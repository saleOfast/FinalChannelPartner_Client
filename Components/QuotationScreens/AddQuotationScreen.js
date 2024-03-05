import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import PlusIcon from "../Svg/PlusIcon";
import { toast } from "react-toastify";
import DeleteIcon from "../Svg/DeleteIcon";
import { useRouter } from "next/router";
import { validEmail, validPhone, validZip } from "../../Utils/regex";
import { useSelector } from "react-redux";
import moment from "moment";
import { fetchData } from "../../Utils/getReq";
import Select from 'react-select';

const AddQuotationScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;

  const [editMode, setEditMode] = useState(false)
  const [prdSer, setPrdSer] = useState(false);
  const [addSec, setAddSec] = useState(false);
  const [productList, setProductList] = useState([])
  const [taxListView, setTaxListView] = useState([])
  const [taxData, setTaxData] = useState([])
  const [opprtunityList, setOpprtunityList] = useState([])
  const [quatStatusList, setQuatStatusList] = useState([])
  const [countrylist, setcountrylist] = useState([]);
  const [shipStates, setShipStates] = useState([]);
  const [singleAccount, setSingleAccount] = useState([]);
  const [billStates, setBillStates] = useState([])
  const [billingCities, setBillingCities] = useState([]);
  const [shipCities, setShipCities] = useState([])
  const [errorToast, setErrorToast] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setisLoading] = useState(false)
  const [errorData, setErrorData] = useState({})
  const [loginDetails, setloginDetails] = useState({})
  const [formValues, setFormValues] = useState(
    [{ p_id: null, qty: 0, price: 0, product_discount: 0, product_amount: 0 }])
  const [userInfo, setUserInfo] = useState({
    "opp_id": null,
    "contact_no": null,
    "email": "",
    "quat_owner": null,
    "quat_status": "",
    "quat_summery": "",
    "bill_cont": null,
    "bill_state": null,
    "bill_city": "",
    "bill_pincode": "",
    "bill_address": "",
    "ship_cont": "",
    "ship_state": "",
    "ship_city": "",
    "ship_pincode": "",
    "ship_address": "",
    "assigned_to": "",
    "product_scat": ""

  })

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD")

  const getProductList = async () => {
    await fetchData('/db/product', setProductList, errorToast, setErrorToast);
  };

  async function getOpportunityList() {
    await fetchData('/db/opportunity', setOpprtunityList, errorToast, setErrorToast);
  }

  const getusersList = async (data) => {
    let url;
    if (data?.isDB == true) {
      url = "/db/users?mode=ul";
    } else {
      url = "/db/users"
    }
    await fetchData(url, setUsersList, errorToast, setErrorToast);
  };

  const getAccountList = async () => {
    await fetchData('/db/account', setAccountList, errorToast, setErrorToast);
  }

  async function getQuatStatus() {
    await fetchData('/db/quatStatus', setQuatStatusList, errorToast, setErrorToast);
  }

  const getBillCity = async (id) => {
    await fetchData(`/db/area/city?st_id=${id}`, (data) => setBillingCities(data.cityData), errorToast, setErrorToast);
  };

  const getShipCity = async (id) => {
    await fetchData(`/db/area/city?st_id=${id}`, (data) => setShipCities(data.cityData), errorToast, setErrorToast);
  };

  const getCountryList = async () => {
    await fetchData(`/db/area/country?bill_cont=1`, setcountrylist, errorToast, setErrorToast);
  };

  const getShipState = async (id) => {
    await fetchData(`/db/area/states?cnt_id=${id}`, setShipStates, errorToast, setErrorToast);
  };

  const getBillState = async (id) => {
    await fetchData(`/db/area/states?cnt_id=${id}`, setBillStates, errorToast, setErrorToast);
  };


  async function getQuatationData(id) {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 51
        },
      };
      try {
        const response = await axios.get(Baseurl + `/db/quatMaster?qm_id=${id}`, header);
        const masterRes = response.data?.data?.quatMasterData[0];
        setUserInfo({
          "quat_mast_id": masterRes?.quat_mast_id,
          "opp_id": masterRes?.opp_id,
          "contact_no": masterRes?.contact_no,
          "email": masterRes?.email,
          "effective_date": masterRes?.effective_date,
          "quat_owner": masterRes?.quat_owner,
          "quat_status": masterRes?.quat_status,
          "quat_summery": masterRes?.quat_summery,
          "bill_cont": masterRes?.bill_cont,
          "bill_state": masterRes?.bill_state,
          "bill_city": masterRes?.bill_city,
          "opp_id": masterRes?.quatOpportunity?.opp_id,
          "bill_pincode": masterRes?.bill_pincode,
          "bill_address": masterRes?.bill_address,
          "ship_cont": masterRes?.ship_cont,
          "ship_state": masterRes?.ship_state,
          "ship_city": masterRes?.ship_city,
          "ship_pincode": masterRes?.ship_pincode,
          "ship_address": masterRes?.ship_address,
          "grand_total": masterRes?.grand_total,
          "sub_total": masterRes?.sub_total,
          "valid_till": masterRes?.valid_till,
          "assigned_to": masterRes?.assigned_to,
          "genrated_date": masterRes?.genrated_date,
          "product_scat": masterRes?.product_scat
        })
        setFormValues(response.data.data?.quatProductData)
        setTaxData(response.data.data?.quatTaxData)
        setTaxListView(response.data.data?.quatSumData)
      } catch (error) {
        console.log(error);
      }
    }
  }

  const addRowHandler = (i) => {
    const ArrLength = formValues.length - 1;
    if (formValues[ArrLength].p_id == '') {
      toast.error('Please Select a Product')
    }
    else if (formValues[ArrLength].qty == '') {
      toast.error('Please Enter Product Quanitity')
    }
    else if (formValues[ArrLength].product_discount == '') {
      toast.error('Please Enter Product Discount')
    }
    else if (formValues[ArrLength].product_discount < 0 || formValues[ArrLength].product_discount > 100) {
      toast.error('invalid Discount value')
    }
    else {
      setFormValues([...formValues, { p_id: null, qty: 0, price: 0, product_discount: 0, product_amount: 0 }])
    }
  }

  function copyAddress(e) {
    const value = e.target.checked
    if (value) {
      setUserInfo({
        ...userInfo,
        "ship_cont": userInfo?.bill_cont,
        "ship_state": userInfo?.bill_state,
        "ship_city": userInfo?.bill_city,
        "ship_pincode": userInfo?.bill_pincode,
        "ship_address": userInfo?.bill_address
      })
    } else {
      setUserInfo({
        ...userInfo,
        "ship_cont": "",
        "ship_state": "",
        "ship_city": "",
        "ship_pincode": "",
        "ship_address": "",
      })
    }
    setErrorData({
      ...errorData,
      "ship_cont": "",
      "ship_state": "",
      "ship_city": "",
      "ship_pincode": "",
    })

  }

  async function getSingleOpportunityList(opp_id) {
    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: 'pass'
        }
      }

      try {
        const response = await axios.get(Baseurl + `/db/opportunity?o_id=${opp_id}`, header);
        setSingleAccount(response.data.data.accName
        )
        setUserInfo({
          ...userInfo,
          bill_cont: response.data.data.accName.bill_cont,
          bill_state: response.data.data.accName.bill_state,
          bill_city: response.data.data.accName.bill_city,
          bill_address: response.data.data.accName.bill_address,
          bill_pincode: response.data.data.accName.bill_pincode,
          ship_cont: response.data.data.accName.ship_cont,
          ship_state: response.data.data.accName.ship_state,
          ship_city: response.data.data.accName.ship_city,
          ship_address: response.data.data.accName.ship_address,
          ship_pincode: response.data.data.accName.ship_pincode,

        })
        setErrorData({ ...errorData, bill_cont: '', bill_state: '', bill_city: '', bill_address: '', bill_pincode: '', ship_cont: '', ship_state: '', ship_city: '', ship_address: '', ship_pincode: '', })

      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        else {
          toast.error('Something went wrong!')
        }
      }
    }
  }

  async function handleSubmit() {
    console.log(errorData);
    const DateNow = new Date().toISOString();
    let arr = [...formValues]
    let allEmpty = true;
    for (let key in errorData) {
      if (errorData[key] !== "") {
        allEmpty = false;
        break;
      }
    }

    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 49,
        },
      };

      const ProductData = arr?.map((data) => { return { ...data, effective_date: DateNow } })
      const taxinfos = taxData?.map((data) => { return { ...data, effective_date: DateNow } })
      const reqOptions = { ...userInfo, effective_date: DateNow, quatProductBody: ProductData, quatTaxBody: taxinfos, quat_owner: loginDetails.user_id }

      try {
        const response = await axios.post(Baseurl + `/db/quatMaster`, reqOptions, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false)
          router.push('/Quotations')
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          const taskObject = {}
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
        setisLoading(false)
      }
    }

    else {
      toast.error('Please fill the Mandatory fields')
    }

  }

  async function upDateHandler() {
    const DateNow = new Date().toISOString();
    let arr = [...formValues]
    let allEmpty = true;
    for (let key in errorData) {
      if (errorData[key] !== "") {
        allEmpty = false;
        break;
      }
    }

    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 51,
        },
      };

      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].hasOwnProperty("effective_date")) {
          arr[i].effective_date = DateNow;
        }
      }
      for (let i = 0; i < taxData.length; i++) {
        if (!taxData[i].hasOwnProperty("effective_date")) {
          taxData[i].effective_date = DateNow;
        }
      }
      const reqOptions = { ...userInfo, quatProductBody: arr, quatTaxBody: taxData, assigned_to: userInfo.assigned_to, product_scat: userInfo.product_scat }

      try {
        const response = await axios.put(Baseurl + `/db/quatMaster`, reqOptions, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false)
          router.push('/Quotations')
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          const taskObject = {}
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
        setisLoading(false)
      }
    }
    else {
      toast.error('Please fill the Mandatory fields')
    }
  };

  const deleteRow = (ind, product_id) => {
    const updatedItem = formValues.filter((elem, i) => {
      return ind !== i;
    })

    const arr = [...taxData]
    const removeTax = arr.filter(x => x.p_id != product_id);
    setTaxData(removeTax)
    const totalPrice = sumPrices(updatedItem);
    const grndTotal = grndTtlFunc(taxListView);
    setUserInfo({ ...userInfo, grand_total: grndTotal + totalPrice, sub_total: totalPrice })
    setFormValues(updatedItem);
    addAmountToTaxData(removeTax, updatedItem)
    toast.success('Product Removed')
  }

  const handleChange = (e, index, v) => {
    setErrorData({ ...errorData, grand_total: '' })
    const isIdExists = formValues.find(obj => obj.p_id === e.target.value) !== undefined;

    let newFormValues = [...formValues];

    if (v == 1) {
      if (isIdExists) {
        toast.error('Product Already Exist')
        newFormValues[index].p_id = '';
        return
      } else {
        newFormValues[index][e.target.name] = e.target.value;
        getSingleProduct(e, index)
        newFormValues[index].qty = 0;
        newFormValues[index].product_discount = 0;
        newFormValues[index].product_amount = 0;
        const totalPrice = sumPrices(newFormValues);
        setUserInfo({ ...userInfo, sub_total: totalPrice });
        addAmountToTaxData(taxData, formValues)
      }

    } else {
      newFormValues[index][e.target.name] = e.target.value;
    }

    if (v == 2) {
      const totalAmt = e.target.value * formValues[index].price - ((e.target.value * formValues[index].price * formValues[index].product_discount) / 100);
      newFormValues[index].product_amount = totalAmt;
      addAmountToTaxData(taxData, formValues)
    }

    if (v == 4) {
      const totalAmt = formValues[index].qty * formValues[index].price - ((formValues[index].qty * formValues[index].price * e.target.value) / 100);
      newFormValues[index].product_amount = totalAmt;
      addAmountToTaxData(taxData, formValues)
    }

    setFormValues(newFormValues);
    const totalPrice = sumPrices(newFormValues);
    const grndTotal = grndTtlFunc(taxListView);
    setUserInfo({ ...userInfo, grand_total: grndTotal + totalPrice, sub_total: totalPrice })
  }

  function taxListViews(actualFiltData) {
    let arr = []
    let storeValue = []
    actualFiltData.map((item, i) => {
      if (!arr.includes(item.tax_id)) {
        storeValue.push(item)
        arr.push(item.tax_id)
      } else {
        storeValue.map((obj, i) => {
          obj.total_amt = obj.total_amt + item.total_amt
        })
      }
    })
    setTaxListView(storeValue)
  }

  function addAmountToTaxData(filterArray, formValues) {
    let actualFiltData = filterArray?.map((item, i) => {
      let pAmtData = formValues?.find(o => o.p_id == item.p_id)
      item.total_amt = (pAmtData?.product_amount * item?.tax_percentage) / 100
      return item
    })
    taxListViews(actualFiltData)
  }

  function sumPrices(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i].product_amount;
    }
    return sum;
  }

  function grndTtlFunc(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i].total_amt;
    }
    return sum;
  }

  async function getSingleProduct(e, index) {
    setTaxData([])
    let newFormValues = [...formValues];
    if (userInfo?.bill_state == '') {
      toast.error("Please Select Billing Address First")
    } else {
      if (hasCookie("token") && e.target.value !== '') {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            pass: 'pass'
          },
        };

        try {
          const response = await axios.get(Baseurl + `/db/producttax?p_id=${e.target.value}&st_id=${userInfo?.bill_state}`, header);
          const taxResp = response.data.data;
          newFormValues[index].price = taxResp[0]?.db_product?.p_price;
          const taxArr = taxResp?.map((data) => { return { tax_name: data?.db_tax?.tax_name, tax_id: data?.db_tax?.tax_id, tax_percentage: data?.db_tax?.tax_percentage, p_id: data?.p_id } })
          let mergedArr = [...taxData, ...taxArr].filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.tax_name === item.tax_name &&
              t.tax_id === item.tax_id &&
              t.tax_percentage === item.tax_percentage &&
              t.p_id === item.p_id
            ))
          );
          const filterArray = mergedArr.filter(item => formValues.some(obj => obj.p_id == item.p_id));
          setTaxData(filterArray);

        } catch (error) {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  }

  function checkLogin() {
    if (hasCookie("userInfo")) {
      let token = getCookie("userInfo");
      let data = JSON.parse(token)
      setloginDetails(data)
      setUserInfo({ ...userInfo, quat_owner: data.user_id })

    }
  }


  useEffect(() => {
    getProductList();
    getOpportunityList();
    getQuatStatus();
    getCountryList();
    getusersList();
    checkLogin();
    getAccountList();
    setUserInfo({
      ...userInfo,
      genrated_date: DateNow,
    })
  }, [])

  useEffect(() => {
    if (userInfo.bill_cont) getBillState(userInfo.bill_cont);
  }, [userInfo.bill_cont]);

  useEffect(() => {
    if (userInfo.ship_cont) getShipState(userInfo.ship_cont);
  }, [userInfo.ship_cont]);

  useEffect(() => {
    if (userInfo.bill_state) getBillCity(userInfo.bill_state);
  }, [userInfo.bill_state]);

  useEffect(() => {
    if (userInfo.ship_state) getShipCity(userInfo.ship_state);
  }, [userInfo.ship_state]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true)
      getQuatationData(id)
    }
  }, [router.isReady, id])

  useEffect(() => {

    if (userInfo.opp_id !== null && !editMode) {
      // call the api with this acoount name 
      getSingleOpportunityList(userInfo.opp_id);
    }

  }, [userInfo.opp_id]);



  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head"> {editMode ? 'Edit' : 'Add'} QUOTATION</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/Quotations">Quotation</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {editMode ? 'Edit' : 'Add'}  Quotation
            </li>
          </ol>
        </nav>
      </div>

      <div className="main_content">
        <div className="Add_user_screen">
          <div className="add_screen_head">
            <span className="text_bold">General Details</span>
          </div>
          <div className="add_user_form">
            <div className="row">

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.account_name ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="task_name">Related Opportunity *</label>
                  <Select
                    id={userInfo.task_status_id}
                    defaultValue={""}
                    options={opprtunityList?.map((data, index) => {
                      return {
                        value: data?.opp_id,
                        label: data?.opp_name,
                      }
                    })}
                    value={opprtunityList?.map((data, index) => {
                      if (userInfo.opp_id === data.opp_id) {
                        return {
                          value: data?.opp_id,
                          label: data?.opp_name,
                        }
                      }
                    })}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, opp_id: e.value })
                      setErrorData({ ...errorData, opp_id: '' })
                    }}
                  />

                  <span className="errorText"> {errorData?.opp_id ? errorData.opp_id : ''}</span>
                </div>
              </div>



              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.contact_no ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="contact_no">Mobile No. *</label>
                  <input
                    type="text"
                    name="contact_no"
                    id="contact_no"
                    placeholder="Enter Mobile No."
                    className={errorData?.contact_no ? 'form-control is-invalid' : 'form-control'}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, contact_no: e.target.value })
                      setErrorData({ ...errorData, contact_no: '' })
                    }}
                    value={userInfo?.contact_no ? userInfo.contact_no : ''}
                  />
                  <span className="errorText"> {errorData?.contact_no ? errorData.contact_no : ''}</span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.email ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="email">Email ID *</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter Email ID"
                    className={errorData?.email ? 'form-control is-invalid' : 'form-control'}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, email: e.target.value })
                      setErrorData({ ...errorData, email: '' })
                    }}
                    value={userInfo?.email ? userInfo.email : ''}
                  />
                  <span className="errorText"> {errorData?.email ? errorData.email : ''}</span>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.quat_owner ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="quat_owner">Owner *</label>

                  {loginDetails?.isDB == true ? (
                    <input
                      type="text"
                      name="contact_owner"
                      disabled
                      placeholder="Contact Owner Name"
                      id="contact_owner"
                      className="form-control"
                      value={loginDetails.user ? loginDetails.user : ""}
                    />
                  ) : (
                    <input
                      type="text"
                      name="contact_owner"
                      disabled
                      placeholder="Contact Owner Name"
                      id="contact_owner"
                      className="form-control"
                      value={loginDetails.user ? loginDetails.user : ""}
                    />)}

                  <span className="errorText"> {errorData?.quat_owner ? errorData.quat_owner : ''}</span>
                </div>
              </div>

              {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="product_cat">Select Associate Account </label>
                  <select
                    name="product_scat"
                    id="product_scat"
                    className="form-control">
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, product_scat: e.target.value })
                    }}
                    value={userInfo?.product_scat ? userInfo.product_scat : ''}
                    <option value="">Select Account</option>
                    {accountList?.map((data) => {
                      return <option key={data.acc_id} value={data.acc_id}>{data.acc_name}</option>
                    })}
                  </select>
                </div>
              </div> */}

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.account_name ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="task_name">Quotation Status *</label>
                  <Select
                    id={userInfo.task_status_id}
                    defaultValue={""}
                    options={quatStatusList?.map((data, index) => {
                      return {
                        value: data?.quat_status_id,
                        label: data?.quat_status_name,
                      }
                    })}
                    value={quatStatusList?.map((data, index) => {
                      if (userInfo.quat_status === data.quat_status_id) {
                        return {
                          value: data?.quat_status_id,
                          label: data?.quat_status_name,
                        }
                      }
                    })}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, quat_status: e.value })
                      setErrorData({ ...errorData, quat_status: '' })
                    }}
                  />

                  <span className="errorText"> {errorData?.quat_status ? errorData.quat_status : ''}</span>
                </div>
              </div>


              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="genrated_date">Generate Date </label>
                  <input
                    type="date"
                    name="genrated_date"
                    disabled
                    id="genrated_date"
                    className="form-control"
                    onChange={(e) => setUserInfo({ ...userInfo, genrated_date: e.target.value })}
                    value={userInfo?.genrated_date ? moment(userInfo?.genrated_date).format("YYYY-MM-DD") : ''}
                  />
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.valid_till ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="valid_till">Valid Till *</label>
                  <input
                    type="date"
                    name="valid_till"
                    id="valid_till"
                    className={errorData?.valid_till ? 'form-control is-invalid' : 'form-control'}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, valid_till: e.target.value })
                      setErrorData({ ...errorData, valid_till: '' })
                    }}
                    value={userInfo?.valid_till ? moment(userInfo?.valid_till).format("YYYY-MM-DD") : ''}
                  />
                  <span className="errorText"> {errorData?.valid_till ? errorData?.valid_till : ''}</span>
                </div>
              </div>


              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.assigned_to ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Assign to *</label>
                    <Select
                      id={userInfo.assigned_to}
                      defaultValue={""}
                      options={usersList?.map((data, index) => {
                        return {
                          value: data?.user_id,
                          label: data?.user,

                        }
                      })}
                        value={usersList?.map((data, index) => {
                          if (userInfo.assigned_to === data.user_id) {
                            return {
                              value: data?.user_id,
                              label: data?.user,

                            }
                          }
                        })}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, assigned_to: e.value })
                        setErrorData({ ...errorData, assigned_to: '' })
                      }}
                    />
                    <span className="errorText"> {errorData?.assigned_to ? errorData.assigned_to : ''}</span>
                  </div>
                </div>

              <div className="col-xl-6 col-md-6 col-sm-20 col-20">
                <div className={errorData?.quat_summery ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="quat_summery">Quotation Summery *</label>
                  <textarea
                    type=""
                    placeholder="Enter Summery"
                    name="quat_summery"
                    id="quat_summery"
                    className={errorData?.quat_summery ? 'form-control is-invalid' : 'form-control'}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, quat_summery: e.target.value })
                      setErrorData({ ...errorData, quat_summery: '' })
                    }}
                    value={userInfo?.quat_summery ? userInfo.quat_summery : ''}
                  />
                  <span className="errorText"> {errorData?.quat_summery ? errorData.quat_summery : ''}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="add_screen_head"
            onClick={() => setAddSec(!addSec)}
            aria-controls="TaskCollapse"
            aria-expanded={addSec} >
            <span className="text_bold">Billing & Shipping Address</span>
          </div>

          <Collapse in={addSec}>
            <div className="add_user_form">
              <div className="row">

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.bill_cont ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Billing Country  *</label>
                    <Select
                      id={userInfo.assigned_to}
                      defaultValue={""}
                      options={countrylist?.map((data, index) => {
                        return {
                          value: data?.country_id,
                          label: data?.country_name,

                        }
                      })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.bill_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_cont: e.value })
                          setErrorData({ ...errorData, bill_cont: '' })
                        }}
                    />
                    <span className="errorText"> {errorData?.bill_cont ? errorData.bill_cont : ''}</span>
                  </div>
                </div>


                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.bill_city ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Billing State *</label>
                    <Select
                      id={userInfo.state_id}
                      defaultValue={""}
                      options={billStates?.map((data, index) => {
                        return {
                          value: data?.state_id,
                          label: data?.state_name,

                        }
                      })}
                        value={billStates?.map((data, index) => {
                          if (userInfo.bill_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_state: e.value })
                          setErrorData({ ...errorData, bill_state: '' })
                        }}
                    />
                    <span className="errorText"> {errorData?.bill_state ? errorData.bill_state : ''}</span>
                  </div>
                </div>


                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.bill_city ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Billing City *</label>
                    <Select
                      id={userInfo.state_id}
                      defaultValue={""}
                      options={billingCities?.map((data, index) => {
                        return {
                          value: data?.city_id,
                          label: data?.city_name,

                        }
                      })}
                        value={billingCities?.map((data, index) => {
                          if (userInfo.bill_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_city: e.value })
                          setErrorData({ ...errorData, bill_city: '' })
                        }}
                    />
                    <span className="errorText"> {errorData?.bill_city ? errorData.bill_city : ''}</span>
                  </div>
                </div>


               

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.bill_pincode ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="per_cont">Billing Zip Code *</label>
                    <input
                      type="text"
                      placeholder="Enter Zip Code"
                      name="Billing_Zip_Code<"
                      id="Zip_code"
                      className={errorData?.bill_pincode ? 'form-control is-invalid' : 'form-control'}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, bill_pincode: e.target.value })
                        setErrorData({ ...errorData, bill_pincode: '' })
                      }}
                      value={userInfo?.bill_pincode ? userInfo.bill_pincode : ''}
                    />
                    <span className="errorText"> {errorData?.bill_pincode ? errorData.bill_pincode : ''}</span>
                  </div>
                </div>

                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="bill_address">Billing Address</label>
                    <textarea
                      type=""
                      placeholder="Enter Address"
                      name="bill_address"
                      id="bill_address"
                      className="form-control"
                      onChange={(e) => setUserInfo({ ...userInfo, bill_address: e.target.value })}
                      value={userInfo?.bill_address ? userInfo.bill_address : ''}
                    />
                  </div>
                </div>

                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <input onChange={(e) => copyAddress(e)} type="checkbox" id="copyAddress" name="copyAddress" className="form-check-input me-2" />
                    <label htmlFor="copyAddress"> Make Shipping Address same as Billing Address</label>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.ship_cont ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Shipping Country *</label>
                    <Select
                      id={userInfo.ship_cont}
                      defaultValue={""}
                      options={countrylist?.map((data, index) => {
                        return {
                          value: data?.country_id,
                          label: data?.country_name,

                        }
                      })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.ship_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_cont: e.value })
                          setErrorData({ ...errorData, ship_cont: '' })
                        }}
                    />
                    <span className="errorText"> {errorData?.ship_cont ? errorData.ship_cont : ''}</span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.ship_state ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Shipping State *</label>
                    <Select
                      id={userInfo.ship_state}
                      defaultValue={""}
                      options={shipStates?.map((data, index) => {
                        return {
                          value: data?.state_id,
                          label: data?.state_name,

                        }
                      })}
                        value={shipStates?.map((data, index) => {
                          if (userInfo.ship_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_state: e.value })
                          setErrorData({ ...errorData, ship_state: '' })
                        }}
                    />
                    <span className="errorText"> {errorData?.ship_state ? errorData.ship_state : ''}</span>
                  </div>
                </div>


                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.ship_state ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Shipping City *</label>
                    <Select
                      id={userInfo.ship_state}
                      defaultValue={""}
                      options={shipCities?.map((data, index) => {
                        return {
                          value: data?.city_id,
                          label: data?.city_name,

                        }
                      })}
                        value={shipCities?.map((data, index) => {
                          if (userInfo.ship_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_city: e.value })
                          setErrorData({ ...errorData, ship_city: '' })
  
                        }}
                    />
                    <span className="errorText"> {errorData?.ship_city ? errorData.ship_city : ''}</span>
                  </div>
                </div>


                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.ship_pincode ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="zip_add">Zip / Postal Code *</label>
                    <input
                      type="number"
                      placeholder="Zip / Postal Code"
                      name="zip_add"
                      id="zip_add"
                      className={errorData?.ship_pincode ? 'form-control is-invalid' : 'form-control'}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, ship_pincode: e.target.value })
                        setErrorData({ ...errorData, ship_pincode: '' })
                      }}
                      value={userInfo.ship_pincode ? userInfo.ship_pincode : ""}
                    />
                    <span className="errorText"> {errorData?.ship_pincode ? errorData.ship_pincode : ''}</span>
                  </div>
                </div>

                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="Shippingaddress">Shipping Address</label>
                    <textarea
                      name="Shippingaddress"
                      id="Shippingaddress"
                      className="form-control"
                      placeholder="Enter Address"
                      rows="2"
                      onChange={(e) => setUserInfo({ ...userInfo, ship_address: e.target.value })}
                      value={userInfo.ship_address ? userInfo.ship_address : ""}>
                    </textarea>

                  </div>
                </div>

              </div>
            </div>
          </Collapse>

          {/* Product and services Section */}


          <div
            className="add_screen_head"
            onClick={() => setPrdSer(!prdSer)}
            aria-controls="TaskCollapse"
            aria-expanded={prdSer} >
            <span className="text_bold">Product Or Services</span>
          </div>
          <Collapse in={prdSer}>
            <div className="add_user_form">
              {formValues?.map((data, index) => {
                return <div className="row" key={index}>
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="p_id">Product of Services</label>
                      <select
                        className="form-control"
                        name="p_id"
                        id="p_id"
                        onChange={e => handleChange(e, index, 1)}
                        value={data?.p_id ? data.p_id : ''}>
                        {data.p_id == null ? <option value="">Select</option> : null}
                        {productList?.map(({ p_name, p_id }) => {
                          return <option key={p_id} value={p_id}>{p_name}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="col-xl-2 col-md-2 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="qty">Quantity *</label>
                      <input
                        type="number"
                        placeholder="Enter Quantity"
                        name="qty"
                        min="1"
                        id="qty"
                        className="form-control"
                        onChange={e => handleChange(e, index, 2)}
                        value={data?.qty ? data.qty : ''}
                      />
                    </div>
                  </div>

                  <div className="col-xl-2 col-md-2 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="price">Price *</label>
                      <input
                        type="number"
                        disabled
                        placeholder="Enter price"
                        name="price"
                        id="price"
                        className="form-control"
                        onChange={e => handleChange(e, index)}
                        value={data?.price ? data.price : ''}
                      />
                    </div>
                  </div>

                  <div className="col-xl-2 col-md-2 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="product_discount">Discount (in %) *</label>
                      <input
                        type="number"
                        placeholder="%"
                        name="product_discount"
                        max="100"
                        maxLength={2}
                        min="0"
                        id="product_discount"
                        className="form-control"
                        onChange={e => handleChange(e, index, 4)}
                        value={data?.product_discount ? data.product_discount : ''}
                      />
                    </div>
                  </div>

                  <div className="col-xl-2 col-md-2 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="product_amount">Amount *</label>
                      <input
                        type="number"
                        placeholder="Product Amount"
                        disabled
                        name="product_amount"
                        id="product_amount"
                        className="form-control"
                        value={data?.product_amount ? data.product_amount : 0}
                      />
                    </div>
                  </div>

                  <div className="col-xl-1 col-md-1 col-sm-12 col-12">
                    <div className="AddRowBtn">
                      {index == 0 ? <button onClick={() => addRowHandler(index)} title="Add Row" className="actionBtn"><PlusIcon /></button> :
                        <button onClick={() => deleteRow(index, data.p_id)} title="Delete Row" className="actionBtn"><DeleteIcon /></button>}
                    </div>
                  </div>
                </div>
              })}
              <div className="subTotal_sec">
                <div className="row">
                  <div className="col-xl-8 col-md-8 col-sm-12 col-12"></div>
                  <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                    <div className="row">
                      <div className="input_box">
                        <div className="taxNameBox">
                          <label htmlFor="product_amount">Sub Total </label>
                        </div>
                        <input
                          type="number"
                          placeholder="Sub Total"
                          disabled
                          name="product_amount"
                          id="product_amount"
                          className="form-control"
                          value={userInfo?.sub_total ? userInfo?.sub_total : ''}
                        />
                      </div>
                    </div>
                    {taxListView?.map((data, i) => {
                      return <div className="row" key={i}>
                        <div className="input_box">
                          <div className="taxNameBox">
                            <label htmlFor="product_amount">{data?.tax_name}</label>
                            <div className="tax_percentage">{data?.tax_percentage} % </div>
                          </div>
                          <input
                            type="number"
                            placeholder="tax Amount"
                            disabled
                            name="product_amount"
                            id="product_amount"
                            className="form-control"
                            value={data?.total_amt}
                          />
                        </div>
                      </div>
                    })}
                    <div className="row">
                      <div className="input_box">
                        <div className={errorData?.grand_total ? 'input_box errorBox' : 'TaxNameBox'}>
                          <label htmlFor="product_amount">Grand Total </label>
                        </div>
                        <input
                          type="number"
                          placeholder="Grand Total"
                          disabled
                          name="product_amount"
                          id="product_amount"
                          className="form-control"
                          value={userInfo?.grand_total ? userInfo?.grand_total : ''}
                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>

          <div className="text-end">
            <div className="submit_btn p-3">
              <Link href="Quotations"><button className="btn btn-cancel me-2" >Cancel</button></Link>
              {editMode ?
                <button disabled={isLoading} className="btn btn-primary" onClick={upDateHandler}>{isLoading ? 'Loading...' : 'Update'} </button> :
                <button disabled={isLoading} className="btn btn-primary" onClick={handleSubmit}>{isLoading ? 'Loading...' : 'Save & Submit'}</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuotationScreen;
