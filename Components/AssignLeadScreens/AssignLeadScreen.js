import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./AssignLeadsTable'),
    { ssr: false }
)
const AssignLeadScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [dataList, setDataList] = useState([]);
    const [usersList, setusersList] = useState([])
    const [show, setShow] = useState(false);
    const [asgnConHandler, setasgnConHandler] = useState(false);
    const [currObj, setcurrObj] = useState("");
    const [reqData, setReqData] = useState([]);

    const getDataList = async () => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 9
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/leads`, header);
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
   

    


    const getUsersList = async () => {
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
                const response = await axios.get(Baseurl + `/db/users`, header);
                setusersList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    function assignConfirm(value) {
        const object = reqData.find((obj) => {
            if(obj?.lead_id){
                obj.lead_id == value
                return obj
            }
           
        });
        setcurrObj(object);
        setasgnConHandler(true);
    }


    const data = { currObj, dataList };

    

    async function assignHandler() {
        
        if (currObj?.assigned_lead) {
            if (hasCookie("token")) {
                let token = getCookie("token");
                let db_name = getCookie("db_name");

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 10,

                    },
                };

                let myoj = {...dataList[0], "assigned_lead": currObj.assigned_lead}
               

                try {
                    const response = await axios.put(Baseurl + `/db/leads?as=1`, myoj ,header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        setasgnConHandler(false)
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Something went wrong!");
                    }
                }
            }
        } else {
            setasgnConHandler(false)
            toast.error('No User Selected')
        }
    }

    const changeHandler = (value, id, row) => {
        let arr = reqData
        if (arr[row.rowIndex]?.assigned_lead) {
            arr[row.rowIndex].assigned_lead = value,
                arr[row.rowIndex].lead_id = id
            setReqData(arr)
        } else {
            const Data = { assigned_lead: value, lead_id:id }
            arr[row.rowIndex] = Data
            setReqData(arr)
        }
    }

    useEffect(() => {
        getDataList();
        getUsersList();
    }, []);
    return (
        <>
            <ConfirmBox
                showConfirm={asgnConHandler}
                setshowConfirm={setasgnConHandler}
                actionType={assignHandler}
                title={"Assign this user?"}
            />

             <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">Assign Leads</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/ManageLeads">Manage Leads </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Assign Leads
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        {dataList? 
                            <DynamicTable
                            title="Leads List"
                            usersList={usersList}
                            changeHandler={changeHandler}
                            dataList={dataList}
                            assignConfirm={assignConfirm}
                        /> :  <p className="text-center p-5">No Leads Found..!</p> }
                    </div>
                </div>
            </div>
        </>
    );
};

export default AssignLeadScreen;
