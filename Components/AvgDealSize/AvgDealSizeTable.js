import React from 'react'
import MUIDataTable from "mui-datatables";
import Loader from '../Loader/Loader';
import moment from 'moment/moment';

const AvgDealSizeTable = ({ dataList, title, openConfirmBox, loader }) => {

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
            name: 'avg_deal_size',
            label: "Average Deal Size",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value}</>
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

export default AvgDealSizeTable