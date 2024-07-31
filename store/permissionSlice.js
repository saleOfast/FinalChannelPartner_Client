import { createSlice } from '@reduxjs/toolkit'
import { deleteCookie, hasCookie, setCookie } from 'cookies-next';

const initialState = { value: '' ,allowedPermissions:[] }

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
            if (hasCookie("media")) {
                deleteCookie('media')
            }
            setCookie('crm', 'crm');
            state.value='crm'
        },
            //Temporary
        media: (state) => {
            if (hasCookie("dms")) {
               
               deleteCookie('dms')
           }
           if (hasCookie("sales")) {
               deleteCookie('sales')
           }
           if (hasCookie("channel")) {
               deleteCookie('channel')
           }
           if (hasCookie("crm")) {
            deleteCookie('crm')
        }
           setCookie('media', 'media');
           state.value='media'
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
            if (hasCookie("media")) {
                deleteCookie('media')
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
            if (hasCookie("media")) {
                deleteCookie('media')
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
            if (hasCookie("media")) {
                deleteCookie('media')
            }
            setCookie('channel', 'channel');
            state.value='channel'
        },
        allowpermissions:(state,action)=>{
            state.allowedPermissions= action.payload;
            setCookie('allowedpermissions', action.payload);
           
        },

        //temp
        // allowpermissions: (state, action) => {
        //     const permissions = new Set(action.payload);
        //     permissions.add('media');
        //     state.allowedPermissions = Array.from(permissions);
        //     setCookie('allowedpermissions', state.allowedPermissions);
        // },
        clearValue:(state,action)=>{
            state.value=null
        }
    },
})

export const { crm,dms,sales,channel,allowpermissions,clearValue,media } = dbPermissionModeSlice.actions

export default dbPermissionModeSlice.reducer

