import React, { useEffect, useState } from 'react'

import PlusIcon from '../Svg/PlusIcon';
import Link from "next/link";
import { toast } from 'react-toastify';
import { hasCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { useRouter } from 'next/router'
import ConfirmBox from '../Basics/ConfirmBox';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
  () => import('./TaxMuiTab'),
  { ssr: false }
)

const ManageTaxScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [taxList, setTaxList] = useState([]);
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState('')


    const gettaxList = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:152
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

    function opnCnfrmBox(value) {
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
                    m_id:156
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/tax?t_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj('')
                    gettaxList();
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

    useEffect(() => {
        gettaxList()
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
                    <h3 className="content_head">TAXES MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Taxes Master</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <Link href='/AdditionTaxPage'>
                                <button className="btn btn-primary Add_btn">
                                    <PlusIcon />
                                    ADD TAX
                                </button>
                            </Link>
                        </div>
                        <DynamicTable
                            title='Tax List'
                            taxList={taxList}
                            opnCnfrmBox={opnCnfrmBox} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageTaxScreen