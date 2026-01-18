import { MessageSquare } from 'lucide-react';
import React from 'react'
import Searchfrineds from './searchbar';
import { useChatStore } from '../store/usechatstore';



const Nochat= () => {

  const {isopen,setisopen}=useChatStore()
const prompts = [
  "What made you smile today?",
  "Coffee or tea?",
  "What’s something you never told anyone?",
  "What song is on repeat right now?",
];

const today = new Date();
const dayOfYear =
  Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );

const todayPrompt = prompts[dayOfYear % prompts.length];

  return (
    <>

     <div className="w-full  relative flex flex-1 flex-col justify-center  items-center  bg-base-100/50">
            <Searchfrineds/>

      <div className=" text-center space-y-6">


        {/* Icon Display */}
        <div className="flex justify-center w-full gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
             <p className='text-5xl' >🙊</p>
             </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">🐒 “Welcome to Boop!”</h2>
        <p className="text-base-content/60">
           {todayPrompt}
        </p>
         
         <div className='md:hidden flex items-center justify-center gap-3 w-full '>
           <button onClick={()=>setisopen(prev=>!prev)} className='transition-all duration-200 ease-out
  active:scale-95
  active:translate-y-0 
  md:hover:bg-primary/40
  shadow-lg text-md bg-primary/10 rounded-xl text-center p-1 px-3 w-35 border-2 border-primary/10'>👀 Start a chat</button>
       
         </div>

      </div>
    </div>
    </>
    
   
  );
}

export default Nochat
