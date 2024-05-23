import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import Link from "next/link";
import DeleteIcon from '../Svg/DeleteIcon';

const OpportunityMuiTable = ({ dataList, title, openConfirmBox }) => {

    const columns = [
        {
            name: 'opp_name',
            label: "Opportunity Name",
            options: {
                filter: true,
            }
        },
        
        //     name: 'accountName',
        //     label: "Account Owner",
        //     options: {
        //         filter: true,
        //         customBodyRender: (value, tableMeta, updateValue) => {
        //             return (
        //                 <>{value?.acc_name? value.acc_name : ''}</>
        //             )
        //         }
        //     }
        // }, 
        
        {
            name: 'accName',
            
            label: "Account Owner",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.acc_name? value.acc_name : ''}</>
                        <>{value ? value : ''}</>
                    )
                }
            }
        }, 
        {
            name: 'amount',
            label: "Amount",
            options: {
                filter: true,
            }
        },

        {
            name: 'oppOwner',
            label: "Assign To",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.user? value.user : ''}</>
                        <>{value ? value : ''}</>
                    )
                }
            }
        },

        {
            name: 'db_opportunity_stg',
            label: "Stage",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.opportunity_stg_name? value.opportunity_stg_name : ''}</>
                        <>{value ? value : ''}</>
                    )
                }
            }
        }, 
        
        
        {
            name: 'opp_id',
            label: "Action",
            options: {
                filter: false,
                download:false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/OpportunityView?id=${value}`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>
                            <Link href={`/AddOpportunity?id=${value}`}>
                                <button className="action_btn" title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            <button className="action_btn" onClick={() => openConfirmBox(value)} title='Remove'>
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
        downloadOptions:{
            filename:"OpportunityList.csv"
        },
    
    };

    const mappedDataList=dataList?.map(list=>({
        opp_name:list?.opp_name,
        accName:list?.accName?.acc_name,
        amount:list?.amount,
        oppOwner:list?.oppOwner?.user,
        db_opportunity_stg:list?.db_opportunity_stg?.opportunity_stg_name,
        opp_id:list?.opp_id,
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

export default OpportunityMuiTable