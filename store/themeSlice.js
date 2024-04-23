import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
    value: 'dark',
    side: '#405189',
    buttons: '#405189'
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

        setSidebarColor : (state, action) => {
            state.side =  action.payload
        },

        setbuttonColor : (state, action) => {
            state.buttons =  action.payload
        },
    },
})

export const { nightMode, lightMode, gradient, setSidebarColor, setbuttonColor} = themeSlice.actions

export default themeSlice.reducer