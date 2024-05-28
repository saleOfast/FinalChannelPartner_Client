import React from "react";
import MUIDataTable from "mui-datatables";
import Link from "next/link";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import CheckIcon from "../Svg/CheckIcon";
import { filesUrl } from "../../Utils/Constants";

const ManageProductCategoryTab = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title }) => {

    // const columns = [
    //     {
    //         name: 'p_cat_name',
    //         label: "Category Name",
    //         options: {
    //             filter: true,
    //         }
    //     },
    //     {
    //         name: 'p_cat_code',
    //         label: "Category Code",
    //         options: {
    //             filter: true,
    //         }
    //     },
    //     {
    //         name:"image",
    //         label:"Image",
    //         options:{
    //           customBodyRender:(value)=>{
    //             return(
    //               <div>
    //                 {value == null ? <></> : <img
    //                 src={`${filesUrl}`+`/category/images${value}`}
    //                 alt="Preview"
                    
    //                 style={{
                    
    //                   width: "80px",
    //                   height: "60px",
    //                 }}
    //               />}
                  
    //             </div>
    //             )
    //           }
    //         }
    //       },
    //     {
    //         name: 'status',
    //         label: "Status",
    //         options: {
    //             filter: true,
    //             customBodyRender: (value, tableMeta, updateValue) => {
    //                 return (
    //                     <div className='status_box'>
    //                         {value ? <span className='active status_btn'>active</span> :
    //                             <span className='inactive status_btn'>inactive</span>}
    //                     </div>
    //                 )
    //             }
    //         }
    //     },
    //     {
    //         name: 'p_cat_id',
    //         label: "Action",
    //         options: {
    //             filter: true,
    //             customBodyRender: (value, tableMeta, updateValue) => {
    //                 console.log(value)
    //                 console.log(tableMeta)
    //                 return (
    //                     <div className="table_btns">

    //                         <Link href={`/AddProductCat?id=${value}`}>
    //                             <button
    //                                 className="action_btn"
    //                                 title='Edit'>
    //                                 <EditIcon />
    //                             </button>
    //                         </Link>
    //                         {tableMeta.rowData[3] ? <button
    //                             onClick={() => disableConfirm(value, 0)}
    //                             className="action_btn"
    //                             title='Disable'>
    //                             <DisableIcon />
    //                         </button> : <button
    //                             onClick={() => disableConfirm(value, 1)}
    //                             className="action_btn x2"
    //                             title="Enable" >
    //                             <CheckIcon />
    //                         </button>}

    //                         <button
    //                             onClick={() => deleteConfirm(value)}
    //                             className="action_btn"
    //                             title='Delete'>
    //                             <DeleteIcon />
    //                         </button>
    //                     </div>
    //                 )
    //             }
    //         }
    //     },
    // ];

    const columns = [
        {
            name: 'p_cat_name',
            label: "Category Name",
            options: {
                filter: true,
            }
        },
        {
            name: 'p_cat_code',
            label: "Category Code",
            options: {
                filter: true,
            }
        },
        {
            name: 'level',
            label: "Level",
            options: {
                filter: true,
            }
        },
        {
            name: 'parent_name',
            label: "Parent Category",
            options: {
                filter: true,
            }
        },
        {
            name:"image",
            label:"Image",
            options:{
                filter:true,
              customBodyRender:(value)=>{
                return(
                  <div>
                    {value == null ? <></> : <img
                    src={`${filesUrl}/category/images${value}`}
                    alt="Preview"
                    style={{
                      width: "80px",
                      height: "60px",
                    }}
                  />}
                  </div>
                )
              }
            }
          },
        {
            name: 'status',
            label: "Status",
            options: {
                filter:false,
                download:false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box'>
                            {value ? <span className='active status_btn'>active</span> :
                                <span className='inactive status_btn'>inactive</span>}
                        </div>
                    )
                }
            }
        },
        {
            name: 'p_cat_id',
            label: "Action",
            options: {
                filter:false,
                download:false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">

                            <Link href={`/AddProductCat?id=${value}`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link>
                            {tableMeta.rowData[5] ? <button
                                onClick={() => disableConfirm(value, 0)}
                                className="action_btn"
                                title='Disable'>
                                <DisableIcon />
                            </button> : <button
                                onClick={() => disableConfirm(value, 1)}
                                className="action_btn x2"
                                title="Enable" >
                                <CheckIcon />
                            </button>}

                            <button
                                onClick={() => deleteConfirm(value)}
                                className="action_btn"
                                title='Delete'>
                                <DeleteIcon />
                            </button>
                        </div>
                    )
                }
            }
        },
    ];
    

    const flattenDataList = (data) => {
        let flatList = [];

        data.forEach(item => {
            // Add parent category
            flatList.push({
                ...item,
                level: 'Parent',
                parent_name: ''
            });

            // Add child categories
            item.children.forEach(child => {
                flatList.push({
                    ...child,
                    level: 'Child',
                    parent_name: item.p_cat_name
                });
            });
        });

        return flatList;
    };


    const options = {
        selectableRows: 'none',
        responsive: "standard",
        downloadOptions:{filename:"ProductCategoryList.csv"}
    };

    

    return (
        <>
            <div className="miuiTable">
                <MUIDataTable
                    title={title}
                    // data={dataList}
                    data={flattenDataList(dataList)}
                    columns={columns}
                    options={options}
                />
            </div>
        </>

    )
}

export default ManageProductCategoryTab  