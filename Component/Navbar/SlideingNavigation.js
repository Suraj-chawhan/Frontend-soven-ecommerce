"use client"

import React, { useEffect,useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaTimes, FaUser } from 'react-icons/fa'
import Link from 'next/link'
import {FaInstagram, FaLinkedin, FaFacebook, FaYoutube, FaPinterest, FaTwitter } from 'react-icons/fa';
import gsap from 'gsap';
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
function SlideingNavigation({isNavOpen,auth,setAuth,setIsNavOpen,product}) {

    const router=useRouter()
    const { data: session } = useSession(); 
     
    const navRef=useRef()



    function Logout(){
      signOut()
    
    }

 useEffect(()=>{

  if(isNavOpen){
    gsap.fromTo(navRef.current.children,{y:0,opacity:0},{y:10,opacity:1,delay:0.2})
  }

  },[isNavOpen])
    
  return (
    <div
    className={`fixed top-0 left-0 w-64 h-full bg-gray-700 text-white p-4 flex flex-col justify-between transition-transform transform ${
      isNavOpen ? 'translate-x-0' : '-translate-x-full'
    } md:w-72 lg:w-80 z-50`}
    ref={navRef}
  >
    <div>
      <div className='flex justify-between items-center'>
    <div>
    
    {session?(
      <button className="block w-full text-left py-2 flex gap-2" onClick={Logout}>
        <FaUser className="inline-block mr-2" />
        <h1 className='font-bold'> Logout</h1>
      </button>
    ):<button className="block w-full text-left py-2 flex gap-1"  onClick={() => router.push("/login")}>
    <FaUser className="inline-block mr-2" />
    <h1 className='font-bold'> Login</h1>
  </button>}
    </div>
    <div onClick={()=>setIsNavOpen(false)}>
    <FaTimes size="2em" />
    </div>
    </div>
    <ul className='flex flex-col gap-4 font-bold text-8 mx-8 '>
     <li><Link href="/about" >About</Link></li>
     <li><Link href="/contact" >Contact us</Link></li>
     <li><Link href="/privacy-policy" >Privacy Policy</Link></li>
     <li><Link href="/disclaimer" >Disclaimer</Link></li>
     <li><Link href="/my-orders">My Orders</Link></li>
    </ul>
    </div>
    <div className='flex gap-16 flex-wrap mx-10 sm:mx-6'>
      <FaInstagram size="2em" />
      <FaLinkedin size="2em" />
      <FaFacebook size="2em" />
      <FaYoutube size="2em"/>
      <FaPinterest size="2em" />
      <FaTwitter size="2em" />
    </div>
  </div>


  )
}

export default SlideingNavigation