import React from "react";
import MUIDataTable from "mui-datatables";
// import moment from "moment";
import ViewIcon from "../Svg/ViewIcon";
import EditIcon from "../Svg/EditIcon";
import Link from "next/link";
import moment from "moment";
import DeleteIcon from "../Svg/DeleteIcon";
import ClosedConverted from "../Svg/ClosedConverted";
import Loader from "../Loader/Loader"

const ManageLeadTable = ({
  dataList,
  openCloseConvert,
  title,
  loader,
  disableConfirm,
  checkAccountMatch
}) => {
  
  const getUserName = (userObject) => {
    return userObject?.user ? userObject.user : "";
  };

  const columns = [
    {
      name: "lead_code",
      label: "Lead ID",
      options: {
        filter: true,
      },
    },
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
      name: "db_lead_source",
      label: "Source",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <>{value} </>;
        },
      },
    },
    {
      name: "db_user",
      label: "Assign Name",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          // return <>{value?.user ? value.user : ""}</>;
          return <>{value}</>;
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
              {/* <span className={`status${value?.lead_status_id} status_btn`}>{value?.lead_status_id ? value?.status_name : ""}</span> */}
              <span className={`status${tableMeta?.rowData[9]} status_btn`}>{ value}</span>
            </div>
          );
        },
      },
    },
    {
      name: "lead_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            // /AddLeads?id=${value}&vw=mds`
            <div className="table_btns">
              <Link href={`/crm/AddLeads?id=${value}&vw=mds`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              
              {
                  // tableMeta?.rowData[6]?.lead_status_id == 3 || tableMeta?.rowData[6]?.lead_status_id == 4  
                  tableMeta?.rowData[9] == 3 || tableMeta?.rowData[9] == 4  
                  ?
                  null : (
                    <>
                        <button
                onClick={() => disableConfirm(value)}
                className="action_btn"
                title="Delete">
                <DeleteIcon />
              </button>
              <Link href={`/crm/AddLeads?id=${value}`}>
              <button className="action_btn" title="Edit">
                <EditIcon />
              </button>
            </Link>
                    </>
                    
                  )
              }
              
              {
              // tableMeta?.rowData[6]?.lead_status_id == 1 || tableMeta?.rowData[6]?.lead_status_id == 2 
              tableMeta?.rowData[9] == 1 || tableMeta?.rowData[9] == 2 
              ?
                <button
                  onClick={() =>{ 
                    
                    openCloseConvert(value,tableMeta?.rowData[1])
                    
                  }}
                  className="action_btn x2"
                  title="Close-converted">
                  <ClosedConverted />
                </button> : null}
            </div>
          );
        },
      },
    },
    {
      name: "lead_status_id",
      label: "Lead Status Id",
      options: {
        filter: false,
        display:false,
        download:false,
        viewColumns:false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <>{value} </>;
        },
      },
    },
  ];
  const options = {
    selectableRows: 'none',
    responsive: "standard",
    downloadOptions:{filename:"LeadList.csv"},
    filterType:'multiselect'
  };

  const mappedDataList=dataList?.map(list=>({
    lead_code:list?.lead_code,
    lead_name:list?.lead_name,
    company_name:list?.company_name,
    p_contact_no:list?.p_contact_no,
    createdAt:list?.createdAt,
    db_user:list?.db_user?.user,
    db_lead_status:list?.db_lead_status?.status_name,
    lead_id:list?.lead_id,
    lead_status_id:list?.db_lead_status?.lead_status_id,
    db_lead_source:list?.db_lead_source?.source
  }))

  return (
    <>
    {
      loader ? <><Loader/></> :(
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

export default ManageLeadTable;
