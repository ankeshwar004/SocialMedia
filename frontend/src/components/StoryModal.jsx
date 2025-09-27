import { ArrowBigLeft, Cpu, Sparkle, TextIcon, Upload } from "lucide-react";
import React,{useState,useEffect} from "react";
import toast from "react-hot-toast";

function StoryModal({setShowModal,fetchStories}){
    
    const colors=["#ec6d51ff","#60c372ff","#546acaff","#bf4fc7ff",  "#5cc4beff"];
    const [mode,setMode]=useState("text");
    const [bgColor,setBgColor]=useState(colors[0]);
    const [text,setText]=useState("");
    const [media,setMedia]=useState(null);
    const [previewURL,setPreviewURL]=useState(null);

    const handleMediaUpload=(e)=>{
        const file=e.target.files[0];
        if(file){
            setMedia(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    }

    const handleCreateStory=async()=>{
        if(!text && !media){
            throw new Error("Please add some text or media to create a story");
        }
    }

    return(
        <div className="fixed inset-0 z-110 min-h-screen flex items-center justify-center bg-black/80 backdrop-blur 
        p-4 text-white">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-4 text-center">
                    <button onClick={() => setShowModal(false)} className="text-white
                     p-2 cursor-pointer">
                       <ArrowBigLeft />
                    </button>
                    <h2 className="text-lg font-semibold">Create Story</h2>
                    <span className="w-10"></span>
                </div>
                {/* Text Area */}
                <div className="rounded-lg h-96 flex items-center justify-center relative"
                    style={{background: bgColor}}>
                    {
                        mode==="text" && (
                            <textarea value={text} onChange={(e) => setText(e.target.value)} 
                            className="w-full h-full p-6 text-lg resize-none bg-transparent text-white
                            focus:outline-none" placeholder="Add your stories" />
                        )
                    }
                    {
                        mode==="media" && previewURL && (
                            media && media.type.startsWith("image") ? (
                                <img src={previewURL} alt="preview" className="max-h-full  object-contain"/>
                            ) : (
                                <video src={previewURL} className="max-h-full  object-contain" controls />
                            )
                        )
                    }
                </div>
                {/* Choosing Diff Colour */}
                <div className="flex mt-4 gap-2">
                    {
                        colors.map((color,index) => (
                            <button key={index} onClick={() => setBgColor(color)}
                             className="w-6 h-6 rounded-full ring cursor-pointer"
                             style={{background: color}}></button>
                        ))
                    }
                </div>
                {/* Media Upload */}
                <div className="flex mt-4 gap-2">
                    <button className={`flex flex-1 items-center justify-center gap-2 p-2 cursor-pointer
                    rounded ${mode==="text" ? "bg-white text-black" : "bg-zinc-800 "}`} 
                    onClick={() => {setMode("text"), setMedia(null), setPreviewURL(null)}}>
                       <TextIcon size={18} /> Text
                    </button>
                    <label className={`flex flex-1 items-center justify-center gap-2 p-2 cursor-pointer 
                    rounded ${mode==="media" ? "bg-white text-black" : "bg-zinc-800 "}`} >
                        <input onChange={(e)=>{handleMediaUpload(e),setMode("media")}} 
                        type="file" accept="image/*,video/*" className="hidden"/> 
                        <Upload size={18}/>Photo/Videos
                    </label>
                </div>
                <button onClick={()=>toast.promise(handleCreateStory,{
                    loading: "Creating Story",
                    success: "Story Created",
                    error:e=> e.message || "Error in creating story"
                })} className="flex items-center justify-center gap-2 text-white
                py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700 active:scale-95
                transition">
                    <Sparkle size={18}/> Share your story
                </button>
            </div>
        </div>
    )
};
export default StoryModal;