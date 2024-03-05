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
import ManageTaskStatusTab from "./ManageTaskstatusTab";
import Papa from "papaparse";
import { useSelector } from "react-redux";
const ManageTaskStatusScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [userInfo, setUserInfo] = useState({ task_status_name: "" });
  const [editMode, setEditMode] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [confirmText, setconfirmText] = useState('')
  const [currObj, setcurrObj] = useState({ task_status_id: '', action: '' })
  const [cvg, setCvg] = useState(false);
  const [excelData, setexcelData] = useState([]);

  const handleClose = () => {
    setShow(false);
    setUserInfo({ task_status_name: "" });
  };

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true);
    setCvg(true)
    setUserInfo({
      ...userInfo,
      task_status_name: value[0],
      lead_priority_code: value[1],
      task_status_id: value[3],
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
    setcurrObj({ task_status_id: value, action: 'delete' })
    setdeleteshowConfirm(true)
  }

  const getDataList = async () => {
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
          Baseurl + `/db/subtask/status`,
          header
        );
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
          Baseurl + `/db/subtask/status?st_id=${currObj.task_status_id}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdeleteshowConfirm(false);
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

  const addIndustryHandler = async () => {
    if (userInfo.task_status_name == "") {
      toast.error("Please enter Task Status Name");
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
            Baseurl + `/db/subtask/status`,
            userInfo,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message);
            handleClose();
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
  };

  const updateHandler = async () => {
    if (userInfo.task_status_name == "") {
      toast.error("Please enter Task Status Name");
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
            Baseurl + `/db/subtask/status`,
            userInfo,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message);
            handleClose();
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
          <h3 className="content_head">TASK STATUS MASTER</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Task Status Master
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
                ADD TASK STATUS
              </button>
              <button className="btn btn-primary Add_btn " onClick={Opencsv}>
                  <PlusIcon />
                  IMPORT CSV
                </button>
            </div>
            </div>

            <ManageTaskStatusTab
              title="Task Status List"
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
          <Modal.Title> {editMode ? "EDIT" : "ADD"} STATUS NAME </Modal.Title>:<Modal.Title> Import CSV</Modal.Title>}
        </Modal.Header>
        {cvg ?
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Status Name</label>
                  <input
                    type="text"
                    placeholder="Enter Status Name"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        task_status_name: e.target.value,
                      })
                    }
                    value={
                      userInfo.task_status_name ? userInfo.task_status_name : ""
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
            <Button variant="primary" onClick={updateHandler}>
              UPDATE
            </Button>
          ) : (
            <Button variant="primary" onClick={addIndustryHandler}>
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

export default ManageTaskStatusScreen;
