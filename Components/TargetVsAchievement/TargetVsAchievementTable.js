import React from "react";
import MUIDataTable from "mui-datatables";
import Loader from "../Loader/Loader";

const TargetVsAchievementTable = ({ dataList, title, loader }) => {
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
      name: "target",
      label: "Target",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta) => {
          const row = Array.isArray(dataList) ? dataList[tableMeta?.rowIndex] : null;
          if (row && row.target_set === false) return <>Not Set</>;
          if (!Number(value)) return <>Not Set</>;
          return <>{Number(value).toFixed(2)}</>;
        },
      },
    },
    {
      name: "achievement",
      label: "Achievement",
      options: {
        filter: true,
        customBodyRender: (value) => <>{Number(value || 0).toFixed(2)}</>,
      },
    },
    {
      name: "gap",
      label: "Gap",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta) => {
          const row = Array.isArray(dataList) ? dataList[tableMeta?.rowIndex] : null;
          if (row && row.target_set === false) return <>—</>;
          return <>{Number(value || 0).toFixed(2)}</>;
        },
      },
    },
    {
      name: "achievement_percent",
      label: "Achievement %",
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value == null || value === "") return <>—</>;
          return <>{Number(value || 0).toFixed(2)}%</>;
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    responsive: "standard",
    downloadOptions: {
      filename: "TargetVsAchievement.csv",
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

export default TargetVsAchievementTable;
