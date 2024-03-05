import React from 'react'
import MUIDataTable from "mui-datatables";
import ListVicn from '../Svg/ListVicn';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import DeleteIcon from '../Svg/DeleteIcon';
import CheckIcon from '../Svg/CheckIcon';

const ViewLeaveTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, openLeaveView }) => {

    const columns = [
        {
            name: 'head_leave_name',
            label: "Leave Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'head_leave_short_name',
            label: "Leave Short name",
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
        }, {
            name: 'leaveHead',
            label: "Total Leave",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            {value[0]?.total_head_leave ? value[0].total_head_leave : 0}
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

                        </div>
                    )
                }
            }
        },
    ];

    const options = {
        selectableRows: 'none'
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

export default ViewLeaveTable 