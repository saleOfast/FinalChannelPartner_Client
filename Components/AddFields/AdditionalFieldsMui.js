import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import Link from "next/link";

const AdditionalFieldsMui = ({ dataList, changeHandler, usersList, title, deleteConfirm, }) => {

    const columns = [
        {
            name: "field_lable",
            label: "Field label",
            options: {
                filter: true,
            },
        },
        {
            name: "field_type",
            label: "Field Type",
            options: {
                filter: true,
            },
        },
        {
            name: "input_type",
            label: "Input Type",
            options: {
                filter: true,
            },
        },
        {
            name: "navigate_type",
            label: "Navigate type",
            options: {
                filter: true,
            },
        },
        {
            name: "option",
            label: "Options",
            options: {
                filter: true,
            },
        },
        {
            name: "field_size",
            label: "field Size",
            options: {
                filter: true,
            },
        },
        {
            name: "field_id",
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/AddDynamicFields?id=${value}&md=${tableMeta.rowData[3]}`}>
                                <button className="action_btn" title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            
                            <button
                                onClick={() => deleteConfirm(value)}
                                className="action_btn"
                                title="Delete">
                                <DeleteIcon />
                            </button>
                        </div>
                    );
                },
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

export default AdditionalFieldsMui;
