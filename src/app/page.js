"use client"


import Cart from "../../Component/Cart";
import Seasonal from "../../Component/Seasonal";
import Banner from "../../Component/Banner";
import {useState,useEffect} from "react"
import Link from "next/link";
import Error from "../../Component/ErrorFetch/FetchError";
import { useSession } from "next-auth/react";
export default function Home() {

  const[a,setA]=useState([]);
  const[b,setB]=useState([]);
  const[catagory,setCatagory]=useState("trousers");
  const[cat,setCat]=useState([]);
  const[images,setImages]=useState([])
  const[recent,setRecent]=useState([])
  const { data: session } = useSession(); 



useEffect(()=>{
  
    if (session) {
      localStorage.setItem("jwt", session.user.accessToken);
      localStorage.setItem("userId", session.user.userId);
    }

  try{
async function fetchDataA(){
  const res = await fetch(`/api/admin/products`);
  const data = await res.json();
  if(data){
  
setA(data)
  }


}
fetchDataA()


const fetchSortedData = async () => {

    const response = await fetch(`/api/admin/products`);
    const result = await response.json();
  

    const sortedData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  

    const slicedData = sortedData.slice(0, 5);

    ;

  setRecent(slicedData)
};

fetchSortedData();


async function fetchDataB(){
  const res=await fetch(`/api/admin/categories`)
  const {data}=await res.json()
  if(data){
  setB(data)
  }
  }

  fetchDataB()

    
const temp=a.filter(val=>val.catagories===catagory)

setCat(temp)
  }
  catch(err){
    setA(null)
    setB(null)
    setImages(null)
  }


  async function fetchDataImages(){
    const res=await fetch(`/api/admin/banner`)
    const data=await res.json()
    if(data){
    setImages(data)
    }
    }
  
    fetchDataImages()

},[])




useEffect(() => {
  if (a.length) {
    const temp = a.filter(val => val.catagories === catagory);
    setCat(temp);
  }
}, [catagory, a]);




if(!b && !a) return <Error/>

  return (
  <div className="flex flex-col gap-10 relative overflow-hidden w-[100%] h-[100%]">
   
<Banner   images={images}/> 

<h1 className="flex align-center justify-center font-bold text-3xl">Newly Drop</h1>
<div className="flex gap-4 self-center">
{
  a?.slice(0,5).map((val,index)=>{
    return(<Link href={`/checkout/${val.slug}`} key={index}  ><Cart title={val.name} size={val.sizes} img={val.thumbnail}  slug={val.slug} price={val.price}/></Link>)
  })
}
</div>
<h1 className="flex align-center justify-center font-bold text-3xl">Seasonal Fav</h1>
<div className="flex gap-8 self-center">
{
  b?.map((val,index)=><Link key={index} href={`/catagories/${val.slug}`}><Seasonal title={val.name} img={val.img} /></Link> )
}
</div>
<div className="self-center flex gap-4">
{

  b.map((val,index)=><button key={index} className=" p-2 border-2  border-black hover:bg-black hover:text-white font-bold  rounded-2xl" onClick={()=>setCatagory(val.name)}>{val.name.toUpperCase()}</button>)
}

</div>
<div className="self-center flex gap-2">
{
  cat.map((val,index)=>(<Link key={index} href={`/checkout/${val.slug}`}><Cart title={val.title}  size={val.sizes} img={val.thumbnail} slug={val.slug} price={val.price}  /></Link>))
}
</div>
<h1 className="font-bold self-center text-4xl ">Recently Added</h1>
<div className="self-center flex gap-4">
  {recent.slice(0,4).map((val, i) => (
    <Link href={`/checkout/${val.slug}`} key={i}><Cart  img={val.thumbnail} size={val.sizes}title={val.title} slug={val.slug} price={val.price} /></Link>
  ))}
</div>

  </div>
  );
}
