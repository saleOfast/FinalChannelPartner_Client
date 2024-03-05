import React from "react";
import MUIDataTable from "mui-datatables";
import moment from "moment";

const AssignLeadsTable = ({ dataList, changeHandler, usersList, title, assignConfirm, }) => {

    let colorArr = ["red ,blue, yellow, green"]
    const columns = [


        {
            name: "lead_name",
            label: "Lead Name",
            options: {
                filter: true,
            },
        },
        {
            name: "company_name",
            label: "Company Name",
            options: {
                filter: true,
            },
        },
        {
            name: "p_contact_no",
            label: "Mobile",
            options: {
                filter: true,
            },
        },
        {
            name: "createdAt",
            label: "Creation Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY LT")}</>
                    );
                },
            },
        },
        {
            name: "db_lead_status",
            label: "Status",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="status_box">
                            <span  className={`status${value.lead_status_id} status_btn`}>{value?.lead_status_id ? value.status_name : ""}</span>
                        </div>
                    );
                },
            },
        }, {
            name: "lead_id",
            label: "Assign Lead",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <select
                                name="assign_lead" id="assign_lead"
                                onChange={(e) => changeHandler(e.target.value, value, tableMeta)}
                                defaultValue={tableMeta?.rowData[7]}
                                className="form-control">
                                <option value="">Select User</option>
                                {usersList?.map((data) => {
                                    return <option value={data.user_id} key={data.user_id}>
                                        {data.user}
                                    </option>
                                })}
                            </select>
                        </div>
                    );
                },
            },
        },
        {
            name: "lead_id",
            label: " ",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <button
                                className="btn btn-primary"
                                onClick={() => assignConfirm(value)}>
                                Submit
                            </button>
                        </div>
                    );
                },
            },
        },
        {
            name: "assigned_lead",
            label: "Creation Date",
            options: {
                filter: true,
                display: false
            },
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
    );
};

export default AssignLeadsTable;
