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
            name: 'campaign_name',
            label: "Campaign Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'acc_id',
            label: "Client Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'cmpn_s_id',
            label: "Status",
            options: {
                filter: true,
            }
        },
        {
            name: 'contact',
            label: "Contact",
            options: {
                filter: true,
            }
        },
        {
            name: 'campaign_brand',
            label: "Campaign Brand",
            options: {
                filter: true,
            }
        },
        {
            name: 'campaign_duration',
            label: "Campaign Duration",
            options: {
                filter: true,
            }
        },
        {
            name: 'cmpn_p_id',
            label: "Proof of Confirmation",
            options: {
                filter: true,
            }
        },
        {
            name: 'cmpn_b_t_id',
            label: "Business Type",
            options: {
                filter: true,
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
            name: 'campaign_id',
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
        campaign_name:list?.campaign_name,
        acc_id:list?.accountName?.acc_id,
        cmpn_s_id:list?.cmpn_s_id,
        contact:list?.contact,
        campaign_brand:list?.campaign_brand,
        campaign_duration:list?.campaign_duration,
        cmpn_p_id:list?.cmpn_p_id,
        cmpn_b_t_id:list?.cmpn_b_t_id,
        campaign_id:list?.campaign_id

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