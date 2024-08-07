import React from 'react'
import Kloudmart from './Kloudmart'
import HotDealsCarousel from './HotDealsCarousel'
import PendingPayments from './PendingPayments'
import RecentOrders from './RecentOrders'
import ShopByProduct from './ShopByProduct'
import ByBrand from './ByBrand'
import ByCategory from './ByCategory'


const LandingPageDMS = () => {
  return (
   <div className='bg-white' style={{height:"92vh", overflow:"auto"}} >
  {/* header */}
  {/* <Kloudmart/> */}
  {/* Hot Deals and Offers-start */}
 <HotDealsCarousel/>
  {/* Hot Deals and Offers-end */}

  {/* shop_by_brand_start */}
  <ByBrand/>
  {/* shop_by_brand_end */}

   {/* shop_by_product_start */}
   <ShopByProduct/>
  {/* shop_by_product_end */}

    {/* shop_by_category_start */}
   <ByCategory/>
  {/* shop_by_category_end */}

  
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