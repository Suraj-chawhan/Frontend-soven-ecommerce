
import {FaHandHoldingUsd,FaTruck } from 'react-icons/fa';
import Button from './Button';
export default function Estimate(){

    return(
      <div className='rounded-6 shadow-xg-black  flex flex-col gap-6'>
      <div className='rounded-6 shadow-xg-black flex '>
      <input type="text" placeholder='hi' className='w-[80%] border-black border border-black rounded'/>
      <Button val={"Check"} col={"black"} enable={true} />
      </div>
      {true&&<div> 
        <FaTruck/>
        < FaHandHoldingUsd/>
        </div>}
      </div>
    )
  }
  