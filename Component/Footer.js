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
    async function call() {
      const res = await fetch("/api/admin/social-media");
      const data = await res.json();
      setSocial(data);
    }

    call();
  }, []);
  return (
    <div className="flex flex-col gap-4 border-t-2 border-black p-2 mt-8">
      <div className="flex justify-between items-start">
        <div className="flex:1 flex-col gap-4">
          <h1>Offline Store</h1>
          <Link href="/">Find near me</Link>
        </div>
        <div className="flex:1 flex-col gap-4">
          <h1>Get to know us</h1>
          <ul>
            <li>Contact us</li>
            <li>Faqs</li>
            <li>Blogs</li>
            <li>Terms and condition</li>
          </ul>
        </div>
        <div>
          <h1>TRACK OR RETURN/EXCHANGE ORDER</h1>
          <ul>
            <li>Track Order</li>
            <li>PLACE RETURN/EXCHANGE REQUEST</li>
            <li>Return/Excahnge Policy</li>
          </ul>
        </div>
        <div>
          <h1>Customer Care</h1>
          <p>Timings: 10 AM - 7 PM (Mon - Sat) </p>
          <p> Whatsapp : +91 6364430801</p>
          <p> Instagram: @snitch.co.in</p>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h1>Sign up and save</h1>
        <p>
          Sign up now and be the first to know about exclusive offers, latest
          fashion trends & style tips!
        </p>
        <div className="flex  items-center gap-2"></div>
        <div className="flex gap-4">
          <FaInstagram
            size="2em"
            onClick={() => router.psuh(social.instagram)}
          />
          <FaFacebook size="2em" onClick={() => router.psuh(social.facebook)} />
          <FaLinkedin size="2em" onClick={() => router.psuh(social.linkdin)} />
          <FaTwitter size="2em" onClick={() => router.psuh(social.twitter)} />
          <FaPinterest
            size="2em"
            onClick={() => router.psuh(social.pintrest)}
          />
          <FaYoutube size="2em" onClick={() => router.psuh(social.youtube)} />
        </div>
      </div>
      <div className="flex justify-center flex-col items-center">
        <h1> © 2024 SNITCH</h1>
        <p>Made in India, for the World 🌍</p>
      </div>
    </div>
  );
}

export default Footer;
