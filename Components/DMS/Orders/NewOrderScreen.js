import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useRouter } from 'next/router';

const NewOrderScreen = () => {
  const router=useRouter()
  return (
    <div className="d-block bg-white w-100 ">
         {/* <-- new_order_page --> */}
         <section className="NEW-ORDER pt-1">
  <div className="container">
    <div className="row">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="my_profile d-flex align-items-center gap-3">
          <i className="fa-solid fa-arrow-left" />
          <span>New Order</span>
        </div>
        <div className="logo">
          <a href="#">
            <img src="/DMS_IMAGES/kloudmart.png" alt="" />
          </a>
        </div>
      </div>
      {/* end col */}
    </div>
    <div className="row pt-3">
      <div className="col-md-4 offset-md-4  border-success">
        <div className="input-group position-relative d-flex justify-content-between">
          <div className="form">
            <input type="text" className="form-control" placeholder="Search Item" aria-label="Recipient's username" />
            <div className="input-group-append position-absolute">
              <span className="input-group-text border-0"><i className="fa fa-search" /></span>
            </div>
          </div>
          <div className="cart position-relative" onClick={()=>router.push("/DMS/Cart")}>
            <img src="/DMS_IMAGES/ICONS/shopping-cart.svg" alt="normal"/>
            <div className="circle d-flex justify-content-center align-items-center position-absolute">
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row mt-2">
      <div className="col-6">
        <select name className="form-select dropdown">
          <option value selected disabled>Brand</option>
          <option className="dropdown-item" href="#">A</option>
          <option className="dropdown-item" href="#">B</option>
          <option className="dropdown-item" href="#">C</option>
        </select>
      </div>
      <div className="col-6">
        <select name className="form-select dropdown">
          <option value selected disabled> Category</option>
          <option className="dropdown-item" href="#">A</option>
          <option className="dropdown-item" href="#">B</option>
          <option className="dropdown-item" href="#">C</option>
        </select>
      </div>
    </div>
    <div className="shop_by d-flex justify-content-between mt-4">
      <div className="text-wrapper-12">Hot Deals and Offers</div>
      <div className="text-wrapper-13">See All</div>
    </div>
  </div>
</section>


    {/* <!-- slider --> */}
    <section className="Battling_Tiredness Offer-slider mt-3">
  <div className="container">
    <div id="carouselExampleCaptions" className="carousel slide">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={1} aria-label="Slide 2" />
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={2} aria-label="Slide 3" />
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className>
            <div className=" d-flex align-items-center">
              <div className="d-flex gap-3">
                <div className>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M14 5.33333V14H2V5.33333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.3334 2H0.666748V5.33333H15.3334V2Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.66675 8H9.33341" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className>
                  <div className="offer_name">Offer name</div>
                  <p className="text m-0">Lorem ipsum dolor sit amet consectetur. In tincidunt lectus augue mi aliquet
                    pretium purus egestas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className>
            <div className=" d-flex align-items-center">
              <div className="d-flex gap-3">
                <div className>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M14 5.33333V14H2V5.33333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.3334 2H0.666748V5.33333H15.3334V2Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.66675 8H9.33341" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className>
                  <div className="offer_name">Offer name</div>
                  <p className="text m-0">Lorem ipsum dolor sit amet consectetur. In tincidunt lectus augue mi aliquet
                    pretium purus egestas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className>
            <div className=" d-flex align-items-center">
              <div className="d-flex gap-3">
                <div className>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M14 5.33333V14H2V5.33333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.3334 2H0.666748V5.33333H15.3334V2Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.66675 8H9.33341" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className>
                  <div className="offer_name">Offer name</div>
                  <p className="text m-0">Lorem ipsum dolor sit amet consectetur. In tincidunt lectus augue mi aliquet
                    pretium purus egestas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* <!-- Discounted Items --> */}
      <section className="Discounted_Items Order-Discounted_Items">
  <div className="container">
    <div className="d-flex justify-content-between gap-2">
      <div className="card" style={{width: '18rem'}}>
        <div className>
          <div className="vector">
            <img src="/DMS_IMAGES/ICONS/card_vector.png" alt="normal"/>
            <span>32%</span>
          </div>
          <div className="items_img text-center"> <img src="/DMS_IMAGES/discounted_items1.png" alt="normal"/></div>
          <div className="biscuits">
            <div className="com_name">
              <p>McVities Digestive</p>
            </div>
            <div className="biscuit_name">
              <span>Biscuits... </span>
              <span> 100 gms</span>
            </div>
            <div className="underline" />
          </div>
        </div>
        <div className="body">
          <div className>
            <div className="prices">
              <div className="price">
                <span className="mrp">MRP</span>
                <span className="rupees">₹40.00</span>
              </div>
              <div className="quantity">
                <span className="ten">10</span>
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
                <div className="value-button" id="decrease" onclick="decreaseValue()" value="Decrease Value">-</div>
                <input type="number" id="number" defaultValue={0} />
                <div className="value-button" id="increase" onclick="increaseValue()" value="Increase Value">+</div>
              </form>
            </div>
            <div className="Piece_increase">
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
      <div className="card" style={{width: '18rem'}}>
        <div className>
          <div className="vector">
            <img src="/DMS_IMAGES/ICONS/card_vector.png" alt="normal"/>
            <span>32%</span>
          </div>
          <div className="items_img text-center pt-2"> <img src="/DMS_IMAGES/discounted_items2.png" alt="normal"/></div>
          <div className="biscuits ">
            <div className="com_name">
              <p>Britannia Good Day</p>
            </div>
            <div className="biscuit_name">
              <span>Cashew... </span>
              <span> 100 gms</span>
            </div>
            <div className="underline" />
          </div>
        </div>
        <div className="body">
          <div className>
            <div className="prices">
              <div className="price">
                <span className="mrp">MRP</span>
                <span className="rupees">₹40.00</span>
              </div>
              <div className="quantity">
                <span className="ten">10</span>
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
                <div className="value-button" id="decrease" onclick="decreaseValue()" value="Decrease Value">-</div>
                <input type="number" id="number" defaultValue={0} />
                <div className="value-button" id="increase" onclick="increaseValue()" value="Increase Value">+</div>
              </form>
            </div>
            <div className="Piece_increase">
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
  </div>
</section>


    </div>
  )
}

export default NewOrderScreen