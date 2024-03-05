import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';


const ChildMuiTable = () =>{


    const parentData = [{
        s_no: '1',
        parent_menu_name: 'Parent Management',
        child_menu_name: 'Manage type',
        page_name: 'manage_type.php',
        
        
        stutus:'ACTIVE',
    }, {
        s_no: '2',
        parent_menu_name: 'Parent Management',
        child_menu_name: 'Manage Contact List',
        page_name: 'manage_contact_list.php',
        stutus:'DEACTIVE',
    },{
        s_no: '3',
        parent_menu_name: 'Parent Management',
        child_menu_name: 'Manage type',
        page_name: 'manage_type.php',
        stutus:'ACTIVE',
    },
    ]
    const columns = [
        {
            name: 's_no',
            label: "Sr.No",
            options: {
                filter: true,
            }
        }, {
            name: 'parent_menu_name',
            label: "Parent Menu Name.",
            options: {
                filter: true,
            }
        }, {
            name: 'child_menu_name',
            label: "Child Menu Name",
            options: {
                filter: true,
            }
        }, {
            name: 'page_name',
            label: "Page Name",
            options: {
                filter: true,
            }
        }, 
      {
            name: 'stutus',
            label: "Stutus",
            options: {
                filter: true,
            }
        },
        
        
        {
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


    return(

<>
            <div className="miuiTable">
                <MUIDataTable
                    title={"Child Menu List"}
                    data={ parentData}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default ChildMuiTable