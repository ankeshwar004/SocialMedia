import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import moment from 'moment';
import StoryModal from './StoryModal';
import StoryViewer from './StoryViewer';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';

function StoriesBar() {

    const {getToken}=useAuth();
    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewGroup, setViewGroup] = useState(null); // { user, stories, index }

    const fetchStories = async () => {
        try{
            const token=await getToken();
            const {data}=await api.get('/api/story/get',{
                headers:{Authorization:`Bearer ${token}`}
            });
            if(data.success){
                setStories(data.stories);
                console.log("Fetched stories:", data.stories);
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchStories();
    }, []);

    // Group stories by user so each user shows a single card
    const groupedStories = useMemo(() => {
        const map = new Map();
        for (const story of stories) {
            const userId = story?.user?._id || story?.user?.id || story?.user; // fallback
            if (!map.has(userId)) {
                map.set(userId, { user: story.user, stories: [] });
            }
            map.get(userId).stories.push(story);
        }
        // ensure user stories are latest-first
        const list = Array.from(map.values()).map(g => {
            g.stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return g;
        });
        return list;
    }, [stories]);

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar
         overflow-x-auto px-4'>

            <div className='flex gap-4 pb-5'>
                {/* {Add stories card} */}
                <div onClick={() => setShowModal(true)} className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] 
                    cursor-pointer hover:shadow-lg transition-all duration-200
                    border-2 border-dashed border-indigo-300 bg-gradient-to-b
                    from-indigo-50 to-white'>
                    <div className='h-full flex flex-col items-center justify-center p-4'>
                        <div className='size-10 rounded-full bg-indigo-500 flex items-center
                         justify-center mb-3'>
                            <Plus className='text-white w-5 h-5' />
                        </div>
                        <p className='text-sm font-medium text-gray-700 text-center'> Create Story </p>
                    </div>
                </div>
                {/* {Stories cards} */}
                {groupedStories.map((group, index) => {
                    const latest = group.stories[0];
                    return (
                        <div
                            onClick={() => setViewGroup({ user: group.user, stories: group.stories, index: 0 })}
                            key={index}
                            className={`relative rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800`}
                            style={latest.media_type === 'text' ? { background: latest.background_color } : undefined}
                        >
                            <img
                                src={group.user.profile_picture}
                                alt="story"
                                className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow'
                            />
                            <p className='absolute top-18 left-3 text-white text-sm truncate max-w-24'>
                                {latest.content}
                            </p>
                            <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>
                                {moment(latest.createdAt).fromNow()}
                            </p>
                            {latest.media_type !== "text" && (
                                <div className='absolute inset-0 z-1 rounded-lg bg-black overflow-hidden'>
                                    {latest.media_type === "image" ? (
                                        <img
                                            src={latest.media_url}
                                            alt="story"
                                            className='h-full w-full object-cover hover:scale-110  duration-200 opacity-70 hover:opacity-80'
                                        />
                                    ) : (
                                        <video
                                            src={latest.media_url}
                                            className='h-full w-full object-cover hover:scale-110  duration-200 opacity-70 hover:opacity-80'
                                        />
                                    )}
                                </div>
                            )}
                            {/* badge for count */}
                            {group.stories.length > 1 && (
                                <span className='absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-black/60 text-white'>
                                    {group.stories.length}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* {Story Modal} */}
            {showModal && (
                <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
            )}
            {/* {View Stories} */}
            {viewGroup && (
                <StoryViewer group={viewGroup} setGroup={setViewGroup} />
            )}

        </div>
    )
}
export default StoriesBar;