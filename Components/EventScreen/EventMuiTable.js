import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import Link from "next/link";
import moment from 'moment';
import DeleteIcon from '../Svg/DeleteIcon';

const EventMuiTable = ({
  dataList,
  disableConfirm,
  openEdtMdl,
  title,

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
    }, {
      name: "db_lead",
      label: "Link With Leads",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value?.lead_id) {
            return (
              <Link href={`/LeadsView?id=${value.lead_id}`}>
                <>{value?.lead_name}</>
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
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value?.opp_id) {
            return (
              <Link href={`/OpportunityView?id=${value.opp_id}`}>
                <>{value?.opp_name}</>
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
        filter: true,
        display: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="status_box">
              {value?.task_status_name == 'Open' || value?.task_status_name == 'Pending' ?
                <span className="active status_btn">
                  {value?.task_status_name}
                </span> :
                <span className="inactive status_btn">
                  {value?.task_status_name}
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
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link href={`/AddEvent?id=${value}&vw=md`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/AddEvent?id=${value}`}>
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
          data={dataList}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
};

export default EventMuiTable