import React from 'react'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
const CartScreen = () => {
  return (
       
  <section className='w-100 bg-white'>
    <section className="NEW-ORDER CART pt-1">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="my_profile d-flex align-items-center gap-3">
              <KeyboardBackspaceOutlinedIcon />
              <span>Cart</span>
            </div>
            <div className="logo">
              <a href="#">
                <img src="/DMS_IMAGES/kloudmart.png" alt />
              </a>
            </div>
          </div>
          {/* end col */}
          <div className="col-12">
            <div className="item">Item(s)</div>
          </div>
        </div>
      </div>
    </section>
    {/* McVities Difestive Biscuits */}
    <section className="Difestive-Biscuits p-2 mt-3">
      <div className="container">
        <div className="row">
          <div className="col-3 d-flex align-items-center">
            <div className="items_img text-center"> <img src="/DMS_IMAGES/discounted_items1.png" alt className="shadow-none" />
            </div>
          </div>
          <div className="col-6">
            <div className="biscuit_deatails card border-0">
              <div className>
                <div className="biscuits p-0">
                  <div className="com_name">
                    <p>McVities Difestive Biscuits</p>
                  </div>
                  <div className="biscuit_name">
                    <span>100 gms </span>
                  </div>
                </div>
              </div>
              <div className="body shop_by_category">
                <div className="amount_increase">
                  <div className="case_increase d-flex justify-content-start gap-2">
                    <span>Case</span>
                    <form>
                      <div className="value-button" id="decrease" onclick="decreaseValue()" value="Decrease Value">-</div>
                      <input type="number" id="number" defaultValue={0} />
                      <div className="value-button" id="increase" onclick="increaseValue()" value="Increase Value">+</div>
                    </form>
                  </div>
                  <div className="Piece_increase  d-flex justify-content-start gap-2">
                    <span>Piece</span>
                    <form>
                      <div className="value-button" id="decrease" onclick="decreaseValue()" value="Decrease Value">-</div>
                      <input type="number" id="number" defaultValue={0} />
                      <div className="value-button" id="increase" onclick="increaseValue()" value="Increase Value">+</div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3 d-flex align-items-center">
            <span className="threefifty">₹ 350.00</span>
          </div>
        </div>
      </div>
    </section>
    {/* discount */}
    <section className="Discounts pt-3">
      <div className="container">
        <div className="heading">Discounts</div>
        <button className="Apply_Coupon bg-transparent d-flex align-items-center gap-2 mt-3"><img src="/DMS_IMAGES/ICONS/iconamoon_discount-fill.svg" alt />Apply Coupon <img src="/DMS_IMAGES/ICONS/chevron-down.svg" alt className="ms-auto" /></button>
        <div className="row pt-4">
          <div className="col-12">
            <div className="Breakdown">Price Breakdown</div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex flex-column justify-content-between">
            <div className="row Price-Breakdown">
              <div className="col-6">
                <span className="price-details">Cart Total</span>
              </div>
              <div className="col-6 text-end">
                <span className="price-details">₹ 350</span>
              </div>
            </div>
            <div className="row Price-Breakdown">
              <div className="col-6">
                <span className="price-details">Discount </span>
              </div>
              <div className="col-6 text-end">
                <span className="price-details">- ₹ 100</span>
              </div>
            </div>
            <div className="row Price-Breakdown">
              <div className="col-6">
                <span className="price-details">Handling &amp; Packaging Fee</span>
              </div>
              <div className="col-6 text-end">
                <span className="price-details">₹ 5</span>
              </div>
            </div>
            <div className="row Price-Breakdown mt-3">
              <div className="col-6">
                <span className="price-details total">Total</span>
              </div>
              <div className="col-6 text-end">
                <span className="price-details total">₹ 245</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* payment section */}
    <div className>
    <section className="Deliver-at">
      <div className="container">
        <div className="row py-1">
          <div className="col-6">
            <div className="d-flex gap-2">
              <img src="/DMS_IMAGES/ICONS/navigation.svg" alt />
              <div className="d-flex flex-column deliver_address">
                <span className="deliver">Deliver at</span>
                <span className="noida">Noida 201301</span>
              </div>
            </div>
          </div>
          <div className="col-6 text-end">
            <span className="change">change</span>
          </div>
        </div>
      </div>
    </section>
    <section className="Phonepe-Section py-2">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="Payment">
              <div className="btn-group">
                <button type="button" className="btn  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="/DMS_IMAGES/ICONS/phonepe.svg" alt />
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a className="dropdown-item" href="#">Separated link</a></li>
                </ul>
              </div>
              <span className="two-forty-five">₹ 245</span>
            </div>
            <button className="btn-checkout d-inline-flex align-items-center">Checkout</button>
          </div>
        </div>
      </div>
    </section>
  </div>
  </section>
 


    
  )
}

export default CartScreen