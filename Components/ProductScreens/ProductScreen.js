import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import Select, { components } from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Papa from "papaparse";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
import DownloadIcon from "../Svg/DownloadIcon";

const DynamicTable = dynamic(
    () => import('./ProductMuiTable'),
    { ssr: false }
)

const ProductScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [dataList, setDataList] = useState([]);
    const [disableShowConfirm, setdisableShowConfirm] = useState(false);
    const [currObj, setcurrObj] = useState("");
    const [show, setShow] = useState(false);
    const [excelData, setexcelData] = useState([]);


    function disableConfirm(value) {
        setcurrObj(value);
        setdisableShowConfirm(true);
    }

    const handleShow = () => setShow(true);


    function openTaxMapModel(value) {
        handleShow();
        setcurrObj(value)
    }


    const getData = async () => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 40
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/product`, header);
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
                    m_id: 44
                },
            };

            try {
                const response = await axios.delete(Baseurl + `/db/product?p_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    setdisableShowConfirm(false);
                    setcurrObj('');
                    getData();

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
    const handleClose = () => {
        setShow(false);
        setexcelData([])
    };

    const importHandler = (event, type) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setexcelData(results.data)

            },

        });

    };

    async function csvSubmitHandler() {
        if (excelData.length <= 0) {
            toast.error('No Data Found Please Check and try Again')
        } else {
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
                    const response = await axios.post(Baseurl + `/db/product/bulk`, excelData, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        getData();
                        handleClose();
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


    const handleDownload = () => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Change the Accept type to Excel
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: "pass",
                },
                responseType: 'blob' // set the response type as blob
            };

            axios.get(Baseurl + `/db/product/download`, header)
                .then(response => {
                    const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
                    const fileUrl = URL.createObjectURL(file);
                    // programmatically create and trigger the download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.setAttribute('download', 'Product.xlsx'); // specify the file name
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }).catch(error => {
                    console.error(error);
                });
        }
    };


    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={deleteHandler}
                title={"Are You Sure you want to Delete ?"}
            />
            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">PRODUCT MANAGEMENT</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                {" "}
                                <Link href="/">Home </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Product
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <div className="d-flex">
                                <Link href="/AddProduct">
                                    <button className="btn btn-primary Add_btn me-3">
                                        <PlusIcon />
                                        ADD PRODUCT
                                    </button>
                                </Link>

                                <button className="btn btn-primary Add_btn me-3" onClick={handleShow}>
                                    <PlusIcon />
                                    IMPORT CSV
                                </button>
                                <button className="btn btn-primary Add_btn " onClick={handleDownload}>
                                    <DownloadIcon />
                                    EXPORT
                                </button>
                            </div>
                        </div>
                        <DynamicTable
                            title="Product List"
                            dataList={dataList}
                            openTaxMapModel={openTaxMapModel}
                            disableConfirm={disableConfirm}
                        />
                    </div>
                </div>
            </div>
            <Modal className="commonModal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>  Import CSV </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="AttendenceFile">Select File</label>
                                    <input type="file"
                                        name="AttendenceFile"
                                        id="AttendenceFile"
                                        accept=".csv"
                                        onChange={importHandler}
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="demoLink text-end py-2">
                                <a className="text-decoration-underline text-primary" href="/Docs/ProductUpload.csv" download='Product-Sample.csv'>Views Sample File </a>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-cancel me-2" onClick={handleClose}>Cancel</button>
                    <Button variant="primary" onClick={csvSubmitHandler}>
                        SUBMIT
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    );
};

export default ProductScreen;
