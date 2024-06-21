import React, { useEffect, useState } from "react";
import Link from "next/link";

import axios from "axios";
import { Baseurl, filesUrl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import moment from "moment";
import { useSelector } from "react-redux";
const AddProductScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [userInfo, setUserInfo] = useState( {
    p_name:"",
    p_code:"",
    p_price:"",
    p_cat_id:"",
    unit_in_case:"",
    p_desc:"",
    image:"",
    created_on:"",
    updated_on:"",
    discount:0,
    brand_name:"",
    brand_id:""
  });
  const [errorData, setErrorData] = useState({});
  const [brandList, setBrandList] = useState([]);
  const [selected, setSelected] = useState({
    p_cat_id: "",
    p_cat_name: "",
    brand_name: "",
    brand_id: "",
  });
  const [dataList, setDataList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const arr = [];

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD");

  function checkChildrens(data, space = 0, i = 0) {
    space += 1;
    let spaces = "";
    for (let i = 0; i < space; i++) {
      spaces += "\u00A0\u00A0";
    }
    if (data?.length > 0) {
      return data?.map(({ p_cat_id, p_cat_name, children }) => {
        return (
          <>
            {" "}
            <option key={p_cat_id} name={p_cat_name} value={p_cat_id}>
              {spaces}
              {p_cat_name}
            </option>
            {checkChildrens(children, space)}
          </>
        );
      });
    }
  }

  function parentHandlerId(e, dataList, obj = []) {
    dataList.map((item) => {
      arr.push({
        p_cat_id: item.p_cat_id,
        p_cat_name: item.p_cat_name,
      });
      if (item.children.length > 0) {
        return parentHandlerId(e, item.children, arr);
      }
    });

    return arr;
  }

  function getItem(e, dataList, obj = []) {
    setErrorData({ ...errorData, p_cat_id: "" });
    let arrData = parentHandlerId(e, dataList, (obj = []));
    const object = arrData.find((net) => net.p_cat_id == e.target.value);
    if (object) {
      setSelected({
        ...selected,
        p_cat_id: object.p_cat_id,
        p_cat_name: object.p_cat_name,
      });
      setUserInfo({ ...userInfo, p_cat_id: e.target.value });
    } else {
      setSelected({ ...selected, p_cat_name: "" });
      setUserInfo({ ...userInfo, p_cat_id: "0" });
    }
  }

  function setBrand(e, brandList) {
    setErrorData({ ...errorData, brand_id: "" });
    let arrData = brandList.find((brand) => brand.brand_id == e.target.value);
    setSelected({
      ...selected,
      brand_name: arrData.brand_name,
      brand_id: arrData.brand_id,
    });
  }

  const getDataList = async () => {
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
        const response = await axios.get(Baseurl + `/db/productCat`, header);
        setDataList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const updateHandler = async () => {
    let allEmpty = true;
    for (let key in errorData) {
      if (errorData[key] !== "") {
        allEmpty = false;
        break;
      }
    }
    if (allEmpty) {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 43,
          },
        };

        const formData = new FormData();
        formData.append("p_id", id);
        formData.append("p_name", userInfo.p_name);
        formData.append("p_code", userInfo.p_code);
        formData.append("p_price", userInfo.p_price);
        formData.append("p_cat_id", userInfo.p_cat_id);
        formData.append("unit_in_case", userInfo.unit_in_case);
        formData.append("p_desc", userInfo.p_desc);
        formData.append("image", userInfo.image);
        formData.append("discount", userInfo.discount);
        formData.append("created_on", userInfo.created_on);
        formData.append("updated_on", userInfo.updated_on);
        formData.append("brand_name", selected.brand_name);
        formData.append("brand_id", selected.brand_id);


        try {
          const response = await axios.put(
            Baseurl + `/db/product`,
            formData,
            header
          );
          if (response.status === 200 || response.status === 204) {
            toast.success(response.data.message);
            router.push("/Products");
          }
        } catch (error) {
          console.log(error)
          if (error?.response?.data?.status === 422) {
            const taskObject = {};
            const array = error?.response?.data?.data;

            for (let i = 0; i < array.length; i++) {
              const key = Object.keys(array[i])[0];
              const value = Object.values(array[i])[0];
              taskObject[key] = value;
            }

            setErrorData(taskObject);
          }
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } else {
      toast.error("Please fill the Mandatory fields");
    }
  };

  const getData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 43,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/product?p_id=${id}`,
          header
        );
        // setUserInfo(response?.data?.data);
        setUserInfo({
          ...userInfo,
          p_name:response?.data?.data?.p_name,
          p_code:response?.data?.data?.p_code,
          p_price:response?.data?.data?.p_price,
          p_cat_id:response?.data?.data?.p_cat_id,
          unit_in_case:response?.data?.data?.unit_in_case,
          p_desc:response?.data?.data?.p_desc,
          image:response?.data?.data?.image,
          created_on:response?.data?.data?.created_on,
          updated_on:response?.data?.data?.updated_on,
          discount:response?.data?.data?.discount,
        });
        setSelected({
          ...selected,
          p_cat_name: response?.data?.data?.db_p_cat?.p_cat_name,
          brand_name: response?.data?.data?.db_dms_brand?.brand_name,
          brand_id: response?.data?.data?.db_dms_brand?.brand_id,
        });
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const submitHandler = async () => {
    let allEmpty = true;
    for (let key in errorData) {
      if (errorData[key] !== "") {
        allEmpty = false;
        break;
      }
    }
    if (allEmpty) {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 41,
          },
        };

        const formData = new FormData();
        formData.append("p_name", userInfo.p_name);
        formData.append("p_code", userInfo.p_code);
        formData.append("p_price", userInfo.p_price);
        formData.append("p_cat_id", userInfo.p_cat_id);
        formData.append("unit_in_case", userInfo.unit_in_case);
        formData.append("p_desc", userInfo.p_desc);
        formData.append("image", userInfo.image);
        formData.append("created_on", userInfo.created_on);
        formData.append("updated_on", userInfo.updated_on);
        formData.append("discount", userInfo.discount);
        formData.append("brand_name", selected.brand_name);
        formData.append("brand_id", selected.brand_id);
       

        try {
          const response = await axios.post(
            Baseurl + `/db/product`,
            formData,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message);
            router.push("/Products");
          }
        } catch (error) {
          if (error?.response?.data?.status === 422) {
            const taskObject = {};
            const array = error?.response?.data?.data;

            for (let i = 0; i < array.length; i++) {
              const key = Object.keys(array[i])[0];
              const value = Object.values(array[i])[0];
              taskObject[key] = value;
            }
            setErrorData(taskObject);
          }
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } else {
      toast.error("Please fill the Mandatory fields");
    }
  };
  const getBrandList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          pass: "pass",
        },
      };

      try {
        const { data } = await axios.get(Baseurl + `/db/brand`, header);
        setBrandList(data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    getDataList();
    getBrandList();
    setUserInfo({
      ...userInfo,
      created_on: DateNow,
      updated_on: DateNow,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, id]);

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">{editMode ? "EDIT" : "ADD"} PRODUCT</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link href="/crm">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/Products"> Product </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {editMode ? "Edit" : "Add"} Product
            </li>
          </ol>
        </nav>
      </div>

      <div className="main_content">
        <div className="Add_user_screen">
          <div className="add_screen_head">
            <span className="text_bold">Fill Details</span> ( * Fields are
            mandatory)
          </div>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.p_name ? "input_box errorBox" : "input_box"
                  }
                >
                  <label htmlFor="p_name"> Name *</label>
                  <input
                    type="text"
                    placeholder="Enter Product Name"
                    name="p_name"
                    id="p_name"
                    className={
                      errorData?.p_name
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, p_name: e.target.value });
                      setErrorData({ ...errorData, p_name: "" });
                    }}
                    value={userInfo.p_name ? userInfo.p_name : ""}
                  />
                  <span className="errorText">
                    {" "}
                    {errorData?.p_name ? errorData.p_name : ""}
                  </span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.p_code ? "input_box errorBox" : "input_box"
                  }
                >
                  <label htmlFor="task_status"> Code *</label>
                  <input
                    type="text"
                    name="product_code"
                    id="product_code"
                    placeholder="Enter Product Code"
                    className={
                      errorData?.p_code
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, p_code: e.target.value });
                      setErrorData({ ...errorData, p_code: "" });
                    }}
                    value={userInfo.p_code ? userInfo.p_code : ""}
                  />
                  <span className="errorText">
                    {" "}
                    {errorData?.p_code ? errorData.p_code : ""}
                  </span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.p_price ? "input_box errorBox" : "input_box"
                  }
                >
                  <label htmlFor="p_price">Price *</label>
                  <input
                    type="number"
                    name="p_price"
                    id="p_price"
                    placeholder="Enter List Price"
                    className={
                      errorData?.p_price
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, p_price: e.target.value });
                      setErrorData({ ...errorData, p_price: "" });
                    }}
                    value={userInfo.p_price ? userInfo.p_price : ""}
                  />
                  <span className="errorText">
                    {" "}
                    {errorData?.p_price ? errorData.p_price : ""}
                  </span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.p_cat_id
                      ? "input_box errorBox option_tree"
                      : "input_box option_tree"
                  }
                >
                  <p className="label_subs"> Category *</p>
                  <div className="select_wrapper">
                    <label className="option_select" htmlFor="p_cat_id">
                      {selected.p_cat_name
                        ? selected.p_cat_name
                        : "Select Product Category"}
                    </label>
                    <select
                      name="p_cat_id"
                      id="p_cat_id"
                      onChange={(e) => getItem(e, dataList)}
                      className={
                        errorData?.p_cat_id
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    >
                      <option value="">Select Category</option>
                      {dataList?.map(
                        ({ children, p_cat_id, p_cat_name }, i) => {
                          return (
                            <>
                              <option
                                name={p_cat_name}
                                key={p_cat_id}
                                value={p_cat_id}
                              > 
                                {p_cat_name}
                              </option>
                              {checkChildrens(children, p_cat_id, i)}
                            </>
                          );
                        }
                      )}
                    </select>
                    <span className="errorText">
                      {" "}
                      {errorData?.p_cat_id ? errorData.p_cat_id : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.discount ? "input_box errorBox" : "input_box"
                  }
                >
                  <label htmlFor="discount">Discount % </label>
                  <input
                    type="number"
                    name="discount"
                    id="discount"
                    placeholder="Enter Discount %"
                    className={
                      errorData?.discount
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, discount: e.target.value });
                      setErrorData({ ...errorData, discount: "" });
                    }}
                    value={userInfo.discount ? userInfo.discount : ""}
                  />
                  <span className="errorText">
                    {" "}
                    {errorData?.discount ? errorData.discount : ""}
                  </span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.unit_in_case ? "input_box errorBox" : "input_box"
                  }
                >
                  <label htmlFor="p_price">Case Unit *</label>
                  <input
                    type="number"
                    name="unit_in_case"
                    id="unit_in_case"
                    placeholder="Enter Case Unit"
                    className={
                      errorData?.unit_in_case
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    onChange={(e) => {
                      setUserInfo({
                        ...userInfo,
                        unit_in_case: e.target.value,
                      });
                      setErrorData({ ...errorData, unit_in_case: "" });
                    }}
                    value={userInfo.unit_in_case ? userInfo.unit_in_case : ""}
                  />
                  <span className="errorText">
                    {" "}
                    {errorData?.unit_in_case ? errorData.unit_in_case : ""}
                  </span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.brand_id
                      ? "input_box errorBox option_tree"
                      : "input_box option_tree"
                  }
                >
                  <p className="label_subs"> Brand *</p>
                  <div className="select_wrapper">
                    <label className="option_select" htmlFor="brand_id">
                      {selected.brand_name
                        ? selected.brand_name
                        : "Select Product Brand"}
                    </label>
                    <select
                      name="brand_id"
                      id="brand_id"
                      onChange={(e) => setBrand(e, brandList)}
                      className={
                        errorData?.brand_id
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    >
                      <option value="">Select Brand</option>
                      {brandList?.map((brand) => {
                        return (
                          <option
                            name={brand.brand_name}
                            key={brand.brand_id}
                            value={brand.brand_id}
                          >
                            {" "}
                            {brand.brand_name}{" "}
                          </option>
                        );
                      })}
                    </select>
                    <span className="errorText">
                      {" "}
                      {errorData?.brand_id ? errorData.brand_id : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="image">Upload Image</label>
                  <input
                    class="form-control"
                    name="image"
                    accept="image/*"
                    type="file"
                    id="image"
                    onChange={(e) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setImagePreviewUrl(reader.result);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                      setUserInfo({
                        ...userInfo,
                        image: e.target.files[0],
                      });
                    }}
                  />
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-12 col-10">
                <div className="input_box">
                  <label htmlFor="task_status"> Description</label>
                  <textarea
                    type="text"
                    name=""
                    id=""
                    placeholder="Enter Description"
                    className="form-control"
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        p_desc: e.target.value,
                      })
                    }
                    value={userInfo.p_desc ? userInfo.p_desc : ""}
                  />
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-12 col-10">
                {userInfo.image && (
                  <div className=" d-flex align-items-center justify-content-center">
                    <img
                      src={imagePreviewUrl ? imagePreviewUrl: `${filesUrl}` + `/product/images${userInfo.image}`}
                      alt="Preview"
                      style={{
                        width: "150px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="add_screen_head">
            <span className="text_bold">System Information </span>
          </div>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Created On</label>
                  <input
                    type="datetime-local"
                    placeholder="Enter Email Id"
                    name="email"
                    disabled
                    id="email"
                    className="form-control"
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        created_on: e.target.value,
                      })
                    }
                    value={
                      userInfo.created_on
                        ? moment(userInfo.created_on).format("YYYY-MM-DDTHH:mm")
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="per_cont">Last Modified On</label>
                  <input
                    type="datetime-local"
                    placeholder="Enter Contact no."
                    name="per_cont"
                    id="per_cont"
                    disabled
                    className="form-control"
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        updated_on: e.target.value,
                      })
                    }
                    value={
                      userInfo.updated_on
                        ? moment(userInfo.updated_on).format("YYYY-MM-DDTHH:mm")
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="text-end">
              <div className="submit_btn">
                {editMode ? (
                  <button className="btn btn-primary" onClick={updateHandler}>
                    Update
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={submitHandler}>
                    Save & Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductScreen;
