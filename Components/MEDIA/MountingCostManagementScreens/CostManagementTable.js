import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../../Svg/ViewIcon';
import DisableIcon from '../../Svg/DisableIcon';
import EditIcon from '../../Svg/EditIcon';
import Link from "next/link";
import moment from 'moment';
import DeleteIcon from '../../Svg/DeleteIcon';
import Loader from '../../Loader/Loader';

const CostManagementTable = ({
  dataList,
  disableConfirm,
  openEdtMdl,
  title,
  loader

}) => {
  const columns = [
    {
      name: "acc_name",
      label: "Account Name",
      options: {
        filter: true,
      },
    },
    // {
    //   name: "due_date",
    //   label: "Due Date",
    //   options: {
    //     filter: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <>{moment(value).format("DD-MM-YYYY LT")} </>
    //       );
    //     }
    //   },
    // },
      {
        name: "db_media_type",
        label: "Media Type",
        options: {
          filter: true,
        },
      },
      {
        name: "mo_c_cost",
        label: "Mounting cost / sq. ft.",
        options: {
          filter: true,
        },
      },
      {
        name: "status",
        label: "Status",
        options: {
          filter: true,

          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="status_box">
                {value == 'Open' || value == 'Pending' ?
                  <span className="active status_btn">
                    {value}
                  </span> :
                  // <span className="inactive status_btn">
                  //   {value}
                  // </span>
                  <span 
                    className="inactive status_btn" 
                    style={{ 
                      color: 
                        value === 'open' ? 'blue' : 
                        value === 'ACTIVE' ? 'green' : 
                        value === 'INACTIVE' ? 'gray' : 
                        value === 'close' ? 'red' : 
                        'black' 
                    }}
                  >
                    {value}
                  </span>
  
                  }
              </div>
            );
          },
        },
      },
   
    // {
    //   name: "assignedToUser",
    //   label: "Assigned To",
    //   options: {
    //     filter: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         // <>{value?.user}</>
    //         <>{value}</>
    //       );
    //     },
    //   },
    // }, 
    // {
    //   name: "db_lead",
    //   label: "Link With Leads",
    //   options: {
    //     filter: true,
    //     // customBodyRender: (value, tableMeta, updateValue) => {
    //     //   if (value?.lead_id) {
    //     //     return (
    //     //       <Link href={`/LeadsView?id=${value.lead_id}`}>
    //     //         <>{value?.lead_name}</>
    //     //       </Link>
    //     //     );
    //     //   } else {
    //     //     return "---";; // Do not render anything if lead_id is null
    //     //   }
    //     // },

    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       if (tableMeta?.rowData[9]) {
    //         return (
    //           <Link href={`/LeadsView?id=${tableMeta?.rowData[9]}`}>
    //             <>{value}</>
    //           </Link>
    //         );
    //       } else {
    //         return "---";; // Do not render anything if lead_id is null
    //       }
    //     },
    //   },
    // },

    // {
    //   name: "linkWithOpportunity",
    //   label: "Link With Opportunity",
    //   options: {
    //     filter: true,
    //     // customBodyRender: (value, tableMeta, updateValue) => {
    //     //   if (value?.opp_id) {
    //     //     return (
    //     //       <Link href={`/OpportunityView?id=${value.opp_id}`}>
    //     //         <>{value?.opp_name}</>
    //     //       </Link>
    //     //     );
    //     //   } else {
    //     //     return "---"; // Do not render anything if opp_id is null
    //     //   }
    //     // },
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       if (tableMeta?.rowData[10]) {
    //         return (
    //           <Link href={`/OpportunityView?id=${tableMeta?.rowData[10]}`}>
    //             <>{value}</>
    //           </Link>
    //         );
    //       } else {
    //         return "---"; // Do not render anything if opp_id is null
    //       }
    //     },
    //   },
    // },
    
    // {
    //   name: "db_task_priority",
    //   label: "Priority",
    //   options: {
    //     filter: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         // <>{value?.task_priority_name}</>
    //         <>{value}</>
    //       );
    //     },
    //   },
    // },
    // {
    //   name: "db_task_status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     // customBodyRender: (value, tableMeta, updateValue) => {
    //     //   return (
    //     //     <div className="status_box">
    //     //       {value?.task_status_name == 'Open' || value?.task_status_name == 'Pending' ?
    //     //         <span className="active status_btn">
    //     //           {value?.task_status_name}
    //     //         </span> :
    //     //         <span className="inactive status_btn">
    //     //           {value?.task_status_name}
    //     //         </span>}
    //     //     </div>
    //     //   );
    //     // },
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <div className="status_box">
    //           {value == 'Open' || value == 'Pending' ?
    //             <span className="active status_btn">
    //               {value}
    //             </span> :
    //             // <span className="inactive status_btn">
    //             //   {value}
    //             // </span>
    //             <span 
    //               className="inactive status_btn" 
    //               style={{ 
    //                 color: 
    //                   value === 'open' ? 'blue' : 
    //                   value === 'active' ? 'green' : 
    //                   value === 'inactive' ? 'gray' : 
    //                   value === 'close' ? 'red' : 
    //                   'black' 
    //               }}
    //             >
    //               {value}
    //             </span>

    //             }
    //         </div>
    //       );
    //     },
    //   },
    // },
    {
      name: "mo_c_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link href={`/media/AddMountingCost?id=${value}&vw=md`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/media/AddMountingCost?id=${value}`}>
                <button className="action_btn" title="Edit">
                  <EditIcon />
                </button>
              </Link>
              <button
                onClick={() => disableConfirm(value)}
                className="action_btn"
                title="Disable" >
                <DeleteIcon />
              </button>
            </div>
          );
        },
      },
    },
    // {
    //   name: "lead_id",
    //   label: "Task Name",
    //   options: {
    //     display:false,
    //     filter: false,
    //     download:false,
    //     viewColumns:false,
    //   },
    // },
    // {
    //   name: "opp_id",
    //   label: "Task Name",
    //   options: {
    //     display:false,
    //     filter: false,
    //     download:false,
    //     viewColumns:false,
    //   },
    // },
  ];
 const options = {
        selectableRows: 'none',
        responsive: "standard",
        downloadOptions:{filename:"TasksList.csv"},
        filterType:'multiselect'
    };

  const mappedDataList=dataList?.map(list=>({
    acc_name:list.acc_name,
    db_media_type:list.db_media_type.m_t_name,
    mo_c_cost:list.mo_c_cost,
    status:list.status,
    mo_c_id:list.mo_c_id,

    // task_name:list?.task_name,
    // due_date:list?.due_date,
    // task_type:list?.task_type,
    // assignedToUser:list?.assignedToUser?.user,
    // db_lead:list?.db_lead?.lead_name,
    // linkWithOpportunity:list?.linkWithOpportunity?.opp_name,
    // db_task_priority:list?.db_task_priority?.task_priority_name,
    // db_task_status:list?.db_task_status?.task_status_name,
    // task_id:list?.task_id,
    // lead_id:list?.db_lead?.lead_id,
    // opp_id:list?.linkWithOpportunity?.opp_id
  }))

  return (
    <>
    {
      loader ? <><Loader/></> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          // data={dataList}
          data={mappedDataList}
          columns={columns}
          options={options}
        />
      </div>
      ) 

    }
     
    </>
  );
};

export default CostManagementTable