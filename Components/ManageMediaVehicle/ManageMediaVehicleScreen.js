import React, { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import Select from "react-select";
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
  () => import('./ManageMediaVehicleTab'),
  { ssr: false }
)

const ManageMediaVehicleScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([])
  const [userInfo, setUserInfo] = useState({ m_v_name: '' })
  const [editMode, setEditMode] = useState(false)
  const [disableShowConfirm, setdisableShowConfirm] = useState(false)
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
  const [currObj, setcurrObj] = useState({ m_v_id: "", action: "" });
  const [confirmText, setconfirmText] = useState("");
  const [loader, setLoader] = useState(false);
  const [mediaFormats,setMediaFormats]=useState()


  const handleClose = () => {
    setShow(false);
    setUserInfo({ m_v_name: '' })
  }

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true)
    setUserInfo({ ...userInfo, m_v_name: value[0], m_v_code: value[1], m_v_id: value[4],m_f_id:value[2] })
    handleShow();
  }

  function OpenAddModal() {
    setEditMode(false)
    handleShow();
  }

  function disableConfirm(value, type) {
    if (type == 1) {
      setconfirmText("enable");
    } else {
      setconfirmText("Disable");
    }
    setcurrObj({ m_v_id: value, action: type });
    setdisableShowConfirm(true);
  }

  function deleteConfirm(value) {
    setcurrObj(value)
    setdeleteshowConfirm(true)
  }

  const getDataList = async () => {
    setLoader(true)
    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 352
        }
      }

      try {
        const response = await axios.get(Baseurl + `/db/media/mediaVehicle/getMediaVehicle`, header);
        if (response?.status == 200 || response?.status == 201) {
          setLoader(false)
          setDataList(response.data.data);
        }
      } catch (error) {
        setLoader(false)
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        else {
          toast.error('Something went wrong!')
        }
      }
    }
  }

  async function disableHandler() {

    const reqInfo = {
      m_v_id: currObj.m_v_id,
      status: currObj.action == 1 ? true : false,
    };

    setdisableShowConfirm(false)
    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 353
        }
      }

      try {
        const response = await axios.put(Baseurl + `/db/media/mediaVehicle/updateMediaVehicle`, reqInfo, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setdisableShowConfirm(false)
          setcurrObj('')
          getDataList();
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

  async function deleteHandler() {
    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 354
        }
      }

      try {
        const response = await axios.delete(Baseurl + `/db/media/mediaVehicle/deleteMediaVehicle?m_v_id=${currObj}`, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setdeleteshowConfirm(false)
          setcurrObj('')
          getDataList();
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

  const addIndustryHandler = async () => {
    if (userInfo.m_v_name == '') {
      toast.error('Please enter the Media Vehicle Name')
    } else {
      if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 351

          }
        }

        try {
          const response = await axios.post(Baseurl + `/db/media/mediaVehicle/addMediaVehicle`, userInfo, header);
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message)
            handleClose();
            getDataList();
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

  }

  const updateHandler = async () => {
    if (userInfo.m_v_name == '') {
      toast.error('Please enter the Media Vehicle Name')
    } else {
      if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 353
          }
        }

        try {
          const response = await axios.put(Baseurl + `/db/media/mediaVehicle/updateMediaVehicle`, userInfo, header);
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message)
            handleClose();
            getDataList();
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

  }

  const getMediaFormatList = async () => {
    
    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 347
        }
      }

      try {
        const response = await axios.get(Baseurl + `/db/media/mediaFormat/getMediaFormat`, header);
        if (response?.status == 200 || response?.status == 201) {
          
          setMediaFormats(response?.data?.data);
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
    getDataList();
  }, [])

  useEffect(() => {
    getMediaFormatList();
  }, [])

  return (
    <>
      <ConfirmBox
        showConfirm={disableShowConfirm}
        setshowConfirm={setdisableShowConfirm}
        actionType={disableHandler}
        title={`Are You Sure you want to ${confirmText} ?`} />

      <ConfirmBox
        showConfirm={deleteshowConfirm}
        setshowConfirm={setdeleteshowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"} />

      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">MEDIA VEHICLE MASTER</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/setting">Home </Link>
              </li>
              <li className="breadcrumb-item"> Media Vehicle Master</li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <button className="btn btn-primary Add_btn" onClick={OpenAddModal}>
                <PlusIcon />
                ADD MEDIA VEHICLE
              </button>
            </div>
            <DynamicTable
              loader={loader}
              title='Media Vehicle List'
              openEdtMdl={openEdtMdl}
              dataList={dataList}
              disableConfirm={disableConfirm}
              deleteConfirm={deleteConfirm}
              mediaFormats={mediaFormats}
            />
          </div>
        </div>
      </div>

      <Modal className="commonModal" show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title> {editMode ? 'EDIT' : ' ADD'} MEDIA VEHICLE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="select_option">Select Media Format</label>
                  <div className="input_box">
                  <Select
                    id="select_option"
                    value={mediaFormats?.map((item,index)=>{
                      if(item?.m_f_id==userInfo?.m_f_id){
                        return {
                          value:item.m_f_id,
                          label:item.m_f_name
                        }
                      }
                    })}
                    options={mediaFormats?.map((item,index)=>{
                      return {
                        value:item.m_f_id,
                        label:item.m_f_name
                      }
                    })}
                    onChange={(e)=>{
                      setUserInfo({
                        ...userInfo,
                        m_f_id:e.value
                      })
                    }}
                  />
                </div>

                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Media Vehicle Name</label>
                  <input
                    type="text"
                    placeholder='Enter Media Vehicle Name'
                    name="email" id="email"
                    className="form-control"
                    onChange={(e) => setUserInfo({ ...userInfo, m_v_name: e.target.value })}
                    value={userInfo.m_v_name ? userInfo.m_v_name : ''}
                  />

                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {editMode ? <Button variant="primary" onClick={updateHandler} >
            UPDATE
          </Button> :
            <Button variant="primary" onClick={addIndustryHandler} >
              SUBMIT
            </Button>}

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageMediaVehicleScreen;
