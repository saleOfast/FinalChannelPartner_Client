import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../../Svg/ViewIcon';
import DisableIcon from '../../Svg/DisableIcon';
import EditIcon from '../../Svg/EditIcon';
import DeleteIcon from '../../Svg/DeleteIcon';
import CheckIcon from '../../Svg/CheckIcon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PlusIcon from '../../Svg/PlusIcon';

const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title }) => {
    const router = useRouter()

    const columns = [
        {
            name: 'user_code',
            label: "Account ID",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  )
            }
        },
        {
            name: 'user',
            label: "Account Name",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  )
            },

        },
        {
            name: 'createdAt',
            label: "Created Date",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    const date = new Date(value);
                    const formattedDate = date.toISOString().split('T')[0];
                    return (
                        <div className='status_box'>
                            {formattedDate}
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
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
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
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            24
                        </div>
                    )
                }
            }
        },
        // {
        //     name: 'email',
        //     label: "E-mail",
        //     options: {
        //         filter: true,
        //     }
        // },
        // {
        //     name: 'contact_number',
        //     label: "Mobile No",
        //     options: {
        //         filter: true,
        //     }
        // },
        
        // {
        //     name: 'db_role',
        //     label: "Role",
        //     options: {
        //         filter: true,
        //         customBodyRender: (value, tableMeta, updateValue) => {
        //             return (
        //                 <div className='status_box'>
        //                     {value && <span >{value.role_name}</span>}
        //                 </div>
        //             )
        //         }
        //     }
        // },
        {
            name: 'reportToUser',
            label: "Assigned to",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
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
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
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
                    <th style={{background:"#405189", color: 'white'}} key={2}  >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/CHANNEL/ViewActiveUsers?id=${value}&mode=view`}>
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
                            </Link>
                            {/* {tableMeta.rowData[5] ?
                                <button
                                    onClick={() => disableConfirm(value, 0)}
                                    className="action_btn"
                                    title='Disable'>
                                    <DisableIcon />
                                </button>
                                : <button
                                    onClick={() => disableConfirm(value, 1)}
                                    className="action_btn x2"
                                    title='Enable'>
                                    <CheckIcon />
                                </button>}

                            <button
                                onClick={() => deleteConfirm(value, 0)}
                                className="action_btn"
                                title='Delete'>
                                <DeleteIcon />
                            </button> */}
                        </div>
                    )
                }
            }
        },
    ];

    const options = {
        selectableRows: 'multiple',
        responsive: "standard",
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
                    title={title}
                    data={dataList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default ManageUsersTable 