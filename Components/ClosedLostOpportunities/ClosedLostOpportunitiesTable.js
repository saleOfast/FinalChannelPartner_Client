import React from 'react'
import MUIDataTable from "mui-datatables";
import Loader from '../Loader/Loader';
import moment from 'moment/moment';
import { mapOpportunityRow } from "../../Utils/reportApi";

const ClosedLostOpportunitiesTable = ({ dataList, title, openConfirmBox, loader }) => {
    const mappedDataList = (Array.isArray(dataList) ? dataList : []).map(mapOpportunityRow);

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
                        <>{typeof value === "object" ? (value?.acc_name || "") : (value || "")}</>
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
                        <>{typeof value === "object" ? (value?.user || value?.user_name || "") : (value || "")}</>
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
                        <>{typeof value === "object" ? (value?.opportunity_stg_name || "") : (value || "")}</>
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
                        <>{typeof value === "object" ? (value?.opportunity_type_name || "") : (value || "")}</>
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
        filterType:'multiselect'
    };

    

    return (
        <>
        {
            loader ? <Loader/> :(
                <div className="miuiTable">
                <MUIDataTable
                    title={title}
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

export default ClosedLostOpportunitiesTable