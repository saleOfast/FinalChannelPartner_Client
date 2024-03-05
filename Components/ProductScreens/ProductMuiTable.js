import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../Svg/ViewIcon';
import ListVicn from '../Svg/ListVicn';
import EditIcon from '../Svg/EditIcon';
import moment from "moment";
import Link from "next/link";
import DeleteIcon from "../Svg/DeleteIcon";


const ProductMuiTable = ({
  dataList,
  openTaxMapModel,
  title,
  disableConfirm,
}) => {
  const columns = [
    {
      name: "p_name",
      label: "Product Name",
      options: {
        filter: true,
      },
    },
    {
      name: "p_code",
      label: "Product code",
      options: {
        filter: true,
      },
    },
    {
      name: "p_price",
      label: "List Price",
      options: {
        filter: true,
      },
    },
    {
      name: "db_p_cat",
      label: "Product Category",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>{value?.p_cat_name}</>
          );
        },
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
      name: "p_id",
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
      name: "p_id",
      label: "Action",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <Link href={`/ProductTaxmapping?id=${value}`}>
                <button
                  className="action_btn x2"
                  title="Tax mapping">
                  <ListVicn />
                </button>
              </Link>

              <Link href={`/ProductView?id=${value}`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>

              <Link href={`/AddProduct?id=${value}`}>
                <button className="action_btn" title="Edit">
                  <EditIcon />
                </button>
              </Link>
              <button
                onClick={() => disableConfirm(value)}
                className="action_btn"
                title="Disable">
                <DeleteIcon />
              </button>

            </div >
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

export default ProductMuiTable