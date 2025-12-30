import { createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/axios";


const initialState = {
    messages:[]
}

export const fetchMessages= createAsyncThunk('messages/fetchMessages',
    async({token,userId})=>{
        const {data}=await api.post('/api/message/get',{to_user_id:userId},{
            headers:{Authorization:`Bearer ${token}`}
        })
        return data.success?data:null;
    }
)

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers:{
        setMessages:(state, action)=>{
            state.messages= action.payload;
        },
        addMessages:(state,action)=>{
            state.messages=[...state.messages, action.payload]; 
        },
        updateMessageStatus:(state,action)=>{
            const updates = Array.isArray(action.payload) ? action.payload : [action.payload];
            updates.forEach(update=>{
                const idx = state.messages.findIndex(m=>String(m._id)===String(update._id));
                if(idx!==-1){
                    state.messages[idx] = { ...state.messages[idx], ...update };
                }
            });
        },
        resetMessages:(state)=>{
            state.messages=[];
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchMessages.fulfilled,(state, action)=>{
            if(action.payload){
                state.messages= action.payload.messages;
            }
        })
    }
})

export const {setMessages, addMessages, updateMessageStatus, resetMessages}= messagesSlice.actions;
export default messagesSlice.reducer;