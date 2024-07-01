import React, { useEffect, useState } from "react";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../../store/dmsCartSlice";

const CartScreen = () => {
  const dispatch=useDispatch();
  const {cart}=useSelector(state=>state.dmsCart)
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState();
  const [total, setTotal] = useState();
  const router=useRouter()
  const clientLogo=hasCookie("clientLogo") ? JSON.parse( getCookie("clientLogo")) : null;
 

  const increaseCases_Piece = async (item, type) => {
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
              { user_id: item.user_id, product_id: item.product_id, cases: 1 },
              header
            )
          : await axios.post(
              Baseurl + `/db/cart`,
              { user_id: item.user_id, product_id: item.product_id, piece: 1 },
              header
            );
        dispatch(fetchCart())
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.success(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const decreaseCases_Piece = async (item, type) => {
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
              { user_id: item.user_id, product_id: item.product_id, cases: 1 },
              header
            )
          : await axios.put(
              Baseurl + `/db/cart`,
              { user_id: item.user_id, product_id: item.product_id, piece: 1 },
              header
            );
       dispatch(fetchCart())
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.success(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const calculateItemPrice = (itemPrice, caseQuantity, piecePerCase, pieceQuantity,discountOnCase) => {
    let casePrice=(caseQuantity*piecePerCase*itemPrice)
    let caseDiscount=(casePrice*discountOnCase)/100;
    let totalCasePrice=casePrice-caseDiscount;
    let totalPiecePrice=pieceQuantity*itemPrice;
    let total=Math.round(totalCasePrice+totalPiecePrice)
    return(total) 
  };
  
  useEffect(() => {
    dispatch(fetchCart())
  }, []);

  useEffect(() => {
    let totalCartPrice = cart.reduce((total, item) => {
      return total + calculateItemPrice(item?.productData?.p_price, item?.cases, item?.productData?.unit_in_case, item?.piece, item?.productData?.discount);
    }, 0);
    setCartTotal(totalCartPrice);
    setTotal(totalCartPrice-105);
  }, [cartItems]);

  return (
    <section className="w-100 bg-white" style={{paddingBottom:"90px", overflowY:"scroll"}}>
      <section className="NEW-ORDER CART pt-1">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="my_profile d-flex align-items-center gap-3">
                <KeyboardBackspaceOutlinedIcon />
                <span>Cart</span>
              </div>
              <div className="logo">
                <div>
                  {/* <img src="/DMS_IMAGES/kloudmart.png" alt="normal"/> */}
                  {
                      clientLogo?.logo ? <img
                        src={
                          clientLogo?.logo &&
                          `${filesUrl}` + `/logo/images${clientLogo?.logo}`
                        }
                        alt="Logo"
                        className=" mx-auto"
                      /> : ""
                      }
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-12">
              <div className="item">Item(s)</div>
            </div>
          </div>
        </div>
      </section>
      {/* Items */}
      
      <section className="Difestive-Biscuits p-2 mt-3">
        {cart?.map((item, i) => (
          <div key={i} className="container mt-3">
            <div className="row">
              <div className="col-3 d-flex align-items-center">
                <div className="items_img text-center">
                  <img
                    src={`${filesUrl}/product/images${item?.productData?.image}`}
                    alt
                    className="shadow-none "
                    style={{ width: "95px" }}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="biscuit_deatails card border-0">
                  <div className>
                    <div className="biscuits p-0">
                      <div className="com_name">
                        <p>{item?.productData?.p_name}</p>
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
                          <div
                            className="value-button"
                            id="decrease"
                            onClick={() => {
                              decreaseCases_Piece(item,"cases")
                            }}
                            value="Decrease Value"
                          >
                            -
                          </div>
                          <input type="number" id="number" value={item?.cases} />
                          <div
                            className="value-button"
                            id="increase"
                            onClick={() => {
                              increaseCases_Piece(item, "cases");
                            }}
                            value="Increase Value"
                          >
                            +
                          </div>
                        </form>
                      </div>
                      <div className="Piece_increase  d-flex justify-content-start gap-2">
                        <span>Piece</span>
                        <form>
                          <div
                            className="value-button"
                            id="decrease"
                            onClick={() => {
                              decreaseCases_Piece(item,"piece")
                            }}
                            value="Decrease Value"
                          >
                            -
                          </div>
                          <input type="number" id="number" value={item.piece} />
                          <div
                            className="value-button"
                            id="increase"
                            onClick={() => {
                              increaseCases_Piece(item, "piece");
                            }}
                            value="Increase Value"
                          >
                            +
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3 d-flex align-items-center">
                <span className="threefifty">
                  {/* ₹ {item.productData.p_price}.00 */}
                  ₹ { calculateItemPrice(item?.productData?.p_price,item?.cases,item?.productData?.unit_in_case,item?.piece,item?.productData?.discount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>
      {/* discount */}
      <section className="Discounts pt-3">
        <div className="container">
          <div className="heading">Discounts</div>
          <button className="Apply_Coupon bg-transparent d-flex align-items-center gap-2 mt-3">
            <img src="/DMS_IMAGES/ICONS/iconamoon_discount-fill.svg" alt="normal"/>
            Apply Coupon{" "}
            <img
              src="/DMS_IMAGES/ICONS/chevron-down.svg"
              alt
              className="ms-auto"
            />
          </button>
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
                  <span className="price-details">₹ {cartTotal} </span>
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
                  <span className="price-details">
                    Handling &amp; Packaging Fee
                  </span>
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
                  <span className="price-details total">₹ {total} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* payment section */}
        <section className="Deliver-at">
          <div className="container">
            <div className="row py-1">
              <div className="col-6">
                <div className="d-flex gap-2">
                  <img src="/DMS_IMAGES/ICONS/navigation.svg" alt="normal"/>
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
                    <button
                      type="button"
                      className="btn  dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src="/DMS_IMAGES/ICONS/phonepe.svg" alt="normal"/>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                  <span className="two-forty-five">₹ {total}</span>
                </div>
                <button className="btn-checkout d-inline-flex align-items-center"
                  onClick={()=>{router.push({
                    pathname: `/dms/PaymentMethod`,
                    query: { payment: total} 
                  })}}
                > 
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </section>
      
    </section>
  );
};

export default CartScreen;