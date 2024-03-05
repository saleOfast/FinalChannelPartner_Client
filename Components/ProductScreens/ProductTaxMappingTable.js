import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../Svg/ViewIcon';
import ListVicn from '../Svg/ListVicn';
import EditIcon from '../Svg/EditIcon';
import moment from "moment";
import Link from "next/link";
import DeleteIcon from "../Svg/DeleteIcon";


const ProductTaxMappingTable = ({
    dataList,
    openTaxMapModel,
    title,
    disableConfirm,
}) => {
    const columns = [
        {
            name: "db_product",
            label: "Product Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.p_name}</>
                    );
                },
            },
        },
        {
            name: "db_tax",
            label: "Tax Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.tax_name}</>
                    );
                },
            },
        },
        {
            name: "db_tax",
            label: "Tax Code",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.tax_code}</>
                    );
                },
            },
        },
        {
            name: "effective_date",
            label: "Effective Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>{moment(value).format("DD-MM-YYYY LT")} </>;
                },
            },
        }, {
            name: "product_tax_id",
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <button
                                onClick={() => disableConfirm(value)}
                                className="action_btn"
                                title="Remove">
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

export default ProductTaxMappingTable