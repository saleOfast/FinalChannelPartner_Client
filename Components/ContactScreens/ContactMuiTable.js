import React from "react";
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";


const ContactMuiTable = ({ accountsList, openConfirmBox , title }) => {

    const columns = [
        {
            name: 'first_name',
            label: "Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'accountName',
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
            name: 'contact_no',
            label: "Contact No",
            options: {
                filter: true,
            }
        },
        {
            name: 'email_id',
            label: "Email Id ",
            options: {
                filter: true,
            }
        },
        
        
        {
            name: 'contact_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/AddContact?id=${value}&vw=mds`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>
                            <Link href={`/AddContact?id=${value}`}>
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
        responsive: "standard"
    };

    return (
        <>
            <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    data={accountsList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}


export default ContactMuiTable