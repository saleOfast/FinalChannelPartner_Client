import React, { useState } from 'react'
import MUIDataTable from "mui-datatables";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { Baseurl } from '../../../../Utils/Constants';
import { getCookie, hasCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import PlusIcon from '../../../Svg/PlusIcon';
import DateRange from '../../../DateRangeCustom/Daterange';





const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, setShowAssignTo, oldAssignTo,setoldAssignTo, setShowDateFilter,usersList,getVisitList }) => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [userData, setUserData] =  useState([])
    const [actionMode, setActionMode] =  useState('')
    const [showModal, setShowModal] =  useState(false)
    const [userInfo, setUserInfo ] =  useState({
    user_code: '',
    reject_reason: ''
  })


  const [value, setValue] = useState({

    startDate: new Date(),
    endDate: new Date().setMonth(11)

  });
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
  
  function formatTime(timeString) {
    const timeParts = (timeString || '').split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
  
    const date = new Date(2000, 0, 1, hours, minutes);
  
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  
  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

    const columns = [
      {
        name: 'visit_id',
        label: "Visit ID",
        options: {
          display:false,
            filter: false,
            download:false,
            viewColumns:false,
            customHeadRender: (columnMeta, updateDirection) => (
                <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <div  className='status_box fw-bold' style={{color:"#293790"}} >
                        {value}
                    </div>
                )
            }
              
        }
    },
        {
            name: 'visit_code',
            label: "Visit ID",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div  className='status_box fw-bold' style={{color:"#293790"}} >
                            {value}
                        </div>
                    )
                }
                  
            }
        },
        {
            name: 'leadDataName',
            label: "Lead Name",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link href={`/CHANNEL/VisitDetails?id=${tableMeta?.rowData[0]}`}  className='status_box fw-bold text-decoration-underline' style={{color:"#293790"}}>
                            {/* {value.lead_name} */}
                            {value}
                        </Link>
                    )
                }
            },

        },
        {
            name: 'leadDataEmail',
            label: "Email",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    
                    return (
                        <div className='status_box fw-bold' style={{color:"#293790"}}>
                            {/* {value.email_id} */}
                            {value}
                        </div>
                    )
                }
                
            }
        },
        {
            name: 'leadDataContact',
            label: "Contact No.",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            {/* +91-{value.p_contact_no} */}
                            +91-{value}
                        </div>
                    )
                }
            }
        },
        {
            name: 'leadDataProject',
            label: "Project",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            {/* {value?.projectData?.project} */}
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            name: 'p_visit_date',
            label: "Visit Date",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            {formatDate(value)}
                        </div>
                    )
                }
            }
        },
        {
            name: 'p_visit_time',
            label: "Visit Time",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div
                        style={{background:"violet", color:"white",padding:"6px", borderRadius:"20px",border:"white", width:"fit-content"}}
                        className='pe-3 ps-3 cursor-pointer'
                        title='Visit Time'>
                            {formatTime(value)}
                    </div>
                    )
                }
            }
        },
        {
            name: 'status',
            label: "Visit Status",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="">
                            <div
                                style={{padding:"6px", color:"white", borderRadius:"20px",border:"white"}}
                                className='pe-3 ps-3 btn-warning btn '
                                title='Visit Status'>
                                   {value}
                            </div>
                          
                        </div>
                    )
                }
            }
        },
    ];

    
  
    const CustomToolbar = () => {
        return (
            <div className=' d-flex justify-content-start gap-3 align-items-center '>
                <p className='fw-bold ' style={{fontSize:"18px"}} >{title}</p>
                <DateRange value={value} setValue={setValue} getData={getVisitList} />
                {/* <button className='btn' style={{background:`${clientBtnColor}`, color:"white"}} onClick={()=>setShowDateFilter(true)}> Custom </button> */}
            </div>
        );
    }

    const handleRowClick = (rowData, rowMeta) => {
        const data = rowMeta?.reduce((accu, value) => {
            accu.push(dataList[value.dataIndex].user_code);
            return accu; // Return the accumulator
        }, []);
        setUserData([...data]);
    };

    const options = {
        selectableRows: 'multiple',
        responsive: "standard",
        onRowSelectionChange : handleRowClick,
    };

    const mappedDataList=dataList?.map(list=>({
      visit_id:list?.visit_id,
      visit_code:list?.visit_code,
      leadDataName:list?.leadData?.lead_name,
      leadDataEmail:list?.leadData?.email_id,
      leadDataContact:list?.leadData?.p_contact_no,
      leadDataProject:list?.leadData?.projectData?.project,
      p_visit_date:list?.p_visit_date,
      p_visit_time:list?.p_visit_time,
      status:list?.status
    }))
      
 
    return (
        <>
            <div className="miuiTable channelTable">
                <MUIDataTable
                    title={<CustomToolbar/>}
                    data={mappedDataList}
                    // data={dataList}
                    columns={columns}
                    options={options}

                />
                <div>
          {userData.length ?
          <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">
              

              <button onClick={()=>{setActionMode('Cancel'); setShowModal(false);setUserData([])}} className=" btn btn-danger rounded-5">
                Cancel
              </button>
              <button onClick={()=>{setActionMode('Assignto'); setShowModal(true)}} style={{backgroundColor: '#293790'}} className="btn  rounded-5 text-white" >
                Assign to
              </button>
            
          </div>
          : <></>
        }
        </div>
            </div>
        
            <Modal className="commonModal"  show={showModal}   onHide={()=>{setShowModal(false)}} size="lg">
                
                <Modal.Body>
                <section className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill" style={{padding: '0 16px'}}>
  <div className="container">
    <div className="row">
      <h3 className=" Perfect-Home text-center ">Create Brokerage Bill</h3>
      <div className="col-12 mt-md-5">
        <div className="Sign-In_Sign-Up Register w-100">
          <div className="perfect-home-form pt-1">
            <section className="Details_Form">
              <div className="pt-3">
                <form id="survey-form" method="GET" action>
                  <div className="d-lg-flex justify-content-lg-around">
                    <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="project" className="pb-1">Project</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab d-flex gap-2">
                          <select name className="form-select dropdown" style={{paddingTop: 12, paddingBottom: 12}}>
                            <option value selected disabled />
                            <option className="dropdown-item" href="#">Emerald Grove Gardens
                            </option>
                            <option className="dropdown-item" href="#">Harmony Hills Estates
                            </option>
                            <option className="dropdown-item" href="#">Horizon Vista Villas
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="name" className="pb-1">Amount</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <input autofocus type="text" name="name" className="input-field" placeholder required />
                        </div>
                      </div>
                      {/* <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="name" className="pb-1">Status</label>
                        </div>
                        <div className="rightTab">
                          <input autofocus type name="name" className="input-field" placeholder="Bill Sent" required />
                        </div>
                      </div> */}
                    </div>
                    <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                      <div className="rowTab mt-3 mt-md-4 mt-lg-0">
                        <div className="labels">
                          <label htmlFor="Location" className="pb-1">Date</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <input autofocus type="text" name="name" className="input-field" placeholder required />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label id="name-label" htmlFor="name" className="pb-1">Bill</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <label htmlFor="adh" className="form-control d-flex flex-row-reverse justify-content-between align-items-center" style={{width: 227, height: 36}}>Upload Bill<img src="/ChannelPartner/upload-file.svg" alt style={{height: 16}} /></label>
                          <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{display: 'none'}} required />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="new-leades-btn d-flex justify-content-center gap-4">
                    <div type="button" className="cancel-btn d-flex align-items-center justify-content-center bg-transparent" onClick={()=>setShowModal(false)}>Cancel</div>
                    <button type='submit' className="submit-btn d-flex align-items-center justify-content-center text-white border-0">Submit</button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

                </Modal.Body>
            </Modal>
          
        </>

    )
}

export default ManageUsersTable 