import React from "react";
import MUIDataTable from "mui-datatables";
import Loader from "../Loader/Loader";

const DailyActivityTable = ({ dataList, title, loader }) => {
  const columns = [
    {
      name: "assignedOpp",
      label: "Name",
      options: {
        filter: true,
        customBodyRender: (value) => (
          <>{typeof value === "object" ? value?.user || value?.user_name || "" : value || ""}</>
        ),
      },
    },
    {
      name: "leads",
      label: "Leads",
      options: { filter: true },
    },
    {
      name: "tasks",
      label: "Tasks",
      options: { filter: true },
    },
    {
      name: "events",
      label: "Events",
      options: { filter: true },
    },
    {
      name: "opportunities",
      label: "Opportunities",
      options: { filter: true },
    },
    {
      name: "total",
      label: "Total Activity",
      options: { filter: true },
    },
  ];

  const options = {
    selectableRows: "none",
    responsive: "standard",
    downloadOptions: {
      filename: "DailyActivity.csv",
    },
    filterType: "multiselect",
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="miuiTable">
          <MUIDataTable
            title={title}
            data={Array.isArray(dataList) ? dataList : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </>
  );
};

export default DailyActivityTable;
