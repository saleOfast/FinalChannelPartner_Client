import React, { useState } from 'react'
import { Baseurl, filesUrl } from '../../../Utils/Constants'
import { getCookie, hasCookie } from 'cookies-next'
import { toast } from 'react-toastify'
import axios from 'axios'


const ProductCard = ({discount,image,p_name,p_desc,p_price,unit_in_case,product_id,cases,piece,getProducts}) => {

  const userInfo=JSON.parse(getCookie('userInfo'))

  const increaseCases_Piece = async (product_id, type) => {
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
        type === "cases"
          ? await axios.post(
              Baseurl + `/db/cart`,
              { user_id: userInfo.user_id,product_id, cases: 1 },
              header
            )
          : await axios.post(
              Baseurl + `/db/cart`,
              { user_id: userInfo.user_id,product_id, piece: 1 },
              header
            );
           await getProducts()
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
          toast.success(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const decreaseCases_Piece = async (product_id, type) => {
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
        type === "cases"
          ? await axios.put(
              Baseurl + `/db/cart`,
              { user_id: userInfo.user_id,product_id, cases: 1 },
              header
            )
          : await axios.put(
              Baseurl + `/db/cart`,
              { user_id: userInfo.user_id, product_id, piece: 1 },
              header
            );
            await getProducts()
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.success(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  return (
   
         <div className="card" style={{width: '18rem'}}>
            <div className>
              <div className="vector">
                <img src="/DMS_IMAGES/ICONS/card_vector.png" alt="normal"/>
                <span>{discount}%</span>
              </div>
              {/* <div className="items_img text-center"> <img src="./DMS_IMAGES/discounted_items1.png" alt="normal"/></div> */}
              <div className="items_img text-center" > 
              <img src={`${filesUrl}/product/images${image}`} style={{width:"115px",height:"70px"}} alt="normal"/>
              </div> 
              <div className="biscuits">
                <div className="com_name">
                  {/* <p>McVities Digestive</p> */}
                  <p>{p_name}</p>
                </div>
                <div className="biscuit_name">
                  {/* <span>Biscuits... </span> */}
                  <span>{p_desc} </span>
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
                    <span className="rupees">{p_price} </span>
                  </div>
                  <div className="quantity">
                    {/* <span className="ten">10</span> */}
                    <span className="ten">{unit_in_case}</span>
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
                    <div className="value-button" id="decrease"  value="Decrease Value" onClick={() => {
                              decreaseCases_Piece(product_id,"cases");
                            }}>-</div>
                    <input type="number" id="number" value={cases} />
                    <div className="value-button" id="increase"  value="Increase Value"  onClick={() => {
                              increaseCases_Piece(product_id,"cases");
                            }} >+</div>
                  </form>
                </div>
                <div className="Piece_increase">
                  <span>Piece</span>
                  <form>
                    <div className="value-button" id="decrease"  value="Decrease Value" onClick={() => {
                              decreaseCases_Piece(product_id,"piece");
                            }}>-</div>
                    <input type="number" id="number" value={piece} />
                    <div className="value-button" id="increase"  value="Increase Value"  onClick={() => {
                              increaseCases_Piece(product_id,"piece");
                            }}>+</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
   
  )
}

export default ProductCard