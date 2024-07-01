import React from 'react'
import ShopByBrandScreen from '../../Components/DMS/ShopByBrand/ShopByBrandScreen'
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS'


const ShopByBrand = () => {
  return (
    <div className='overflow-scroll pb-4 bg-white w-100'>
        <ShopByBrandScreen/>
    </div>
  )
}

export default WithUserhoc_DMS(ShopByBrand) 