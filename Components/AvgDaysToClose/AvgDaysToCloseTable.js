import React from 'react'
import MUIDataTable from "mui-datatables";
import Loader from '../Loader/Loader';
import moment from 'moment/moment';

const AvgDaysToCloseTable = ({ dataList, title, openConfirmBox, loader }) => {

    const columns = [
        {
            name: 'assigned_to',
            label: "Name",
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
            name: 'average_days_difference',
            label: "Average Days",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{Number(value || 0).toFixed(2)}</>
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
                    data={Array.isArray(dataList) ? dataList : []}
                    columns={columns}
                    options={options}
                />
            </div>
            )
        }
            
        </>

    )
}

export default AvgDaysToCloseTable