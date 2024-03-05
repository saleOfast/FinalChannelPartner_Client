import React from "react";
import MUIDataTable from "mui-datatables";
import Link from "next/link";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import ListVicn from "../Svg/ListVicn";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";

const UserProfileManagementTable = ({ redirectPermission, deleteConfirm, disableConfirm, dataList, openEdtMdl, title }) => {

    const columns = [
        {
            name: 'role_name',
            label: "Level Name",
            options: {
                filter: true,
            }
        },
        /* {
            name: 'status',
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
        }, */
        {
            name: 'role_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/AddProfileManage?id=${value}`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            {tableMeta.rowData[2] ? <button
                                onClick={() => disableConfirm(value)}
                                className="action_btn"
                                title='Disable'>
                                <DisableIcon />
                            </button> : null}
                            <Link href={`/RolePermission?id=${value}`}>
                                <button
                                    className="action_btn x2"
                                    title='Permissions'>
                                    <ListVicn />
                                </button>
                            </Link>

                            <button
                                onClick={() => deleteConfirm(value)}
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

export default UserProfileManagementTable