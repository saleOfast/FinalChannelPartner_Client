import React from 'react'
import MUIDataTable from "mui-datatables";
import Loader from '../Loader/Loader';
import moment from 'moment/moment';

const ClosedLostOpportunitiesTable = ({ dataList, title, openConfirmBox, loader }) => {

    const columns = [
        {
            name: 'opp_name',
            label: "Opportunity Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'accName',
            label: "Account Owner",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.acc_name? value.acc_name : ''}</>
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
            name: 'assignedOpp',
            label: "Assign To",
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
            name: 'close_date',
            label: "Close Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value ? moment(value).format('DD MMMM YYYY') : ''}</>
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
                        <>{value?.opportunity_stg_name? value.opportunity_stg_name : ''}</>
                    )
                }
            }
        },
        {
            name: 'db_opportunity_type',
            label: "Type",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.opportunity_type_name? value.opportunity_type_name : ''}</>
                    )
                }
            }
        },
        {
            name: 'db_lead_source',
            label: "Source",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.source? value.source : ''}</>
                    )
                }
            }
        }, 
        {
            name: 'desc',
            label: "Description",
            options: {
                filter: true,
            }
        },
        {
            name: 'createdAt',
            label: "Created At",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value ? moment(value).format('DD MMMM YYYY') : ''}</>
                    )
                }
            }
        }, 
        {
            name: 'updatedAt',
            label: "Last Modified",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value ? moment(value).format('DD MMMM YYYY') : ''}</>
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

    

    return (
        <>
        {
            loader ? <Loader/> :(
                <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    data={dataList}
                    columns={columns}
                    options={options}
                />
            </div>
            )
        }
            
        </>

    )
}

export default ClosedLostOpportunitiesTable