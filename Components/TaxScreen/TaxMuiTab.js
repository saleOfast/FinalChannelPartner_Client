import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import Link from 'next/link';

const TaxMuiTab = ({ opnCnfrmBox, taxList, openEdtMdl, title }) => {

    const columns = [

        {
            name: 'tax_name',
            label: "Tax Name",
            options: {
                filter: true,
            }
        }, {
            name: 'tax_code',
            label: "Tax Code",
            options: {
                filter: true,
            }
        }, {
            name: 'tax_type',
            label: "Tax Type",
            options: {
                filter: true,
            }
        },
        {
            name: 'tax_percentage',
            label: "Tax Percentage",
            options: {
                filter: true,
            }
        },
        {
            name: 'mode',
            label: "Tax Mode",
            options: {
                filter: true,
            }
        },
         {
            name: 'tax_id',
            label: "Action",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">

                            <Link href={`/AdditionTaxPage?id=${value}`}>
                                <button className="action_btn" title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>

                            <button
                                className="action_btn" title='Remove'
                                onClick={() => opnCnfrmBox(value)} >
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
                    title={title}
                    data={taxList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default TaxMuiTab