import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../../../store/dmsCartSlice'
import { getCookie, hasCookie } from 'cookies-next'
import { Baseurl, filesUrl } from '../../../Utils/Constants'
import { toast } from 'react-toastify'
import axios from 'axios'

const PaymentMethodScreen = () => {
    const router=useRouter()
    const {payment}=router.query
    const dispatch=useDispatch()
    const {cart}=useSelector(state=>state.dmsCart)
    const clientLogo=hasCookie("clientLogo") ? JSON.parse( getCookie("clientLogo")) : null;
  
    

    const createOrder=async()=>{
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
         const {data}=await axios.post(Baseurl + `/db/order`,{
            cartData:cart?cart:[]
         } ,header);
         toast.success(data.message);
         router.push("/dms/Orders")
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
          toast.success(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
    }

    useEffect(()=>{
        dispatch(fetchCart())
    },[])
    
  return (
    <section className="Payment-Method w-100 bg-white">
  <div className="container">
    <div className="row">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="my_profile d-flex align-items-center gap-3">
          <i className="fa-solid fa-arrow-left" />
          <span>Payment Method</span>
        </div>
        <div className="logo">
          <div div>
          {
            clientLogo?.logo ? <img
              src={
                clientLogo?.logo &&
                `${filesUrl}` + `/logo/images${clientLogo?.logo}`
              }
              alt="Logo"
              className=" mx-auto"
            /> : ""
            }
          </div>
        </div>
      </div>
    </div>
    <div className="row mt-2 total-payment">
      <div className="col-6">
        <span className="rice-detailsp total">Total Payment</span>
      </div>
      <div className="col-6 text-end">
        <span className="rate" style={{fontFamily: 'Arial', fontSize: 20, fontWeight: 700}}>₹ </span>
        <span className="price-details price"> {payment}</span>
      </div>
    </div>
    <div className="row pt-4">
      <div className="choose-payment">Choose Payment Method</div>
      <div className="col-12 pt-3">
        <div className="Checbox d-flex align-items-center gap-3 justify-content-between">
          <div className>
            <svg xmlns="http://www.w3.org/2000/svg" width={22} height={16} viewBox="0 0 22 16" fill="none">
              <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97933 11.8043 4.588 11.413C4.19667 11.0217 4.00067 10.5507 4 10V2C4 1.45 4.196 0.979333 4.588 0.588C4.98 0.196666 5.45067 0.000666667 6 0H20C20.55 0 21.021 0.196 21.413 0.588C21.805 0.98 22.0007 1.45067 22 2V10C22 10.55 21.8043 11.021 21.413 11.413C21.0217 11.805 20.5507 12.0007 20 12H6ZM8 10H18C18 9.45 18.196 8.97933 18.588 8.588C18.98 8.19667 19.4507 8.00067 20 8V4C19.45 4 18.9793 3.80433 18.588 3.413C18.1967 3.02167 18.0007 2.55067 18 2H8C8 2.55 7.80433 3.021 7.413 3.413C7.02167 3.805 6.55067 4.00067 6 4V8C6.55 8 7.021 8.196 7.413 8.588C7.805 8.98 8.00067 9.45067 8 10ZM19 16H2C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V3H2V14H19V16Z" fill="black" />
            </svg>
            <span>Pay Later</span>
          </div>
          <div className="form-group">
            <div className="radio">
              <label className="position-relative">
                <input type="radio" name="radio-input" />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
        <button className="chech-btn mt-4 d-flex align-items-center justify-content-center" onClick={()=>{
            createOrder()
        }}>Checkout</button>
      </div>
    </div>
  </div>
</section>

  )
}

export default PaymentMethodScreen