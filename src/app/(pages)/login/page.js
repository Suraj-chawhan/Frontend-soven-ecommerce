

"use client"

import React,{ useEffect,useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);




  useEffect(()=>{
  let jwt=localStorage.getItem("jwt")
  if(jwt){
    router.push("/")
  }
  },[])




    const initiateGoogleLogin = () => {
    const strapiGoogleOAuthURL = `${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/connect/google`;
      window.location.href = strapiGoogleOAuthURL;
    };


  async function call() {
    try {
      const response = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization":process.env.NEXT_PUBLIC_STRAPI_JWT
        },
        body: JSON.stringify({
           identifier:email,password:password
          }),
      });

      const data = await response.json();
        
      if (response.ok) {
       
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('userId', data.user.documentId);

     

       
        router.push("/");
      } else {
        setError(data.error.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during login. Please try again.");
    }
  }

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-center items-center mb-6 border border-black p-2 rounded-full">
        <Image src="/google.png" width={40} height={40} alt="google" />
        <h1 className="ml-4 text-lg font-semibold cursor-pointer" onClick={initiateGoogleLogin}>Sign in with Google</h1>
      </div>
      <div className="space-y-4">

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={call}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <h1 onClick={()=>router.push("/signup")} className='text-blue-500'>Dont have account ?</h1>
      </div>
    </div>
  </div>
  
  )
}

