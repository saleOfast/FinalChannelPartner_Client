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

const TasksMuiTable = ({
  dataList,
  disableConfirm,
  openEdtMdl,
  title,
  loader
 
}) => {
  const columns = [
    {
      name: "db_account.acc_name",
      label: "Vendor",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
                {value}
            </>
          );
        }
      },
    },
    {
      name: "db_country.country_name",
      label: "Country",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value} </>
          );
        }
      },
    },
    {
      name: "db_state.state_name",
      label: "State",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value} </>
          );
        }
      },
    },
    {
      name: "db_media_type.m_t_name",
      label: "Media Type",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // <>{value?.user}</>
            <>{value}</>
          );
        },
      },
    },
    {
      name: "db_media_vehicle.m_v_name",
      label: "Media Vehicle",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // <>{value?.user}</>
            <>{value}</>
          );
        },
      },
    }, 
    {
      name: "db_rating.rating_name",
      label: "Rating",
      options: {
        filter: true,
        

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // <>{value?.user}</>
            <>{value}</>
          );
        },
      },
    },

    {
      name: "db_site_category.site_cat_name",
      label: "Site Category",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // <>{value?.user}</>
            <>{value}</>
          );
        },
      },
    },
    
    {
      name: "db_site_status.s_s_name",
      label: "Site Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // <>{value?.task_priority_name}</>
            <>{value}</>
          );
        },
      },
    },
    {
      name: "site_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link href={`/media/AddSites?id=${value}&vw=md`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/media/AddSites?id=${value}`}>
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
        responsive: "standard",
        downloadOptions:{filename:"TasksList.csv"},
        enableNestedDataAccess:"."
    };

  // const mappedDataList=dataList?.map(list=>({
  //   task_name:list?.task_name,
  //   due_date:list?.due_date,
  //   task_type:list?.task_type,
  //   assignedToUser:list?.assignedToUser?.user,
  //   db_lead:list?.db_lead?.lead_name,
  //   linkWithOpportunity:list?.linkWithOpportunity?.opp_name,
  //   db_task_priority:list?.db_task_priority?.task_priority_name,
  //   db_task_status:list?.db_task_status?.task_status_name,
  //   task_id:list?.task_id,
  //   lead_id:list?.db_lead?.lead_id,
  //   opp_id:list?.linkWithOpportunity?.opp_id
  // }))

  return (
    <>
    {
      loader ? <><Loader/></> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={dataList}
          // data={mappedDataList}
          columns={columns}
          options={options}
        />
      </div>
      ) 

    }
     
    </>
  );
};

export default TasksMuiTable