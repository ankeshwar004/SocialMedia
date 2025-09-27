import { BadgeCheck } from "lucide-react";
import React from "react";
import moment from "moment";

function PostCard({ post }) {

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
            <div className="inline-flex items-center gap-3 cursor-pointer">
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
        </div>
    );
}

export default PostCard;