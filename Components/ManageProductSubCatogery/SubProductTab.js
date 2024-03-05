import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';

const SubProductTab  = ({ opnCnfrmBox, openEdtMdl, title }) => {
    const userData = [{
        s_no: '1',
        department_id: 'd_10011',
        department: 'General Manager',
        status: 'ACTIVE',
    }, {
        s_no: '2',
        department_id: 'd_10012',
        department: 'General Manager',
        status: 'ACTIVE',
    }
    ]
    const columns = [
        
        {
            name: 's_no',
            label: "Sr.No",
            options: {
                filter: true,
            }
        }, {
            name: 'department_id',
            label: "Department ID",
            options: {
                filter: true,
            }
        }, {
            name: 'department',
            label: "Department",
            options: {
                filter: true,
            }
        }, 
         {
            name: 'status',
            label: "Status",
            options: {
                filter: true,
            }
        }, {
            name: 'createdAt',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <button className="action_btn" title='View'>
                                <ViewIcon />
                            </button>
                            <button className="action_btn" title='Edit'>
                                <EditIcon />
                            </button>
                            <button className="action_btn" title='Remove'>
                                <DisableIcon />
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
                    title={"Product Sub Catogery List"}
                    data={userData}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default  SubProductTab  