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
import DateRange from '../../../DateRangeCustom/Daterange';





const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, setShowAssignTo, oldAssignTo,setoldAssignTo, setShowDateFilter,usersList,getDataList }) => {
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

  

    const columns = [
        {
            name: 'user_code',
            label: "Account ID",
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
            name: 'user',
            label: "Account Name",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link href={`/CHANNEL/ChannelPartnersDetails?id=${tableMeta?.rowData[0]}&mode=view`}  className='status_box fw-bold text-decoration-underline' style={{color:"#293790"}}>
                            {value}
                        </Link>
                    )
                }
            },

        },
        {
            name: 'createdAt',
            label: "Created Date",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    
                    const date = new Date(value);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                    const year = date.getFullYear();
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            {`${day}/${month}/${year}`}
                        </div>
                    )
                }
                
            }
        },
        {
            name: 'lead_count',
            label: "Leads Count",
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
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            name: 'booking_count',
            label: "Bookings Count",
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
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            name: 'reportToUser',
            label: "Assigned to",
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
                            {/* {value && <span  >{value.user}</span>} */}
                            {value && <span  >{value}</span>}
                        </div>
                    )
                }
            }
        },
        {
            name: 'user_status',
            label: "Status",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            {value ? <span className='active status_btn'>active</span> :
                                 <span className='inactive status_btn'>inactive</span>}
                        </div>
                    )
                }
            }
        },
        {
            name: 'user_code',
            label: "Action",
            options: {
                filter: false,
                download:false,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                // customBodyRender: (value, tableMeta, updateValue) => {
                //     return (
                //         <div className="table_btns">
                //             <button
                //                 onClick={()=>{setShowAssignTo(value); setoldAssignTo(tableMeta?.rowData[5]?.user_id) }}
                //                 style={{background:`${clientBtnColor}`, color:"white",padding:"6px", borderRadius:"20px",border:"white"}}
                //                 className='pe-3 ps-3'
                //                 title='Assign - To'>
                //                     Assign to
                //             </button>
                          
                //         </div>
                //     )
                // }
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <button
                                onClick={()=>{setShowAssignTo(value); setoldAssignTo(tableMeta?.rowData[8]?.user_id) }}
                                style={{background:`${clientBtnColor}`, color:"white",padding:"6px", borderRadius:"20px",border:"white"}}
                                className='pe-3 ps-3'
                                title='Assign - To'>
                                    Assign to
                            </button>
                          
                        </div>
                    )
                }
            }
        },
        {
            name: 'reportToUserId',
            label: "ReportToUserId",
            options: {
                filter: false,
                viewColumns:false,
                download:false,
                display:false
            }
        },
    ];

    
  
    const CustomToolbar = () => {
        return (
            <div className=' d-flex justify-content-start gap-3 align-items-center '>
                <p className='fw-bold ' style={{fontSize:"18px"}} >{title}</p>
                {/* <button className='btn btn-secondary' onClick={()=>setShowDateFilter(true)}> Custom </button> */}
                <DateRange value={value} setValue={setValue} getData={getDataList} />
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

   

    const updateUserHandler = async () => {
        let toastShown=false;
        for (const element of userData) {
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
            const response = await axios.put(`${Baseurl}/db/users`, {
              db_name: db_name,
              user_code: element,
              report_to: oldAssignTo,
            }, header);
            
            if (response.status === 200 || response.status === 201) {
                if (!toastShown) { 
                    toast.success(response.data.message);
                    toastShown = true; 
                }
              setoldAssignTo('');
              setShowModal(false);
              setUserData([])
              getDataList();
            }
          } catch (error) {
            console.log(error)
            if (error?.response?.data?.status === 422) {
                if (!toastShown) { 
                    toast.error(error.response.data.message);
                    toastShown = true; 
                }
            } else if (error?.response?.data?.message) {
                if (!toastShown) { 
                    toast.error(error.response.data.message);
                    toastShown = true; 
                }
            } else {
                if (!toastShown) { 
                    toast.error("Something went wrong!");
                    toastShown = true; 
                }
            }
          }
        }
      };
      
      const mappedDataList=dataList?.map(list=>({
        user_code:list?.user_code,
        user:list?.user,
        createdAt:list?.createdAt,
        lead_count:list?.lead_count,
        booking_count:list?.booking_count,
        reportToUser:list?.reportToUser?.user,
        user_status:list?.user_status,
        reportToUserId:list?.reportToUser?.user_id,
      }))

    return (
        <>
            <div className="miuiTable channelTable">
                <MUIDataTable
                    title={<CustomToolbar/>}
                    // data={dataList}
                    data={mappedDataList}
                    columns={columns}
                    options={options}
                />
                <div>
          {userData.length ?
          <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">
              

              <button onClick={()=>{setActionMode('Cancel'); setShowModal(false);setUserData([])}} className=" btn btn-danger rounded-5">
                Cancel
              </button>
              <button onClick={()=>{setActionMode('Assignto'); setShowModal(true)}} style={{backgroundColor:clientBtnColor}} className="btn  rounded-5 text-white" >
                Assign to
              </button>
            
          </div>
          : <></>
        }
        </div>
            </div>
        
            <Modal className="commonModal"  show={showModal}   onHide={()=>{setShowModal(false)}} style={{}}>
                <Modal.Header closeButton>
                    <Modal.Title>  Assign to </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                   
                                        <Select
                                            id="select"
                                            defaultValue={""}
                                            options={usersList?.map((data, index) => {
                                            return {
                                                value: data?.user_id,
                                                label: data?.user,
                                            };
                                            })}
                                            value={usersList?.map((data, index) => {
                                            if (oldAssignTo === data.user_id) {
                                                return {
                                                value: data?.user_id,
                                                label: data?.user,
                                                };
                                            }
                                            })}
                                            onChange={(e) => {
                                            setoldAssignTo(e.value)
                                            
                                            }}
                                        />
                                        
                                      
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className=" btn btn-danger rounded-5" onClick={()=>setShowModal(false)}>Cancel</button>
                    <button style={{background:clientBtnColor}} className='btn rounded-5 text-white'  onClick={updateUserHandler} >
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
          
        </>

    )
}

export default ManageUsersTable 