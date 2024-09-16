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



const PendingApprovalManagementTable = ({
  dataList,
  disableConfirm,
  openEdtMdl,
  title,
  loader
}) => {
  const [show,setShow] =useState(false)
  const [payload,setPayload] =useState({
    id: null,
    status:"",
    reject_reason:""
  })
  const handleClose =()=>{
      setPayload({
        id: null,
        status:"",
        reject_reason:""
      })
      setShow(false)
  }

  const accept_rejectHandler=(id,status)=>{
    setPayload({...payload,id:id,status:status})
      if(status===true){
        accept_rejectDistributor({id,status,reject_reason:""})
      }
      else{
        setShow(true)
      }
  }

  const accept_rejectDistributor=async(payload)=>{
    if(payload?.status==false && payload?.reject_reason==""){
      return toast?.error("Please Enter Reject Reason")
    }
    console.log(payload)
    handleClose()
  }

  const columns = [
    {
      name: "call_lead_id",
      label: "id",
      options: {
        display:false,
        filter:false,
        download:false,
        viewColumns:false,
      },
    }, 
    {
      name: "call_subject",
      label: "Event Name",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Link href={`/dms/PendingApprovalInfo?id=${tableMeta?.rowData[0]}&vw=md`}>{value}</Link>
          );
        }
      },
    },
   {
      name: "event_status",
      label: "Event Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value}</>
          );
        }
      },
    },
    {
      name: "call_lead_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <button
                onClick={() => accept_rejectHandler(value,true)}
                className="action_btn"
                title="Accept" >
                <AcceptIcon />
              </button>
              <button
                onClick={() =>{ 
                  accept_rejectHandler(value,false)
                }}
                className="action_btn"
                title="Reject" >
                <RejectIcon />
              </button>
            </div>
          );
        },
      },
    },
    
  ];
  const options = {
    selectableRows: 'none',
    responsive: "standard",
    downloadOptions:{filename:"EventsList.csv"}
  };

  const mappedDataList=[{
    call_subject:"Triple H",
    event_status:"pending",
    call_lead_id:1,
  }]
  
 
  return (
    <>
    {
      loader ?<><Loader/></> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={mappedDataList}
          // data={dataList}
          columns={columns}
          options={options}
        />
      </div>
      )
    }
      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Reject Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <textarea
          id="rejectReason"
          className="form-control"
          rows="4"
          value={payload?.reject_reason}
          onChange={(e) => {
            const value = e.target.value
              .replace(/<script[^>]*?>.*?<\/script>/gi, "") // Removes script tags
              .replace(/[^a-zA-Z0-9\s]/g, ""); // Removes special characters
            setPayload({ ...payload, reject_reason: value });
          }}
          placeholder="Enter your reason here..."
          required
        />

        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
              Cancel
            </Button>
        <Button variant="primary" onClick={()=>{
          accept_rejectDistributor(payload)
        }}>
              Reject
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PendingApprovalManagementTable