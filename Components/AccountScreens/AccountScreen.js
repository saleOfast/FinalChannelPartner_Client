import React, { useEffect, useState } from 'react'
import PlusIcon from '../Svg/PlusIcon';
import Link from "next/link";
import { toast } from 'react-toastify';
import { hasCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import ConfirmBox from '../Basics/ConfirmBox';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
import DownloadIcon from '../Svg/DownloadIcon';
const DynamicTable = dynamic(
    () => import('./AccountMuiTable'),
    { ssr: false }
)
const AccountScreen = () => {
    const [accountsList, setAccountsList] = useState([]);
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState('')
    const sideView = useSelector((state) => state.sideView.value);


    const getAccountsList = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 21
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/account`, header);
                setAccountsList(response.data.data);
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

    function openConfirmBox(value) {
        setcurrObj(value)
        setdeleteshowConfirm(true)
    }

    const deleteHandler = async () => {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 23
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/account?acc_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj('')
                    getAccountsList();
                }
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

            axios.get(Baseurl + `/db/account/download`, header)
                .then(response => {
                    const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
                    const fileUrl = URL.createObjectURL(file);
                    // programmatically create and trigger the download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.setAttribute('download', 'Accounts.xlsx'); // specify the file name
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }).catch(error => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        getAccountsList()
    }, []);

    return (
        <>
            <ConfirmBox
                showConfirm={deleteshowConfirm}
                setshowConfirm={setdeleteshowConfirm}
                actionType={deleteHandler}
                title={"Are You Sure you want to Delete ?"} />
            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">Accounts</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home   </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Account List</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                        <div className="d-flex">
                            <Link href='/AddAccount'>
                                <button className="btn btn-primary Add_btn me-3">
                                    <PlusIcon />
                                    ADD ACCOUNT
                                </button>
                            </Link>
                            <button className="btn btn-primary Add_btn " onClick={handleDownload}>
                                <DownloadIcon />
                                EXPORT
                            </button>
                        </div>
                        </div>
                        <DynamicTable
                            accountsList={accountsList}
                            openConfirmBox={openConfirmBox} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountScreen