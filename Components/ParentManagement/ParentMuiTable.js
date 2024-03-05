import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';


const ParentMuiTable = () =>{


    const parentData = [{
        s_no: '1',
        menu_name: 'Parent Management',
        page_name: 'parent_menu.php',
        icon: 'fa-icon',
        stutus:'ACTIVE',
    }, {
        s_no: '2',
        menu_name: 'Child Management',
        page_name: 'parent_menu.php',
        icon: 'fa-icon',
        stutus:'DEACTIVE',
    },{
        s_no: '3',
        menu_name: 'Parent Management',
        page_name: 'parent_menu.php',
        icon: 'fa-icon',
        stutus:'ACTIVE',
    },
    ]
    const columns = [
        {
            name: 's_no',
            label: "Sr. No",
            options: {
                filter: true,
            }
        }, {
            name: 'menu_name',
            label: "Menu Name.",
            options: {
                filter: true,
            }
        }, {
            name: 'page_name',
            label: "Page Name",
            options: {
                filter: true,
            }
        }, {
            name: 'icon',
            label: "Icon",
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
                    title={"Parent List"}
                    data={ parentData}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default ParentMuiTable