import React from 'react'
import ShopByBrandScreen from '../../Components/DMS/ShopByBrand/ShopByBrandScreen'
import withUser from '../../HOC/WithUserhoc'


const ShopByBrand = () => {
  return (
    <>
        <ShopByBrandScreen/>
    </>
  )
}

export default withUser(ShopByBrand) 