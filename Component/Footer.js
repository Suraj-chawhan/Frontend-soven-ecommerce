"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import Link from "next/link";

function Footer() {
  const [social, setSocial] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchSocialMediaLinks() {
      try {
        const res = await fetch("/api/admin/social-media");
        if (res.ok) {
          const data = await res.json();
          setSocial(data);
        } else {
          console.error("Failed to fetch social media links");
        }
      } catch (error) {
        console.error("Error fetching social media links:", error);
      }
    }
    fetchSocialMediaLinks();
  }, []);

  return (
    <footer className="bg-gray-900 text-white p-8 mt-12">
      {/* Top Section */}
      <div className="flex flex-wrap justify-between gap-8 border-b border-gray-700 pb-8">
        {/* Offline Store */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold mb-4">Offline Store</h2>
          <Link href="/" className="text-gray-400 hover:text-white">
            Find near me
          </Link>
        </div>

        {/* Get to Know Us */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold mb-4">Get to Know Us</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold mb-4">Customer Care</h2>
          <p className="text-gray-400">Timings: 10 AM - 7 PM (Mon - Sat)</p>
          <p className="text-gray-400">WhatsApp: +91 6364430801</p>
          <p className="text-gray-400">Instagram: @oddoutfits.co.in</p>
        </div>
      </div>

      {/* Sign Up and Save Section */}
      <div className="mt-8 text-center">
        <Link href="/login">
          <h2 className="text-lg inline-block font-bold mb-4 text-underline text-blue-900 hover:text-white hover:border-b-2 hover:border-blue-500">
            Login and Save
          </h2>
        </Link>
        <p className="text-gray-400 max-w-xl mx-auto">
          Be the first to know about exclusive offers, latest fashion trends,
          and style tips!
        </p>
        <div className="flex justify-center gap-4 mt-6">
          {social.instagram && (
            <FaInstagram
              size="2em"
              className="cursor-pointer hover:text-pink-500"
              onClick={() => router.push(social.instagram)}
            />
          )}
          {social.facebook && (
            <FaFacebook
              size="2em"
              className="cursor-pointer hover:text-blue-500"
              onClick={() => router.push(social.facebook)}
            />
          )}
          {social.linkedin && (
            <FaLinkedin
              size="2em"
              className="cursor-pointer hover:text-blue-400"
              onClick={() => router.push(social.linkedin)}
            />
          )}
          {social.twitter && (
            <FaTwitter
              size="2em"
              className="cursor-pointer hover:text-sky-400"
              onClick={() => router.push(social.twitter)}
            />
          )}
          {social.pinterest && (
            <FaPinterest
              size="2em"
              className="cursor-pointer hover:text-red-600"
              onClick={() => router.push(social.pinterest)}
            />
          )}
          {social.youtube && (
            <FaYoutube
              size="2em"
              className="cursor-pointer hover:text-red-500"
              onClick={() => router.push(social.youtube)}
            />
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 text-center text-gray-500">
        <p className="font-bold">© 2024 Odd Outfits</p>
        <p className="font-bold">Made in India, for the World 🌍</p>
      </div>
    </footer>
  );
}

export default Footer;
