import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import EditIcon from '../Svg/EditIcon';
import Link from 'next/link';
import DeleteIcon from '../Svg/DeleteIcon';

const AccountMuiTable = ({ accountsList, openConfirmBox }) => {

    const columns = [
        {
            name: 'acc_name',
            label: "Account Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'acc_code',
            label: "Account Code",
            options: {
                filter: true,
            }
        },
        {
            name: 'website',
            label: "Website",
            options: {
                filter: true,
            }
        },
        {
            name: 'account_owner',
            label: "Account Owner",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        // <>{value?.user ? value.user : ''}</>
                        <>{value ? value : ''}</>
                    )
                }
            }
        }, {
            name: 'parent_name',
            label: "Parent Account",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value ? value : ''}</>
                    )
                }
            }
        }, 
        {
            name: 'lead_count',
            label: "Lead Count",
            options: {
                filter: true,
            }
        },
        {
            name: 'acc_id',
            label: "Action",
            options: {
                filter: false,
                download: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <Link href={`/AddAccount/?id=${value}&vw=mds`}>
                                <button className="action_btn" title="View">
                                    <ViewIcon />
                                </button>
                            </Link>
                            <Link href={`/AddAccount?id=${value}`}>
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

    const mappedDataList=accountsList?.map(list=>({
        acc_name:list?.acc_name,
        acc_code:list?.acc_code,
        website:list?.website,
        account_owner:list?.account_owner?.user,
        parent_name:list?.parent_name,
        lead_count:list?.lead_count,
        acc_id:list?.acc_id,
    }))

    return (
        <>
            <div className="miuiTable">
                <MUIDataTable
                    title={"Accounts List"}
                    // data={accountsList}
                    data={mappedDataList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default AccountMuiTable