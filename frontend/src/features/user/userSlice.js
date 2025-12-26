import { createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/axios";
import { data } from "react-router-dom";
import { toast } from "react-hot-toast";


const initialState = {
    value: null
}

export const fetchUser= createAsyncThunk('user/fetchUser',async (token)=>{
    await api.get('/api/user/data',{
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
    return data.success? data.user:null;
});

export const updateUser= createAsyncThunk('user/update',async (userData, token)=>{
    await api.get('/api/user/update',{
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
   if(data.success){
        toast.success(data.message);
        return data.user;
   }else{
        toast.error(data.message);
        return null; 
   }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUser.fulfilled,(state, action)=>{
            state.value= action.payload;
        });
        builder.addCase(updateUser.fulfilled,(state, action)=>{
            state.value= action.payload;
        });
    }

})
export default userSlice.reducer;