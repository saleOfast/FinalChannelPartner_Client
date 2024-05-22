import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import CheckIcon from "../Svg/CheckIcon";
import { filesUrl } from "../../Utils/Constants";

const ManageCouponScreenTab = ({
  deleteConfirm,
  couponList,
  openEdtMdl,
  title,
}) => {
  const columns = [
    {
      name: "coupon_name",
      label: "Coupon Name",
      options: {
        filter: true,
      },
    },
    {
      name: "value",
      label: "Value",
      options: {
        filter: true,
      },
    },
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
      },
    },
    {
      name: "use_type",
      label: "Use Type",
      options: {
        filter: true,
      },
    },
    {
      name: "coupon_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
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
          data={couponList}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
};

export default ManageCouponScreenTab;
