import React from 'react'
import MUIDataTable from "mui-datatables";
import Loader from '../Loader/Loader';
import moment from 'moment/moment';

const ExpectedRevenueTable = ({ dataList, title, openConfirmBox, loader }) => {

    const columns = [
        {
            name: 'assignedOpp',
            label: "Name",
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
            name: 'total_amount',
            label: "Amount",
            options: {
                filter: true,
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

export default ExpectedRevenueTable