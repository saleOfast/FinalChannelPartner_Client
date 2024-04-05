import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';

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
            console.log(data.data);
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
      <div className="d-flex justify-content-between gap-2">
        {products?.map((product, i)=>
            <div className="card" style={{width: '18rem'}}>
            <div className>
              <div className="vector">
                <img src="./DMS_IMAGES/ICONS/card_vector.png" alt />
                <span>{(i+1)*5}%</span>
              </div>
              {/* <div className="items_img text-center"> <img src="./DMS_IMAGES/discounted_items1.png" alt /></div> */}
              <div className="items_img text-center" > 
              <img src={`${filesUrl}/product/images${product.image}`} style={{width:"115px",height:"70px"}} alt />
              </div> 
              <div className="biscuits">
                <div className="com_name">
                  {/* <p>McVities Digestive</p> */}
                  <p>{product.p_name}</p>
                </div>
                <div className="biscuit_name">
                  {/* <span>Biscuits... </span> */}
                  <span>{product.p_desc} </span>
                  {/* <span> {product.p_desc}</span> */}
                </div>
                <div className="underline" />
              </div>
            </div>
            <div className="body">
              <div className>
                <div className="prices">
                  <div className="price">
                    <span className="mrp">MRP</span>
                    {/* <span className="rupees">₹40.00</span> */}
                    <span className="rupees">{product.p_price} </span>
                  </div>
                  <div className="quantity">
                    {/* <span className="ten">10</span> */}
                    <span className="ten">{product.unit_in_case}</span>
                  </div>
                </div>
                <div className="prices details">
                  <div className="price">
                    <span className="mrp">RLP</span>
                    <span className="rupees">₹35.00</span>
                  </div>
                  <div className="quantity">
                    <span className="case">Case Qty</span>
                  </div>
                </div>
              </div>
              <div className="amount_increase">
                <div className="case_increase">
                  <span>Case</span>
                  <form>
                    <div className="value-button" id="decrease"  value="Decrease Value">-</div>
                    <input type="number" id="number" defaultValue={0} />
                    <div className="value-button" id="increase"  value="Increase Value">+</div>
                  </form>
                </div>
                <div className="Piece_increase">
                  <span>Piece</span>
                  <form>
                    <div className="value-button" id="decrease"  value="Decrease Value">-</div>
                    <input type="number" id="number" defaultValue={0} />
                    <div className="value-button" id="increase"  value="Increase Value">+</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
    </>
  )
}

export default ShopByProduct