import { createSlice } from '@reduxjs/toolkit'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';

const initialState = { value: false }

export const ClientLoginSlice = createSlice({
    name: 'dbMode',
    initialState,
    reducers: {
        UserLogIN: (state) => {
            state.value = true;
            if (hasCookie("saLsTkn")) {
                deleteCookie('saLsTkn')
            }
            if (hasCookie("SaLsUsr")) {
                deleteCookie('SaLsUsr')
            }
            if (hasCookie("Admin")) {
                deleteCookie('Admin')
            }
        },
        userLogOut: (state) => {
            state.value = false;
            if (hasCookie("userInfo")) {
                deleteCookie('userInfo')
            }
            if (hasCookie("token")) {
                deleteCookie('token')
            }
            if (hasCookie("db_name")) {
                deleteCookie('db_name')
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
        }
    },
})

export const { UserLogIN, userLogOut } = ClientLoginSlice.actions

export default ClientLoginSlice.reducer