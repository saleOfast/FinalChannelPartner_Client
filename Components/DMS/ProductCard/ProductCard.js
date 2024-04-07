import React from 'react'
import { filesUrl } from '../../../Utils/Constants'

const ProductCard = ({discount,image,p_name,p_desc,p_price,unit_in_case}) => {
  return (
    <div className='col-6'>
         <div className="card" style={{width: '18rem'}}>
            <div className>
              <div className="vector">
                <img src="/DMS_IMAGES/ICONS/card_vector.png" alt />
                <span>{discount}%</span>
              </div>
              {/* <div className="items_img text-center"> <img src="./DMS_IMAGES/discounted_items1.png" alt /></div> */}
              <div className="items_img text-center" > 
              <img src={`${filesUrl}/product/images${image}`} style={{width:"115px",height:"70px"}} alt />
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
    </div>
  )
}

export default ProductCard