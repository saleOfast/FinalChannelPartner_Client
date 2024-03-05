import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";


const LeaveSubmitTab = ({ leaveLists,viewRemark, openConfirmBox, title }) => {

    const columns = [
        {
            name: 'submittedBy',
            label: "Submit By",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user ? value.user : ''}</>
                    )
                }
            }
        },
        {
            name: 'submittedTo',
            label: "Application Submit To",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user ? value.user : ''}</>
                    )
                }
            }
        },

        {
            name: 'leaveType',
            label: "Leave Type",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.head_leave_name ? value.head_leave_name : ''}</>
                    )
                }
            }
        },
        {
            name: 'from_date',
            label: "From Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY")}</>
                    )
                }
            }
        },
        {
            name: 'to_date',
            label: "To Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY")}</>
                    )
                }
            }
        },
        {
            name: 'no_of_days',
            label: "Leave Days",
            options: {
                filter: true,
            }
        },
        {
            name: 'reason',
            label: "Reason",
            options: {
                filter: true,
            }
        },
        {
            name: 'leave_app_status',
            label: "Status",
            options: {
                filter: true,
            }
        },
        {
            name: 'leave_app_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>
                            {tableMeta.rowData[7] == 'pending' ?
                                <div className="table_btns">
                                    <button className="btn btn-primary me-2" title='Accept' onClick={() => openConfirmBox(tableMeta.rowData, 1)}>
                                        Accept
                                    </button>
                                    <button className="btn btn-primary" title='Reject' onClick={() => openConfirmBox(tableMeta.rowData, 0)}>
                                        Reject
                                    </button>
                                </div> :
                                <div className="table_btns">
                                    <button
                                        className="action_btn"
                                        title='View Remark'
                                        onClick={() => viewRemark(tableMeta.rowData)}
                                        >
                                        <ViewIcon />
                                    </button>
                                </div>}
                        </>
                    )
                }
            }
        },
        {
            name: 'head_leave_id',
            label: "head leave id",
            options: {
                filter: true,
                display: false
            }
        },
        {
            name: 'head_leave_cnt_id',
            label: "head leave cnt id",
            options: {
                filter: true,
                display: false
            }
        },
        {
            name: 'remarks',
            label: "head leave cnt id",
            options: {
                filter: true,
                display: false
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
                    data={leaveLists}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}


export default LeaveSubmitTab