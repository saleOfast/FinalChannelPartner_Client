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

const DistributorManagementTable = ({
  dataList,
  disableConfirm,
  openEdtMdl,
  title,
  loader
}) => {
  const columns = [
    {
      name: "call_subject",
      label: "Event Name",
      options: {
        filter: true,
      },
    },
   {
      name: "event_date",
      label: "Event Date",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{moment(value).format("DD-MM-YYYY LT")} </>
          );
        }
      },
    },
    {
      name: "due_date",
      label: "Due Date",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{moment(value).format("DD-MM-YYYY LT")} </>
          );
        }
      },
    },
    {
      name: "contact_person_name",
      label: "Contact person",
      options: {
        filter: true,
      },
    },
     {
      name: "db_lead",
      label: "Link With Leads",
      options: {
        filter: true,
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   if (value?.lead_id) {
        //     return (
        //       <Link href={`/LeadsView?id=${value.lead_id}`}>
        //         {/* <>{value?.lead_name}</> */}
        //         <>{value}</>
        //       </Link>
        //     );
        //   } else {
        //     return "---";
        //   }
        // },
        customBodyRender: (value, tableMeta, updateValue) => {
          if (tableMeta?.rowData[9]) {
            return (
              <Link href={`/media/LeadsView?id=${tableMeta?.rowData[9]}`}>                
                <>{value}</>
              </Link>
            );
          } else {
            return "---";
          }
        },
      },
    },

    {
      name: "db_opportunity",
      label: "Link With Opportunity",
      options: {
        filter: true,
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   if (value?.opp_id) {
        //     return (
        //       <Link href={`/OpportunityView?id=${value.opp_id}`}>
        //         <>{value?.opp_name}</>
        //       </Link>
        //     );
        //   } else {
        //     return "---"; // Do not render anything if opp_id is null
        //   }
        // },
        customBodyRender: (value, tableMeta, updateValue) => {
          if (tableMeta?.rowData[10]) {
            return (
              <Link href={`/OpportunityView?id=${tableMeta?.rowData[10]}`}>
                <>{value}</>
              </Link>
            );
          } else {
            return "---"; // Do not render anything if opp_id is null
          }
        },
      },
    },
    
    {
      name: "cts_no",
      label: "CTS No.",
      options: {
        filter: true,
      },
    },
    {
      name: "db_task_status",
      label: "Status",
      options: {
        filter: false,
        display: false,
        download:false,
        viewColumns:false,
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return (
        //     <div className="status_box">
        //       {value?.task_status_name == 'Open' || value?.task_status_name == 'Pending' ?
        //         <span className="active status_btn">
        //           {value?.task_status_name}
        //         </span> :
        //         <span className="inactive status_btn">
        //           {value?.task_status_name}
        //         </span>}
        //     </div>
        //   );
        // },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="status_box">
              {value == 'Open' || value == 'Pending' ?
                <span className="active status_btn">
                  {value}
                </span> :
                <span className="inactive status_btn">
                  {value}
                </span>}
            </div>
          );
        },
      },
    },
    {
      name: "call_lead_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link href={`/media/AddEvent?id=${value}&vw=md`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/media/AddEvent?id=${value}`}>
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
    {
      name: "lead_id",
      label: "Lead Id",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        display:false
      },
    },
    {
      name: "opp_id",
      label: "Opp Id",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        display:false
      },
    },
  ];
  const options = {
    selectableRows: 'none',
    responsive: "standard",
    downloadOptions:{filename:"EventsList.csv"}
  };

  const mappedDataList=dataList.map(list=>({
    call_subject:list?.call_subject,
    event_date:list?.event_date,
    due_date:list?.due_date,
    contact_person_name:list?.contact_person_name,
    db_lead:list?.db_lead?.lead_name,
    db_opportunity:list?.opp_name,
    cts_no:list?.cts_no,
    db_task_status:list?.db_task_status?.task_status_name,
    call_lead_id:list?.call_lead_id,
    lead_id:list?.db_lead?.lead_id,
    opp_id:list?.db_opportunity?.opp_id,
  }))

  return (
    <>
    {
      loader ?<><Loader/></> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={mappedDataList}
          // data={dataList}
          columns={columns}
          options={options}
        />
      </div>
      )
    }
      
    </>
  );
};

export default DistributorManagementTable