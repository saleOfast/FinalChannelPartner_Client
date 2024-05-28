import { createSlice } from '@reduxjs/toolkit'

const initialState =  {value: 'dashboard'}

export const isActiveSlice = createSlice({
    name: 'isActiveSlice',
    initialState,
    reducers: {
        setIsActive: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { setIsActive } = isActiveSlice.actions

export default isActiveSlice.reducer