import { Badge, BadgeCheck, XCircle } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';


// group: { user, stories: [...], index }
function StoryViewer({ group, setGroup }) {

    const current = useMemo(() => group.stories[group.index], [group]);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);

    const advance = useCallback(() => {
        if (group.index < group.stories.length - 1) {
            setGroup({ ...group, index: group.index + 1 });
        } else {
            setGroup(null);
        }
    }, [group, setGroup]);

    const retreat = useCallback(() => {
        if (group.index > 0) {
            setGroup({ ...group, index: group.index - 1 });
        } else {
            // at first story, close viewer or stay; choosing to stay
            setGroup({ ...group, index: 0 });
        }
    }, [group, setGroup]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowRight') {
            advance();
        } else if (e.key === 'ArrowLeft') {
            retreat();
        } else if (e.key === 'Escape') {
            setGroup(null);
        }
    }, [advance, retreat, setGroup]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        let timer, progressInterval;
        if (current && (current.media_type === "image" || current.media_type === "text")) {
            setProgress(0);
            const duration = 10000;
            let elapsed = 0;
            const tick = 100;
            progressInterval = setInterval(() => {
                elapsed += tick;
                setProgress((elapsed / duration) * 100);
            }, tick);

            timer = setTimeout(() => {
                advance();
            }, duration);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
            };
        } else {
            setProgress(0);
        }
    }, [current, advance]);

    const renderContent = () => {
        if (current.media_type === "image") {
            return (
                <img src={current.media_url} alt="story" className='max-h-full max-w-full object-contain' />
            );
        } else if (current.media_type === "video") {
            return (
                <video
                    ref={videoRef}
                    onLoadedMetadata={() => setProgress(0)}
                    onTimeUpdate={(e) => {
                        const dur = e.target.duration || 1;
                        const ct = e.target.currentTime || 0;
                        setProgress(Math.min(100, (ct / dur) * 100));
                    }}
                    onEnded={advance}
                    src={current.media_url}
                    className='max-h-screen'
                    autoPlay
                    controls={false}
                />
            );
        } else {
            return (
                <div className='w-full h-full flex items-center justify-center p-4 text-white text-2xl text-center'>
                    {current.content}
                </div>
            );
        }
    };

    return (
        <div
            className='fixed inset-0 z-110 min-h-screen flex items-center justify-center bg-black/80'
            style={{ backgroundColor: current.media_type === "text" ? current.background_color : 'rgba(0, 0, 0, 1)' }}
        >
            {/* Segmented Progress Bar */}
            <div className='absolute top-0 left-0 w-full px-3 pt-3 flex gap-1'>
                {group.stories.map((s, i) => {
                    const width = i < group.index ? 100 : i === group.index ? progress : 0;
                    return (
                        <div key={i} className='flex-1 h-1 bg-zinc-700/70 rounded'>
                            <div className='h-1 bg-white rounded' style={{ width: `${width}%` }} />
                        </div>
                    );
                })}
            </div>
            {/* User Info */}
            <div className='absolute top-4 left-4 p-2 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 bg-black/50 rounded backdrop-blur-2xl'>
                <img
                    src={group.user.profile_picture}
                    alt="profile"
                    className='size-7 sm:size-8 rounded-full object-cover border border-blue-500'
                />
                <div className='flex items-center text-white font-medium gap-1.5'>
                    <span>{group.user.username}</span>
                    <BadgeCheck />
                </div>
            </div>

            {/* Close Button */}
            <button onClick={() => setGroup(null)} className='absolute top-4 right-4 p-2 bg-black/50 rounded-full backdrop-blur-2xl text-white'>
                <XCircle className='w-5 h-5 hover:scale-110 transition cursor-pointer' />
            </button>

            {/* Content */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>
        </div>
    );
}

export default StoryViewer;