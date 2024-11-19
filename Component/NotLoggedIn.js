import React from 'react';
import { useRouter } from 'next/navigation';

function NotLoggedInPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="mb-6">
          <img
            src="/logo.jpg" // Replace with a relevant lock/login icon
            alt="Access Denied"
            className="mx-auto w-16 h-16"
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          You're Not Logged In
        </h1>
        <p className="text-gray-600 mb-6">
          Please log in to access your account and manage your dashboard.
        </p>
        <button
          onClick={() => router.push('/login')} // Navigate to login page
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Log In
        </button>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <span
              onClick={() => router.push('/signup')} // Navigate to signup page
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotLoggedInPage;
