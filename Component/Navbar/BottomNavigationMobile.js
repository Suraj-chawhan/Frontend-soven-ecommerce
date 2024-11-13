import React from 'react'
import { useRouter } from 'next/navigation'
import { FaHome,FaUser,FaShoppingBag,FaHeart } from 'react-icons/fa'

import { useSelector, useDispatch } from 'react-redux';
import {  setTrue, setFalse} from "../redux/cartToggle.js"

function BottomNavigationMobile() {
        
    const isToggled = useSelector((state) => state.toggle.isToggled);  // Read the global state
    const dispatch = useDispatch();
    const router=useRouter()
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white md:hidden">
      <div className="flex justify-around p-2">
        <button className="flex flex-col items-center" onClick={() => router.push("/")}>
          <FaHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center" onClick={() => router.push("/login")}>
          <FaUser className="text-2xl" />
          <span className="text-xs">Profile</span>
        </button>
        <button className="flex flex-col items-center" onClick={() => dispatch(setTrue())}>
          <FaShoppingBag className="text-2xl" />
          <span className="text-xs">Bag</span>
        </button>
        <button className="flex flex-col items-center" onClick={() => router.push("/wishlist")}>
          <FaHeart className="text-2xl" />
          <span className="text-xs">Favorites</span>
        </button>
      </div>
    </div>
  )
}

export default BottomNavigationMobile