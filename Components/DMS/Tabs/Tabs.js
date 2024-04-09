import React from 'react'
import { useRouter } from "next/router";
import Link from "next/link";


const Tabs = ({children}) => {
  const router=useRouter();
  return (
    <div className='d-flex flex-column w-100 '>
      <div>
    {children}
      </div>
  <section className="nav_tab bottom-nav">
    <div >
      <div className="card">
        <nav>
          <div className="nav nav-tabs d-flex justify-content-between"  id="nav-tab" role="tablist">
            <button className="nav-link active d-flex flex-column gap-2 align-items-center" onClick={()=>{
              router.push("/")
            }} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 7.49996L10 1.66663L17.5 7.49996V16.6666C17.5 17.1087 17.3244 17.5326 17.0118 17.8451C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8451C2.67559 17.5326 2.5 17.1087 2.5 16.6666V7.49996Z" stroke="#00498B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 18.3333V10H12.5V18.3333" stroke="#00498B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Home</button>
            <button className="nav-link d-flex flex-column gap-2 align-items-center" onClick={()=>{
              router.push("/DMS/Orders")
            }} id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-Orders" type="button" role="tab" aria-controls="nav-orders" aria-selected="false">
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="shopping-bag">
                  <path id="Vector" d="M5 1.66663L2.5 4.99996V16.6666C2.5 17.1087 2.67559 17.5326 2.98816 17.8451C3.30072 18.1577 3.72464 18.3333 4.16667 18.3333H15.8333C16.2754 18.3333 16.6993 18.1577 17.0118 17.8451C17.3244 17.5326 17.5 17.1087 17.5 16.6666V4.99996L15 1.66663H5Z" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <path id="Vector_2" d="M2.5 5H17.5" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <path id="Vector_3" d="M13.3334 8.33337C13.3334 9.21743 12.9822 10.0653 12.357 10.6904C11.7319 11.3155 10.8841 11.6667 10 11.6667C9.11597 11.6667 8.26812 11.3155 7.643 10.6904C7.01788 10.0653 6.66669 9.21743 6.66669 8.33337" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
               Orders</button>
            <button className="nav-link d-flex flex-column gap-2 align-items-center" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-Inventory" type="button" role="tab" aria-controls="nav-Inventory" aria-selected="false"><svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="shopping-bag">
                  <path id="Vector" d="M5 1.66663L2.5 4.99996V16.6666C2.5 17.1087 2.67559 17.5326 2.98816 17.8451C3.30072 18.1577 3.72464 18.3333 4.16667 18.3333H15.8333C16.2754 18.3333 16.6993 18.1577 17.0118 17.8451C17.3244 17.5326 17.5 17.1087 17.5 16.6666V4.99996L15 1.66663H5Z" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <path id="Vector_2" d="M2.5 5H17.5" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <path id="Vector_3" d="M13.3334 8.33337C13.3334 9.21743 12.9822 10.0653 12.357 10.6904C11.7319 11.3155 10.8841 11.6667 10 11.6667C9.11597 11.6667 8.26812 11.3155 7.643 10.6904C7.01788 10.0653 6.66669 9.21743 6.66669 8.33337" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
              Inventory</button>
            <button className="nav-link d-flex flex-column gap-2 align-items-center return" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-Payment" type="button" role="tab" aria-controls="nav-Payment" aria-selected="false"><svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="credit-card" clipPath="url(#clip0_1153_9057)">
                  <path id="Vector" d="M17.5 3.33337H2.49998C1.57951 3.33337 0.833313 4.07957 0.833313 5.00004V15C0.833313 15.9205 1.57951 16.6667 2.49998 16.6667H17.5C18.4205 16.6667 19.1666 15.9205 19.1666 15V5.00004C19.1666 4.07957 18.4205 3.33337 17.5 3.33337Z" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <path id="Vector_2" d="M0.833313 8.33337H19.1666" stroke="#939393" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_1153_9057">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Payment</button>
            <button className="nav-link d-flex flex-column gap-2 justify-content-center align-items-center" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-Claim/Returnt" type="button" role="tab" aria-controls="nav-Claim/Returnt" aria-selected="false"> <svg width={22} height={16} viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Frame 18">
                  <rect x={1} y={1} width={20} height={14} rx={2} stroke="#939393" strokeWidth={2} />
                  <path id="Vector" d="M14 4V5C15.103 5 16 5.897 16 7C16 8.103 15.103 9 14 9H8V6.5L5 9.5L8 12.5V10H14C15.6545 10 17 8.6545 17 7C17 5.3455 15.6545 4 14 4Z" fill="#939393" />
                </g>
              </svg>
              Claim/Returnt</button>
            <button className="nav-link d-flex flex-column gap-2 justify-content-center align-items-center" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-Claim/Returnt" type="button" role="tab" aria-controls="nav-Claim/Returnt" aria-selected="false" onClick={()=>{
              router.push("/DMS/Cart")
            }}>
            <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  width="24"
  height="24"
>
  <circle cx="9" cy="21" r="1" />
  <circle cx="20" cy="21" r="1" />
  <path
    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61H18a2 2 0 0 0 2-1.61L23 6H6"
  />
</svg>
              Cart
            </button>
          </div>
        </nav>
      </div>
    </div>
  </section>
    </div>
  )
}

export default Tabs