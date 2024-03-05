import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import Link from "next/link";

const ManageProfileTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title }) => {

  const columns = [
    {
      name: 'name',
      label: "Name",
      options: {
        filter: true,
      }
    },
    {
      name: 'mobile',
      label: "Mobile No.",
      options: {
        filter: true,
      }
    },
    {
      name: 'user_id',
      label: "User Id",
      options: {
        filter: true,
      }
    },
    {
      name: 'profile_level',
      label: "Profile Level",
      options: {
        filter: true,
      }
    },
    {
      name: 'status',
      label: "Status",
      options: {
        filter: true,
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
      name: 'u_id',
      label: "Action",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <button
                className="action_btn"
                title='View'
              >
                <ViewIcon />
              </button>

              <Link href='/AddProfilePermission'>
                <button
                  className="action_btn"
                  title='Edit'
                  onClick={() => { openEdtMdl(tableMeta.rowData) }} >
                  <EditIcon />
                </button>
              </Link>
              {tableMeta.rowData[2] ? <button
                onClick={() => disableConfirm(value)}
                className="action_btn"
                title='Disable'>
                <DisableIcon />
              </button> : null}

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

  )
}

export default ManageProfileTable;
