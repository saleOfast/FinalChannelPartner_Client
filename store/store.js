import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../store/themeSlice'
import dbModeReducer from '../store/dbModeSlice'
import adMinLoginReducer from '../store/adMinLoginSlice'
import userloginreducer from '../store/ClientLoginSlice'
import isActiveSliceReducer from '../store/isActiveSidebarSlice'
import sideViewSlice from './sideViewSlice'

export const store = configureStore({
    reducer: {
        themeMode: themeReducer,
        dbMode:dbModeReducer,
        adminLogin: adMinLoginReducer,
        userLogin: userloginreducer,
        sideView: sideViewSlice,
        isActiveSlice: isActiveSliceReducer
    },
    
})