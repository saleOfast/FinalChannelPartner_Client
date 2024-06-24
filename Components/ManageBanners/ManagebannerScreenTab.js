import React from "react";
import MUIDataTable from "mui-datatables";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import { filesUrl } from "../../Utils/Constants";
import Loader from "../Loader/Loader"

const Managebannerscreentab = ({
  deleteConfirm,
  bannerList,
  openEdtMdl,
  title,
  loader
}) => {
  const columns = [
    {
      name: "banner_alt",
      label: "Banner Alt",
      options: {
        filter: true,
      },
    },
    {
      name: "banner_link",
      label: "Banner Link",
      options: {
        filter: true,
      },
    },
    {
      name: "banner_image",
      label: "Preview",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <div className="">
                    <img
                      src={`${filesUrl}`+`/banner/images${value}`}
                      alt="Preview"
                      style={{
                        width: "80px",
                        height: "60px",
                        
                      }}
                      className=""
                    />
                  </div>
                );
              },
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      options: {
        filter: true,
      },
    },

    {
      name: "end_date",
      label: "End Date",
      options: {
        filter: true,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
      },
    },
    {
      name: "banner_id",
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
                onClick={() =>  openEdtMdl(tableMeta.rowData) }
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
        responsive: "standard",
        downloadOptions:{filename:"BannerList.csv"}
    };

  return (
    <>
    {
      loader ?<Loader/> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={bannerList}
          columns={columns}
          options={options}
        />
      </div> 
      )
    }

    </>
  );
};

export default Managebannerscreentab;
