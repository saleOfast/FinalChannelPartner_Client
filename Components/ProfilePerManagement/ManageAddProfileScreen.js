import { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../Basics/ConfirmBox";
import ManageProfileTable from "./ManageProfileTable";
import { useSelector } from "react-redux";

export default function ManageAddProfileScreen() {
  const sideView = useSelector((state) => state.sideView.value);

  const [dataList, setDataList] = useState([])
  const [disableShowConfirm, setdisableShowConfirm] = useState(false)
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
  const [currObj, setcurrObj] = useState('')

  function disableConfirm(value) {
    setcurrObj(value)
    setdisableShowConfirm(true)
  }

  function deleteConfirm(value) {
    setcurrObj(value)
    setdeleteshowConfirm(true)
  }

  const getDataList = async () => {

   
  }

  async function disableHandler() {
    setdisableShowConfirm(false)
  }

  async function deleteHandler() {
    setdeleteshowConfirm(false)


  }

  useEffect(() => {
    getDataList();
  }, [])

  return (
    <>
       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h1 className="content_head">MANAGE PROFILE</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/ProfilePermissionManagement">Profile Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Profile List
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <Link href="/AddProfilePermission">
                <button className="btn btn-primary Add_btn">
                  <PlusIcon />
                  ADD PROFILE
                </button>
              </Link>
            </div>
            <ManageProfileTable
              title='Profile List'
              dataList={dataList}
              disableConfirm={disableConfirm}
              deleteConfirm={deleteConfirm} />
          </div>
        </div>
      </div>
    </>
  );
}
