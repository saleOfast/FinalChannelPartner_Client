import React from "react";
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";


const ManageLeaveTab = ({ leaveAppList, openConfirmBox , title }) => {

    const columns = [
        {
            name: 'submittedBy',
            label: "Submitted By",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user? value.user : ''}</>
                    )
                }
            }
        }, 
        {
            name: 'leaveType',
            label: "Leave Name ",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.head_leave_name? value.head_leave_name : ''}</>
                    )
                }
            }
        }, 

        {
            name: 'leaveType',
            label: "Leave Short Name ",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.head_leave_short_name? value.head_leave_short_name : ''}</>
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
                    data={leaveAppList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}


export default ManageLeaveTab