import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import DeleteIcon from '../Svg/DeleteIcon';
import CheckIcon from '../Svg/CheckIcon';
import Link from 'next/link';

const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title }) => {

    const columns = [
        {
            name: 'user',
            label: "Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'email',
            label: "E-mail",
            options: {
                filter: true,
            }
        },
        {
            name: 'contact_number',
            label: "Mobile No.",
            options: {
                filter: true,
            }
        },
        {
            name: 'user_code',
            label: "User Code",
            options: {
                filter: true,
            }
        },
        {
            name: 'address',
            label: "Address",
            options: {
                filter: true,
            }
        },
        {
            name: 'user_status',
            label: "Status",
            options: {
                filter: true,
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
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/AddUsers?id=${value}&mode=view`}>
                                <button
                                    className="action_btn"
                                    title='View'>
                                    <ViewIcon />
                                </button>
                            </Link>

                            <Link href={`/AddUsers?id=${value}&mode=edit`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            {tableMeta.rowData[5] ?
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
                            </button>
                        </div>
                    )
                }
            }
        },
    ];

    const options = {
        selectableRows: 'none',
        responsive: "standard"
    };

    return (
        <>
            <div className="miuiTable">
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