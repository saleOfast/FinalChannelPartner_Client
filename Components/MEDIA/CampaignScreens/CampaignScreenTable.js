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


const CampaignScreenTable = ({ accountsList, openConfirmBox , title, loader }) => {

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
            label: "Account Name",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.acc_name? value.acc_name : ''}</>
                        <>{value ? value : ''}</>
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
                filter:false,
                download:false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/media/AddCampaigns?id=${value}&vw=mds`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>
                            <Link href={`/media/AddCampaigns?id=${value}`}>
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
        first_name:list?.first_name,
        accountName:list?.accountName?.acc_name,
        contact_no:list?.contact_no,
        email_id:list?.email_id,
        contact_id:list?.contact_id
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


export default CampaignScreenTable