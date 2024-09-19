import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import Link from "next/link";
import DeleteIcon from '../Svg/DeleteIcon';
import Loader from '../Loader/Loader';



const QuationMuiTable = ({ deleteConfirm, disableConfirm, dataList, openConfirmBox, title,loader }) => {

    const columns = [
        {
            name: 'quat_code',
            label: "Quotation No.",
            options: {
                filter: true,
            }
        },
        {
            name: 'quatOpportunity',
            label: "Related Opportunity",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.opp_name}</>
                        <>{value}</>
                    );
                },
            }
        },

        {
            name: 'quatAccount',
            label: "Related Account",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.opp_name}</>
                        <>{value}</>
                    );
                },
            }
        },

        {
            name: 'quatOwner',
            label: "Owner",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.user}</>
                        <>{value}</>
                    );
                },
            }
        },
        {
            name: 'grand_total',
            label: "Total Amount",
            options: {
                filter: true,
            }
        },
        {
            name: 'quatStatus',
            label: "Status",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            {/* <span className='active status_btn'>{value?.quat_status_name}</span> */}
                            {/* <span className='active status_btn' >{value}</span> */}
                            <span 
                                className='active status_btn' 
                                style={{ 
                                    color: 
                                    value === 'New' ? 'blue' : 
                                    value === 'In Progress' ? 'orange' : 
                                    value === 'Submitted' ? 'purple' : 
                                    value === 'Negotiation' ? 'teal' : 
                                    value === 'Approved' ? 'green' : 
                                    value === 'Rejected' ? 'red' : 
                                    'black' 
                                }}
                                >
                                {value}
                                </span>

                        </div>
                    )
                }
            }
        },
        {
            name: 'quat_mast_id',
            label: "Action",
            options: {
                filter: true,
                download:false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    console.log(tableMeta?.rowData)
                    return (
                        <div className="table_btns">
                            {
                               ( tableMeta?.rowData[5] !== "Approved" && tableMeta?.rowData[5] !== "Rejected" )&&(
                                        <>
                                            <Link href={`/crm/AddQuotations?id=${value}`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            

                            <button
                                onClick={() => openConfirmBox(value)}
                                className="action_btn"
                                title='Delete'>
                                <DeleteIcon />
                            </button>
                                        </>
                               )
                            }
                            <Link href={`/crm/QuotationView?id=${value}`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>
                            
                        </div>
                    )
                }
            }
        },
    ];

    const options = {
        selectableRows: 'none',
        responsive: "standard",
        downloadOptions:{filename:"QuotationList.csv"},
        filterType:'multiselect'
    };

    const mappedDataList=dataList?.map(list=>({
        quat_code:list?.quat_code,
        quatOpportunity:list?.quatOpportunity?.opp_name,
        quatAccount:list?.quatOpportunity?.accName?.acc_name,
        quatOwner:list?.quatOwner?.user,
        grand_total:list?.grand_total,
        quatStatus:list?.quatStatus?.quat_status_name,
        quat_mast_id:list?.quat_mast_id
    }))

    return (
        <>
        {
            loader ? <Loader/> :(
                <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    // data={dataList}
                    data={mappedDataList}
                    columns={columns}
                    options={options}
                />
            </div>
            )
        }
            
        </>

    )
}

export default QuationMuiTable  