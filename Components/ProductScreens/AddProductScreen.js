import React, { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import ConfirmBox from "../Basics/ConfirmBox";
import { useRouter } from "next/router";
import moment from "moment";
import { useSelector } from "react-redux";
const AddProductScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;
    const [userInfo, setUserInfo] = useState({});
    const [errorData, setErrorData] = useState({})
    const [selected, setSelected] = useState({
        p_cat_id: '',
        p_cat_name: ''
    })


    const [dataList, setDataList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const arr = []

    const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD")

    function checkChildrens(data, space = 0, i = 0) {
        space += 1;
        let spaces = '';
        for (let i = 0; i < space; i++) {
            spaces += '\u00A0\u00A0'
        }
        if (data?.length > 0) {
            return data?.map(({ p_cat_id, p_cat_name, children }) => {
                return <> <option key={p_cat_id} name={p_cat_name} value={p_cat_id} >
                    {spaces}{p_cat_name}</option>
                    {checkChildrens(children, space)}
                </>
            })
        }
    }

    function parentHandlerId(e, dataList, obj = []) {
        dataList.map((item) => {
            arr.push({
                p_cat_id: item.p_cat_id,
                p_cat_name: item.p_cat_name
            })
            if (item.children.length > 0) {
                return parentHandlerId(e, item.children, arr)
            }
        })

        return arr;
    }

    function getItem(e, dataList, obj = []) {
        setErrorData({ ...errorData, p_cat_id: '' })
        let arrData = parentHandlerId(e, dataList, obj = [])
        const object = arrData.find(net => net.p_cat_id == e.target.value);
        if (object) {
            setSelected({ ...selected, p_cat_id: object.p_cat_id, p_cat_name: object.p_cat_name })
            setUserInfo({ ...userInfo, p_cat_id: e.target.value })
        } else {
            setSelected({ ...selected, p_cat_name: '' })
            setUserInfo({ ...userInfo, p_cat_id: '0' })
        }
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
                    pass: 'pass'
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
                        m_id: 43
                    },
                };

                try {
                    const response = await axios.put(
                        Baseurl + `/db/product`,
                        userInfo,
                        header
                    );
                    if (response.status === 200 || response.status === 204) {
                        toast.success(response.data.message);
                        router.push("/Products");
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
                }
            }
        } else {
            toast.error('Please fill the Mandatory fields')
        }
    }

    const getData = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 43
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/product?p_id=${id}`, header);
                setUserInfo(response.data.data);
                setSelected({ ...selected, p_cat_name: response?.data?.data?.db_p_cat?.p_cat_name })
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
                        m_id: 41
                    },
                };

                try {
                    const response = await axios.post(Baseurl + `/db/product`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        router.push("/Products");
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
                }
            }
        } else {
            toast.error('Please fill the Mandatory fields')
        }
    };

    useEffect(() => {
        getDataList();
        setUserInfo({
            ...userInfo,
            created_on: DateNow,
            updated_on: DateNow,
        })

    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getData(id);
        }
    }, [router.isReady, id]);

    return (


        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">{editMode ? "EDIT" : "ADD"} PRODUCT</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/">Home</Link>
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
                                <div className={errorData?.p_name ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="p_name"> Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Product Name"
                                        name="p_name"
                                        id="p_name"
                                        className={errorData?.p_name ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, p_name: e.target.value })
                                            setErrorData({ ...errorData, p_name: '' })
                                        }}
                                        value={userInfo.p_name ? userInfo.p_name : ""}
                                    />
                                    <span className="errorText"> {errorData?.p_name ? errorData.p_name : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.p_code ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_status"> Code *</label>
                                    <input
                                        type="text"
                                        name="product_code"
                                        id="product_code"
                                        placeholder="Enter Product Code"
                                        className={errorData?.p_code ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, p_code: e.target.value })
                                            setErrorData({ ...errorData, p_code: '' })
                                        }}
                                        value={userInfo.p_code ? userInfo.p_code : ""}
                                    />
                                    <span className="errorText"> {errorData?.p_code ? errorData.p_code : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.p_price ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="p_price">Price *</label>
                                    <input
                                        type="number"
                                        name="p_price"
                                        id="p_price"
                                        placeholder="Enter List Price"
                                        className={errorData?.p_price ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, p_price: e.target.value })
                                            setErrorData({ ...errorData, p_price: '' })
                                        }}
                                        value={userInfo.p_price ? userInfo.p_price : ""} />
                                    <span className="errorText"> {errorData?.p_price ? errorData.p_price : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.p_cat_id ? 'input_box errorBox option_tree' : 'input_box option_tree'}>
                                    <p className="label_subs"> Category *</p>
                                    <div className="select_wrapper">
                                        <label className="option_select" htmlFor="p_cat_id">
                                            {selected.p_cat_name ? selected.p_cat_name : 'Select Product Category'}
                                        </label>
                                        <select
                                            name="p_cat_id" id="p_cat_id"
                                            onChange={(e) => getItem(e, dataList)}
                                            className={errorData?.p_cat_id ? 'form-control is-invalid' : 'form-control'}>
                                            <option value=''>Select Category </option>
                                            {dataList?.map(({ children, p_cat_id, p_cat_name }, i) => {
                                                return (<>
                                                    <option name={p_cat_name} key={p_cat_id} value={p_cat_id}> {p_cat_name} </option>
                                                    {checkChildrens(children, p_cat_id, i)}
                                                </>
                                                )
                                            })}
                                        </select>
                                        <span className="errorText"> {errorData?.p_cat_id ? errorData.p_cat_id : ''}</span>
                                    </div>

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
                                        type="date"
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
                                        value={userInfo.created_on ? moment(userInfo.created_on).format("YYYY-MM-DD") : ""}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="per_cont">Last Modified On</label>
                                    <input
                                        type="date"
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
                                        value={userInfo.updated_on ? moment(userInfo.updated_on).format("YYYY-MM-DD") : ""}
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
