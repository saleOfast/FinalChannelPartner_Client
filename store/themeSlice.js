import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
    value: 'dark',
}

export const themeSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        nightMode: (state, action) => {
            state.value = 'dark'
            // toast.success('Dark Mode Enabled')
            console.log(action.payload);
        },
        lightMode: (state) => {
            state.value = 'light'
            toast.success('Light Mode Enabled')
        },
        gradient: (state) => {
            state.value = 'gradient'
            toast.success('Gradient Mode Enabled')
        },
    },
})

export const { nightMode, lightMode, gradient} = themeSlice.actions

export default themeSlice.reducer