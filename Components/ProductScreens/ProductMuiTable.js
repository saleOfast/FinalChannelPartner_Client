import React from 'react'
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from '../Svg/ViewIcon';
import ListVicn from '../Svg/ListVicn';
import EditIcon from '../Svg/EditIcon';
import moment from "moment";
import Link from "next/link";
import DeleteIcon from "../Svg/DeleteIcon";
import { filesUrl } from '../../Utils/Constants';
import Loader from '../Loader/Loader';


const ProductMuiTable = ({
  dataList,
  openTaxMapModel,
  title,
  disableConfirm,
  loader
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
      name: "discount",
      label: "Discount %",
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
            // <>{value?.p_cat_name}</>
            <>{value}</>
          );
        },
      },
    },
    {
      name: "db_dms_brand",
      label: "Brand Name",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // <>{value?.brand_name}</>
            <>{value}</>
          );
        },
      },
    },
    {
      name:"image",
      label:"Image",
      options:{
        filter:true,
        customBodyRender:(value)=>{
          return(
            <div>
              {!value ? <></> :
            <img
              src={`${filesUrl}`+`/product/images${value}`}
              alt="Preview"
              style={{
                width: "80px",
                height: "60px",
              }}
            />
          }
          </div>
          )
        }
      }
    },
    {
      name:"unit_in_case",
      label:"Case Unit",
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
      name: "p_id",
      label: "Status",
      options: {
        filter: false,
        download:false,
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
        filter: false,
        download:false,
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
        responsive: "standard",
        downloadOptions:{filename:"ProductList.csv"}
    };

  const mappedDataList=dataList?.map(list=>({
      p_name:list?.p_name,
      p_code:list?.p_code,
      p_price:list?.p_price,
      discount:list?.discount,
      db_p_cat:list?.db_p_cat?.p_cat_name,
      db_dms_brand:list?.db_dms_brand?.brand_name,
      image:list?.image,
      unit_in_case:list?.unit_in_case,
      createdAt:list?.createdAt,
      p_id:list?.p_id
  }))

  return (
    <>
    {
      loader ? <Loader/> :(
        <div className="miuiTable">
        <MUIDataTable
          title={title}
          // data={dataList}
          data={mappedDataList}
          columns={columns}
          options={options}
        />
      </div>
      )
    }
      
    </>
  );
};

export default ProductMuiTable