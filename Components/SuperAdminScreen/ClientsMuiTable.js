import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import HistoryIcon from '../Svg/HistoryIcon';
import EditIcon from '../Svg/EditIcon';
import CheckIcon from '../Svg/CheckIcon';
import moment from "moment";
import ListVicn from '../Svg/ListVicn';
import Link from 'next/link';

const ClientsMuiTable = ({ clientList, openEnableBox, renewSubscription, title, redirectPermission, opnCnfrmBox, openEdtMdl, handleDownload  }) => {


    const columns = [
        {
            name: 'user',
            label: "User Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'contact_number',
            label: "Contact No.",
            options: {
                filter: true,
            }
        },
        {
            name: 'email',
            label: "Email",
            options: {
                filter: true,
            }
        },
        {
            name: 'db_name',
            label: "DB Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'subscription_start_date',
            label: "subscription start date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div>{moment(value).format("DD-MM-YYYY LT")}</div>
                    );
                }
            }
        },
        {
            name: 'subscription_end_date',
            label: "subscription end date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div>{moment(value).format("DD-MM-YYYY LT")}</div>
                    );
                }
            }
        },
        {
            name: 'user_status',
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
            name: 'user_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/AddClient?id=${value}`}>
                                <button className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>

                            <button
                                className="action_btn x2"
                                title='Permissions'
                                onClick={() => redirectPermission(value, tableMeta.rowData[3])}>
                                <ListVicn />
                            </button>

                            <button
                                className="action_btn x2"
                                title='Renew Subscription'
                                onClick={() => renewSubscription(value)}>
                                <HistoryIcon />
                            </button>
                            {tableMeta.rowData[6] ?
                                <button
                                    className="action_btn"
                                    title='Disable'
                                    onClick={() => opnCnfrmBox(value)}>
                                    <DisableIcon />
                                </button> :
                                <button
                                    className="action_btn x2"
                                    title='enable'
                                    onClick={() => openEnableBox(value)}>
                                    <CheckIcon />
                                </button>
                            }
                        </div>
                    )
                }
            }
        }
    ];

    const options = {
        selectableRows: 'none',
        responsive: "standard",
        download: true,
        // onDownload: handleDownload ,    
       
    };


    return (
        <>
            <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    data={clientList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default ClientsMuiTable