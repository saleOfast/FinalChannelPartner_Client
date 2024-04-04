import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';

const ShopbyBrand = () => {

  const [products,setProducts]=useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

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



  useEffect(() => {
    const fetchData = async () => {
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
          const response = await axios.get(Baseurl + `/db/brand`, header);
          setBrands(response.data.data);
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.success(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }

        try {
          const response = await axios.get(
            Baseurl + `/db/productCat/getAllList`,
            header
          );
          setCategories(response.data.data);
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.success(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
        <section className="By_brand">
    <div className="container">
      <div className="brands">
        <div className="text-wrapper-22">Shop By Brand</div>
        <div className="text-wrapper-23">See All</div>
      </div>
      {/* slider */}
      <div className="content-wrapper">
        <div className="slider-container">
          <div className="slider-title-wrapper">
            <div className="slider-wrapper">
              {brands?.map((item, i)=> 
                <div key={i} className="slider-item"><img src={`${filesUrl}/brand/images${item.brand_image}`} alt="sd"  /></div>
              )} 
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
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
                <span>{(i+1)*5}</span>
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
                  <span>Biscuits... </span>
                  {/* <span>{product.p_desc} </span> */}
                  <span> {product.p_desc}</span>
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
        
        {/* <div className="card" style={{width: '18rem'}}>
          <div className>
            <div className="vector">
              <img src="./DMS_IMAGES/ICONS/card_vector.png" alt />
              <span>32%</span>
            </div>
            <div className="items_img text-center pt-2"> <img src="./DMS_IMAGES/discounted_items2.png" alt /></div>
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
        </div> */}
      </div>
    </div>
  </section>
  <section className="shop_by_category">
    <div className="container">
      <div className="shop_by">
        <div className="text-wrapper-12">Shop By Category</div>
        <div className="text-wrapper-13">See All</div>
      </div>
      <div className="row pt-3">
        {categories?.map((_v, _x)=>
           <div className="col-3 mt-2">
           <div className="product d-flex flex-column gap-2">
             <img src={`${filesUrl}/category/images${_v.image}`} alt={``} />
             <span className="item">{_v.p_cat_name}</span>
           </div>
         </div>
        )}
       
      
      </div>
      
    </div>
  </section>
    </>
  )
}

export default ShopbyBrand