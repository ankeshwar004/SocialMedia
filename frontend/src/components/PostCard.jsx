import { BadgeCheck, CarTaxiFront, Heart, MessageCircle, Share } from "lucide-react";
import React ,{useState} from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";


function PostCard({ post }) {

    const navigate=useNavigate();
    const [likes, setLikes] = useState(post.likes_count);
    const currUser=useSelector((state)=>state.user.value);
    const {getToken}=useAuth();
    
    const handleLike=async()=>{
       try{
        const {data}=await api.post('/api/post/like',{postId:post._id},{
            headers:{   Authorization:` Bearer ${await getToken({template:"backend"})}` }});
        if(data.success){
            toast.success(data.message);
            setLikes(prev=>{
                if(prev.includes(currUser._id)){
                    return prev.filter(id=>id!==currUser._id);
                }else{
                    return [...prev,currUser._id];
                } 
            })
        }else{
            toast(data.message);
        }
       }catch(error){
        console.log(error);
         }
    }


    // Build JSX parts so Tailwind classes apply (React escapes raw HTML strings by default)
    const parts = React.useMemo(() => {
        if (!post?.content) return [];
        return post.content
            .split(/(#\w+)/g) // keep delimiters in result
            .filter(seg => seg.length > 0)
            .map((seg, i) => {
                if (/^#\w+$/.test(seg)) {
                    return (
                        <span key={i} className="text-indigo-600">
                            {seg}
                        </span>
                    );
                }
                return seg; // plain text segment
            });
    }, [post?.content]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md space-y-4 w-full max-w-2xl">
            {/* User Info */}
            <div onClick={() => navigate(`/profile/${post.user._id}`)} className="inline-flex items-center gap-3 cursor-pointer">
                <img src={post.user.profile_picture} alt="profile" className="size-10 
                rounded-full object-cover"/>
                <div>
                    <div className="flex items-center space-x-1">
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className="h-4 w-4 text-blue-500"/>
                    </div>
                    <div className="text-sm text-gray-500">
                        @{post.user.username} · {moment(post.createdAt).fromNow()}
                    </div>
                </div>
            </div>

            {/* Content */}
            {post.content && (
                <div className="text-sm text-gray-800 whitespace-pre-line">
                    {parts}
                </div>
            )}

            {/* Images */}
            {post.image_urls && (
                <div className="grid grid-cols-2 gap-2">
                    {post.image_urls.map((img, index) => (
                        <img key={index} src={img} alt={`post-${index}`} 
                        className={`w-full h-48 object-cover rounded-lg
                         ${post.image_urls.length === 1 && 'col-span-2 h-auto'}   
                        `}/>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex item-center gap-4 text-gray-600 text-sm pt-2 border-t
              border-gray-300">
                <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 cursor-pointer
                         ${likes.includes(currUser.id) && 'text-red-500 fill-red-500'}`} 
                         onClick={handleLike} />
                    <span className="text-xs ml-1">{likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 cursor-pointer" />
                    <span className="text-xs ml-1">{8}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Share className="h-4 w-4 cursor-pointer" />
                    <span className="text-xs ml-1">{1}</span>
                </div>

            </div>

        </div>
    );
}

export default PostCard;