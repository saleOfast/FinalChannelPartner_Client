import React, { useState } from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../../Svg/ViewIcon';
import DisableIcon from '../../Svg/DisableIcon';
import EditIcon from '../../Svg/EditIcon';
import DeleteIcon from '../../Svg/DeleteIcon';
import CheckIcon from '../../Svg/CheckIcon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PlusIcon from '../../Svg/PlusIcon';
import ListVicn from '../../Svg/ListVicn';



const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, setShowAssignTo, setoldAssignTo, setShowDateFilter }) => {
    const router = useRouter()
    const [data, setData] = useState([])
    const columns = [
        {
            name: 'user_code',
            label: "Account ID",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link href={`/CHANNEL/ViewActiveUsers?id=${value}&mode=view`} className='status_box fw-bold' style={{color:"#0000ee"}} >
                            {value}
                        </Link>
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
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box fw-bold' style={{color:"#0000ee"}}>
                            {value}
                        </div>
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
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
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
                            {`${day}${month}${year}`}
                        </div>
                    )
                }
                
            }
        },
        {
            name: 'user',
            label: "Leads Count",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            108
                        </div>
                    )
                }
            }
        },
        {
            name: 'user',
            label: "Bookings Count",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            24
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
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box fw-bold' style={{color:"#0000ee"}}>
                            {value && <span  >{value.user}</span>}
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
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
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
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#0000ee", color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            {/* <Link href={`/CHANNEL/ViewActiveUsers?id=${value}&mode=view`}>
                                <button
                                    className="action_btn"
                                    title='View'>
                                    <ViewIcon />
                                </button>
                            </Link>

                            <Link href={`/CHANNEL/ViewActiveUsers?id=${value}&mode=edit`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link> */}

                          
                            <button
                                onClick={()=>{setShowAssignTo(value); setoldAssignTo(tableMeta.rowData[5].user_id) }}
                                style={{background:"#0000ee", color:"white",padding:"6px", borderRadius:"20px",border:"white"}}
                                className='pe-3 ps-3'
                                title='Assign - To'>
                                    Assign to
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
                <button className='btn btn-secondary' onClick={()=>setShowDateFilter(true)}> Custom </button>
            </div>
        );
    }

    const handleRowClick = (rowData, rowMeta) => {
        console.log(rowData, rowMeta);
    };

    const options = {
        selectableRows: 'multiple',
        responsive: "standard",
        onRowsSelect : handleRowClick,

        
      
      
        
        customBodyRender: (value, tableMeta, updateValue) => {
            
            return (
                <tr >
                    <th style={{ backgroundColor: '#1E90FF' }}>

                    </th>
                    {/* Your table cells here */}
                </tr>
            );
        }
    };

    const goto = (url) => {
        router.push(url)
    }

   
 

    return (
        <>
            <div className="miuiTable channelTable">
                <MUIDataTable
                    title={<CustomToolbar/>}
                    data={dataList}
                    columns={columns}
                    options={options}
                    onRowsSelect
                />
            </div>
        </>

    )
}

export default ManageUsersTable 