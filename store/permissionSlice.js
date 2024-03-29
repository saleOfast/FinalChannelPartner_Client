import { createSlice } from '@reduxjs/toolkit'
import { deleteCookie, hasCookie, setCookie } from 'cookies-next';

const initialState = { value: '',allowedPermissions:[] }

export const assignPermissions=(permissions)=>(dispatch)=>{
    dispatch(allowpermissions(permissions))
}

export const dbPermissionModeSlice = createSlice({
    name: 'permissionMode',
    initialState,
    reducers: {
        crm: (state) => {
             if (hasCookie("dms")) {
                
                deleteCookie('dms')
            }
            if (hasCookie("sales")) {
                deleteCookie('sales')
            }
            if (hasCookie("channel")) {
                deleteCookie('channel')
            }
            setCookie('crm', 'crm');
            state.value='crm'
        },
        dms: (state) => {
            if (hasCookie("crm")) {
                deleteCookie('crm')
            }
            if (hasCookie("sales")) {
                deleteCookie('sales')
            }
            if (hasCookie("channel")) {
                deleteCookie('channel')
            }
            setCookie('dms', 'dms');
            state.value='dms'
        },
        sales: (state) => {
            if (hasCookie("dms")) {
                deleteCookie('dms')
            }
            if (hasCookie("crm")) {
                deleteCookie('crm')
            }
            if (hasCookie("channel")) {
                deleteCookie('channel')
            }
            setCookie('sales', 'sales');
            state.value='sales'
        },
        channel: (state) => {
            if (hasCookie("dms")) {
                deleteCookie('dms')
            }
            if (hasCookie("sales")) {
                deleteCookie('sales')
            }
            if (hasCookie("crm")) {
                deleteCookie('crm')
            }
            setCookie('channel', 'channel');
            state.value='channel'
        },
        allowpermissions:(state,action)=>{
            state.allowedPermissions=action.payload
            setCookie("allowedPermissions",JSON.stringify(action.payload))
        }
    },
})

export const { crm,dms,sales,channel,allowpermissions } = dbPermissionModeSlice.actions

export default dbPermissionModeSlice.reducer

