import { FaChevronDown } from "react-icons/fa"
export default function Description({isOpen,call,val,title}){

  
    return(

      <div className=' flex flex-col gap-8 p-4   border-2 border-black ' onClick={()=>call(1)}>
      <div className='flex justify-between'>
      <h3>{title}</h3>
      <FaChevronDown size="2em"    className="transition-transform ease" style={{ transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)", transitionDuration: "600ms"}} />
     </div>
     {isOpen && <h1>{val}</h1>}
      </div>
      
    )
  }
  
  
  