"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      localStorage.setItem("jwt", session.user.accessToken);
      localStorage.setItem("userId", session.user.userId);
      router.push("/");
    }
  }, [session, router]);

  const initiateGoogleLogin = async () => {
    const result = await signIn("google", { callbackUrl: "/" });
    if (result?.error) {
      setError("Google login failed");
    } else {
      if (result?.jwt && result?.user) {
        localStorage.setItem("jwt", result.jwt);
        localStorage.setItem("userId", result.user.id);
        router.push("/");
      }
    }
  };

  async function call() {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
        });
      } else {
        setError(data.error.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during registration. Please try again.");
    }
  }

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
          <div className="flex space-x-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            Signup
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
