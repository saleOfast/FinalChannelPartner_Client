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
            if (hasCookie("allowedPermissions")) {
                deleteCookie('allowedPermissions')
            }
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
            if (hasCookie("crm")) {
                deleteCookie('crm')
            }
            if (hasCookie("dms")) {
                deleteCookie('dms')
            }
            if (hasCookie("sales")) {
                deleteCookie('sales')
            }
            if (hasCookie("channel")) {
                deleteCookie('channel')
            } 
            if (hasCookie("media")) {
                deleteCookie('media')
            }
            if (hasCookie("allowedpermissions")) {
                deleteCookie('allowedpermissions')
            }
            if (hasCookie("subscriptionInfo")) {
                deleteCookie('subscriptionInfo')
            }
            if (hasCookie("activeLink")) {
                deleteCookie('activeLink')
            }
            if (hasCookie("clientBtnColor")) {
                deleteCookie('clientBtnColor')
            }
            if (hasCookie("topnavcolor")) {
                deleteCookie('topnavcolor')
            }
            if (hasCookie("sidecolor")) {
                deleteCookie('sidecolor')
            }
            if (hasCookie("LeadsFilter")) {
                deleteCookie('LeadsFilter')
            }
            if (hasCookie("VisitsFilter")) {
                deleteCookie('VisitsFilter')
            }
            if (hasCookie("BookingsFilter")) {
                deleteCookie('BookingsFilter')
            }
            if (hasCookie("BrokerageFilter")) {
                deleteCookie('BrokerageFilter')
            }
            if (hasCookie("Channel_PartnerFilter")) {
                deleteCookie('Channel_PartnerFilter')
            }
            if (hasCookie("cp_selected")) {
                deleteCookie('cp_selected')
            }
          
        }
    },
})

export const { UserLogIN, userLogOut } = ClientLoginSlice.actions

export default ClientLoginSlice.reducer