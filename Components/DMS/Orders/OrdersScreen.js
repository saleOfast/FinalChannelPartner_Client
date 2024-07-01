import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import { getCookie, hasCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrdersScreen = () => {
  const router=useRouter();
  const [orderList,setOrderList]=useState([]);
  const clientLogo=hasCookie("clientLogo") ? JSON.parse( getCookie("clientLogo")) : null;

  const fetchOrders = async () => {
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
        const { data } = await axios.get(Baseurl + `/db/order`, header);
        setOrderList(data?.data?.data);
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
          toast.success(error?._response?.data?.message);

        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return (new Intl.DateTimeFormat("en-US", options).format(date))
  }

  useEffect(()=>{
    fetchOrders()
  },[])

  const calculatePrice=(cases,piece,unit_per_case,discount,price)=>{
    const totalPrice=((cases*unit_per_case*price)-(cases*unit_per_case*price*discount)/100)+(piece*price)
    return Math.round(totalPrice)
  }



  
  return (
    <section className="nav_tab order_tab bg-white">
  
    <div className="d-flex justify-content-between align-items-center" style={{padding: '0 16px'}}>
      <div className="my_profile d-flex align-items-center gap-3 ">
        <KeyboardBackspaceOutlinedIcon />
        <span>Orders</span>
      </div>
      <div className="logo">
        <div >
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
    <div className="card">
      <nav className='w-100' >
        <div className="nav nav-tabs  d-flex justify-content-between" id="nav-tab"  role="tablist">
          <button className="nav-link active d-flex flex-column gap-2 align-items-center pb-3" id="active" data-bs-toggle="tab" data-bs-target="#active-tab" type="button" role="tab" aria-controls="active-tab" aria-selected="true">
            Active</button>
          <button className="nav-link d-flex flex-column gap-2 align-items-center pb-3" id="delivered" data-bs-toggle="tab" data-bs-target="#order-delivered" type="button" role="tab" aria-controls="order-delivered" aria-selected="false">
            Delivered</button>
          <button className="nav-link d-flex flex-column gap-2 align-items-center pb-3" style={{marginRight: 20}} id="canceled" data-bs-toggle="tab" data-bs-target="#order-canceled" type="button" role="tab" aria-controls="order-canceled" aria-selected="false">
            Cancelled</button>
        </div>
      </nav>
      <div className="tab-content pt-3 " id="order-tabContent" style={{padding: '  0 16px'}}>
        <div className="tab-pane fade active show" id="active-tab" role="tabpanel" aria-labelledby="active">
          <div className="row">
            <div className="col-12">
              {
                 orderList[0]?.orderItemList.map((order,i)=>
                 {
                  return(
                  <div key={i} className="biscuit_deatails p-3">
                    <div className="biscuits">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="com_name">
                        {formatDate(new Date(order?.createdAt))}
                        </div>
                        <div className="biscuit_name">
                          <a href="#" className="text-decoration-none"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                              <path d="M2.66675 11.3333V12.6667C2.66675 13.0203 2.80722 13.3594 3.05727 13.6095C3.30732 13.8595 3.64646 14 4.00008 14H12.0001C12.3537 14 12.6928 13.8595 12.9429 13.6095C13.1929 13.3594 13.3334 13.0203 13.3334 12.6667V11.3333M4.66675 7.33333L8.00008 10.6667M8.00008 10.6667L11.3334 7.33333M8.00008 10.6667V2.66667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>Download Invoice</a>
                        </div>
                      </div>
                      <div className="underline" />
                    </div>
                  
                  <div className="body shop_by_category pt-3">
                    
                      <div className="d-flex  align-items-center pb-2">
                        <div className="items_img text-center"> <img src={`${filesUrl}/product/images${order?.OrderProductData?.image}`} style={{width:"150px"}} alt="normal"className="shadow-none" />
                        </div>
                        <div className="d-flex flex-column ms-4">
                          <div className="d-flex flex-column gap-2">
                            
                              <div className="order_id">Order ID: {orderList[0]?.order_id}</div>
                              <span className="Britannia">{order?.OrderProductData?.p_name}</span>
                            
                            <div className="prices d-flex align-items-center">
                              <div className="price">
                                <div className="rupees">{calculatePrice(order?.cases,order?.piece,order?.product_unit,order?.product_discount,order?.price)}</div>
                                <div className='rupees'>Cases:{order?.cases}</div>
                                <div className='rupees'>Piece:{order?.piece}</div>
                              </div>
                              <button type="button" className="btn btn_red d-flex flex-row align-items-center gap-1 border-0"><i className="fa-solid fa-rotate-right" />
                                {orderList[0]?.p_status}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="underline mb-0" />
                   
                    <div className="btn_cancel_payment d-flex justify-content-between pt-3">
                      <button className="btn btn_left d-flex align-items-center justify-content-center m-0">Cancel</button>
                      <button className="btn btn_right d-flex align-items-center justify-content-center m-0">Make
                        Payment</button>
                    </div>
                  </div>
                </div>
                 )}
                 )
              }
             
            </div>
          </div>
          {/* <div className="deatils_form position-relative" onClick={()=>{router.push("/dms/NewOrders")}}>
            <div className="edit_page d-flex align-items-center justify-content-center position-fixed" style={{marginTop: '73%', width: 48, height: 48, flexShrink: 0, fill: 'var(--Primary-Color, #00498B)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none">
                <path d="M33.0001 23.8297H23.8334V32.9963C23.8334 33.4826 23.6403 33.9489 23.2964 34.2927C22.9526 34.6365 22.4863 34.8297 22.0001 34.8297C21.5139 34.8297 21.0475 34.6365 20.7037 34.2927C20.3599 33.9489 20.1667 33.4826 20.1667 32.9963V23.8297H11.0001C10.5139 23.8297 10.0475 23.6365 9.70372 23.2927C9.3599 22.9489 9.16675 22.4826 9.16675 21.9963C9.16675 21.5101 9.3599 21.0438 9.70372 20.7C10.0475 20.3561 10.5139 20.163 11.0001 20.163H20.1667V10.9963C20.1667 10.5101 20.3599 10.0438 20.7037 9.69996C21.0475 9.35615 21.5139 9.16299 22.0001 9.16299C22.4863 9.16299 22.9526 9.35615 23.2964 9.69996C23.6403 10.0438 23.8334 10.5101 23.8334 10.9963V20.163H33.0001C33.4863 20.163 33.9526 20.3561 34.2964 20.7C34.6403 21.0438 34.8334 21.5101 34.8334 21.9963C34.8334 22.4826 34.6403 22.9489 34.2964 23.2927C33.9526 23.6365 33.4863 23.8297 33.0001 23.8297Z" fill="white" />
              </svg>
            </div>
          </div> */}
          {/* <div className="row pt-2">
            <div className="col-12">
              <div className="biscuit_deatails p-3">
                <div className>
                  <div className="biscuits">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="com_name">
                        Jan 16, 2024 - 5:38 PM
                      </div>
                      <div className="biscuit_name">
                        <a href="#" className="text-decoration-none"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                            <path d="M2.66675 11.3333V12.6667C2.66675 13.0203 2.80722 13.3594 3.05727 13.6095C3.30732 13.8595 3.64646 14 4.00008 14H12.0001C12.3537 14 12.6928 13.8595 12.9429 13.6095C13.1929 13.3594 13.3334 13.0203 13.3334 12.6667V11.3333M4.66675 7.33333L8.00008 10.6667M8.00008 10.6667L11.3334 7.33333M8.00008 10.6667V2.66667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>Download Invoice</a>
                      </div>
                    </div>
                    <div className="underline" />
                  </div>
                </div>
                <div className="body shop_by_category pt-3">
                  <div className>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <div className="items_img text-center"> <img src="/DMS_IMAGES/discounted_items1.png" alt="normal"className="shadow-none" />
                      </div>
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-column gap-2">
                          <div className>
                            <div className="order_id">Order ID: DL295750293018</div>
                            <span className="Britannia">McVities Digestive, Britannia
                              Go...</span>
                          </div>
                          <div className="prices d-flex align-items-center">
                            <div className="price">
                              <span className="rupees">3266.82</span>
                              <span className="mrp">|</span>
                              <span className="twoitems"> 2 Items</span>
                            </div>
                            <button type="button" className="btn btn_red d-flex flex-row align-items-center gap-1 border-0" style={{color: '#06A718'}}><svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" fill="none">
                                <path d="M10 3L4.5 8.5L2 6" stroke="#06A718" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Paid</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="underline mb-0" />
                  </div>
                  <div className="btn_cancel_payment d-flex justify-content-between pt-3">
                    <button className="btn btn_left d-flex align-items-center justify-content-center w-100 m-0">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="tab-pane fade" id="order-delivered" role="tabpanel" aria-labelledby="delivered">
            <img className="img-fluid" src="https://fakeimg.pl/800x300/?text=about" />
          </div>
          <div className="tab-pane fade" id="order-canceled" role="tabpanel" aria-labelledby="canceled">
            <img className="img-fluid" src="https://fakeimg.pl/800x300/?text=home" />
          </div>
        </div>
      </div>
    </div>
  
  </section>

  )
}

export default OrdersScreen