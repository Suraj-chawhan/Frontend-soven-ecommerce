"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);
  const initiateGoogleLogin = async () => {
    const result = await signIn("google", { callbackUrl: "/" });
    if (result?.error) {
      setError("Google login failed");
    }
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (response?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center items-center mb-6 border border-black p-2 rounded-full">
          <Image src="/google.png" width={40} height={40} alt="google" />
          <h1
            className="ml-4 text-lg font-semibold cursor-pointer"
            onClick={initiateGoogleLogin}
          >
            Sign in with Google
          </h1>
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
            onClick={handleCustomLogin}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <h1 onClick={() => router.push("/signup")} className="text-blue-500">
            {"Don't have an account?"}
          </h1>
        </div>
      </div>
    </div>
  );
}
