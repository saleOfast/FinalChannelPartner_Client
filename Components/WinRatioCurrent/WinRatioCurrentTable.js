import React from 'react'
import MUIDataTable from "mui-datatables";
import Loader from '../Loader/Loader';
import moment from 'moment/moment';

const WinRatioCurrentTable = ({ dataList, title, openConfirmBox, loader }) => {

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
            name: 'closed_won_opportunities',
            label: "Won Opportunities",
            options: {
                filter: true,
            }
        },
        {
            name: 'total_opportunities',
            label: "Total Opportunities",
            options: {
                filter: true,
            }
        },
        {
            name: 'total_opportunities',
            label: "Win Ratio",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{tableMeta?.rowData[1]+":"+tableMeta?.rowData[2]}</>
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

export default WinRatioCurrentTable