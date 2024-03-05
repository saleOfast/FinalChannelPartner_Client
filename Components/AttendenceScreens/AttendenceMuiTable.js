import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import Link from "next/link";
import DeleteIcon from '../Svg/DeleteIcon';
import moment from 'moment';

const AttendenceMuiTable = ({ deleteConfirm, disableConfirm, dataList, openConfirmBox, title }) => {

    const columns = [
        {
            name: 'db_user',
            label: "User Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user}</>
                    );
                },
            }
        }, {
            name: 'db_user',
            label: "User Code",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user_code}</>
                    );
                },
            }
        },
        {
            name: 'check_in',
            label: "Checked In",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY LT")} </>
                    );
                },
                
                
            }
        },

        {
            name: 'check_out',
            label: "Checked Out",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        
                        <>{value !== null ? moment(value).format("DD-MM-YYYY LT"): ""} </>
                    );
                },
                
            }
        },
        {
            name: 'lat',
            label: "Latitude",
            options: {
                filter: true,
            }
        },
        {
            name: 'lon',
            label: "Longitude",
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
                    data={dataList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default AttendenceMuiTable  