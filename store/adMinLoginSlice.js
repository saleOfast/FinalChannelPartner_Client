import { createSlice } from '@reduxjs/toolkit'
import { hasCookie, deleteCookie } from 'cookies-next';

const initialState = { value: false }

export const adMinLoginSlice = createSlice({
    name: 'adminLoginSlice',
    initialState,
    reducers: {
        LoggedIn: (state) => {
            state.value = true;
            if (hasCookie("userInfo")) {
                deleteCookie('userInfo')
            }
            if (hasCookie("token")) {
                deleteCookie('token')
            }
            if (hasCookie("user")) {
                deleteCookie('user')
            }
            if (hasCookie("sideAdmin")) {
                deleteCookie('sideAdmin')
            }
            if (hasCookie("sideUser")) {
                deleteCookie('sideUser')
            }
        },
        LoggedOut: (state) => {
            state.value = false;
            if (hasCookie("saLsTkn")) {
                deleteCookie('saLsTkn')
            }
            if (hasCookie("SaLsUsr")) {
                deleteCookie('SaLsUsr')
            }
            if (hasCookie("Admin")) {
                deleteCookie('Admin')
            }
        }
    },
})

export const { LoggedIn, LoggedOut } = adMinLoginSlice.actions

export default adMinLoginSlice.reducer