import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import { Baseurl } from '../../../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../../../Basics/ConfirmBox";
import { useSelector } from 'react-redux';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import dynamic from 'next/dynamic'
import Papa from "papaparse";
import Loader from '../../../Loader/Loader';
const DynamicTable = dynamic(
    () => import('./CPRegisterLeadsTable'),
    { ssr: false }
)

const CPRegisterLeadsScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [dataList, setDataList] = useState([])
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [confirmText, setconfirmText] = useState('')
    const [show, setShow] = useState(false);
    const [excelData, setexcelData] = useState([]);
    const [currObj, setcurrObj] = useState({
        cpl_id: '',
        db_name: ''
    })
  const [loader,setLoader]=useState(false);


    function disableConfirm(value, type) {
        if (type == 1) {
            setconfirmText('enable')
        } else {
            setconfirmText('Disable')
        }
        setcurrObj({
            id: value,
            action: type
        })
        setdisableShowConfirm(true)
    }

    const handleClose = () => {
        setShow(false);
        setexcelData([])
    };

    const handleShow = () => setShow(true);

    function deleteConfirm(value) {
        setcurrObj({
            id: value,
            action: 'delete'
        })
        setdeleteshowConfirm(true)
    }



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


    const getDataList = async () => {
        setLoader(true);
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 76,
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/channelPartnerLeads?db_name=${db_name}`, header);
                if(response?.status === 200 || response?.status === 201){
                    setLoader(false);
                    setDataList(response.data.data);
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    setLoader(false);
                    toast.error(error.response.data.message);
                } else {
                    setLoader(false);
                    toast.error("Something went wrong!");
                }
            }
        }
    }

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
                    const response = await axios.post(Baseurl + `/db/users/owner`, excelData, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        getDataList();
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

    async function deleteHandler() {
        setdeleteshowConfirm(false)

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 80
                }
            }
            try {
                const response = await axios.delete(Baseurl + `/db/channelPartnerLeads?cpl_id=${currObj.cpl_id}&db_name=${db_name}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj({
                        cpl_id: '',
                        db_name: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }

    }
    


    useEffect(() => {
        getDataList();
    }, [])

    return (
        <>
        <ConfirmBox
        showConfirm={deleteshowConfirm}
        setshowConfirm={setdeleteshowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"}
      />
        <div className="w-100 ps-4 pe-4 pb-4 overflow-scroll" >
                
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec ">
                            <div className="d-flex">
                            <Link href='/ChannelAddUsers'>
                                {/* <button className="btn ms-auto btn-primary Add_btn me-3">
                                    <PlusIcon />
                                    ADD USER
                                </button> */}
                            </Link>
                            {/* <button className="btn btn-primary Add_btn" onClick={handleShow}>
                                <PlusIcon />
                                Import CSV
                            </button> */}
                            </div>
                        </div>
                        <DynamicTable
                            title='Channel Partner Registration Leads'
                            dataList={dataList}
                            loader={loader}
                            setdeleteshowConfirm={setdeleteshowConfirm}
                            disableConfirm={disableConfirm}
                            deleteConfirm={deleteConfirm}
                            getDataList={getDataList}
                            setcurrObj={setcurrObj}
                            currObj={currObj}
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
                                <a className="text-decoration-underline text-primary" href="/Docs/demoUser.csv" download='user-Sample-File.csv'>Views Sample File </a>
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
    )
}

export default CPRegisterLeadsScreen