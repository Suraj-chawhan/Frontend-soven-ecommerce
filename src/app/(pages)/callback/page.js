"use client"

import { useEffect } from 'react';

const GoogleAuthCallback = () => {
  useEffect(() => {
    const handleGoogleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('access_token')
      if (!token) {
        window.location.href = '/';
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const url = `${backendUrl}/api/auth/google/callback?access_token=${token}`;

      try {

        const response = await fetch(url);

        if (!response.ok) {
          console.error('Failed to authenticate:', await response.text());
          window.location.href = '/';
          return;
        }
        const { jwt, user } = await response.json();
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('userId', user.id);
        window.location.href = '/';
      } catch (error) {
        console.error('Error during authentication:', error);
        window.location.href = '/';
      }
    };

    handleGoogleAuth();
  }, []);

  return <div>Loading...</div>;
};

export default GoogleAuthCallback;
