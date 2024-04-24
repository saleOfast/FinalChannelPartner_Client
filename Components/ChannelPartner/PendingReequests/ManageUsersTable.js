import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../../Svg/ViewIcon";
import DisableIcon from "../../Svg/DisableIcon";
import EditIcon from "../../Svg/EditIcon";
import DeleteIcon from "../../Svg/DeleteIcon";
import CheckIcon from "../../Svg/CheckIcon";
import Link from "next/link";

const ManageUsersTable = ({
  deleteConfirm,
  disableConfirm,
  dataList,
  openEdtMdl,
  title,
}) => {
  const channelUserStatus = (key) => {
    switch (key) {
      case 0:
        return <span>Pending</span>;
        break;
      case 1:
        return <span>Under Process</span>;
        break;
      case 3:
        return <span>Rejected</span>;
        break;
      default:
        return <span>Completed</span>;
        break;
    }
  };

  const columns = [
    {
      name: "user_code",
      label: "Account Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "user",
      label: "Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "email",
      label: "E-mail",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "contact_number",
      label: "Mobile No",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "organisation",
      label: "Organisation",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "gst",
      label: "GST",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
      },
    },

    {
      name: "doc_verification",
      label: "Status",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#405189", color: "white" }} key={2}>
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className="status_box">{channelUserStatus(value)}</div>;
        },
      },
    },
    {
      name: "user_code",
      label: "Action",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th
            style={{ background: "#405189", color: "white", padding: "9px" }}
            key={2}
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link
                href={`/CHANNEL/ChannelAddUsersReject?id=${value}&mode=view`}
              >
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>

              {/* <Link href={`/ChannelAddUsers?id=${value}&mode=edit`}>
                                <button
                                    className="action_btn"
                                    title='Edit'>
                                    <EditIcon />
                                </button>
                            </Link> */}
              {/* {tableMeta.rowData[5] ?
                                <button
                                    onClick={() => disableConfirm(value, 0)}
                                    className="action_btn"
                                    title='Disable'>
                                    <DisableIcon />
                                </button>
                                : <button
                                    onClick={() => disableConfirm(value, 1)}
                                    className="action_btn x2"
                                    title='Enable'>
                                    <CheckIcon />
                                </button>}

                            <button
                                onClick={() => deleteConfirm(value, 0)}
                                className="action_btn"
                                title='Delete'>
                                <DeleteIcon />
                            </button> */}
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    responsive: "standard",
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

export default ManageUsersTable;
