import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";


const ExpenseMuiTable = ({ leaveLists, viewRemark, openConfirmBox, title }) => {

    const columns = [
        {
            name: 'ExpenceSubmittedBy',
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
            name: 'ExpenceSubmittedTo',
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
            name: 'db_policy_head',
            label: "Policy Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.policy_name ? value.policy_name : ''}</>
                    )
                }
            }
        },
        {
            name: 'claim_type',
            label: "Claim Type",
            options: {
                filter: true,
            }
        },
        {
            name: 'from_date',
            label: "From Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY LTS")}</>
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
                        <>{moment(value).format("DD-MM-YYYY LTS")}</>
                    )
                }
            }
        },

        {
            name: 'from_location',
            label: "From Location",
            options: {
                filter: true,
            }
        },
        {
            name: 'to_location',
            label: "To Location",
            options: {
                filter: true,
            }
        },
        {
            name: 'total_expence',
            label: "Total Expense",
            options: {
                filter: true,
            }
        },{
            name: 'status',
            label: "Status",
            options: {
                filter: true,
            }
        },
        {
            name: 'expence_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>
                            {tableMeta.rowData[9] == 'pending' ?
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
        }, {
            name: 'remark',
            label: "Remark",
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


export default ExpenseMuiTable