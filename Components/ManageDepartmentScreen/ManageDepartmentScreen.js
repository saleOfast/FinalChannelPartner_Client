import React, { useState, useEffect } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
import Papa from "papaparse";
const DynamicTable = dynamic(
  () => import('./ManageDepartmentTable'),
  { ssr: false }
)

const ManageDepartmentScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [userInfo, setUserInfo] = useState({ department_name: "" });
  const [editMode, setEditMode] = useState(false);
  const [cvg, setCvg] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState({ dep_id: "", action: "" });
  const [confirmText, setconfirmText] = useState("");
  const [excelData, setexcelData] = useState([]);

  const handleClose = () => {
    setShow(false);
    setUserInfo({ department_name: "" });
    setexcelData([])
  };

  const handleShow = () => setShow(true);


  const getDataList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 90
        },
      };

      try {
        const response = await axios.get(Baseurl + `/db/department`, header);
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

  function disableConfirm(value, type) {
    if (type == 1) {
      setconfirmText("enable");
    } else {
      setconfirmText("Disable");
    }
    setcurrObj({ dep_id: value, action: type });
    setdisableShowConfirm(true);
  }

  function deleteConfirm(value) {
    setcurrObj({ dep_id: value, action: "delete" });
    setdeleteshowConfirm(true);
  }
  function deleteConfirm(value) {
    setcurrObj(value);
    setdeleteshowConfirm(true);
  }

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
                const response = await axios.post(Baseurl + `/db/department/bulk`, excelData, header);
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

  async function disableHandler() {
    const reqInfo = {
      dep_id: currObj.dep_id,
      status: currObj.action == 1 ? true : false,
    };
    setdisableShowConfirm(false);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 92
        },
      };

      try {
        const response = await axios.put(
          Baseurl + `/db/department`,
          reqInfo,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdisableShowConfirm(false);
          setcurrObj("");
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
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 93
        },
      };

      try {
        const response = await axios.delete(
          Baseurl + `/db/department?dep_id=${currObj}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdeleteshowConfirm(false);
          setcurrObj("");
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

  const openEdtMdl = (value) => {
    setEditMode(true);
    setCvg(true)
    setUserInfo({
      ...userInfo,
      department_name: value[0],
      department_code: value[1],
      dep_id: value[3],
    });
    handleShow();
  };

  useEffect(() => {
    getDataList();
  }, []);

  const addDepartmentHandler = async () => {
    if (userInfo.department_name == "") {
      toast.error("Please enter the Department Name");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 90
          },
        };

        try {
          const response = await axios.post(
            Baseurl + `/db/department`,
            userInfo,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success("Department Created Successfully");
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
  };

  const updateHandler = async () => {
    if (userInfo.department_name == "") {
      toast.error("Please enter the Department Name");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 92
          },
        };

        try {
          const response = await axios.put(
            Baseurl + `/db/department`,
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
          }
          else {
            toast.error('Something went wrong!')
          }
        }
      }
    }
  };

  return (
    <>
      <ConfirmBox
        showConfirm={disableShowConfirm}
        setshowConfirm={setdisableShowConfirm}
        actionType={disableHandler}
        title={`Are You Sure you want to ${confirmText} ?`}
      />

      <ConfirmBox
        showConfirm={deleteshowConfirm}
        setshowConfirm={setdeleteshowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"}
      />

      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">DEPARTMENT MASTER</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Department Master
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <div className="d-flex">
                <button
                  className="btn btn-primary Add_btn me-4"
                  onClick={OpenAddModal}
                >
                  <PlusIcon />
                  ADD DEPARTMENT
                </button>
                <button className="btn btn-primary Add_btn" onClick={Opencsv}>
                  <PlusIcon />
                  IMPORT CSV
                </button>
              </div>
            </div>
            <DynamicTable
              title="Department List"
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
            <Modal.Title> {editMode ? "EDIT" : " ADD"} DEPARTMENT </Modal.Title> :
            <Modal.Title> Import CSV</Modal.Title>
          }
        </Modal.Header>
        {cvg ?
          <Modal.Body>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="email">Department Name</label>
                    <input
                      type="text"
                      placeholder="Enter Department Name"
                      name="email"
                      id="email"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          department_name: e.target.value,
                        })
                      }
                      value={
                        userInfo.department_name ? userInfo.department_name : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body> : <Modal.Body>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="DepartmentFile">Select File</label>
                    <input type="file"
                      name="DepartmentFile"
                      id="DepartmentFile"
                      onChange={importHandler}
                      className="form-control" />
                  </div>
                </div>
                <div className="demoLink text-end py-2">
                  <a className="text-decoration-underline text-primary" href="/Docs/DepartmentUpload.csv" download='Department-Sample-File.csv'>Views Sample File </a>
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
              <Button variant="primary" onClick={addDepartmentHandler}>
                SUBMIT
              </Button>
            )}
          </Modal.Footer> : <Modal.Footer>
            <button className="btn btn-cancel me-2" onClick={handleClose}>Cancel</button>
            <Button variant="primary" onClick={csvSubmitHandler}>
              SUBMIT
            </Button>
          </Modal.Footer>}
      </Modal>
    </>
  );
};

export default ManageDepartmentScreen;




