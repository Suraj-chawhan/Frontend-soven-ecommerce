import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';
import User from '../../../../../Component/Admin/Mongodb/MongodbSchema/userSchema';
import connectDB from '../../../../../Component/Admin/Mongodb/Connect';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    
      profile(profile) {
        return {
          id: profile.sub,  // Use 'sub' from Google profile as the ID
          name: profile.name,
          email: profile.email,
        };
      },
    }),

    // Credentials Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials.');
        }

        return {
          id: user._id.toString(), // Make sure it's user._id and not user.id
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // JWT Callback
    async jwt({ token, user, account ,profile}) {
      let accessToken;
       
      if (account?.provider === 'credentials') {
        // Custom JWT sign for credentials login
        accessToken = jwt.sign(
          { userId: user._id, email: user.email }, // Ensure you're using _id
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '7d' }
        );
      } else if (account?.provider === 'google') {
        // Google JWT sign with profile.sub (Google ID)
        accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '7d' }
        );
      }


      // Store accessToken in the token object
      if (user) {
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = accessToken; // Store the signed JWT as accessToken
      }

      return token; // Make sure to return the updated token object
    },

    // Session Callback
    async session({ session, token }) {
      if (token) {
        session.user = {
          userId: token.userId,
          name: token.name,
          email: token.email,
          accessToken: token.accessToken,  // Add the accessToken to the session
        };
      }

      return session;
    },
  },

  pages: {
    signIn: '/',
    error: '/auth/error',
  },
});

export const GET = handler;
export const POST = handler;
