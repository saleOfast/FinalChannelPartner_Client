import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from 'axios'
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DownloadIcon from "../Svg/DownloadIcon";
const DynamicTable = dynamic(
  () => import('./ManageLeadTable'),
  { ssr: false }
)

const ManageLeadScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [dataList, setDataList] = useState([]);
  const [show, setShow] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [accountsList, setAccountsList] = useState([]);
  const [ContactList, setContactList] = useState([]);
  const [oppurtunityList, setOppurtunityList] = useState([]);

  const handleClose = () => {
    setUserInfo({});
    setShow(false);
  };

  const reqObj = {}

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
          m_id: 4,
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

  const getAccountsList = async () => {

    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: 'pass'
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

  const getSingleData = async (id) => {
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
        const response = await axios.get(
          Baseurl + `/db/leads?l_id=${id}`,
          header
        );
        setUserInfo(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getContactList = async () => {

    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: 'pass'
        }
      }
      try {
        const response = await axios.get(Baseurl + `/db/contacts`, header);
        setContactList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getOppurtunityList = async () => {
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
        const response = await axios.get(Baseurl + `/db/opportunity`, header);
        setOppurtunityList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const ConvertedLead = async () => {

    if (userInfo.acc_name == "" || userInfo.acc_name == undefined && userInfo.acc_id == 0 || userInfo.acc_id == null) {
      return toast.error('please select account name')
    }
    if ((userInfo.first_name == "" || userInfo.first_name == undefined) && (userInfo.contact_id == 0 || userInfo.contact_id == null)) {
      return toast.error('please select contact name')
    }
    if ((userInfo.opp_name == "" || userInfo.opp_name == undefined) && (userInfo.opp_id == 0 || userInfo.opp_id == null)) {
      return toast.error('please select opportunity name')
    }

    if (userInfo.acc_id == 0) {
      await AccountHandlers();
    }

    if (userInfo.contact_id == 0) {
      await ContactHandler();
    }

    if (userInfo.opp_id == 0) {
      await OpportunityHandler();
    }

    const data = { ...userInfo, lead_status_id: "4" }

    if (userInfo.acc_id && userInfo.contact_id && userInfo.opp_id) {
      submitHandler(data);
    }
  }

  const submitHandler = async (object) => {

    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 3,
        },

      };

      let userInfoBody = { ...object }

      if (reqObj.acc_id) {
        userInfoBody.acc_id = reqObj.acc_id
      }

      if (reqObj.contact_id) {
        userInfoBody.contact_id = reqObj.contact_id
      }

      if (reqObj.opp_id) {
        userInfoBody.opp_id = reqObj.opp_id
      }

      try {
        const response = await axios.put(
          Baseurl + `/db/leads`,
          userInfoBody,
          header
        );

        if (response.status === 200 || response.status === 204) {
          toast.success(response.data.message);
          reqObj.acc_id = null;
          reqObj.opp_id = null;
          reqObj.contact_id = null;
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

  };

  const AccountHandlers = async () => {
    if (userInfo.acc_name == "" || userInfo.acc_name == undefined) {
      if (userInfo.acc_id !== undefined && userInfo.acc_id !== null && userInfo.acc_id !== 0) {
        return toast.error("Account is not selected");
      }
      return toast.error("Please enter the Account Name");
    }
    else {
      if (hasCookie('token') && userInfo.acc_name !== "") {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            pass: 'pass'
          }
        }

        try {
          const response = await axios.post(Baseurl + `/db/account`, {
            acc_name: userInfo.acc_name,
          }, header);
          if (response.status === 204 || response.status === 200) {
            reqObj.acc_id = response.data.data.acc_id;
            setUserInfo({ ...userInfo, acc_id: response.data.data.acc_id, acc_name: "" })
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  const ContactHandler = async () => {
    if (userInfo.first_name == '' || userInfo.first_name == undefined) {
      if (userInfo.contact_id !== undefined && userInfo.contact_id !== null && userInfo.contact_id !== 0) {
        return
      }
      toast.error('please enter the first name')
      return
    }
    else {
      if (hasCookie("token") && userInfo.first_name !== '') {
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
          const response = await axios.post(Baseurl + `/db/contacts`, { first_name: userInfo.first_name }, header);
          if (response.status === 204 || response.status === 200) {
            console.log(response, 'contact response');
            reqObj.contact_id = response.data.data.contact_id;
            setUserInfo({ ...userInfo, contact_id: response.data.data.contact_id, first_name: "" })
          }
        } catch (error) {

        }
      }
    }

  }

  const OpportunityHandler = async () => {
    if (userInfo.opp_name === '' || userInfo.opp_name == undefined) {
      if (userInfo.opp_id !== undefined && userInfo.opp_id !== null && userInfo.opp_id !== 0) {
        return
      }
      toast.error('please enter the opportunity name')
    }

    else {
      if (hasCookie("token") && userInfo.opp_name !== "") {
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
          const response = await axios.post(Baseurl + `/db/opportunity`, { opp_name: userInfo.opp_name }, header);
          if (response.status === 204 || response.status === 200) {
            reqObj.opp_id = response.data.data.opp_id;
            setUserInfo({ ...userInfo, opp_id: response.data.data.opp_id, opp_name: "" })
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  function openCloseConvert(value) {
    handleShow();
    getSingleData(value);
  }

  function disableConfirm(value) {
    setcurrObj(value);
    setdisableShowConfirm(true);
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
          m_id: 6
        },
      };

      try {
        const response = await axios.delete(Baseurl + `/db/leads?l_id=${currObj}`, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdisableShowConfirm(false);
          setcurrObj('');
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

      axios.get(Baseurl + `/db/leads/download`, header)
        .then(response => {
          const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
          const fileUrl = URL.createObjectURL(file);
          // programmatically create and trigger the download link
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.setAttribute('download', 'Leads.xlsx'); // specify the file name
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }).catch(error => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    getDataList();
    getAccountsList();
    getContactList();
    getOppurtunityList();
  }, []);
  return (
    <>
      <ConfirmBox
        showConfirm={disableShowConfirm}
        setshowConfirm={setdisableShowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"} />
      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">Leads</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Leads
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <div className="d-flex">
                <Link href="/AddLeads">
                  <button className="btn btn-primary Add_btn me-3">
                    <PlusIcon />
                    ADD LEADS
                  </button>
                </Link>
                <button className="btn btn-primary Add_btn " onClick={handleDownload}>
                  <DownloadIcon />
                  EXPORT
                </button>
              </div>
            </div>
            <DynamicTable
              title="Leads List"
              dataList={dataList}
              disableConfirm={disableConfirm}
              openCloseConvert={openCloseConvert}
            />
          </div>
        </div>
      </div>
      <Modal className="commonModal" show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title> converted Lead </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="loss_reson">Account</label>
                  <select
                    className="form-control"
                    name="Account" id="Account"
                    onChange={(e) => setUserInfo({ ...userInfo, acc_id: e.target.value })}
                    value={userInfo.acc_id ? userInfo.acc_id : ""} >
                    <option value={null}>Select Account</option>
                    <option value='0' >
                      Create New Account
                    </option>
                    {accountsList?.map((data, index) => {
                      return <option key={index} value={data.acc_id}>{data.acc_name}</option>
                    })}
                  </select>
                </div>
              </div>
              {userInfo.acc_id == 0 ?
                <>
                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">

                      <label htmlFor="loss_reson">Account Name</label>

                      <input
                        type="text"
                        placeholder="Account Name"
                        name="account name"
                        id="account name"
                        className="form-control"
                        onChange={(e) => setUserInfo({ ...userInfo, acc_name: e.target.value })}
                      />
                    </div>
                  </div>

                </> : null}

              <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="loss_reson">Contact</label>
                  <select
                    className="form-control"
                    name="Account" id="Account"
                    onChange={(e) => setUserInfo({ ...userInfo, contact_id: e.target.value })}
                    value={userInfo.contact_id ? userInfo.contact_id : ""}
                  >
                    <option value={null}>Select Contact</option>
                    <option value='0' >
                      Create New Contact
                    </option>
                    {ContactList?.map((data, index) => {
                      return <option key={index} value={data.contact_id}>{data.first_name}</option>
                    })}
                  </select>
                </div>
              </div>
              {userInfo.contact_id == 0 ?
                <>
                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="loss_reson">Contact Name</label>
                      <input
                        type="text"
                        placeholder="Account Name"
                        name="account name"
                        id="account name"
                        className="form-control"
                        onChange={(e) => setUserInfo({ ...userInfo, first_name: e.target.value })}

                      />
                    </div>
                  </div>
                </> : null}

              <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="loss_reson">Opportunity</label>
                  <select
                    className="form-control"
                    name="Account" id="Account"
                    onChange={(e) => setUserInfo({ ...userInfo, opp_id: e.target.value })}
                    value={userInfo.opp_id ? userInfo.opp_id : ""}
                  >
                    <option value={null}>Select Opportunity</option>
                    <option value='0' >
                      Create New Opportunity
                    </option>
                    {oppurtunityList?.map((data, i) => {
                      return <option key={i} value={data.opp_id}>{data.opp_name}</option>
                    })}
                  </select>
                </div>
              </div>
              {userInfo.opp_id == 0 ?
                <>
                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">

                      <label htmlFor="loss_reson">Opportunity Name</label>

                      <input
                        type="text"
                        placeholder="Opportunity Name"
                        name="opportunity name"
                        id="opportunity name"
                        className="form-control"
                        onChange={(e) => setUserInfo({ ...userInfo, opp_name: e.target.value })}
                      />
                    </div>
                  </div>
                </> : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="cancel" onClick={handleClose} >
            Cancel
          </Button>
          <Button variant="primary" onClick={ConvertedLead} >
            SUBMIT
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageLeadScreen;
