import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import Select, { components } from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useRouter } from "next/router";

import ProductTaxMappingTable from "./ProductTaxMappingTable";
import { useSelector } from "react-redux";

const ProductTaxMappingScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;

    const [dataList, setDataList] = useState([]);
    const [taxList, setTaxList] = useState([]);
    const [selTaxdata, setselTaxdata] = useState([])
    const [disableShowConfirm, setdisableShowConfirm] = useState(false);
    const [currObj, setcurrObj] = useState("");
    const [effectDate, setEffectDate] = useState('')
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setcurrObj('')
        setselTaxdata([])
    }

    const handleShow = () => setShow(true);

    function disableConfirm(value) {
        setcurrObj(value);
        setdisableShowConfirm(true);
    }

    const getTaxList = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass:'pass'
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/tax`, header);
                setTaxList(response.data.data);
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

    const InputOption = ({
        getStyles,
        Icon,
        isDisabled,
        isFocused,
        isSelected,
        children,
        innerProps,
        ...rest
    }) => {
        const [isActive, setIsActive] = useState(false);
        const onMouseDown = () => setIsActive(true);
        const onMouseUp = () => setIsActive(false);
        const onMouseLeave = () => setIsActive(false);

        // styles
        let bg = "transparent";
        if (isFocused) bg = "#eee";
        if (isActive) bg = "#B2D4FF";

        const style = {
            alignItems: "center",
            backgroundColor: bg,
            color: "inherit",
            display: "flex "
        };

        // prop assignment
        const props = {
            ...innerProps,
            onMouseDown,
            onMouseUp,
            onMouseLeave,
            style
        };

        return (
            <components.Option
                {...rest}
                isDisabled={isDisabled}
                isFocused={isFocused}
                isSelected={isSelected}
                getStyles={getStyles}
                innerProps={props}
            >
                <input type="checkbox" defaultChecked={isSelected} />
                {children}
            </components.Option>
        );
    };

    async function mapTaxHandler() {
        if (selTaxdata.length <= 0) {
            toast.error('Please Select any tax')
        } else if (!effectDate) {
            toast.error('Please enter the date')
        } else {
            if (hasCookie("token")) {
                let token = getCookie("token");
                let db_name = getCookie("db_name");

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:45
                       

                    },
                };

                const newData = selTaxdata.map(obj => {
                    return {
                        ...obj,
                        effective_date: effectDate,
                        p_id: router.query.id
                    };
                });

                try {
                    const response = await axios.post(
                        Baseurl + `/db/producttax`,
                        newData,
                        header
                    );
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        handleClose();
                        setcurrObj('')
                        setselTaxdata([])
                        getData(router.query.id);
                    }
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

    const getData = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:45
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/producttax?p_id=${id}`, header);
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

    async function deleteHandler() {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:45
                },
            };
            try {
                const response = await axios.delete(Baseurl + `/db/producttax?p_t_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    setdisableShowConfirm(false);
                    setcurrObj('');
                    getData(router.query.id);

                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

    useEffect(() => {
        getTaxList();
    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            getData(id);
        }
    }, [router.isReady, id]);

    return (
        <>
            <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={deleteHandler}
                title={"Are You Sure you want to Delete ?"} />

             <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">PRODUCT TAXES</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home </Link>
                            </li>
                            <li className="breadcrumb-item" aria-current="page">
                                <Link href="/Products"> Product</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Product Taxes
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <button className="btn btn-primary Add_btn"
                                onClick={handleShow}>
                                <PlusIcon />
                                ADD TAX
                            </button>
                        </div>
                        <ProductTaxMappingTable
                            title="Taxes List"
                            dataList={dataList}
                            disableConfirm={disableConfirm}
                        />
                    </div>
                </div>
            </div>
            <Modal className="commonModal" show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Map Tax With Product </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="sel_taxes">Select Taxes</label>
                                    <Select
                                        defaultValue={[]}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        hideSelTelcaler={false}
                                        onChange={(options) => {
                                            if (Array.isArray(options)) {
                                                setselTaxdata(options.map((opt) => {
                                                    return { tax_id: opt.value }
                                                }));
                                            }
                                        }}

                                        options={taxList?.map((data, i) => {
                                            return { value: data.tax_id, label: data.tax_name }
                                        })}

                                        components={{
                                            Option: InputOption
                                        }} />
                                </div>
                            </div>
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="effect_date">Effective Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        onChange={(e) => setEffectDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="primary" onClick={mapTaxHandler} >
                        SUBMIT
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductTaxMappingScreen;
