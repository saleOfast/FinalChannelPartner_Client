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
  const[brokerageBill,setBrokerageBill]=useState({
    booking_id:'',
    file:null,
    amount:"",
    date:"",
    status:""
  })
 
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
 
  const columns = [
    {
      name: 'booking_id',
      label: "Booking ID",
      options: {
        display:false,
        filter: false,
        download:false,
        viewColumns:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box fw-bold' style={{ color: "#293790" }} >
              {value}
            </div>
          )
        }

      }
    },
    {
      name: 'booking_code',
      label: "Booking ID",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box fw-bold' style={{ color: "#293790" }} >
              {value}
            </div>
          )
        }

      }
    },
    {
      name: 'booking_name',
      label: "Booking Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Link href={`/CHANNEL/BookingDetails?booking_id=${tableMeta?.rowData[0]}`} className='status_box fw-bold text-decoration-underline' style={{ color: "#293790" }}>
              {value}
            </Link>
          )
        }
      },

    },
    {
      name: 'email',
      label: "Email",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {

          return (
            <div className='status_box fw-bold' style={{ color: "#293790" }}>
              {value}
            </div>
          )
        }

      }
    },
    {
      name: 'contact_no',
      label: "Contact No.",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box' style={{ color: "#667799" }}>
              +91-{value}
            </div>
          )
        }
      }
    },
    {
      name: 'BookingprojectData',
      label: "Project",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box' style={{ color: "#667799" }}>
              {/* {value?.project} */}
              {value}
            </div>
          )
        }
      }
    },
    {
      name: 'Location',
      label: "Location",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className='status_box' style={{ color: "#667799" }}>
              {value}
            </div>
          )
        }
      }
    },
    {
      name: 'status',
      label: "Booking Status",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div
              style={{ background: "violet", color: "white", padding: "6px", borderRadius: "20px", border: "white", width: "fit-content"}}
              className='pe-3 ps-3'>
              {value}
            </div>
          )
        }
      }
    },
    {
      name: 'BrokerageBookingList',
      label: "Brokerage Bill",
      options: {
        filter: false,
        download:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: 'white', paddingLeft: "15px" }}   >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="table_btns">
              <button
                onClick={() => {
                  setShowModal(true);
                  setBrokerageBill({
                    ...brokerageBill,
                    booking_id: tableMeta.rowData[0],
                  })
                }}
                style={{
                  background:value?.length>0 ? "#9C9AA5" :clientBtnColor,
                  color: "white",
                  padding: "6px",
                  borderRadius: "20px",
                  border: "white",
                  cursor: "pointer",
                }}
                disabled={value?.length>0 ? true:false }
                className="pe-3 ps-3 "
              >
                + Create
              </button>
            </div>
          );
        }
      }
    },
  ];



  const CustomToolbar = () => {
    return (
      <div className=' d-flex justify-content-start gap-3 align-items-center '>
        <p className='fw-bold ' style={{ fontSize: "18px" }} >{title}</p>
        <DateRange value={value} setValue={setValue} getData={getDataList} />
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrokerageBill({
          ...brokerageBill,
          file:e.target.files[0],
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }; 

  const createBrokerageBill =  async() => {

    if(brokerageBill.file===null){
      return toast.error("Pls Upload Bill")
    }
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

      const formData=new FormData();
      for (const [key, value] of Object.entries(brokerageBill)) {
        formData.append(key, value);
      }
      try {
        const response = await axios.post(`${Baseurl}/db/channel/brokerage`,formData, header);
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
          setBrokerageBill("")
          setShowModal(false)
          getDataList()
        }
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.status === 422) {
              toast.error(error?.response?.data?.message)
              
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
  };

  const options = {
    selectableRows: 'multiple',
    responsive: "simple",
    onRowSelectionChange: handleRowClick,
    downloadOptions:{filename:"ChannelBookings"}
  };

  const mappedDataList=dataList?.map(list=>({
      booking_id:list?.booking_id,
      booking_code:list?.booking_code,
      booking_name:list?.booking_name,
      email:list?.email,
      contact_no:list?.contact_no,
      BookingprojectData:list?.BookingprojectData?.project,
      Location:list?.Location,
      status:list?.status,
      BrokerageBookingList:list?.BrokerageBookingList
  }))

  return (
    <>
      <div className="miuiTable channelTable">
        <MUIDataTable
          title={<CustomToolbar />}
          // data={dataList}
          data={mappedDataList}
          columns={columns}
          options={options}
        />
        <div>
          {/* {userData.length ?
            <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">


              <button onClick={() => { setActionMode('Cancel'); setShowModal(false); setUserData([]) }} className=" btn btn-danger rounded-5">
                Cancel
              </button>
              <button onClick={() => { setActionMode('Assignto'); setShowModal(true) }} style={{ backgroundColor: '#293790' }} className="btn  rounded-5 text-white" >
                Assign to
              </button>

            </div>
            : <></>
          } */}
        </div>
      </div>

      <Modal
        className="commonModal"
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setBrokerageBill("")
        }}
        size="lg"
      >
        <Modal.Body>
          <section
            className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill"
            style={{ padding: "0 16px" }}
          >
            <div className="container">
              <div className="row">
                <h3 className=" Perfect-Home text-center ">
                  Create Brokerage Bill
                </h3>
                <div className="col-12 mt-md-5">
                  <div className="Sign-In_Sign-Up Register w-100">
                    <div className="perfect-home-form pt-1">
                      <section className="Details_Form">
                        <div className="pt-3">
                          <form id="survey-form" onSubmit={(e)=>{
                            e.preventDefault();
                            createBrokerageBill()
                          }}>
                            <div className="d-lg-flex justify-content-lg-around">
                              <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="project" className="pb-1">
                                      Booking
                                    </label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab d-flex gap-2">
                                    <select
                                      name
                                      className="form-select dropdown"
                                      style={{

                                        marginLeft: "auto",
                                      }}
                                      value={dataList.find((list)=>(
                                          list?.booking_id === brokerageBill?.booking_id ? list?.booking_name : null
                                      ))}
                                      onChange={(e)=>{
                                        setBrokerageBill({
                                          ...brokerageBill,
                                          booking_id: e.target.value
                                        })
                                      }}
                                    >
                                      {
                                        dataList?.map((list)=>(
                                          <option
                                          key={list?.booking_id}
                                          value={list?.booking_id}
                                        >
                                          {list?.booking_name}
                                        </option>
                                        ))
                                      }
                                     
                                    </select>
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label htmlFor="name" className="pb-1">
                                      Amount
                                    </label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <input
                                      autofocus
                                      type="number"
                                      name="name"
                                      value={brokerageBill?.amount}
                                      onChange={(e)=>{
                                        setBrokerageBill({
                                          ...brokerageBill,
                                          amount:e.target.value
                                        })
                                      }}
                                      className="input-field"
                                      placeholder
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                <div className="rowTab mt-3 mt-md-4 mt-lg-0">
                                  <div className="labels">
                                    <label htmlFor="Location" className="pb-1">
                                      Date
                                    </label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <input
                                      autofocus
                                      type="date"
                                      name="name"
                                      value={brokerageBill?.date}
                                      onChange={(e)=>{
                                        setBrokerageBill({...brokerageBill,date:e.target.value})
                                      }}
                                      className="input-field"
                                      placeholder
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="rowTab">
                                  <div className="labels">
                                    <label
                                      id="name-label"
                                      htmlFor="name"
                                      className="pb-1"
                                    >
                                      Bill
                                    </label>
                                    <span className="star">*</span>
                                  </div>
                                  <div className="rightTab">
                                    <label
                                      htmlFor="adh"
                                      className="form-control d-flex flex-row-reverse justify-content-between align-items-center"
                                      style={{
                                        width: 162,
                                        height: 35,
                                        background: clientBtnColor,
                                      }}
                                    >
                                      Upload Bill
                                      <img
                                        src="/ChannelPartner/upload-file.svg"
                                        alt
                                        style={{ height: 16 }}
                                      />
                                    </label>
                                    <input
                                      type="file"
                                      id="adh"
                                      onChange={(e)=>handleFileChange(e)}
                                      className="input-field"
                                      style={{ display: "none" }}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="new-leades-btn d-flex justify-content-center gap-4">
                              <div
                                type="button"
                                className="btn btn-danger rounded-5 text-white"
                                onClick={() =>{ setShowModal(false); setBrokerageBill("");}}
                              >
                                Cancel
                              </div>
                              <button
                                type="submit"
                                className="btn text-white rounded-5"
                                style={{ background: clientBtnColor }}
                              >
                                Submit
                              </button>
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
  );
}

export default ManageUsersTable 