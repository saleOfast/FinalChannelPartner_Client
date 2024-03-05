import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import CheckIcon from "../Svg/CheckIcon";

const AccountTypeScreenTab = ({
  deleteConfirm,
  disableConfirm,
  dataList,
  openEdtMdl,
  title,
}) => {
  const columns = [
    {
      name: "account_type_name",
      label: "Account Name",
      options: {
        filter: true,
      },
    },
    {
      name: "account_type_code",
      label: "Account Code",
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
              {value ? (
                <span className="active status_btn">active</span>
              ) : (
                <span className="inactive status_btn">inactive</span>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "account_type_id",
      label: "Action",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <button
                className="action_btn"
                title="Edit"
                onClick={() => {
                  openEdtMdl(tableMeta.rowData);
                }}
              >
                <EditIcon />
              </button>

              {tableMeta.rowData[2] ?
                <button
                  onClick={() => disableConfirm(value, 0)}
                  className="action_btn"
                  title="Disable">
                  <DisableIcon />
                </button>
                : <button
                  onClick={() => disableConfirm(value, 1)}
                  className="action_btn x2"
                  title="Enable" >
                  <CheckIcon />
                </button>}
              <button
                onClick={() => deleteConfirm(value)}
                className="action_btn"
                title="Delete"
              >
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

export default AccountTypeScreenTab;
