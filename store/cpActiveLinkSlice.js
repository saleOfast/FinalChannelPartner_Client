import { createSlice } from "@reduxjs/toolkit";

const initialState={
    activeLink:"/partner"
}

export const cpActiveLinkSlice=createSlice({
    name:'cpActiveLink',
    initialState,
    reducers:{
        setActiveLink:(state,action)=>{
            state.activeLink=action.payload;
        }
    }
})

export const{setActiveLink}=cpActiveLinkSlice.actions
export default cpActiveLinkSlice.reducer

