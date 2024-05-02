import React, { useEffect, useState } from 'react'
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





const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, setShowAssignTo, oldAssignTo,setoldAssignTo, setShowDateFilter,usersList,getDataList }) => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [userData, setUserData] =  useState([])
    const [actionMode, setActionMode] =  useState('')
    const [showModal, setShowModal] =  useState(false)
    const [showModal2, setShowModal2] =  useState(false)
    const [userInfo, setUserInfo ] =  useState({
    user_code: '',
    reject_reason: ''
  })

  const [value, setValue] = useState({

    startDate: new Date(),
    endDate: new Date().setMonth(11)

  });
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
  const[brokerageId,setBrokerageId]=useState("")
  const[brokerageBill,setBrokerageBill]=useState()
  

  const getDataListById = async () => {

    if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                m_id: 76,
            }
        }

        try {
            const response = await axios.get(Baseurl + `/db/channel/brokerage?brokerage_id=${brokerageId}`, header);
            setBrokerageBill(response.data.data);
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
}
useEffect(()=>{
  if(brokerageId){
    getDataListById();
    }
},[brokerageId])

    const columns = [
        {
            name: 'brokerage_id',
            label: "Booking ID",
            options: {
                filter: true,
                display:false,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div  className='status_box fw-bold' style={{color:"#293790"}} >
                            NK12647
                        </div>
                    )
                }
                  
            }
        },
        {
          name: 'brokerage_code',
          label: "Booking ID",
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
            name: 'BrokerageBookingtData',
            label: "Booking Name",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div  className='status_box fw-bold ' style={{color:"#293790"}}>
                            {value?.booking_name}
                        </div>
                    )
                }
            },

        },
        {
            name: 'BrokerageBookingtData',
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
                            {value?.email}
                        </div>
                    )
                }
                
            }
        },
        {
            name: 'BrokerageBookingtData',
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
                            +91-{value?.contact_no}
                        </div>
                    )
                }
            }
        },
        {
            name: 'BrokerageBookingtData',
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
                            {value?.BookingprojectData?.project}
                        </div>
                    )
                }
            }
        },
        {
            name: 'BrokerageBookingtData',
            label: "Location",
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
                            {value?.Location}
                        </div>
                    )
                }
            }
        },
        {
            name: 'status',
            label: "Brokerage Status",
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
                        style={{background:"violet",width:"fit-content", color:"white",padding:"6px", borderRadius:"20px",border:"white"}}
                        className='pe-3 ps-3'
                        title='Assign - To'>
                            {value}
                    </div>
                    )
                }
            }
        },
        {
            name: 'user_code',
            label: "Brokerage Bill",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                  
                    return (
                        <div className="table_btns">
                            <button
                                onClick={()=>{setShowModal(true); setBrokerageId(tableMeta?.rowData[0]);  }}
                                style={{background:clientBtnColor, color:"white",padding:"6px", borderRadius:"20px",border:"white"}}
                                className='pe-3 ps-3 justify-content-center align-items-center d-flex '
                                title='view'>
                                 <img  style={{width:"22px"}}  src="/ChannelPartner/view-icon.png"  alt='view Icon'/>
                                   View
                            </button>
                          
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
                <DateRange value={value} setValue={setValue} />

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

    function formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${day}/${month}/${year}`;
    }

    
      
 

    return (
        <>
            <div className="miuiTable channelTable">
                <MUIDataTable
                    title={<CustomToolbar/>}
                    data={dataList}
                    columns={columns}
                    options={options}

                />
                <div>
          {/* {userData.length ?
          <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">
              

              <button onClick={()=>{setActionMode('Cancel'); setShowModal(false);setUserData([])}} className=" btn btn-danger rounded-5">
                Cancel
              </button>
              <button onClick={()=>{setActionMode('Assignto'); setShowModal(true)}} style={{backgroundColor: '#293790'}} className="btn  rounded-5 text-white" >
                Assign to
              </button>
            
          </div>
          : <></>
        } */}
        </div>
            </div>
        
      <Modal className="commonModal" centered show={showModal2} onHide={() => { setShowModal2(false); setBrokerageId("") }} size="lg">
        <Modal.Body>
          <section className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill" style={{ padding: '0 16px' }}>
            <div className="container">
              <div className="row">
                <h3 className=" Perfect-Home text-center ">Create Brokerage Bill</h3>
                <div className="col-12 mt-md-5">
                  <div className="Sign-In_Sign-Up Register w-100">
                    <div className="perfect-home-form pt-1">
                      <section className="Details_Form">
                        <div className="pt-3">
                          <form id="survey-form" >
                            <div className="d-lg-flex justify-content-lg-around">
                              <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="project" className="pb-1">Booking</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab d-flex gap-2">
                                    <select name className="form-select dropdown" style={{ paddingTop: 12, paddingBottom: 12, marginLeft: "auto" }}>
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
                                    <input autofocus type="number" name="name" className="input-field" placeholder required />
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                <div className="rowTab mt-3 mt-md-4 mt-lg-0">
                                  <div className="labels">
                                    <label htmlFor="Location" className="pb-1">Date</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <input autofocus type="date" name="name" className="input-field" placeholder required />
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label id="name-label" htmlFor="name" className="pb-1">Bill</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <label htmlFor="adh" className="form-control d-flex flex-row-reverse justify-content-between align-items-center" style={{ width: 162, height: 35, background:clientBtnColor }}>Upload Bill<img src="/ChannelPartner/upload-file.svg" alt style={{ height: 16 }} /></label>
                                    <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{ display: 'none' }} required />  
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="new-leades-btn d-flex justify-content-center gap-4">
                              <div type="button" className="btn btn-danger rounded-5 text-white" onClick={() => setShowModal2(false)} >Cancel</div>
                              <button type='submit' className="btn text-white rounded-5" style={{background:clientBtnColor}}>Submit</button>
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

<Modal className="" centered show={showModal} onHide={() => { setShowModal(false); setBrokerageId("") }} size="lg">
        <Modal.Body>
          <section className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill" style={{ padding: '0 16px' }}>
          <div className='d-flex justify-content-end align-items-center pb-2'>
                    <img
                    className=' cursor-pointer'
                      src="/ChannelPartner/profile-edit.svg"
                      onClick={()=>{
                        setShowModal(false)
                        setShowModal2(true)
                      }}
                      alt
                    />
                     <img
                     className='ms-4 cursor-pointer'
                     onClick={()=>{
                      setShowModal(false)
                      setBrokerageId("")
                     }}
                     style={{width:"29px"}}
                      src="/ChannelPartner/cross-icon.png"
                      alt
                    />
              </div>
            <div className="container">
              <div className="row">
                <h3 className=" Perfect-Home text-center ">Brokerage Bill</h3>
                <div className="col-12 mt-md-5">
                  <div className="Sign-In_Sign-Up Register w-100">
                    <div className="perfect-home-form pt-1">
                      <section className="Details_Form">
                        <div className="">
                          <form id="survey-form" >
                            <div className="d-lg-flex justify-content-lg-around pb-5">
                              <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                              <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">Booking</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab fw-semibold" style={{color:"#293790"}}>
                                    {brokerageBill?.BrokerageBookingtData?.booking_name}
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">Amount</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab fw-semibold" style={{color:"#293790"}}>
                                  ₹ {brokerageBill?.amount}.00
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">Status</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab fw-semibold" style={{color:"#293790"}}>
                                  {brokerageBill?.status}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                              <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">Date</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab fw-semibold" style={{color:"#293790"}}>
                                  {formatDate(brokerageBill?.date)}
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">Bill</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab fw-semibold text-decoration-underline" style={{color:"#293790"}}>
                                  {brokerageBill?.bill_file}
                                  </div>
                                </div>
                              </div>
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