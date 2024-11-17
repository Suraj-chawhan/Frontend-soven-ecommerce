
"use client"

import React,{useState} from 'react';

function ContactUs() {


  const[name,setName]=useState("")
  const[email,setEmail]=useState("")
  const[message,setMessage]=useState("")

    async function Submit(){
     
   try{
   const res=await fetch("/api/admin/contactus",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,message})
   })

    if(res.ok){
        alert("Message send successfully")
        setName("");
        setEmail("");
        setMessage("");
    }
   }

   catch(err){
   console.log(err)
   }

    }



  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <p className="text-lg mb-6 text-center">
        Have questions, feedback, or need assistance? We’re here to help!
      </p>

      <div className="flex flex-col md:flex-row justify-around gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
          <p className="mb-2">
            <strong>Email:</strong> support@outfit-ecommerce.com
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> +1 234 567 890
          </p>
          <p className="mb-2">
            <strong>Business Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM (EST)
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Corporate Office</h3>
          <p className="mb-2">
            123 Fashion Street<br />
            New York, NY 10001<br />
            United States
          </p>
        </div>
      </div>

      <form className="mt-12 space-y-6 max-w-lg mx-auto">
        <div>
          <label className="block text-lg mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Your Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-lg mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Your Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-lg mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Your Message"
            rows="5"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" onClick={Submit}>
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactUs;
