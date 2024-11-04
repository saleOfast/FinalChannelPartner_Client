import React from 'react'
import MUIDataTable from "mui-datatables";
import ViewIcon from '../Svg/ViewIcon';
import DisableIcon from '../Svg/DisableIcon';
import EditIcon from '../Svg/EditIcon';
import DeleteIcon from '../Svg/DeleteIcon';
import CheckIcon from '../Svg/CheckIcon';
import Loader from "../Loader/Loader"

const ManageReasonForNDPTab = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, loader }) => {

  const columns = [
    {
      name: 'ndp_r_name',
      label: "Reason For NDP Name",
      options: {
        filter: true,
      }
    },
    {
      name: 'ndp_r_code',
      label: "Reason For NDP Code",
      options: {
        filter: true,
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
      name: 'ndp_r_id',
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

              {tableMeta.rowData[2] ?
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

export default ManageReasonForNDPTab 