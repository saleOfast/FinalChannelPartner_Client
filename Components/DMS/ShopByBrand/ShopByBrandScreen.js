import React, { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { useRouter } from "next/router";
import axios from "axios";
import { Baseurl } from "../../../Utils/Constants";
import { toast } from "react-toastify";
import { hasCookie, getCookie } from "cookies-next";
import ProductCard from "../ProductCard/ProductCard";

const ShopByBrandScreen = () => {
  const router = useRouter();
  const { brand_id, category_id } = router.query;
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandId, setBrandId] = useState(brand_id || "");
  const [categoryId, setCategoryId] = useState(category_id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const fetchData = async (url, setData) => {
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
        const { data } = await axios.get(Baseurl + url, header);
        setData(data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getProducts = async () => {
    let url = `/db/product/getShopItems?page=1`;

    if (brandId) {
      url += `&brand_id=${brandId}`;
    }

    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }

    url += `&search=${search}`;

    fetchData(url, setProducts);
  };

  useEffect(() => {
    fetchData("/db/brand", setBrandList);
    fetchData("/db/productCat", setCategoryList);
  }, []);

  useEffect(() => {
    getProducts();
  }, [search, brand_id, brandId, categoryId]);

  const handleBrandChange = (event) => {
    const selectedBrandId = event.target.value;
    setCategoryId("");
    setBrandId(selectedBrandId === "all" ? "" : selectedBrandId);
  };

  const handleCategoryChange = (event) => {
    console.log(event.target.value);
    const selectedCategoryId = event.target.value;
    setBrandId("");
    setCategoryId(selectedCategoryId === "all" ? "" : selectedCategoryId);
  };

  return (
    <div className="d-block bg-white w-100">
      <section className="NEW-ORDER pt-1">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="my_profile d-flex align-items-center gap-3">
                <div onClick={() => router.back()}>
                  <KeyboardBackspaceOutlinedIcon />
                </div>
                <span>Shop By Brand</span>
              </div>
              <div className="logo">
                <a href="#">
                  <img src="/DMS_IMAGES/kloudmart.png" alt="normal"/>
                </a>
              </div>
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-md-4 offset-md-4  border-success">
              <div className="input-group position-relative d-flex justify-content-between">
                <div className="form">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Item"
                    aria-label="Recipient's username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={() => setSearch(searchQuery)}
                  />
                  <div
                    className="input-group-append position-absolute"
                    onClick={() => setSearch(searchQuery)}
                  >
                    <span className="input-group-text border-0">
                      <SearchOutlinedIcon />
                    </span>
                  </div>
                </div>
                <div className="cart position-relative">
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
              <select
                name="brandSelect"
                className="form-select dropdown"
                value={brandId}
                onChange={handleBrandChange}
              >
                <optgroup label="Brands">
                  <option value="">All</option>
                  {brandList.map((brand, i) => (
                    <option key={i} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="col-6">
              <select
                name="categorySelect"
                className="form-select dropdown"
                value={categoryId}
                onChange={handleCategoryChange}
              >
                <optgroup label="Categories">
                  <option value="">All</option>
                  {categoryList.map((category, i) => (
                    <option key={i} value={category.p_cat_id}>
                      {category.p_cat_name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          <div className="shop_by d-flex justify-content-between mt-4">
            <div className="text-wrapper-12">Hot Deals and Offers</div>
            <div className="text-wrapper-13">See All</div>
          </div>
        </div>
      </section>
      <section className="Battling_Tiredness Offer-slider mt-3">
        <div className="container">
          <div id="carouselExampleCaptions" className="carousel slide">
            <div className="carousel-indicators">
              {[...Array(3)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
                  aria-current={i === 0 ? "true" : ""}
                  aria-label={"Slide " + (i + 1)}
                />
              ))}
            </div>
            <div className="carousel-inner">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={"carousel-item" + (i === 0 ? " active" : "")}
                >
                  <div className>
                    <div className=" d-flex align-items-center">
                      <div className="d-flex gap-3">
                        <div className>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M14 5.33333V14H2V5.33333"
                              stroke="black"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.3334 2H0.666748V5.33333H15.3334V2Z"
                              stroke="black"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6.66675 8H9.33341"
                              stroke="black"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className>
                          <div className="offer_name">Offer name</div>
                          <p className="text m-0">
                            Lorem ipsum dolor sit amet consectetur. In tincidunt
                            lectus augue mi aliquet pretium purus egestas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="Discounted_Items Order-Discounted_Items">
        <div className="container">
          <div className="row">
            {products?.map((product, i) => (
              <div key={i} className="col-6">
                <ProductCard
                  discount={product.discount}
                  image={product.image}
                  p_name={product.p_name}
                  p_price={product.p_price}
                  unit_in_case={product.unit_in_case}
                  p_desc={product.p_desc}
                  product_id={product.p_id}
                  cases={
                    product.productCartList[0]
                      ? product.productCartList[0].cases
                      : 0
                  }
                  piece={
                    product.productCartList[0]
                      ? product.productCartList[0].piece
                      : 0
                  }
                  getProducts={getProducts}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopByBrandScreen;
