import React from "react";
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from "../Svg/ViewIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";
import ClosedConverted from "../Svg/ClosedConverted";

const ManageLeadTable = ({
  dataList,
  openCloseConvert,
  title,
  disableConfirm,
}) => {

  const columns = [
    {
      name: "lead_name",
      label: "Lead Name",
      options: {
        filter: true,
      },
    },
    {
      name: "company_name",
      label: "Company Name",
      options: {
        filter: true,
      },
    },
    {
      name: "p_contact_no",
      label: "Mobile",
      options: {
        filter: true,
      },
    },
    {
      name: "createdAt",
      label: "Creation Date",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <>{moment(value).format("DD-MM-YYYY LT")} </>;
        },
      },
    },
    {
      name: "db_user",
      label: "Assign Name",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <>{value?.user ? value.user : ""}</>;
        },
      },
    },
    {
      name: "db_lead_status",
      label: "Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="status_box">
              <span className={`status${value.lead_status_id} status_btn`}>{value?.lead_status_id ? value.status_name : ""}</span>
            </div>
          );
        },
      },
    },
    {
      name: "lead_id",
      label: "Action",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // /AddLeads?id=${value}&vw=mds`
            <div className="table_btns">
              <Link href={`AddLeads?id=${value}&vw=mds`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/AddLeads?id=${value}`}>
                <button className="action_btn" title="Edit">
                  <EditIcon />
                </button>
              </Link>
              <button
                onClick={() => disableConfirm(value)}
                className="action_btn"
                title="Delete">
                <DeleteIcon />
              </button>
              {tableMeta?.rowData[5]?.lead_status_id == 1 || tableMeta?.rowData[5]?.lead_status_id == 2 ?
                <button
                  onClick={() => openCloseConvert(value)}
                  className="action_btn x2"
                  title="Close-converted">
                  <ClosedConverted />
                </button> : null}
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

export default ManageLeadTable;
