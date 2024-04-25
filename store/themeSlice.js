import { createSlice } from '@reduxjs/toolkit'
import { getCookie, hasCookie } from 'cookies-next'
import { toast } from 'react-toastify'


const initialState = {
    value: 'dark',
    side: hasCookie('sidecolor')? getCookie('sidecolor') : '#405189',
    buttons: hasCookie('btncolor')? getCookie('btncolor') : '#405189',
    topnav: hasCookie('topnavcolor')? getCookie('topnavcolor') : '#405189'
}

console.log("initialState", initialState, getCookie('sidecolor'))



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
        
        setTopNavColor : (state, action) => {
            state.topnav =  action.payload
        },

        clearTheme : (state, action) => {
            state.side =  '#405189'
            state.buttons =  '#405189'
            state.topnav =  '#405189'
            if (hasCookie("btncolor")) {
                deleteCookie('btncolor')
            }
            if (hasCookie("sidecolor")) {
                deleteCookie('sidecolor')
            }
            if (hasCookie("topnavcolor")) {
                deleteCookie('topnavcolor')
            }
        },
    },
})

export const { nightMode, lightMode, gradient, setSidebarColor, setbuttonColor, setTopNavColor, clearTheme} = themeSlice.actions

export default themeSlice.reducer