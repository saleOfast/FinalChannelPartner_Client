import React from 'react'
import MUIDataTable from "mui-datatables";
import ListVicn from '../Svg/ListVicn';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import DeleteIcon from '../Svg/DeleteIcon';
import CheckIcon from '../Svg/CheckIcon';

const LeaveHeadMui = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title}) => {

    const columns = [
        {
            name: 'head_leave_name',
            label: "Leave Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'head_leave_code',
            label: "Leave Code",
            options: {
                filter: true,
            }
        },{
            name: 'head_leave_short_name',
            label: "Leave Short Name",
            options: {
                filter: true,
            }
        },
        {
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
        },
        {
            name: 'head_leave_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <button
                                className="action_btn"
                                title='Edit'
                                onClick={() => { openEdtMdl(tableMeta.rowData) }} >
                                <EditIcon />
                            </button>

                            {tableMeta.rowData[3] ?
                                <button
                                    onClick={() => disableConfirm(value, 0)}
                                    className="action_btn"
                                    title="Disable">
                                    <DisableIcon />
                                </button>
                                : <button
                                    onClick={() => disableConfirm(value, 1)}
                                    className="action_btn x2"
                                    title="Enable" >
                                    <CheckIcon />
                                </button>}
                            <button
                                onClick={() => deleteConfirm(value, 'delete')}
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

export default LeaveHeadMui 