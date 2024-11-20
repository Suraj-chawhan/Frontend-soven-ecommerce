import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';
import User from '../../../../../Component/Admin/Mongodb/MongodbSchema/userSchema';
import connectDB from '../../../../../Component/Admin/Mongodb/Connect';
import bcrypt from 'bcrypt';
import GoogleUser from '../../../../../Component/Admin/Mongodb/MongodbSchema/googleUserSchema';

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

    // Credentials Provider for Email/Password Authentication
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          // Check if user exists
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with this email.');
          }

          // Validate password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid credentials.');
          }

          // Return user data if 
          console.log(user.role)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role, // Include the role if necessary
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // JWT Callback
    async jwt({ token, user, account }) {
      try {
        await connectDB();

        let accessToken;
        let role;

        if (account?.provider === 'credentials') {
          // Handle credentials login
          accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: '7d' }
          );
        } else if (account?.provider === 'google') {
          // Handle Google login (same logic as previously)
          const googleUser = await GoogleUser.findOne({ email: user.email });
          if (!googleUser) {
            const newUser = new GoogleUser({
              name: user.name,
              email: user.email,
              role: 'user',  // Default role for new users
            });
            await newUser.save();
            role = 'user'; // Default role for Google users
          } else {
            role = googleUser.role;
          }

          // Generate accessToken for Google users
          accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: '7d' }
          );
        }

        // Store accessToken and other details in the token object
        if (user) {
          token.userId = user.id;
          token.name = user.name;
          token.email = user.email;
          token.accessToken = accessToken;
          token.role = user.role || role;  // Store the signed JWT as accessToken
        }

        return token; // Return the updated token object
      } catch (error) {
        console.error('JWT Callback Error:', error.message);
        throw new Error(error.message);
      }
    },

    // Session Callback
    async session({ session, token }) {
      if (token) {
        session.user = {
          userId: token.userId,
          name: token.name,
          email: token.email,
          accessToken: token.accessToken,
          role: token.role,  // Add the role to the session
        };
      }

      return session; // Return the updated session
    },
  },

  pages: {
    signIn: '/',
    error: '/auth/error',
  },
});

export const GET = handler;
export const POST = handler;
