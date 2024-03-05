import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Papa from "papaparse";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic';
import DownloadIcon from "../Svg/DownloadIcon";
const DynamicTable = dynamic(
    () => import('./AttendenceMuiTable'),
    { ssr: false }
)

export default function AttendenceListScreen() {
    const sideView = useSelector((state) => state.sideView.value);


    const [dataList, setDataList] = useState([]);
    const [currObj, setcurrObj] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [excelData, setexcelData] = useState([]);
    const [show, setShow] = useState(false);
    const [searchFields, setSearchFields] = useState({
        "user_id": null,
        "from_date": null,
        "to_date": null,
    });
    const [latLongDtls, setLanglongDtls] = useState({});

    const handleClose = () => {
        setShow(false);
        setexcelData([])
    };

    const handleShow = () => setShow(true);

    function openConfirmBox(value) {
        setcurrObj(value)
    }

    function mapLatLonFunc(arr, obj) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].lat = obj.lat;
            arr[i].lon = obj.lon;
            arr[i].check_in = arr[i].check_in.replaceAll('/', '-');
            arr[i].check_out = arr[i].check_out.replaceAll('/', '-');
        }
        return arr;
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
                const reqInfo = mapLatLonFunc(excelData, latLongDtls);
                try {
                    const response = await axios.post(Baseurl + `/db/checkin/bulk`, reqInfo, header);
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
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 192
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/checkin/bulk`, header);
                setDataList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    };

    const getUsersList = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: "pass",
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/users?mode=ul`, header);
                setUsersList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

    const clearFilter = () => {
        setSearchFields({
            "user_id": null,
            "from_date": null,
            "to_date": null,

        })
        getDataList();
    }

    async function filterSubmit() {
        const allEmpty = Object.values(searchFields).every(value => value === null || value === undefined || value === "");
        if (allEmpty) {
            toast.error('All Fields Are Empty')
        } else if (searchFields.from_date && !searchFields.to_date) {
            toast.error('Please enter To Date')
        } else {
            let from_date = searchFields.from_date !== null ? `${searchFields.from_date} 00:00:00` : null
            let todate = searchFields.to_date !== null ? `${searchFields.to_date} 00:00:00` : null
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 191,
                    }
                }
                try {
                    const response = await
                        axios.get(Baseurl + `/db/checkin/bulk/?user_id=${searchFields.user_id}&from_date=${from_date}&to_date=${todate}`, header);
                    setDataList(response.data.data);
                } catch (error) {
                    console.log('error', error);
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error('Something went wrong!')
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

            axios.get(Baseurl + `/db/checkin/download`, header)
                .then(response => {
                    const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
                    const fileUrl = URL.createObjectURL(file);
                    // programmatically create and trigger the download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.setAttribute('download', 'Attendence.xlsx'); // specify the file name
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }).catch(error => {
                    console.error(error);
                });
        }
    };


    useEffect(() => {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position) => {
                setLanglongDtls({
                    ...latLongDtls,
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                })
            }, (error) => {
                setLanglongDtls({ ...latLongDtls, lat: null, lon: null })
            })
        }
        getDataList();
        getUsersList()
    }, [])



    return (
        <>
            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">ATTENDENCE</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Attendence List</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="row filterRow">
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6">
                                <div className="filterBox">
                                    <label className="label " htmlFor="users">Select User </label>
                                    <select
                                        name="users"
                                        id="users"
                                        className="form-control"
                                        onChange={(e) => setSearchFields({ ...searchFields, user_id: e.target.value })}
                                        value={searchFields?.user_id ? searchFields.user_id : ''} >
                                        <option value="">Select User</option>
                                        {usersList?.map(({ user_id, user }) => {
                                            return <option key={user_id} value={user_id}>{user}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6 pe-sm-0">
                                <div className="filterBox">
                                    <label className="label" htmlFor="fromDate">From </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="fromDate"
                                        id="fromDate"
                                        onChange={(e) => setSearchFields({ ...searchFields, from_date: e.target.value })}
                                        value={searchFields?.from_date ? searchFields.from_date : ''}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6">
                                <div className="filterBox">
                                    <label className="label" htmlFor="toDate">To</label>
                                    <input type="date"
                                        className="form-control"
                                        name="toDate"
                                        id="toDate"
                                        onChange={(e) => setSearchFields({ ...searchFields, to_date: e.target.value })}
                                        value={searchFields?.to_date ? searchFields.to_date : ''}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6">
                                <div className="submitBtn">
                                    <button className="btn btn-primary" onClick={filterSubmit}>Search</button>
                                    <button className="btn btn-cancel ms-3" onClick={clearFilter}>Clear</button>
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="submitBtn">
                                    <button className="btn ms-auto btn-primary Add_btn me-2" onClick={handleShow}>
                                        <PlusIcon />
                                        Import CSV
                                    </button>
                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                        <button className="btn ms-auto btn-primary Add_btn me-2" onClick={handleDownload}>
                                            <DownloadIcon />
                                            Export
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <DynamicTable
                            title='Attendence List'
                            dataList={dataList}
                            openConfirmBox={openConfirmBox}
                        />
                    </div>
                </div>
            </div>
            <Modal className="commonModal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>  Import CSV  </Modal.Title>
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
                                        onChange={importHandler}
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="demoLink text-end py-2">
                                <a className="text-decoration-underline text-primary" href="/Docs/demoAttendence.csv" download='Attendence-Sample-File.csv'>View Sample File </a>
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
}
