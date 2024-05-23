import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import Link from "next/link";
import DeleteIcon from '../Svg/DeleteIcon';



const QuationMuiTable = ({ deleteConfirm, disableConfirm, dataList, openConfirmBox, title }) => {

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
                            <span className='active status_btn'>{value}</span>
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
                    return (
                        <div className="table_btns">
                            <Link href={`/AddQuotations?id=${value}`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            <Link href={`/QuotationView?id=${value}`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>

                            <button
                                onClick={() => openConfirmBox(value)}
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
        responsive: "standard",
        downloadOptions:{filename:"QuotationList.csv"}
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
            <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    // data={dataList}
                    data={mappedDataList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default QuationMuiTable  