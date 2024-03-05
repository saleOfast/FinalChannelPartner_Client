import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import Collapse from "react-bootstrap/Collapse";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { validEmail, validPhone, validZip } from "../../Utils/regex";
import moment from "moment";
import { useSelector } from "react-redux";
import PlusIcon from "../Svg/PlusIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import { fetchData } from "../../Utils/getReq";
import Select from 'react-select';

const AddOpportunityScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;

    const [userInfo, setUserInfo] = useState({
        opp_name: "",
        close_date: "",
        created_on: "",
        updated_on: "",
        amount: "",
        desc: "",
        account_name: "",
        opportunity_stg_id: "",
        opportunity_type_id: null,
        lead_src_id: "",
        opp_owner: null,
        created_at: "",
        assigned_to: null
    });
    const [prdSer, setPrdSer] = useState(false);
    const [accountsList, setAccountsList] = useState([]);
    const [stageList, setStageList] = useState([]);
    const [sourceList, setSourceList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [loginDetails, setloginDetails] = useState({});
    const [formValues, setFormValues] = useState(
        [{ p_id: null, qty: 0, price: 0 }])
    const [editMode, setEditMode] = useState(false);
    const [errorData, setErrorData] = useState({})
    const [errorToast, setErrorToast] = useState(false)
    const [productList, setProductList] = useState([])
    const [isLoading, setisLoading] = useState(false)

    const Datenow = moment(new Date().toISOString()).format("YYYY-MM-DD");

    const getAccountsList = async () => {
        await fetchData(`/db/account`, setAccountsList, errorToast, setErrorToast)
    }

    const getProductList = async () => {
        await fetchData(`/db/product`, setProductList, errorToast, setErrorToast)
    }

    const getOppTypeList = async () => {
        await fetchData(`/db/opprtype`, setTypeList, errorToast, setErrorToast)
    }

    const getSourceList = async () => {
        await fetchData(`/db/leadsrc`, setSourceList, errorToast, setErrorToast)
    }

    const getStageList = async () => {
        await fetchData(`/db/oppr`, setStageList, errorToast, setErrorToast)
    }

    const addRowHandler = (i) => {
        const ArrLength = formValues.length - 1;
        if (formValues[ArrLength].p_id == '') {
            toast.error('Please Select a Product')
        }
        else if (formValues[ArrLength].qty == '') {
            toast.error('Please Enter Product Quanitity')
        }
        else {
            setFormValues([...formValues, { p_id: null, qty: 0, price: 0 }])
        }
    }

    const getusersList = async () => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: 'pass',
                },
            };
            try {
                let url;
                if (loginDetails?.isDB == true) {
                    url = Baseurl + "/db/users?mode=ul";
                } else {
                    url = Baseurl + "/db/users"
                }
                const response = await axios.get(url, header);
                setUsersList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    const getSingleData = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 36,
                },
            };
            try {
                const response = await axios.get(
                    Baseurl + `/db/opportunity?o_id=${id}`,
                    header
                );
                setUserInfo(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    const getProductData = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 36,
                },
            };

            try {
                const response = await axios.get(
                    Baseurl + `/db/oppro?opp_id=${id}`,
                    header
                );
                setFormValues(response.data.data);
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

        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 34,
                },
            };

            let oppBody = { ...userInfo }
            oppBody.opp_owner = loginDetails.user_id
            try {
                const response = await axios.post(Baseurl + `/db/opportunity`, oppBody, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    await productSubmit(formValues, response.data.data.opp_id)
                    setisLoading(false)
                    router.push("/Opportunity");
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

    const productSubmit = async (arr, id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 34,
                },
            };

            const ProductData = arr?.map((data) => { return { ...data, opp_id: id } });

            try {
                const response = await axios.post(Baseurl + `/db/oppro`, ProductData, header);
                if (response.status === 204 || response.status === 200) {
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const UpdateHandler = async () => {

        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 36,
                },
            };

            try {
                const response = await axios.put(
                    Baseurl + `/db//opportunity`,
                    userInfo,
                    header
                );
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    productUpdate(formValues, router.query.id)
                    setisLoading(false)
                    router.push("/Opportunity");
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

    const productUpdate = async (arr, id) => {
        
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 34,
                },
            };

            const ProductData = arr?.map((data) => { return { ...data, opp_id: id } });
            try {
                const response = await axios.put(Baseurl + `/db/oppro`, ProductData, header);
                if (response.status === 204 || response.status === 200) {
                }

            } catch (error) {
                console.log(error)
            }
        }
    }

    function checkLogin() {
        if (hasCookie("userInfo")) {
            let token = getCookie("userInfo");
            let data = JSON.parse(token)
            setloginDetails(data)
            setUserInfo({ ...userInfo, opp_owner: data.user_id })

        }
    }

    


    const handleChange = (e, index, v) => {
        const isIdExists = formValues.find(obj => obj.p_id === e.value) !== undefined;

        let newFormValues = [...formValues];

        if (v == 1) {
            if (isIdExists) {
                toast.error('Product Already Exist')
                newFormValues[index].p_id = '';
                return
            } else {
                newFormValues[index][e.name] = e.value;
            }

        } else {
            newFormValues[index][e.target.name] = e.target.value;
        }
        setFormValues(newFormValues);
        const totalprice = sumPrices(newFormValues);
        setUserInfo({ ...userInfo, amount: totalprice })
        setErrorData({ ...errorData, amount: '' })
        
    }
    
    

    function sumPrices(array) {
        let sum = 0;
        array.forEach(obj => {
            const numericValue = parseFloat(obj.price);
            sum += numericValue;
        });
        /* for (let i = 0; i < array.length; i++) {
            const numericValue = parseFloat(array[i].product_amount);
            sum += numericValue;
        } */
        return sum;
    }

    const deleteRow = (ind, product_id) => {
        const updatedItem = formValues.filter((elem, i) => {
            return ind !== i;
        })
        setFormValues(updatedItem);
        const totalprice = sumPrices(updatedItem);
        setUserInfo({ ...userInfo, amount: totalprice })
        toast.success('Product Removed')
    }

   
    useEffect(() => {
        getAccountsList();
        getStageList();
        getSourceList();
        getusersList();
        checkLogin();
        getOppTypeList();
        getProductList();
        setUserInfo({
            ...userInfo,
            created_on: Datenow,
            updated_on: Datenow,
            opp_owner: loginDetails.user_id
        })
    }, []);


    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleData(id);
            getProductData(id);
        }
    }, [router.isReady, id]);
    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">
                    {editMode ? "Edit" : "ADD"} OPPORTUNITY
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/Opportunity"> Opportunity </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {editMode ? "Edit" : "ADD"} Opportunity
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
                                <div className={errorData?.opp_name ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Opportunity Name"
                                        name="task_name"
                                        id="task_name"
                                        className={`form-control ${errorData?.opp_name ? ' is-invalid' : ''}`}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, opp_name: e.target.value })
                                            setErrorData({ ...errorData, opp_name: '' })
                                        }}
                                        value={userInfo.opp_name ? userInfo.opp_name : ""}
                                    />
                                    <span className="errorText"> {errorData?.opp_name ? errorData.opp_name : ''}</span>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.opp_owner ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="oppr_ownr">Owner *</label>
                                    {loginDetails?.isDB == true ? (
                                        <input
                                            type="text"
                                            name="opp_owner"
                                            disabled
                                            placeholder="Contact Owner Name"
                                            id="opp_owner"
                                            className="form-control"
                                            value={loginDetails.user ? loginDetails.user : ""}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="opp_owner"
                                            disabled
                                            placeholder="Contact Owner Name"
                                            id="opp_owner"
                                            className="form-control"
                                            value={loginDetails.user ? loginDetails.user : ""}
                                        />

                                    )}
                                    <span className="errorText"> {errorData?.opp_owner ? errorData.opp_owner : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.account_name ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Account Name *</label>
                                    <Select
                                        id={userInfo.task_status_id}
                                        defaultValue={""}
                                        options={accountsList?.map((data, index) => {
                                            return {
                                                value: data?.acc_id,
                                                label: data?.acc_name,

                                            }
                                        })}
                                        value={accountsList?.map((data, index) => {
                                            if (userInfo.account_name === data.acc_id) {
                                                return {
                                                    value: data?.acc_id,
                                                    label: data?.acc_name,

                                                }
                                            }
                                        })}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, account_name: e.value })
                                            setErrorData({ ...errorData, account_name: '' })
                                        }}
                                    />
                                    {!editMode ? null : <p className="label_link">  <Link href="/AddAccount">+ Add New</Link></p>}
                                    <span className="errorText"> {errorData?.account_name ? errorData.account_name : ''}</span>
                                </div>
                            </div>



                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.close_date ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="close_date">Close date * </label>
                                    <input
                                        type="date"
                                        name="per_cont"
                                        id="per_cont"
                                        className={errorData?.close_date ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({
                                                ...userInfo,
                                                close_date: e.target.value,
                                            })
                                            setErrorData({ ...errorData, close_date: '' })
                                        }}
                                        value={moment(userInfo?.close_date).format("YYYY-MM-DD")}
                                    />
                                    <span className="errorText"> {errorData?.close_date ? errorData.close_date : ''}</span>
                                </div>
                            </div>


                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.opportunity_stg_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Stage  *</label>
                                    <Select
                                        id={userInfo.opportunity_stg_id}
                                        defaultValue={""}
                                        options={stageList?.map((data, index) => {
                                            return {
                                                value: data?.opportunity_stg_id,
                                                label: data?.opportunity_stg_name,

                                            }
                                        })}
                                        value={stageList?.map((data, index) => {
                                            if (userInfo.opportunity_stg_id === data.opportunity_stg_id) {
                                                return {
                                                    value: data?.opportunity_stg_id,
                                                    label: data?.opportunity_stg_name,

                                                }
                                            }
                                        })}
                                        onChange={(e) => {
                                            setUserInfo({
                                                ...userInfo,
                                                opportunity_stg_id: e.value,
                                            })
                                            setErrorData({ ...errorData, opportunity_stg_id: '' })
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.opportunity_stg_id ? errorData.opportunity_stg_id : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.opportunity_type_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Type  *</label>
                                    <Select
                                        id={userInfo.opportunity_type_id}
                                        defaultValue={""}
                                        options={typeList?.map((data, index) => {
                                            return {
                                                value: data?.opportunity_type_id,
                                                label: data?.opportunity_type_name,

                                            }
                                        })}
                                        value={typeList?.map((data, index) => {
                                            if (userInfo.opportunity_type_id === data.opportunity_type_id) {
                                                return {
                                                    value: data?.opportunity_type_id,
                                                    label: data?.opportunity_type_name,

                                                }
                                            }
                                        })}
                                        onChange={(e) => {
                                            setUserInfo({
                                                ...userInfo,
                                                opportunity_type_id: e.value,
                                            })
                                            setErrorData({ ...errorData, opportunity_type_id: '' })
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.opportunity_type_id ? errorData.opportunity_type_id : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.amount ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="Amount">Amount *</label>
                                    <input
                                        type="number"
                                        name="Amount"
                                        placeholder="Enter Amount "
                                        id="Amount"
                                        className={errorData?.amount ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, amount: e.target.value })
                                            setErrorData({ ...errorData, amount: '' })
                                        }}
                                        value={userInfo.amount ? userInfo.amount : ""}
                                    />
                                    <span className="errorText"> {errorData?.amount ? errorData.amount : ''}</span>
                                </div>
                            </div>
                            {editMode ?
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.assigned_to ? 'input_box errorBox' : 'input_box'}>
                                  <label htmlFor="task_name">Assign To </label>
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
                              : null}
                        </div>
                    </div>

                    <div className="add_screen_head">
                        <span className="text_bold">Additional Information </span>
                    </div>



                    <div className="add_user_form">
                        <div className="row">

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.opportunity_type_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Lead Source  *</label>
                                    <Select
                                        id={userInfo.opportunity_type_id}
                                        defaultValue={""}
                                        options={sourceList?.map((data, index) => {
                                            return {
                                                value: data?.lead_src_id,
                                                label: data?.source,

                                            }
                                        })}
                                        value={sourceList?.map((data, index) => {
                                            if (userInfo.lead_src_id === data.lead_src_id) {
                                                return {
                                                    value: data?.lead_src_id,
                                                    label: data?.source,

                                                }
                                            }
                                        })}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, lead_src_id: e.value })
                                            setErrorData({ ...errorData, lead_src_id: '' })
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.lead_src_id ? errorData.lead_src_id : ''}</span>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="Description">Description</label>
                                    <textarea
                                        name="Description"
                                        placeholder="Description"
                                        className="form-control"
                                        id="Description"
                                        rows="2"
                                        onChange={(e) =>
                                            setUserInfo({ ...userInfo, desc: e.target.value })
                                        }
                                        value={userInfo.desc ? userInfo.desc : ""}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                        <div className={errorData?.opportunity_type_id ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="task_name">Product of Services </label>
                                            <Select
                                                name="p_id"
                                                id={userInfo.p_id}
                                                defaultValue={""}
                                                options={productList?.map((data, i) => {
                                                    return {
                                                        value: data?.p_id,
                                                        label: data?.p_name,
                                                        name: "p_id"
                                                    }
                                                })}
                                                value={productList?.map((pData, i) => {
                                                    if (pData.p_id === data.p_id)  {
                                                        return {
                                                            value: pData?.p_id,
                                                            label: pData?.p_name,
                                                            name: "p_id"
                                                            
                                                        }
                                                    }
                                                })}
                                                onChange={(e) => {handleChange(e, index, 1, "p_id")}}
                                            />
                                            <span className="errorText"> {errorData?.p_id ? errorData.p_id : ''}</span>
                                        </div>
                                    </div>
                                    {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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
                                    </div> */}

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="qty">Quantity </label>
                                            <input
                                            
                                                type="number"
                                                placeholder="Enter Quantity"
                                                name="qty"
                                                min="1"
                                                id="qty"
                                                className="form-control"
                                                onChange={e => handleChange(e, index, 2,  "qty")}
                                                value={data?.qty ? data.qty : ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="price">Price </label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                name="price"
                                                id="price"
                                                className="form-control"
                                                onChange={e => handleChange(e, index,"price")}
                                                value={data?.price ? data.price : ''}
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
                            {/*    <div className="subTotal_sec">
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
                            </div> */}
                        </div>
                    </Collapse>

                    <div className="add_screen_head">
                        <span className="text_bold">System Information </span>
                    </div>

                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="created_on">Created On</label>
                                    <input
                                        type="date"
                                        name="created_on"
                                        id="created_on"
                                        disabled
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                created_on: e.target.value,
                                            })
                                        }
                                        value={userInfo?.created_on ? moment(userInfo?.created_on).format("YYYY-MM-DD") : ''}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="last_modified">Last Modified On</label>
                                    <input
                                        type="date"
                                        name="last_modified"
                                        disabled
                                        id="last_modified"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                updated_on: e.target.value,
                                            })
                                        }
                                        value={userInfo?.updated_on ? moment(userInfo?.updated_on).format("YYYY-MM-DD") : ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="submit_btn">
                                <Link href="Opportunity"><button className="btn btn-cancel m-3 " >Cancel</button></Link>
                                {editMode ? (
                                    <button disabled={isLoading} className="btn btn-primary" onClick={UpdateHandler}>
                                        {isLoading ? 'Loading...' : 'Update'}
                                    </button>
                                ) : (
                                    <button disabled={isLoading} className="btn btn-primary" onClick={submitHandler}>
                                        {isLoading ? 'Loading...' : 'Save & Submit'}
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

export default AddOpportunityScreen;
