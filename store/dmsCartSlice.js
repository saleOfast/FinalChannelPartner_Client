import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import {  getCookie, hasCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { Baseurl } from '../Utils/Constants';

const initialState = { cart:[] }

export const fetchCart=()=>async(dispatch)=>{
    if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            pass: "pass",
          },
        };
  
        try {
          const { data } = await axios.get(Baseurl + `/db/cart`, header);
          dispatch(addToCart(data.data))
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.success(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
}

export const dmsCartSlice = createSlice({
    name: 'dmsCart',
    initialState,
    reducers: {
        addToCart:(state,action)=>{
            state.cart=action.payload
        }
    },
})

export const { addToCart } = dmsCartSlice.actions

export default dmsCartSlice.reducer

