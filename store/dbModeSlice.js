import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: '' }

export const dbModeSlice = createSlice({
    name: 'dbMode',
    initialState,
    reducers: {
        masterMode: (state) => {
            state.value = 'master'
        },
        userMode: (state) => {
            state.value = 'user'
        },
        adminMode: (state) => {
            state.value = 'admin'
        },
        clearMode: (state) => {
            state.value = ''
        },
    },
})

export const { masterMode, userMode, adminMode, clearMode } = dbModeSlice.actions

export default dbModeSlice.reducer