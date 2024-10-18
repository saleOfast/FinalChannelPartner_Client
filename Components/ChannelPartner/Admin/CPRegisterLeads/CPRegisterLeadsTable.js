import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import Link from "next/link";
import { Baseurl, filesUrl } from "../../../../Utils/Constants";
import { Button, Modal, Form } from "react-bootstrap";
import { getCookie, hasCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import DeleteIcon from "../../../Svg/DeleteIcon";
import EditIcon from "../../../Svg/EditIcon";
import moment from "moment";

const CPRegisterLeadsTable = ({
  deleteConfirm,
  disableConfirm,
  setcurrObj,
  currObj,
  setdeleteshowConfirm,
  dataList,
  openEdtMdl,
  title,
  getDataList,
  loader
}) => {

  const [userData, setUserData] =  useState([])
  const [actionMode, setActionMode] =  useState('')
  const [showModal, setShowModal] =  useState(false)
  const[id,setId]=useState("")
  const userInfo=hasCookie("userInfo")?JSON.parse(getCookie("userInfo")):null;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact: '',
    email: '',
    stage: 'OPEN',
    createdAt: ''
  });
  const [errors, setErrors] = useState({});
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#61E25E"

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`;
};
  


const addUserHandler = async (id,assignedToId) => {
  const object=dataList?.find((item)=>item?.cpl_id==id)
  const db_name = getCookie("db_name");
  const token = getCookie("token");
  const payload={
    contact_number:object?.contact,
    cpt_id:1,
    db_name:db_name,
    email:object?.email,
    role_id:1,
    user:object?.first_name,
    user_l_name:object?.last_name,
    report_to:assignedToId
  }
  if (!hasCookie("token")) return;
 
  const header = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      pass:"pass"
    },
  };

  try {
    
    const response = await axios.post(
      `${Baseurl}/db/users`,
      payload,
      header
    );
    if (response.status === 200 || response.status === 201) {
      let onBoradStage=true ;
      updateUserhandler(onBoradStage)
      toast.success("Mail Sent for Onboarding",{autoClose:2500});
    }
  } catch (error) {
    if (error?.response?.data?.status === 422) {
      const taskObject = error.response.data.data.reduce((obj, item) => {
        const [key, value] = Object.entries(item)[0];
        obj[key] = value;
        return obj;
      }, {});
      setErrorData(taskObject);
    }
    if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message,{autoClose:2500});
    } else {
      toast.error("Something went wrong!",{autoClose:2500});
    }
    setisLoading(false);
  }
};


const updateUserhandler = async (onBoradStage=false) => {
  const newErrors = validateForm();
  if (Object.keys(newErrors).length === 0) {
    if (!hasCookie("token")) return;
  
  const token = getCookie("token");
  const db_name = getCookie("db_name");
  const header = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      pass: "pass",
    },
  };
  let newFormData;
  if(onBoradStage){
     newFormData={...formData,db_name:db_name,stage:"LINK SENT"}
  }
  else{
     newFormData={...formData,db_name:db_name}
  }
  // const newFormData={...formData,db_name:db_name,}
  try {
    const response = await axios.put(
      `${Baseurl}/db/channelPartnerLeads`,
      newFormData,
      header
    );
    if (response.status === 200 || response.status === 201) {
      // toast.success(response?.data?.message,{autoClose:2500});
      getDataList()
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message,{autoClose:2500});
    } else {
      toast.error("Something went wrong!",{autoClose:2500});
    }
  }
    console.log('Form data submitted:', formData);
    setShowModal(false);
  } else {
    setErrors(newErrors);
  }
  
};

  const columns = [
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "contact",
      label: "Contact",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "createdAt",
      label: "Registration Date",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px"  }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className=""
          style={{color: '#667799'}}
          >
            {formatDate(value)}
        </span>
          )
        },
      },
    },
    {
      name: "stage",
      label: "Status",
      options: {
        filter: true,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "user",
      label: "Assigned To",
      options: {
        filter: true,
        display:userInfo?.isDB ? true:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
            {columnMeta.label}
          </th>
        ),

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
          <span
          className="fw-bold"
          style={{color: '#293790'}}
          >
            {value}
        </span>
          )
        },
      },
    },
    {
      name: "cpl_id",
      label: "Action",
      options: {
        filter: false,
        download:false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th
            style={{ background:`${clientBtnColor}`, color: "white",  paddingLeft: '65px' }}
            
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
              <>
                  <div className="table_btns">
                    {
                      tableMeta?.rowData[5]!=="LINK SENT" && (
                        <>
                              <button
                    className="action_btn"
                    title="Edit"
                    onClick={() => {
                      const newData=dataList?.find((item)=>item?.cpl_id==value)
                      setFormData(newData)
                      setShowModal(true)
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button className="action_btn" onClick={() =>{
                    setcurrObj({...currObj,cpl_id:value})
                     setdeleteshowConfirm(true)
                     }} title='Remove'>
                        <DeleteIcon />
                  </button>
                        </>
                      )
                    }
                  
                  {
                    tableMeta?.rowData[5]=="CONTACTED" && (
                      <button 
                      className="btn text-white rounded-5"  style={{backgroundColor: clientBtnColor ? clientBtnColor : "#61E25E"}}
                       onClick={() =>{
                        let newData = dataList?.find((item) => item?.cpl_id == value);
                        setFormData(newData)
                            addUserHandler(value,tableMeta?.rowData[8])
                         }} title='Onboard For Channel Partner'>
                            Onboard
                      </button>
                    )
                  }

                  </div>
              </>
          );
        },
      },
    },
    {
      name: 'asssigned_to',
      label: "AssignedToId",
      options: {
        display:false,
          filter: false,
          download:false,
          viewColumns:false,
          customHeadRender: (columnMeta, updateDirection) => (
            <th style={{ background:`${clientBtnColor}`, color: "white", paddingLeft: '15px',padding:"7px" }} >
              {columnMeta.label}
            </th>
          ),
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <div  className='status_box fw-bold' style={{color:"#293790"}} >
                      {value}
                  </div>
              )
          }
            
      }
  }
  ];

 

  const options = {
    selectableRows: 'none',
    responsive: "simple",
    downloadOptions:{filename:"CPRegistrationList"},
    filterType:'multiselect'
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.contact || formData.contact.toString().length !== 10) newErrors.contact = "Contact must be 10 digits";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    return newErrors;
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  return (
    <>
    {
      loader ?  <div className="miuiTable channelTable"><Loader/></div>
      :
      (
        <div className="miuiTable channelTable">
        <MUIDataTable
          title={<span style={{ color: "black", fontWeight:"bold", fontSize:"17px" }}>{title}</span>}
          data={dataList}
          columns={columns}
          options={options}
        />
        
      </div>
      )
    }
      

      <Modal
        className="commonModal"
        show={showModal}
        onHide={() => {
          setErrors("")
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e)=>{
            e.preventDefault()
            updateUserhandler()
          }}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                disabled={true}
                value={formData.first_name}
                onChange={(e) => {
                  // Allow only alphabetic characters
                  const value = e.target.value.replace(/[^a-zA-Z]/g, '');
                  setFormData({
                    ...formData,
                    first_name: value
                  });
                }}
                placeholder="Enter first name"
              />
              {errors.first_name && <Form.Text className="text-danger">{errors.first_name}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                disabled={true}
                value={formData.last_name}
                onChange={(e) => {
                  // Allow only alphabetic characters
                  const value = e.target.value.replace(/[^a-zA-Z]/g, '');
                  setFormData({
                    ...formData,
                    last_name: value
                  });
                }}
                placeholder="Enter last name"
              />
              {errors.last_name && <Form.Text className="text-danger">{errors.last_name}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="contact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                disabled={true}
                value={formData.contact}
                onChange={(e) => {
                  // Allow only numeric characters and limit to 10 digits
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setFormData({
                    ...formData,
                    contact: value
                  });
                }}
                placeholder="Enter contact number"
                maxLength={10}
              />
              {errors.contact && <Form.Text className="text-danger">{errors.contact}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                disabled={true}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="stage">
              <Form.Label>Stage</Form.Label>
              <Form.Control
                as="select"
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
              >
                <option value="OPEN">OPEN</option>
                <option value="CONTACTED">CONTACTED</option>
                <option hidden value="LINK SENT">LINK SENT</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="registrationDate">
              <Form.Label>Registration Date</Form.Label>
              <Form.Control
                type="text"
                name="registration_date"
                value={moment(formData.createdAt).format("DD-MM-YYYY ")}
                readOnly
              />
            </Form.Group>

            <Button variant="primary" type="submit" className=" float-end mt-4">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
    </>
  );
};

export default CPRegisterLeadsTable;
