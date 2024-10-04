import React, { useState } from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../../Svg/ViewIcon';
import DisableIcon from '../../Svg/DisableIcon';
import EditIcon from '../../Svg/EditIcon';
import Link from "next/link";
import moment from 'moment';
import DeleteIcon from '../../Svg/DeleteIcon';
import Loader from '../../Loader/Loader';
import AcceptIcon from '../../Svg/AcceptIcon';
import RejectIcon from '../../Svg/RejectIcon';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import { getCookie, hasCookie } from 'cookies-next';
import axios from 'axios';



const PendingApprovalManagementTable = ({
  dataList,
  disableConfirm,
  openEdtMdl,
  title,
  loader,
  getDataList
}) => {
  const [actionMode, setActionMode] =  useState('')
  const [showModalSingle, setShowModalSingle] =  useState(false)
  const [userInfo, setUserInfo ] =  useState({
    user_code: '',
    reject_reason: ''
  })
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

  const updateUserhandler = async () => {

    if (!hasCookie("token")) return;
    if (actionMode !== 'Accept' && userInfo.reject_reason === "") {
      return toast.error("Please enter a reason",{autoClose:2500});
    }
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db:db_name,
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
          isDMS:userInfo?.reject_reason ? false : true
        },
        header
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message,{autoClose:2500});
        getDataList()
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message,{autoClose:2500});
      } else {
        toast.error("Something went wrong!",{autoClose:2500});
      }
    }
  };

  const columns = [
    {
      name: "user_id",
      label: "Id",
      options:{
        display:false,
        filter:false,
        viewColumns:false,
      }
    },
    {
      name: "user",
      label: "Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="fw-bold text-decoration-underline"
          style={{color: '#293790'}}
          href={`/dms/PendingApprovalInfo?id=${tableMeta.rowData[0]}&mode=view`}
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
          <th >
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
      label: "Address Proof",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/address_proof/images${value?.address_proof}`}
          >
            {value?.address_proof ? 'Address Proof': ''}  
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "GST REG.",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/gst_registration/images${value?.gst_registration}`}
          >
            {value?.address_proof ? 'GST REG.': ''}
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "Incorporation Cert.",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/incorporation_certificate/images${value?.incorporation_certificate}`}
          >
            {value?.address_proof ? 'Incorporation Cert.': ''}
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "Business PAN",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th >
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
            {value?.address_proof ? 'Business PAN': ''}
            
        </Link>
          )
        },
      },
    },
    {
      name: "db_user_profile",
      label: "Banking Details",
      options: {
        download:false,
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <Link
          className="text-decoration-underline"
          style={{color: '#293790'}}
          target="_blank"
          href={`${filesUrl}/banking_details/images${value?.banking_details}`}
          >
            {value?.address_proof ? 'Banking Details': ''}
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
          <th  >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className={`status_box ${channelUserStatusColor(value)} `}>
            {channelUserStatus(value)}
            </div>;
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
          <th>
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
              <>
              {/* {tableMeta?.rowData[7]===0 && (
                <button  onClick={()=>{
                  let user=dataList?.find((user)=>(user?.user_code==value))
                  resendEmail(user?.user_id,user?.email)
                  }} style={{backgroundColor:"green"}} className="btn text-white rounded-5" >
                Resend
              </button>
              )} */}
              {tableMeta?.rowData[8]===1 ?
              <>  
              <div className="table_btns d-flex align-items-center justify-content-start gap-3">
              <button  onClick={()=>{setActionMode('Accept'); setShowModalSingle(true);  setUserInfo({
                ...userInfo, user_code: value
              })}}  className="btn btn-warning text-white rounded-5" >
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
  const options = {
    selectableRows: 'none',
    responsive: "standard",
    downloadOptions:{filename:"EventsList.csv"},
    enableNestedDataAccess:"."
  };
  
 
  return (
    <>
    {
      loader ?<><Loader/></> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={dataList}
          columns={columns}
          options={options}
        />
      </div>
      )
    }
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

export default PendingApprovalManagementTable