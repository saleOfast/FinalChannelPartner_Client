import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";


const ExpenseMuiTable = ({ leaveLists, viewRemark, openConfirmBox, title }) => {
    const displayUser = (value) => {
        if (!value) return "---";
        if (typeof value === "string") return value;
        return value.user || value.user_name || value.name || "---";
    };

    const displayPolicy = (value, row) => {
        if (typeof value === "string" && value) return value;
        return value?.policy_name || value?.policy_type_name || row?.policy_name || "---";
    };

    const displayDate = (value) => {
        if (!value) return "---";
        const parsed = moment(value);
        return parsed.isValid() ? parsed.format("DD-MM-YYYY") : "---";
    };

    const columns = [
        {
            name: 'ExpenceSubmittedBy',
            label: "Submit By",
            options: {
                filter: true,
                customBodyRender: (value) => displayUser(value),
            }
        },
        {
            name: 'ExpenceSubmittedTo',
            label: "Submit To",
            options: {
                filter: true,
                customBodyRender: (value) => displayUser(value),
            }
        },
        {
            name: 'db_policy_head',
            label: "Policy Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta) => displayPolicy(value, tableMeta?.rowData),
            }
        },
        {
            name: 'claim_type',
            label: "Claim Type",
            options: {
                filter: true,
                customBodyRender: (value) => value || "---",
            }
        },
        {
            name: 'from_date',
            label: "From Date",
            options: {
                filter: true,
                customBodyRender: (value) => displayDate(value),
            }
        },
        {
            name: 'to_date',
            label: "To Date",
            options: {
                filter: true,
                customBodyRender: (value) => displayDate(value),
            }
        },
        {
            name: 'from_location',
            label: "From Location",
            options: {
                filter: true,
                customBodyRender: (value) => value || "---",
            }
        },
        {
            name: 'to_location',
            label: "To Location",
            options: {
                filter: true,
                customBodyRender: (value) => value || "---",
            }
        },
        {
            name: 'total_expence',
            label: "Total Expense",
            options: {
                filter: true,
                customBodyRender: (value) => (value || value === 0 ? value : "---"),
            }
        },
        {
            name: 'status',
            label: "Status",
            options: {
                filter: true,
                customBodyRender: (value) => (
                    <span className={`status_btn ${String(value).toLowerCase() === "approved" ? "active" : String(value).toLowerCase() === "rejected" ? "inactive" : ""}`}>
                        {value || "---"}
                    </span>
                ),
            }
        },
        {
            name: 'expence_id',
            label: "Action",
            options: {
                filter: false,
                sort: false,
                download: false,
                viewColumns: false,
                setCellProps: () => ({ style: { whiteSpace: "nowrap", minWidth: 160 } }),
                customBodyRender: (value, tableMeta) => {
                    return (
                        <>
                            {String(tableMeta.rowData[9]).toLowerCase() == 'pending' ?
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
        responsive: "standard",
        filterType:'multiselect',
        downloadOptions: { filename: "ExpensesList.csv" },
    };

    return (
        <>
            <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    data={Array.isArray(leaveLists) ? leaveLists : []}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}


export default ExpenseMuiTable