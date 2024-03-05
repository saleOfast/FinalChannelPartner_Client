import React from 'react'
import MUIDataTable from "mui-datatables";
import ListVicn from '../Svg/ListVicn';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import DeleteIcon from '../Svg/DeleteIcon';
import CheckIcon from '../Svg/CheckIcon';
import { Policy } from '@mui/icons-material';
import Link from 'next/link';
import moment from 'moment';

const PolicyTypeMui = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title  }) => {

    const columns = [


        {
            name: 'policy_type_name',
            label: "Policy Name",
            options: {
                filter: true,
            }
        },

        {
            name: 'db_policy_head',
            label: "Travel Type",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>
                         {value?.policy_name?value.policy_name : ''}
                        </>
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
            name: 'db_policy_head',
            label: "Policy Code",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>
                         {value?.policy_code?value.policy_code: ''}
                        </>
                    )
                }

            }
        },

        {
            name: 'cost_per_km',
            label: "Cost",
            options: {
                filter: true,
            }
        },

        // {
        //     name: 'fixed',
        //     label: "Fixed",
        //     options: {
        //         filter: true,
        //     }
        // },

        // {
        //     name: 'max_allowance',
        //     label: "Maximum Allownce",
        //     options: {
        //         filter: true,
        //     }
        // },

        {
            name: 'from_date',
            label: "Effective Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                       <> {moment(value).format("YYYY-MM-DD LT")}</>
                    )
                }
            }
        },

        
       /*  {
            name: 'status',
            label: "Status",
            options: {
                filter: true,
                display: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            {value ? <span className='active status_btn'>active</span> :
                                <span className='inactive status_btn'>inactive</span>}
                        </div>
                    )
                }
            }
        }, */
        {
            name: 'policy_type_id',
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
                            {/* {tableMeta.rowData[3] ?
                                <button
                                    onClick={() => disableConfirm(value, 0)}
                                    className="action_btn"
                                    title="Disable">
                                    <DisableIcon />
                                </button>
                                : <button
                                    onClick={() => disableConfirm(value, 1)}
                                    className="action_btn x2"
                                    title="Enable" >
                                    <CheckIcon />
                                </button>} */}
                            <button
                                onClick={() => deleteConfirm(value)}
                                className="action_btn"
                                title='Delete'>
                                <DeleteIcon />
                            </button>
                        </div>
                    )
                }
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

export default PolicyTypeMui 