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
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
  () => import('./ManageProofOfConfirmationTab'),
  { ssr: false }
)

const ManageProofOfConfirmationScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([])
  const [userInfo, setUserInfo] = useState({ cmpn_p_name: '' })
  const [editMode, setEditMode] = useState(false)
  const [disableShowConfirm, setdisableShowConfirm] = useState(false)
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
  const [currObj, setcurrObj] = useState({ cmpn_p_id: "", action: "" });
  const [confirmText, setconfirmText] = useState("");
  const [loader, setLoader] = useState(false);


  const handleClose = () => {
    setShow(false);
    setUserInfo({ cmpn_p_name: '' })
  }

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true)
    setUserInfo({ ...userInfo, cmpn_p_name: value[0], cmpn_p_code: value[1], cmpn_p_id: value[3] })
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
    setcurrObj({ cmpn_p_id: value, action: type });
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
          m_id: 357
        }
      }

      try {
        const response = await axios.get(Baseurl + `/db/media/campaign/campaignProof/getCampaignProof`, header);
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
      cmpn_p_id: currObj.cmpn_p_id,
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
          m_id: 358
        }
      }

      try {
        const response = await axios.put(Baseurl + `/db/media/campaign/campaignProof/updateCampaignProof`, reqInfo, header);
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
          m_id: 359
        }
      }

      try {
        const response = await axios.delete(Baseurl + `/db/media/campaign/campaignProof/deleteCampaignProof?cmpn_p_id=${currObj}`, header);
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
    if (userInfo.cmpn_p_name == '') {
      toast.error('Please enter the Proof Of Confirmation Name')
    } else {
      if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 356

          }
        }

        try {
          const response = await axios.post(Baseurl + `/db/media/campaign/campaignProof/addCampaignProof`, userInfo, header);
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
    if (userInfo.cmpn_p_name == '') {
      toast.error('Please enter the Proof Of Confirmation Name')
    } else {
      if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 358
          }
        }

        try {
          const response = await axios.put(Baseurl + `/db/media/campaign/campaignProof/updateCampaignProof`, userInfo, header);
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

  useEffect(() => {
    getDataList();
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
          <h3 className="content_head">PROOF OF CONFIRMATION MASTER</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/crm">Home </Link>
              </li>
              <li className="breadcrumb-item"> Proof Of Confirmation Master</li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <button className="btn btn-primary Add_btn" onClick={OpenAddModal}>
                <PlusIcon />
                ADD MEDIA TYPE
              </button>
            </div>
            <DynamicTable
              loader={loader}
              title='Proof Of Confirmation List'
              openEdtMdl={openEdtMdl}
              dataList={dataList}
              disableConfirm={disableConfirm}
              deleteConfirm={deleteConfirm}
            />
          </div>
        </div>
      </div>

      <Modal className="commonModal" show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title> {editMode ? 'EDIT' : ' ADD'} MEDIA TYPE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Proof Of Confirmation Name</label>
                  <input
                    type="text"
                    placeholder='Enter Proof Of Confirmation Name'
                    name="email" id="email"
                    className="form-control"
                    onChange={(e) => setUserInfo({ ...userInfo, cmpn_p_name: e.target.value })}
                    value={userInfo.cmpn_p_name ? userInfo.cmpn_p_name : ''}
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

export default ManageProofOfConfirmationScreen;
