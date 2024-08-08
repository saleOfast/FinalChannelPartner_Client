import React from "react";
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from "../../Svg/ViewIcon";
import DisableIcon from "../../Svg/DisableIcon";
import EditIcon from "../../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../../Svg/DeleteIcon";
import Loader from "../../Loader/Loader";


const PrintingCostTable = ({ accountsList, openConfirmBox , title, loader }) => {

    const columns = [
        {
            name: 'acc_name',
            label: "Account Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'm_t_id',
            label: "Media Type",
            options: {
                filter: true,
            }
        },
        {
            name: 'pr_m_id',
            label: "Printing Material",
            options: {
                filter: true,
            }
        },
        {
            name: 'pr_c_cost',
            label: "Printing Cost/Sq. Ft.",
            options: {
                filter: true,
            }
        },
        // {
        //     name: 'status',
        //     label: "Status.",
        //     options: {
        //         filter: true,
        //     }
        // },
        {
            name: 'status',
            label: "Status",
            options: {
                filter: false,
                download: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            {value =="ACTIVE" ? <span className='active status_btn'>active</span> :
                                <span className='inactive status_btn'>inactive</span>}
                        </div>
                    )
                }
            }
        },



        // {
        //     name: 'accountName',
        //     label: "Account Name",
        //     options: {
        //         filter: true,
        //         customBodyRender: (value, tableMeta, updateValue) => {
        //             return (
        //                 // <>{value?.acc_name? value.acc_name : ''}</>
        //                 <>{value ? value : ''}</>
        //             )
        //         }
        //     }
        // }, 
        
        // {
        //     name: 'contact_no',
        //     label: "Contact No",
        //     options: {
        //         filter: true,
        //     }
        // },
        // {
        //     name: 'email_id',
        //     label: "Email Id ",
        //     options: {
        //         filter: true,
        //     }
        // },
        
        
        {
            name: 'pr_c_id',
            label: "Action",
            options: {
                filter:false,
                download:false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/media/AddPrintingCost?id=${value}&vw=mds`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>
                            <Link href={`/media/AddPrintingCost?id=${value}`}>
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
        downloadOptions:{filename:"ContactList.csv"}
    };

    const mappedDataList=accountsList?.map(list=>({
        acc_name:list?.acc_name,
        m_t_id:list?.db_media_type?.m_t_name,
        pr_m_id:list?.db_printing_material?.pr_m_name,
        pr_c_cost:list?.pr_c_cost,
        status:list?.status,
        pr_c_id:list?.pr_c_id
    }))

    return (
        <>
        {
            loader ?<Loader/> :(
                <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    // data={accountsList}
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


export default PrintingCostTable