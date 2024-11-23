"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaTimes,
  FaUser,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";
import gsap from "gsap";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function SlidingNavigation({ isNavOpen, setIsNavOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const navRef = useRef();

  const Logout = () => {
    signOut();
  };

  useEffect(() => {
    if (isNavOpen) {
      gsap.fromTo(
        navRef.current,
        { x: "-100%" },
        { x: "0%", duration: 0.3, ease: "power3.out" }
      );
    } else {
      gsap.to(navRef.current, { x: "-100%", duration: 0.3, ease: "power3.in" });
    }
  }, [isNavOpen]);

  return (
    <>
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsNavOpen(false)}
        />
      )}
      <div
        ref={navRef}
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 flex flex-col justify-between transform md:w-72 lg:w-80 z-50`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <button
              className="flex items-center gap-2"
              onClick={session ? Logout : () => router.push("/login")}
            >
              <FaUser />
              <span className="font-bold">{session ? "Logout" : "Login"}</span>
            </button>
            <FaTimes
              size="1.5em"
              className="cursor-pointer hover:text-gray-400"
              onClick={() => setIsNavOpen(false)}
            />
          </div>
          <ul className="flex flex-col gap-4 font-medium text-lg">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/disclaimer">Disclaimer</Link>
            </li>
            <li>
              <Link href="/my-orders">My Orders</Link>
            </li>
            {session?.user?.role === "admin" && pathname !== "/admin" && (
              <li>
                <button
                  onClick={() => router.push("/admin")}
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none"
                >
                  Go to Admin
                </button>
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-4 justify-center">
          {[
            FaInstagram,
            FaLinkedin,
            FaFacebook,
            FaYoutube,
            FaPinterest,
            FaTwitter,
          ].map((Icon, index) => (
            <Icon
              key={index}
              size="1.5em"
              className="hover:text-gray-400 cursor-pointer"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default SlidingNavigation;
