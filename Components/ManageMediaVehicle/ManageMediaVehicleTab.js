import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import DeleteIcon from '../Svg/DeleteIcon';
import CheckIcon from '../Svg/CheckIcon';
import Loader from "../Loader/Loader"

const ManageMediaVehicleTab = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, loader,mediaFormats }) => {

  const columns = [
    {
      name: 'm_v_name',
      label: "Media Vehicle Name",
      options: {
        filter: true,
      }
    },
    {
      name: 'm_v_code',
      label: "Media Vehicle Code",
      options: {
        filter: true,
      }
    },
    {
      name: 'm_f_id',
      label: "Media Format",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className=''>
                {
                  mediaFormats?.find((item)=>(item?.m_f_id==value))?.m_f_name
                }
            </div>
          )
        }
      }
    },
    {
      name: 'status',
      label: "Status",
      options: {
        filter: false,
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box'>
              {value ? <span className='active status_btn'>active</span> :
                <span className='inactive status_btn'>inactive</span>}
            </div>
          )
        }
      }
    },
    {
      name: 'm_v_id',
      label: "Action",
      options: {
        filter: false,
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <button
                className="action_btn"
                title='Edit'
                onClick={() => { openEdtMdl(tableMeta.rowData) }} >
                <EditIcon />
              </button>

              {tableMeta.rowData[3] ?
                <button
                  onClick={() => disableConfirm(value, 0)}
                  className="action_btn"
                  title="Disable">
                  <DisableIcon />
                </button>
                : <button
                  onClick={() => disableConfirm(value, 1)}
                  className="action_btn x2"
                  title="Enable" >
                  <CheckIcon />
                </button>}

              <button
                onClick={() => deleteConfirm(value)}
                className="action_btn"
                title='Delete'>
                <DeleteIcon />
              </button>
            </div>
          )
        }
      }
    },
  ];

  const options = {
    selectableRows: 'none',
    responsive: "standard",
    downloadOptions: { filename: "LeadIndustryList.csv" }
  };

  return (
    <>
      {loader ? <><Loader /> </> : (
        <div className="miuiTable">
          <MUIDataTable
            title={title}
            data={dataList}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </>
  );
}

export default ManageMediaVehicleTab 