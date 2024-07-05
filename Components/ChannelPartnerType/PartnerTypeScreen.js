import React, { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import ConfirmBox from "../Basics/ConfirmBox";
import ManageTaskStatusTab from "./ManageTaskStatusTab";
import Papa from "papaparse";
import { useSelector } from "react-redux";

const PartnerTypeScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "" });
  const [editMode, setEditMode] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [confirmText, setconfirmText] = useState('')
  const [currObj, setcurrObj] = useState({ cpt_id: '', action: '' })
  const [cvg, setCvg] = useState(false);
  const [excelData, setexcelData] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleClose = () => {
    setShow(false);
    setUserInfo({ name: "" });
  };

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true);
    setCvg(true)
    setUserInfo({
      ...userInfo,
      name: value[0],
      cpt_id: value[1],
      
    });
    handleShow();
  };

  function OpenAddModal() {
    setEditMode(false);
    setCvg(true)
    handleShow();
  }

  function Opencsv() {
    setCvg(false)
    handleShow()
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
          const response = await axios.post(Baseurl + `/db/subtask/status/bulk`, excelData, header);
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



  function disableConfirm(value, type) {
    if (type == 1) {
      setconfirmText('enable')
    } else {
      setconfirmText('Disable')
    }
    setcurrObj({ task_status_id: value, action: type })
    setdisableShowConfirm(true)
  }

  function deleteConfirm(value) {
    setcurrObj({ cpt_id: value, action: 'delete' })
    setdeleteshowConfirm(true)
  }

  const getDataList = async () => {
    setLoader(true)
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:63
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/users/channelPartnerType`,
          header
        );
        if(response?.status==200||response?.status==201){
          setLoader(false)
          setDataList(response?.data?.data);
        }
      } catch (error) {
        setLoader(false)
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  async function disableHandler() {
    const reqInfo = { task_status_id: currObj.task_status_id, status: currObj.action == 1 ? true : false }

    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:66
    
        },
      };

      try {
        const response = await axios.put(Baseurl + `/db/subtask/status`, reqInfo, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdisableShowConfirm(false);
          setcurrObj({ task_status_id: '', action: '' })
          getDataList();
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

  async function deleteHandler() {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:67
        },
      };

      try {
        const response = await axios.delete(
          Baseurl + `/db/users/channelPartnerType?cpt_id=${currObj.cpt_id}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdeleteshowConfirm(false);
          setcurrObj({ cpt_id: '', action: '' })
          getDataList();
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

  const addPartnerTypeHandler = async () => {
    if (userInfo.name == "") {
      toast.error("Please enter Partner Type Name");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id:64
          },
        };

        try {
          const response = await axios.post(
            Baseurl + `/db/users/channelPartnerType`,
            userInfo,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
            handleClose();
            getDataList();
          }
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  };

  const updatePartnerTypeHandler = async () => {
    if (userInfo.name == "") {
      toast.error("Please enter Partner Type Name");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id:66,
          },
        };

        try {
          const response = await axios.put(
            Baseurl + `/db/users/channelPartnerType`,
            userInfo,
            header
          );
          if (response?.status === 204 || response?.status === 200) {
            toast.success(response?.data?.message);
            handleClose();
            getDataList();
          }
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  };

  useEffect(() => {
    getDataList();
  }, []);

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
        title={"Are You Sure you want to Delete ?"}
      />

       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">CHANNEL PARTNER TYPE MASTER</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/crm">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Partner Type Master
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
            <div className="d-flex">
              <button
                className="btn btn-primary Add_btn me-3"
                onClick={OpenAddModal}>
                <PlusIcon />
                ADD PARTNER TYPE
              </button>
              <button className="btn btn-primary Add_btn " onClick={Opencsv}>
                  <PlusIcon />
                  IMPORT CSV
                </button>
            </div>
            </div>

            <ManageTaskStatusTab
              loader={loader}
              title="Partner Type List"
              openEdtMdl={openEdtMdl}
              dataList={dataList}
              disableConfirm={disableConfirm}
              deleteConfirm={deleteConfirm}
            />
          </div>
        </div>
      </div>

      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        {cvg ?
          <Modal.Title> {editMode ? "EDIT" : "ADD"} PARTNER TYPE </Modal.Title>:<Modal.Title> Import CSV</Modal.Title>}
        </Modal.Header>
        {cvg ?
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Partner Type Name</label>
                  <input
                    type="text"
                    placeholder="Enter Partner Type Name"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        name: e.target.value,
                      })
                    }
                    value={
                      userInfo.name ? userInfo.name : ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>:<Modal.Body>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="StatusFile">Select File</label>
                    <input type="file"
                      name="StatusFile"
                      id="StatusFile"
                      onChange={importHandler}
                      className="form-control" />
                  </div>
                </div>
                <div className="demoLink text-end py-2">
                  <a className="text-decoration-underline text-primary" href="/Docs/TaskStatusUpload.csv" download='TaskStatusUpload.csv'>Views Sample File </a>
                </div>
              </div>
            </div>
          </Modal.Body>}

          {cvg ? 
        <Modal.Footer>
          {editMode ? (
            <Button variant="primary" onClick={updatePartnerTypeHandler}>
              UPDATE
            </Button>
          ) : (
            <Button variant="primary" onClick={addPartnerTypeHandler}>
              SUBMIT
            </Button>
          )}
        </Modal.Footer> :<Modal.Footer>
            <button className="btn btn-cancel me-2" onClick={handleClose}>Cancel</button>
            <Button variant="primary" onClick={csvSubmitHandler}>
              SUBMIT
            </Button>
          </Modal.Footer>}
      </Modal>
    </>
  );
};

export default PartnerTypeScreen;
