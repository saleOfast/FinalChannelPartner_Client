import React from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../Svg/ViewIcon";
import DisableIcon from "../Svg/DisableIcon";
import EditIcon from "../Svg/EditIcon";
import DeleteIcon from "../Svg/DeleteIcon";
import CheckIcon from "../Svg/CheckIcon";
import { filesUrl } from "../../Utils/Constants";
import Loader from "../Loader/Loader";

const ManagebrandScreenTab = ({
  deleteConfirm,
  brandList,
  openEdtMdl,
  title,
  loader
}) => {
  const columns = [
    {
      name: "brand_name",
      label: "Brand Name",
      options: {
        filter: true,
      },
    },
    {
      name: "brand_image",
      label: "Preview",
      options: {
        filter:true,
        customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <div>
                    {
                      value ?<img
                      src={`${filesUrl}`+`/brand/images${value}`}
                      alt="Preview"
                      style={{
                        width: "80px",
                        height: "60px",
                        
                      }}
                    /> :""
                    }
                    
                  </div>
                );
              },
      },
    },
    {
      name: "brand_id",
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
        responsive: "standard",
        downloadOptions:{filename:"BrandList.csv"}
    };

  return (
    <>
    {
      loader ? <Loader/> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          data={brandList}
          columns={columns}
          options={options}
        />
      </div>
      )
    }
      
    </>
  );
};

export default ManagebrandScreenTab;
