import React, { useState } from 'react'
import MUIDataTable from "mui-datatables";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { Baseurl } from '../../../../Utils/Constants';
import { getCookie, hasCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import PlusIcon from '../../../Svg/PlusIcon';
import DateRange from '../../../DateRangeCustom/Daterange';
import { ForkLeft } from '@mui/icons-material';





const ManageUsersTable = ({ deleteConfirm, disableConfirm, dataList, openEdtMdl, title, setShowAssignTo, oldAssignTo, setoldAssignTo, setShowDateFilter, usersList, getDataList }) => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [userData, setUserData] = useState([])
  const [actionMode, setActionMode] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [userInfo, setUserInfo] = useState({
    user_code: '',
    reject_reason: ''
  })
  const [value, setValue] = useState({

    startDate: new Date(),
    endDate: new Date().setMonth(11)

  });


  const columns = [
    {
      name: 'user_code',
      label: "Booking ID",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box fw-bold' style={{ color: "#293790" }} >
              NK12647
            </div>
          )
        }

      }
    },
    {
      name: 'user',
      label: "Booking Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Link href={`/CHANNEL/BookingDetails`} className='status_box fw-bold text-decoration-underline' style={{ color: "#293790" }}>
              Shekhar Mittal
            </Link>
          )
        }
      },

    },
    {
      name: 'createdAt',
      label: "Email",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {

          return (
            <div className='status_box fw-bold' style={{ color: "#293790" }}>
              shekharmi2938@gmail.com
            </div>
          )
        }

      }
    },
    {
      name: 'user',
      label: "Contact No.",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box' style={{ color: "#667799" }}>
              +91-8587493655
            </div>
          )
        }
      }
    },
    {
      name: 'user',
      label: "Project",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box' style={{ color: "#667799" }}>
              Harmony Hills Estates
            </div>
          )
        }
      }
    },
    {
      name: 'user',
      label: "Location",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box' style={{ color: "#667799" }}>
              Noida
            </div>
          )
        }
      }
    },
    {
      name: 'user',
      label: "Booking Status",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div
              style={{ background: "violet", color: "white", padding: "6px", borderRadius: "20px", border: "white", width: "fit-content"}}
              className='pe-3 ps-3'>
              Eligible for Brokerage Bill
            </div>
          )
        }
      }
    },
    {
      name: 'user_code',
      label: "Brokerage Bill",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background: "#293790", color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <div
                onClick={() => { setShowModal(value); }}
                style={{ background: "white", color: "#293790", padding: "6px", borderRadius: "20px", border: "white", cursor: "pointer" }}
                className='pe-3 ps-3 '
              >
                <span className=''>+</span> Create
              </div>

            </div>
          )
        }
      }
    },
  ];



  const CustomToolbar = () => {
    return (
      <div className=' d-flex justify-content-start gap-3 align-items-center '>
        <p className='fw-bold ' style={{ fontSize: "18px" }} >{title}</p>
        <DateRange value={value} setValue={setValue} />
        {/* <button className='btn' style={{background:"#293790", color:"white"}} onClick={()=>setShowDateFilter(true)}> Custom </button> */}
      </div>
    );
  }

  const handleRowClick = (rowData, rowMeta) => {
    const data = rowMeta?.reduce((accu, value) => {
      accu.push(dataList[value.dataIndex].user_code);
      return accu; // Return the accumulator
    }, []);
    setUserData([...data]);
  };

  const options = {
    selectableRows: 'multiple',
    responsive: "standard",
    onRowSelectionChange: handleRowClick,
  };

  const goto = (url) => {
    router.push(url)
  }

  const updateUserHandler = async () => {
    let toastShown = false;
    for (const element of userData) {
      if (!hasCookie("token")) return;

      const token = getCookie("token");
      const db_name = getCookie("db_name");

      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          m_id: 79,
        },
      };

      try {
        const response = await axios.put(`${Baseurl}/db/users`, {
          db_name: db_name,
          user_code: element,
          report_to: oldAssignTo,
        }, header);

        if (response.status === 200 || response.status === 201) {
          if (!toastShown) {
            toast.success(response.data.message);
            toastShown = true;
          }
          setoldAssignTo('');
          setShowModal(false);
          setUserData([])
          getDataList();
        }
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.status === 422) {
          if (!toastShown) {
            toast.error(error.response.data.message);
            toastShown = true;
          }
        } else if (error?.response?.data?.message) {
          if (!toastShown) {
            toast.error(error.response.data.message);
            toastShown = true;
          }
        } else {
          if (!toastShown) {
            toast.error("Something went wrong!");
            toastShown = true;
          }
        }
      }
    }
  };



  return (
    <>
      <div className="miuiTable channelTable">
        <MUIDataTable
          title={<CustomToolbar />}
          data={dataList}
          columns={columns}
          options={options}

        />
        <div>
          {userData.length ?
            <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">


              <button onClick={() => { setActionMode('Cancel'); setShowModal(false); setUserData([]) }} className=" btn btn-danger rounded-5">
                Cancel
              </button>
              <button onClick={() => { setActionMode('Assignto'); setShowModal(true) }} style={{ backgroundColor: '#293790' }} className="btn  rounded-5 text-white" >
                Assign to
              </button>

            </div>
            : <></>
          }
        </div>
      </div>

      <Modal className="commonModal" show={showModal} onHide={() => { setShowModal(false) }} size="lg">

        <Modal.Body>
          <section className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill" style={{ padding: '0 16px' }}>
            <div className="container">
              <div className="row">
                <h3 className=" Perfect-Home text-center ">Create Brokerage Bill</h3>
                <div className="col-12 mt-md-5">
                  <div className="Sign-In_Sign-Up Register w-100">
                    <div className="perfect-home-form pt-1">
                      <section className="Details_Form">
                        <div className="pt-3">
                          <form id="survey-form" method="GET" action>
                            <div className="d-lg-flex justify-content-lg-around">
                              <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="project" className="pb-1">Project</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab d-flex gap-2">
                                    <select name className="form-select dropdown" style={{ paddingTop: 12, paddingBottom: 12, marginLeft: "auto" }}>
                                      <option value selected disabled />
                                      <option className="dropdown-item" href="#">Emerald Grove Gardens
                                      </option>
                                      <option className="dropdown-item" href="#">Harmony Hills Estates
                                      </option>
                                      <option className="dropdown-item" href="#">Horizon Vista Villas
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">Amount</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <input autofocus type="text" name="name" className="input-field" placeholder required />
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                <div className="rowTab mt-3 mt-md-4 mt-lg-0">
                                  <div className="labels">
                                    <label htmlFor="Location" className="pb-1">Date</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <input autofocus type="text" name="name" className="input-field" placeholder required />
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label id="name-label" htmlFor="name" className="pb-1">Bill</label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <label htmlFor="adh" className="form-control d-flex flex-row-reverse justify-content-between align-items-center" style={{ width: 162, height: 35 }}>Upload Bill<img src="/ChannelPartner/upload-file.svg" alt style={{ height: 16 }} /></label>
                                    <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{ display: 'none' }} required />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="new-leades-btn d-flex justify-content-center gap-4">
                              <div type="button" className="cancel-btn d-flex align-items-center justify-content-center bg-transparent" onClick={() => setShowModal(false)}>Cancel</div>
                              <button type='submit' className="submit-btn d-flex align-items-center justify-content-center text-white border-0">Submit</button>
                            </div>
                          </form>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </Modal.Body>
      </Modal>

    </>

  )
}

export default ManageUsersTable 