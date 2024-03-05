import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: 'open' }

export const sideViewSlice = createSlice({
    name: 'sideviewslice',
    initialState,
    reducers: {
        fullView: (state) => {
            state.value = 'open'
        },
        closedView: (state) => {
            state.value = 'close'
        }
    },
})

export const { fullView, closedView } = sideViewSlice.actions

export default sideViewSlice.reducer