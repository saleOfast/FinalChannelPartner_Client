import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ShopByProduct = () => {

    const [products,setProducts]=useState([]);

    const getProducts=async()=>{
        if(hasCookie("token")){
          let token=getCookie("token")
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              pass:"pass"
            },
          };
    
          try {
            const {data} = await axios.get(Baseurl + `/db/product`, header);
            setProducts(data.data);
          } catch (error) {
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
    
        }
      }
      useEffect(()=>{
        getProducts();
      }, [])

  return (
    <>
        <section className="Discounted_Items">
    <div className="container">
      <div className="discounted">
        <div className="text-wrapper-12">Shop By Product</div>
        <div className="text-wrapper-13">See All</div>
      </div>
      <div className="d-flex  justify-content-between gap-2">
        {products?.map((product, i)=>
        
          <ProductCard 
          key={i}
          discount={product.discount} 
          image={product.image}
          p_name={product.p_name}
          p_price={product.p_price}
          unit_in_case={product.unit_in_case}
          p_desc={product.p_desc}
          />
      
        )}
      </div>
      {/* <Slider
  className="d-flex  justify-content-between gap-2"
  dots={true}
  infinite={true}
  speed={500}
  slidesToShow={2}
  slidesToScroll={2}
>
  {products?.map((product, i) =>
    <ProductCard
      key={i}
      discount={product.discount}
      image={product.image}
      p_name={product.p_name}
      p_price={product.p_price}
      unit_in_case={product.unit_in_case}
      p_desc={product.p_desc}
    />
  )}
</Slider> */}
    </div>
  </section>
    </>
  )
}

export default ShopByProduct