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
      name: "user",
      label: "Name",
      options: {
        filter: true,
      },
    },
   {
      name: "contact_number",
      label: "Phone",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value}</>
          );
        } 
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value}</>
          );
        } 
      },
    },
    {
      name: "address",
      label: "Physical Address",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value}</>
          );
        } 
      },
    },
    {
      name: "db_user_profile",
      label: "Conatct Person",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value?.contact_person}</>
          );
        } 
      },
    },
    {
      name: "db_user_profile",
      label: "Credit Limit",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value?.credit_limit}</>
          );
        } 
      },
    },
    {
      name: "user_code",
      label: "Action",
      options: {
        filter: false,
        download:false,
        viewColumns:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link href={`/dms/AddDistributor?id=${value}&vw=md`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/dms/AddDistributor?id=${value}`}>
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
    downloadOptions:{filename:"EventsList.csv"},
    enableNestedDataAccess:"."
  };

  

  return (
    <>
    {
      loader ?<><Loader/></> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={dataList}
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