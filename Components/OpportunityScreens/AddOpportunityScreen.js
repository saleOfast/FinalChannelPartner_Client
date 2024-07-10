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
        assigned_to: null,
        close_lost_reason:"",
        db_opportunity_fields: [],

    });
    const [newFields, setNewFields] = useState({
        field_lable: null,
        input_type: null,
        field_type: null,
        field_size: null,
        option: null,
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
    const [lossLists, setlossLists] = useState([])
    const [iscollapse, setiscollapse] = useState(false);

  

    const Datenow =  moment(new Date().toISOString()).format("YYYY-MM-DDTHH:mm");

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

    const getLossLists = async () => {
        await fetchData(`/db/loss`, setlossLists, errorToast, setErrorToast);
      }





      const inputClass = (value) => {
        const inputClasses = {
          text: 'form-control',
          date: 'form-control',
          email: 'form-control',
          number: 'form-control',
          checkbox: 'form-check-input ms-3',
        };
        return inputClasses[value] || '';
      };

      
    const createInputField = (e) => {
        console.log("creating field")

        e.preventDefault();
        const { field_lable, input_type, field_type,field_size, option } = newFields;
    
        const showError = (errorMessage) => {
          toast.error(errorMessage);
        };
    
        const validateField = () => {
          if (!field_lable) {
            showError('Please enter the Field Name');
            return false;
          } else if (!input_type) {
            showError('Please select the Input Type');
            return false;
          }
          else if (input_type === 'input' && !field_type ) {
            showError('Please select the Field Type');
            return false;
          }
          // else if (input_type === 'input' && !field_size  && field_type !== 'checkbox' && field_type !== 'date') {
          //   showError('Please Enter Field Size');
          //   return false;
          // }
          else if (input_type === 'select' && !option) {
            showError('Please select input Options');
            return false;
          }
          return true;
        };
        console.log("test 1")
    
        if (validateField()) {
          const inputReq = {
            ...newFields,
            field_name: field_lable.replaceAll(' ', '_'),
            navigate_type: userInfo.navigate_type,
            // field_order: inputsData.length + 1
          };
          let arr = userInfo
          arr.db_opportunity_fields.push(newFields)
          setUserInfo(arr)
          console.log("arr",arr)
          setiscollapse(!iscollapse);
          setNewFields({
            field_lable: null,
            input_type: null,
            field_type: null,
            option: null,
            field_size: null,
          })
          console.log("new file",newFields)
        }
      };



      
  const updateFieldInfo = (e, ind) => {
    let newData = JSON.parse(JSON.stringify(userInfo))
    console.log('newData',newData)

    if( newData?.db_opportunity_fields[ind]?.field_type === 'checkbox'){
      newData.db_opportunity_fields[ind].input_value = e.target.checked

    }else{

      newData.db_opportunity_fields[ind].input_value = e.target.value
    }
   
    setUserInfo(newData)

  };
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
                setUserInfo(response?.data?.data);
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
        if(userInfo?.opportunity_stg_id===4 && (userInfo?.close_lost_reason===undefined  || userInfo?.close_lost_reason==="" || userInfo?.close_lost_reason===null)){
            setErrorData({...errorData,close_lost_reason:"Enter Close Lost Reason"})
            toast.error("Please Fill Mandatory Fields")
            return
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
                    m_id: 34,
                },
            };

            let oppBody = { ...userInfo }
            oppBody.opp_owner = loginDetails.user_id
            try {
                const response = await axios.post(Baseurl + `/db/opportunity`, oppBody, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    await productSubmit(formValues, response.data.data.opp_id,oppBody.db_opportunity_fields)
                    await postFieldsFunc(response.data.data.opp_id,oppBody.db_opportunity_fields);
                    setisLoading(false)
                    router.push("/crm/Opportunity");
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


//postFieldFunc

async function postFieldsFunc(id, data) {
    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
        },

      };
    //   data?.map(item => {
    //     item.opp_id = id
    //   })


    const updatedData = data.map(item => ({
        ...item,
        opportunity: id
      }));
      try {
        const response = await axios.post(Baseurl + `/db/opportunity/field`,updatedData, header);
        if (response.status === 204 || response.status === 200) {
          setisLoading(false)
        }
      } catch (error) {
        console.log(error)
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
  }


    const UpdateHandler = async () => {
        
        if(userInfo?.opportunity_stg_id===4 && (userInfo?.close_lost_reason===undefined  || userInfo?.close_lost_reason==="" || userInfo?.close_lost_reason===null)){
            setErrorData({...errorData,close_lost_reason:"Enter Close Lost Reason"})
            toast.error("Please Fill Mandatory Fields")
            return
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
                    m_id: 36,
                },
            };
      let userInfoBody = { ...userInfo,updated_on:Datenow }


            try {
                const response = await axios.put(
                    Baseurl + `/db/opportunity`,
                    userInfoBody,
                    header
                );
                if (response.status === 204 || response.status === 200) {
                    await postFieldsFunc(userInfoBody.opp_id,userInfoBody.db_opportunity_fields);
                    toast.success(response.data.message);
                    productUpdate(formValues, router.query.id)
                    setisLoading(false)
                    router.push("/crm/Opportunity");
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


    const AddFieldsFunc = (e) => {
        e.preventDefault();
        setiscollapse(true)
      };
    

    


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
        productDelete(product_id)
        const updatedItem = formValues.filter((elem, i) => {
            return ind !== i;
        })
        setFormValues(updatedItem);
        const totalprice = sumPrices(updatedItem);
        setUserInfo({ ...userInfo, amount: totalprice })
        // toast.success('Product Removed')
    }

    const productDelete = async (product_id) => {
        
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

            
            try {
                const response = await axios.delete(Baseurl + `/db/oppro?o_p_id=${product_id}`,header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response?.data?.message)
                }

            } catch (error) {
                console.log(error)
            }
        }
    }

   
    useEffect(() => {
        getAccountsList();
        getStageList();
        getLossLists();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleData(id);
            getProductData(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <Link href="/crm">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/crm/Opportunity"> Opportunity </Link>
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
                                    {!editMode ? null : <p className="label_link">  <Link href="/crm/AddAccount">+ Add New</Link></p>}
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
                                        min={moment().format("YYYY-MM-DD")}
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
                            
                            {
                                userInfo?.opportunity_stg_id===4 && (
                                    
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="loss_reson">Select Loss Reason*</label>
                    <select
                      className="form-control"
                      name="loss_reson" id="loss_reson"
                      value={userInfo?.close_lost_reason}
                      onChange={(e) =>{ 
                        setUserInfo({ ...userInfo, close_lost_reason: e.target.value })
                        setErrorData({ ...errorData, close_lost_reason: '' })
                        }} >
                      <option value="">Select Reason</option>
                      {lossLists?.map((data, i) => {
                        return <option key={i} value={data.close_lost_reason}>{data.loss_reason}</option>
                      })}
                    </select>
                    <span className="errorText"> {errorData?.close_lost_reason ? errorData.close_lost_reason : ''}</span>
                  </div>
                </div>
                            
                                )
                            }
                            
                              

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
                        <span className="text_bold cursor-pointer">Product Or Services</span>
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
                                                // value={data?.price ? data.price : ''}
                                                value={productList?.find((item)=>(item.p_id == data?.p_id)) ? productList?.find((item)=>(item.p_id == data?.p_id))?.p_price:"" }

                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-1 col-md-1 col-sm-12 col-12">
                                        <div className="AddRowBtn">
                                            {index == 0 ? <button onClick={() => addRowHandler(index)} title="Add Row" className="actionBtn"><PlusIcon /></button> :
                                                <button onClick={() => deleteRow(index, data?.o_p_id)} title="Delete Row" className="actionBtn"><DeleteIcon /></button>}
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
                                        type="datetime-local"
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
                                        value={userInfo?.created_on ? moment(userInfo?.created_on).format("YYYY-MM-DDTHH:mm") : ''}
                                    />
                                </div>
                            </div>  

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="last_modified">Last Modified On</label>
                                    <input
                                        type="datetime-local"
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
                                        value={userInfo?.updated_on ? moment(userInfo?.updated_on).format("YYYY-MM-DDTHH:mm") : ''}
                                    />
                                </div>
                            </div>
                        </div>






                        {userInfo.db_opportunity_fields?.map(({ option, field_name, field_lable, field_type, input_type, input_value }, ind) => (
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12" key={ind}>
                          <div className="input_box">
                            <label htmlFor={field_name + ind}> {field_lable} </label>
                            {input_type === 'input' ? (
                              <input
                                type={field_type}
                                className={inputClass(field_type)}
                                id={field_name + ind}
                                name={field_name}
                                placeholder={field_lable}
                                // disabled={viewMode}
                                onChange={(e) => updateFieldInfo(e, ind)}
                                //value={userInfo.field_name ? userInfo.field_name : ""}
                                checked={input_value == "1" ? true: false}
                                value={input_value}

                              />
                            ) : null}
                            {input_type === 'select' ? (
                              <select
                                onChange={(e) => updateFieldInfo(e, ind)}
                                name={field_name}
                                id={field_name + ind}
                                className="form-control"
                                value={input_value}
                                // disabled={viewMode}
                              >
                                <option value="">Select {field_lable}</option>
                                {option?.split(",").map((data, i) => (
                                  <option value={data} key={i}>{data}</option>
                                ))}
                              </select>
                            ) : null}
                          </div>
                        </div>
                      ))}

                        {iscollapse && (
                      <div className="addFieldsForm py-5">
                        <div className="row">
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor='newFieldName'>Field Name</label>
                              <input
                                type='text'
                                className='form-control'
                                id='newFieldName'
                                placeholder='Field Name'
                                onChange={(e) => setNewFields({ ...newFields, field_lable: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor='newFieldType'>Field Type</label>
                              <select
                                name="newFieldType"
                                className='form-control'
                                id="newFieldType"
                                onChange={(e) => setNewFields({ ...newFields, input_type: e.target.value })}
                              >
                                <option>Select Field Type</option>
                                <option value='input'>Input Box</option>
                                <option value='select'>Select Box</option>
                              </select>
                            </div>
                          </div>

                          {newFields.input_type === 'input' && (
                            <>
                              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="input_box">
                                  <label htmlFor='newInputType'>Input Type</label>
                                  <select
                                    name="newInputType"
                                    className='form-control'
                                    onChange={(e) => setNewFields({ ...newFields, field_type: e.target.value })}
                                    id="newInputType">
                                    <option>Select Input Type</option>
                                    <option value='text'>Text</option>
                                    <option value='email'>Email</option>
                                    <option value='checkbox'>Checkbox</option>
                                    <option value='number'>Number</option>
                                    <option value='date'>Date</option>
                                  </select>
                                </div>
                              </div>
                              {/* <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="input_box">
                                  <label htmlFor='field_size'>Field Size</label>
                                  <input
                                    type='number'
                                    name="field_size"
                                    className='form-control'
                                    placeholder='Enter field size'
                                    id="field_size"
                                    onChange={(e) => setNewFields({ ...newFields, field_size: e.target.value })}
                                  />
                                </div>
                              </div> */}

                            </>
                          )}

                          {/* {
                            newFields.input_type === 'input' && (newFields?.field_type==="text" ||  newFields?.field_type==="email" || newFields?.field_type==="number") && (
                              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor='field_size'>Field Size</label>
                                <input
                                  type='number'
                                  name="field_size"
                                  className='form-control'
                                  placeholder='Enter field size'
                                  id="field_size"
                                  onChange={(e) => setNewFields({ ...newFields, field_size: e.target.value })}
                                />
                              </div>
                            </div>
                            )
                          } */}
                         

                          {newFields.input_type === 'select' && (
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor='newKeywords'>Select Keywords</label>
                                <input
                                  type='text'
                                  name="newKeywords"
                                  className='form-control'
                                  placeholder='e.g. Name, age, gender'
                                  id="newKeywords"
                                  onChange={(e) => setNewFields({ ...newFields, option: e.target.value })}
                                />
                              </div>
                            </div>
                          )}



                        </div>

                        <div className="btn-row my-4">
                          {/* <button onClick={"AddFieldsFunc"} className="btn btn-light me-3">Cancel</button> */}
                          <button onClick={createInputField} className="btn btn-success">Create Field</button>
                        </div>
                      </div>
                    )}




                        <div className="text-end">
                            <div className="submit_btn">

                            <div className="add_screen_head">
                            <span className="text_bold"><button className='btn btn-primary ' onClick={AddFieldsFunc}> Add More Fields</button>  </span>
                          </div>
                                <Link href="/crm/Opportunity"><button className="btn btn-cancel m-3 " >Cancel</button></Link>
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
