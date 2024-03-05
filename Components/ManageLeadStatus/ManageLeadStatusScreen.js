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
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./ManageLeadStatusTab'),
    { ssr: false }
)

const ManageLeadStatusScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [userInfo, setUserInfo] = useState({ status_name: "" });
  const [editMode, setEditMode] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState({ lead_status_id: "", action: "" });
    const [confirmText, setconfirmText] = useState("");


  const handleClose = () => {
    setShow(false);
    setUserInfo({ status_name: "" });
  };

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true);
    setUserInfo({
      ...userInfo,
      status_name: value[0],
      lead_status_code: value[1],
      lead_status_id: value[3],
    });
    handleShow();
  };

  function OpenAddModal() {
    setEditMode(false);
    handleShow();
  }

  function disableConfirm(value, type) {
    if (type == 1) {
        setconfirmText("enable");
    } else {
        setconfirmText("Disable");
    }
    setcurrObj({ lead_status_id: value, action: type });
    setdisableShowConfirm(true);
}

  function deleteConfirm(value) {
    setcurrObj(value);
    setdeleteshowConfirm(true);
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
          m_id:126
        },
      };

      try {
        const response = await axios.get(Baseurl + `/db/leadstatus`, header);
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
    const reqInfo = {
      lead_status_id: currObj.lead_status_id,
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
          m_id:129
        },
      };

      try {
        const response = await axios.put(
          Baseurl + `/db/leadstatus`,
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
          m_id:130
        },
      };

      try {
        const response = await axios.delete(
          Baseurl + `/db/leadstatus?st_id=${currObj}`,
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
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  }

  const addIndustryHandler = async () => {
    if (userInfo.status_name == "") {
      toast.error("Please enter the statusName");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id:127
          },
        };

        try {
          const response = await axios.post(
            Baseurl + `/db/leadstatus`,
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
    if (userInfo.status_name == "") {
      toast.error("Please enter the Rating");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id:129
          },
        };

        try {
          const response = await axios.put(
            Baseurl + `/db/leadstatus`,
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
          <h3 className="content_head">LEAD STATUS MASTER</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Lead Status Master
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <button
                className="btn btn-primary Add_btn"
                onClick={OpenAddModal}
              >
                <PlusIcon />
                ADD LEAD STATUS
              </button>
            </div>
            <DynamicTable
              title="Lead Status List"
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
          <Modal.Title> {editMode ? "EDIT" : " ADD"} LEAD STATUS </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Status Name</label>
                  <input
                    type="text"
                    placeholder="Enter Status  Name"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, status_name: e.target.value })
                    }
                    value={userInfo.status_name ? userInfo.status_name : ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
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
        </Modal.Footer>


      </Modal>
    </>
  );
};

export default ManageLeadStatusScreen;
