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


    const settings = {
      centerMode: true,
      centerPadding: '5px',
      slidesToShow: 5,
      speed: 500,
      slidesToScroll: 1,
      arrows: true,
      dots: true,

      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            slidesToShow: 2,
            
          },
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            slidesToShow: 2,
          },
        },
      ],
    };

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
            console.log(data.data)
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
      <Slider className='mx-2' {...settings} >
      {products?.map((product, i) => (
  <div className="px-1" key={i}>
    <ProductCard
      discount={product.discount}
      image={product.image}
      p_name={product.p_name}
      p_price={product.p_price}
      unit_in_case={product.unit_in_case}
      p_desc={product.p_desc}
      product_id={product.p_id}
      cases={ product?.productCartList[0] ? product.productCartList[0].cases :0}
      piece={product?.productCartList[0] ? product.productCartList[0].piece:0}
      getProducts={getProducts}
    />
  </div>
))}

</Slider>
    </div>
  </section>
    </>
  )
}

export default ShopByProduct
