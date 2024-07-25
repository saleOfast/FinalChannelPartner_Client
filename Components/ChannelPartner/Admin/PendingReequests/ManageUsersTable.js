import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import Link from "next/link";
import { Baseurl, filesUrl } from "../../../../Utils/Constants";
import { Button, Modal } from "react-bootstrap";
import { getCookie, hasCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../../Loader/Loader";

const ManageUsersTable = ({
  deleteConfirm,
  disableConfirm,
  dataList,
  openEdtMdl,
  title,
  getDataList,
  loader
}) => {

  const [userData, setUserData] =  useState([])
  const [actionMode, setActionMode] =  useState('')
  const [showModal, setShowModal] =  useState(false)
  const [showModalSingle, setShowModalSingle] =  useState(false)
  const[id,setId]=useState("")
  const [userInfo, setUserInfo ] =  useState({
    user_code: '',
    reject_reason: ''
  })
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#61E25E"


  const channelUserStatus = (key) => {
    switch (key) {
      case 0:
        return <span>Pending</span>;
        break;
      case 1:
        return <span>Under Process</span>;
        break;
      case 3:
        return <span>Rejected</span>;
        break;
      default:
        return <span>Completed</span>;
        break;
    }
  };

  const channelUserStatusColor = (key) => {
    switch (key) {
      case 0:
        return 'text-primary';
        break;
      case 1:
        return 'text-warning';
        break;
      case 3:
        return 'text-danger';
        break;
      default:
        return 'text-success';
        break;
    }
  };

  const resendEmail =  async(id,email) => {

    
      if (!hasCookie("token")) return;
      const token = getCookie("token");
      const db_name = getCookie("db_name");
      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          m_id: 79,
        },
      };

      
      try {
        const response = await axios.post(`${Baseurl}/db/users/resendEmailToPendingUser`,{
          email:email,
          user_id:id
        }, header);
        if (response.status === 200 || response.status === 201) {
          toast.success(response?.data?.message);
          getDataList()
        }
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.status === 422) {
              toast.error(error?.response?.data?.message)  
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
  };



  const columns = [
    {
      name: "user_code",
      label: "Account Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "user",
      label: "Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="fw-bold text-decoration-underline"
          style={{color: '#293790'}}
          href={`/partner/PendingRequestsDetail?id=${tableMeta.rowData[0]}&mode=view`}
          >
            {value}
        </Link>
          )
        }
      },
    },
    {
      name: "createdAt",
      label: "Request Date",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px'  }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className=""
          style={{color: '#667799'}}
          >
            {value?.split('T')[0]?.split('-')?.reverse()?.join('/')}
        </span>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "Aadhar",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/adh/images${value?.aadhar_file}`}
          >
            {value?.aadhar_file ? 'Aadhar': ''}
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "PAN",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/pan/images${value?.pan_file}`}
          >
            {value?.pan_file ? 'PAN': ''}
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "Rera License",
      options: {
        filter: false,
        download:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/rera/images${value?.rera_file}`}
          >
            {value?.rera_file ? 'Rera': ''}
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "Cancelled Cheque",
      options: {
        filter: false,
        download:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/cheque/images${value?.c_cheque_file}`}
          >
            {value?.c_cheque_file ? 'Cancelled Cheque': ''}
            
        </Link>
          )
        },
      },
    },

    {
      name: "doc_verification",
      label: "Status",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px' }} >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className={`status_box ${channelUserStatusColor(value)} `}>{channelUserStatus(value)}</div>;
        },
      },
    },
    {
      name: "user_code",
      label: "Action",
      options: {
        filter: false,
        download:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th
            style={{ background:`${clientBtnColor}`, color: "white",  paddingLeft: '65px' }}
            
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
              <>
              {tableMeta?.rowData[7]===0 && (
                <button  onClick={()=>{
                  let user=dataList?.find((user)=>(user?.user_code==value))
                  resendEmail(user?.user_id,user?.email)
                  }} style={{backgroundColor:"green"}} className="btn text-white rounded-5" >
                Resend
              </button>
              )}
              {tableMeta?.rowData[7]===1 ?
              <>  
              <div className="table_btns d-flex align-items-center justify-content-start gap-3">
              <button  onClick={()=>{setActionMode('Accept'); setShowModalSingle(true);  setUserInfo({
                ...userInfo, user_code: value
              })}} style={{backgroundColor: clientBtnColor}} className="btn text-white rounded-5" >
                Accept
              </button>
  
              <button onClick={()=>{setActionMode('Reject'); setShowModalSingle(true); setUserInfo({
                ...userInfo, user_code: value
              })}} className=" btn btn-danger rounded-5">
                Reject
              </button>
          </div>
              </>
              
            :
            <div className="text-center"></div> }
           
              </>
          );
        },
      },
    },
  ];

  const handleRowClick = (rowData, rowMeta) => {
    const data = rowMeta?.reduce((accu, value) => {
        accu.push(dataList[value.dataIndex].user_code);
        return accu; // Return the accumulator
    }, []);
    setUserData([...data]);
};


  const options = {
    selectableRows: 'multiple',
    responsive: "simple",
    onRowSelectionChange : handleRowClick,
    downloadOptions:{filename:"PendingRequestList"}
  };

  const updateUserhandler = async () => {

    if (!hasCookie("token")) return;
    if (actionMode !== 'Accept' && userInfo.reject_reason === "") {
      return toast.error("Please enter a reason");
    }
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        pass: "pass",
      },
    };

    try {
      const response = await axios.put(
        `${Baseurl}/db/users`,
        {
          doc_verification: actionMode === 'Accept' ? 2 : 3,
          reject_reason: userInfo?.reject_reason,
          user_code: userInfo?.user_code,
          isCHANNEL:userInfo?.reject_reason ? false : true
        },
        header
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message);
        getDataList()
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const updateBunchUserhandler = async () => {

    let toastShown=false;
    for(const element of userData){

      if (!hasCookie("token")) return;
      if (actionMode !== 'Accept' && userInfo.reject_reason === "") {
        return toast.error("Please enter a reason");
      }
      const token = getCookie("token");
      const db_name = getCookie("db_name");
      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          pass: "pass",
        },
      };

    try {
      const response = await axios.put(
        `${Baseurl}/db/users`,
        {
          doc_verification: actionMode === 'Accept' ? 2 : 3,
          reject_reason: userInfo.reject_reason,
          user_code: element,
          isCHANNEL:userInfo?.reject_reason ? false : true
        },
        header
      );
      if (response.status === 200 || response.status === 201) {
        if (!toastShown) {
          toast.success(response.data.message);
          toastShown = true;
        }
        getDataList()
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        if(!toastShown){
          toast.error(error.response.data.message);
          toastShown=true
        }
      } else {
        if(!toastShown){
          toast.error("Something went wrong!");
          toastShown=true
        }
      }
    }
    }
    setUserData([])
  };



  return (
    <>
    {
      loader ?  <div className="miuiTable channelTable"><Loader/></div>
      :
      (
        <div className="miuiTable channelTable">
        <MUIDataTable
          title={<span style={{ color: "black", fontWeight:"bold", fontSize:"17px" }}>{title}</span>}
          data={dataList}
          columns={columns}
          options={options}
        />
        <div>
          {userData.length ?
          <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">
              
              

              <button onClick={()=>{setActionMode('Reject'); setShowModal(true)}} className=" btn btn-danger rounded-5">
                Reject
              </button>

              <button onClick={()=>{setActionMode('Accept'); setShowModal(true)}} style={{backgroundColor: clientBtnColor}} className="btn  rounded-5 text-white" >
                Accept
              </button>
            
          </div>
          : <></>
        }
        </div>
      </div>
      )
    }
      

      <Modal
        className="commonModal"
        show={showModal}
        // onHide={handleClose}
      >
       
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box text-center">
                  <label htmlFor="email">
                    Are you sure you want to {actionMode} this request?
                  </label>
                  {actionMode !== 'Accept' ?
                  <input
                    type="text"
                    placeholder="Enter Reason"
                    className="form-control"
                    onChange={(e) => {
                      setUserInfo({
                        ...userInfo, reject_reason: e.target.value
                      })
                    }}
                    value={userInfo.reject_reason}
                  />
                  : <> </>
                }
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
              
          <Button
            variant="primary"
            type="button"
            className="rounded-5"
            onClick={() => {

              updateBunchUserhandler();
              setActionMode("");
              setShowModal(false)
            }}
          >
            Yes
          </Button>

          <Button
            variant="secondary"
            type="button"
            className="rounded-5 "
            onClick={() => {
              setActionMode("");
              setShowModal(false)
              setUserInfo({
                ...userInfo,
                reject_reason: "",
              });
            }}
          >
            No
          </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      
      </Modal>
      <Modal
        className="commonModal"
        show={showModalSingle}
        // onHide={handleClose}
      >
       
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box text-center">
                  <label htmlFor="email">
                    Are you sure you want to {actionMode} this request?
                  </label>
                  {actionMode !== 'Accept' ?
                  <input
                    type="text"
                    placeholder="Enter Reason"
                    className="form-control"
                    onChange={(e) => {
                      setUserInfo({
                        ...userInfo, reject_reason: e.target.value
                      })
                    }}
                    value={userInfo.reject_reason}
                  />
                  : <> </>
                }
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
              
          <Button
            variant="primary"
            type="button"
            className="rounded-5"
            onClick={() => {
              
              updateUserhandler();
              setActionMode("");
              setShowModalSingle(false)
            }}
          >
            Yes
          </Button>

          <Button
            variant="secondary"
            type="button"
            className="rounded-5 "
            onClick={() => {
              setActionMode("");
              setShowModalSingle(false)
              setUserInfo({
                ...userInfo,
                reject_reason: "",
              });
            }}
          >
            No
          </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      
      </Modal>
    </>
  );
};

export default ManageUsersTable;
