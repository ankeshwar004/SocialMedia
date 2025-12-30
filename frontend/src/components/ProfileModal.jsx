import React, {useState, useEffect} from "react";
import { Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";


function ProfileModal({setShowEdit}) {

    const dispatch=useDispatch(); 
    const { getToken } = useAuth();

    const user = useSelector((state) => state.user.value);
    console.log("User in modal:", user);
    const [editForm, setEditForm] = useState({
        full_name: user?.full_name || "",
        username: user?.username || "",
        bio: user?.bio || "",
        profile_picture: user?.profile_picture || "",
        location: user?.location || "",
        cover_photo: user?.cover_photo || "",
    });

    // Sync form when user data loads/changes
    useEffect(() => {
        if (user) {
            setEditForm({
                full_name: user.full_name || "",
                username: user.username || "",
                bio: user.bio || "",
                profile_picture: user.profile_picture || "",
                location: user.location || "",
                cover_photo: user.cover_photo || "",
            });
            setProfilePreview(user.profile_picture || "");
            setCoverPreview(user.cover_photo || "");
        }
    }, [user]);

    // Local preview URL/state (string). We derive it from editForm.profile_picture
    const [profilePreview,setProfilePreview] = useState(user.profile_picture);
    const [coverPreview,setCoverPreview] = useState(user.cover_photo);

    // Whenever profile_picture changes, if it's a File create an object URL and revoke on cleanup
    useEffect(()=>{
        const pic = editForm.profile_picture;
        if (pic instanceof File) {
            const objectUrl = URL.createObjectURL(pic);
            setProfilePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof pic === 'string') {
            setProfilePreview(pic);
        }
    },[editForm.profile_picture]);

    useEffect(()=>{
        const pic = editForm.cover_photo;
        if (pic instanceof File) {
            const objectUrl = URL.createObjectURL(pic);
            setCoverPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof pic === 'string') {
            setCoverPreview(pic);
        }
    },[editForm.cover_photo]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setEditForm(prev => ({...prev, profile_picture: file}));
        }
    }
    const handleCoverPhotoChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if(file){
            setEditForm(prev => ({...prev, cover_photo: file}));
        }
    }

    const handleSaveProfile=async(e)=>{
        e.preventDefault();
        try{
            const formData = new FormData();
            const {full_name,username,bio,location,profile_picture,cover_photo}=editForm;
            formData.append('full_name',full_name);
            formData.append('username',username);
            formData.append('bio',bio);
            formData.append('location',location);
            profile_picture && formData.append('profile_picture',profile_picture);
            cover_photo &&  formData.append('cover_photo',cover_photo);
            const token=await getToken();
            dispatch(updateUser({ formData, token }))

            setShowEdit(false);
        }catch(error){
            toast.error(error.message);
        }
    }

    return(
        <div className="fixed inset-0 bg-black/50 h-screen overflow-y-scroll z-[110]">
            <div className="max-w-2xl sm:py-6 mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
                    <form action="" onSubmit={e=>toast.promise(handleSaveProfile(e),
                    {loading:"Saving profile"})} className="space-y-4">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-start gap-3">
                            <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture
                                <input hidden type="file" id="profile_picture" accept="image/*" onChange={handleProfilePicChange}
                                    className="border border-gray-200 rounded-lg p-3 w-full" />
                            <div className="group/profile relative">
                            <img
                                src={profilePreview}
                                alt="Profile preview"
                                className="size-24 rounded-full object-cover mt-2"/>
                            <div className="absolute hidden group-hover/profile:flex items-center justify-center
                             top-0 bottom-0 right-0 left-0 bg-black/40 rounded-full cursor-pointer">
                                <Pencil className="size-5 text-white"/>
                            </div>
                            </div>
                            </label>
                        </div>
                    {/* Cover Photo */}
                    <div className="flex flex-col items-start gap-3">
                        <span className="block text-sm font-medium text-gray-700 mb-1">Cover Photo</span>
                        <input
                            hidden
                            type="file"
                            id="cover_photo"
                            accept="image/*"
                            onChange={handleCoverPhotoChange}
                        />
                        <label
                            htmlFor="cover_photo"
                            className="relative group cursor-pointer w-full"
                            title="Click to change cover"
                        >
                            <img
                                src={coverPreview}
                                onError={(e)=>{ e.currentTarget.src = user.cover_photo; }}
                                alt="Cover preview"
                                className="w-full h-40 md:h-56 object-cover rounded mt-2"
                            />
                            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 rounded mt-2">
                                <Pencil className="size-6 text-white" />
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Name"
                        onChange={(e)=>setEditForm(prev => ({...prev, full_name: e.target.value}))} value={editForm.full_name}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Username"
                        onChange={(e)=>setEditForm(prev => ({...prev, username: e.target.value}))} value={editForm.username}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea rows={3} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Bio"
                        onChange={(e)=>setEditForm(prev => ({...prev, bio: e.target.value}))} value={editForm.bio}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Location"
                        onChange={(e)=>setEditForm(prev => ({...prev, location: e.target.value}))} value={editForm.location}/>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={()=>{setShowEdit(false)}} type="button" className="px-4 py-2 text-white  border-0 rounded-lg bg-gray-700 hover:cursor-pointer">
                            Cancel</button>
                        <button type="submit" className="px-4 py-2 border-0 text-white rounded-lg bg-indigo-600  hover:cursor-pointer">
                            Save Edit</button>
                    </div>
                    </form>
                </div>

            </div>
        </div>
    )
}    
export default ProfileModal;