import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";


const AddExpenseMui = ({ policyAppList, viewRemark, title , isTravel  }) => {

    const columns = [
        {
            name: 'ExpenceSubmittedBy',
            label: "Submit By",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user ? value.user : ''}</>
                    )
                }
            }
        },
        {
            name: 'ExpenceSubmittedTo',
            label: "Application Submit To",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.user ? value.user : ''}</>
                    )
                }
            }
        },

        // {
        //     name: 'claim_type',
        //     label: "claim Type",
        //     options: {
        //         filter: true,
        //     }
        // },
        {
            name: 'from_date',
            label: "From Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY LTS")}</>
                    )
                }
            }
        },

        {
            name: 'to_date',
            label: "To Date",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{moment(value).format("DD-MM-YYYY LTS")}</>
                    )
                }
            }
        },


        {
            name: 'db_policy_head',
            label: "Policy Type",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>{value?.policy_name ? value.policy_name : ''}</>
                    )
                }
            }
        },
        {
            name: 'total_expence',
            label: "Total Expense",
            options: {
                filter: true,

            }
        },
                 
        { 
            name: 'kms',
            label: "Distance in Km.",
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
        },
        /*   {
              name: 'expence_id',
              label: "Action",
              options: {
                  filter: true,
                  customBodyRender: (value, tableMeta, updateValue) => {
                      return (
                          <>
                              <div className="table_btns">
                                  <button
                                      className="action_btn"
                                      title='View Remark'
                                      onClick={() => viewRemark(tableMeta.rowData)} >
                                      <ViewIcon />
                                  </button>
                              </div>
                          </>
                      )
                  }
              }
          }, */
        {
            name: 'remark',
            label: "Remark",
            options: {
                filter: true,
            }
        },

    ];

    const options = {
        selectableRows: 'none',
        responsive: 'standard'

    };

    return (
        <>
            <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    data={policyAppList}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}


export default AddExpenseMui