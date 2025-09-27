import { Badge, BadgeCheck,XCircle } from 'lucide-react';
import React, {useState,useEffect} from 'react';

function StoryViewer({ viewStory, setViewStory }) {

    const [Progress, setProgress] = useState(0);

    useEffect(()=>{
        let timer,progressInterval;
        if(viewStory && (viewStory.media_type==="image" || viewStory.media_type==="text")){
            setProgress(0);
            const duration=10000;
            let elapsed=0;
            const setTime=100;
            progressInterval=setInterval(()=>{
                elapsed+=setTime;
                setProgress((elapsed/duration)*100);
            },setTime);

            timer=setTimeout(()=>{
                setViewStory(null);
            },duration);

            return ()=>{
                clearTimeout(timer);
                clearInterval(progressInterval);
            }
        }
    },[viewStory,setViewStory]);


    const renderContent = () => {
        if (viewStory.media_type === "image") {
            return (
                <img src={viewStory.media_url} alt="story" className='max-h-full max-w-full object-contain' />
            );
        }
        else if (viewStory.media_type === "video") {
            return (
                <video onEnded={() => setViewStory(null)} src={viewStory.media_url} className='max-h-screen' autoPlay />
            );
        }
        else {
            return (
                <div className='w-full h-full flex items-center justify-center p-4 
                text-white text-2xl text-center'>
                    {viewStory.content}
                </div>
            );
        }
    }  

    return (
        <div className='fixed inset-0 z-110 min-h-screen flex items-center justify-center bg-black/80'
         style={{backgroundColor: viewStory.media_type === "text" ? viewStory.background_color : 'rgba(0, 0, 0, 1)'}}>

            {/* {Progress Bar} */}
            <div className='absolute top-0 left-0 w-full h-1 bg-grey-700'>
                <div className='h-full bg-white transition-all duration-100 ease-linear'
                 style={{width: `${Progress}%`}}>
                
                </div>
            </div>
            {/* {User Info-Top Left} */}
            <div className='absolute top-4 left-4 p-2 flex items-center space-x-3 p-2
             px-4 sm:p-4 sm:px-8 bg-black/50 rounded backdrop-blur-2xl'>
                <img src={viewStory.user.profile_picture} alt="profile" 
                className='size-7 sm:size-8 rounded-full object-cover border border-blue-500'/>
                 <div className='flex items-center text-white font-medium gap-1.5'>
                     <span>{viewStory.user.username}</span>
                     <BadgeCheck/>
                 </div>
            </div>

            {/* {Close Button-Top Right} */}
            <button onClick={()=> setViewStory(null)} className='absolute top-4 right-4 p-2
             bg-black/50 rounded-full backdrop-blur-2xl text-white'>
                <XCircle className='w-5 h-5 hover:scale-110 transition cursor-pointer'/>
            </button>

            {/* {Content Wrapper} */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>

        </div>
    )
}
export default StoryViewer;