import React from 'react'
import Kloudmart from './Kloudmart'
import HotDealsCarousel from './HotDealsCarousel'
import ShopbyBrand from './ShopbyBrand'
import PendingPayments from './PendingPayments'
import RecentOrders from './RecentOrders'
import Tabs from '../Tabs/Tabs'


const LandingPageDMS = () => {
  return (
   <div className='bg-white' style={{height:"92vh", overflow:"auto"}} >
  {/* header */}
  <Kloudmart/>
  {/* Hot Deals and Offers-start */}
 <HotDealsCarousel/>
  {/* Hot Deals and Offers-end */}

  {/* shop_by_brand_start */}
  <ShopbyBrand/>
  {/* shop_by_brand_end */}
  
  {/* pending payment start */}
  <PendingPayments/>
  {/* pending payment end */}
  
  {/* Recent Orders Start */}
  <RecentOrders/>
  {/* Recent Orders End */}
  
</div>

  )
}

export default LandingPageDMS