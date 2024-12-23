import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../../../Svg/PlusIcon';
import axios from 'axios';
import { hasCookie, getCookie, setCookie } from 'cookies-next';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import dynamic from 'next/dynamic'
import Papa from "papaparse";
import { Baseurl } from '../../../../Utils/Constants';
import ConfirmBox from '../../../Basics/ConfirmBox';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { fetchData } from '../../../../Utils/getReq';
import Daterange from '../../../DateRangeCustom/Daterange';
import Loader from "../../../Loader/Loader";
import DateRange from '../../../DateRangeCustom/Daterange';
const DynamicTable = dynamic(
    () => import('./ManageUsersTable'),
    { ssr: false }
)

const ActivePartnersScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);
    const router = useRouter()
    const [dataList, setDataList] = useState([])
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [confirmText, setconfirmText] = useState('')
    const [show, setShow] = useState(false);
    const [showAssignTo, setShowAssignTo] = useState("");
    const [oldAssignTo, setoldAssignTo] = useState("");
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [excelData, setexcelData] = useState([]);
    const [errorToast, setErrorToast] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [DateEvent, seDateEvent] = useState({
        type: 'Custom',
        fDate: '',
        eDate: ''
    });
    const [currObj, setcurrObj] = useState({
        id: '',
        action: ''
    })
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
  const userInfo=hasCookie("userInfo")?JSON.parse(getCookie("userInfo")):null;
  const [loader,setLoader]=useState(false);
  const [selectedOption, setSelectedOption] = useState(hasCookie("cp_selected") ? getCookie("cp_selected"):'Channel Partner');

   const getCurrentWeekDates = () => {
      const startDate = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1));
        const endDate = new Date(new Date().setDate(startDate.getDate() + 6));
        if(hasCookie("Channel_PartnerFilter")){
          let data=JSON.parse(getCookie("Channel_PartnerFilter"))
           return {startDate:data?.f_date,endDate:data?.t_date}
         }
         else{
           return { startDate, endDate };
         }
  
    };

    const handleChange = (event) => {
            const value = event.target.value;
            setCookie("cp_selected",value)
            setSelectedOption(value);
            console.log(`Selected option: ${value}`);
            // Add any additional logic you want to handle on selection change
          };
  
    const [value, setValue] = useState(getCurrentWeekDates());

  

    function disableConfirm(value, type) {
        if (type == 1) {
            setconfirmText('enable')
        } else {
            setconfirmText('Disable')
        }
        setcurrObj({
            id: value,
            action: type
        })
        setdisableShowConfirm(true)
    }

    const handleClose = () => {
        setShow(false);
        setexcelData([])
    };

    const handleShow = () => setShow(true);

    function deleteConfirm(value) {
        setcurrObj({
            id: value,
            action: 'delete'
        })
        setdeleteshowConfirm(true)
    }

    const goto = (url) => {
        router.push(url)
    }


    async function getUsersList() {
        await fetchData("/db/users", setUsersList, errorToast, setErrorToast);
      }


    const importHandler = (event, type) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setexcelData(results.data)

            },

        });

    };


    const getDataList = async (queryObjLeads) => {
        setLoader(true)
        
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 76,
                }
            }

            try {
                
                const response = selectedOption=="Channel Partner" ? 
                await axios.get(Baseurl + `/db/users/rolewise?role_id=1`, {...header,params:queryObjLeads})
                : selectedOption=="BST" ?
                await axios.get(Baseurl + `/db/users/rolewise?role_id=2`, {...header,params:queryObjLeads})
                :
                await axios.get(Baseurl + `/db/users/rolewise?role_id=3`, {...header,params:queryObjLeads})

                if(response?.status === 200 || response?.status === 201){
                    setLoader(false)
                setDataList(response?.data?.data);
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    setLoader(false)
                    toast.error(error?.response?.data?.message,{autoClose:2500});
                } else {
                    setLoader(false)
                    toast.error("Something went wrong!",{autoClose:2500});
                }
            }
        }
    }

    async function disableHandler() {

        const reqInfo = { user_code: currObj.id, user_status: currObj.action == 1 ? true : false }

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 79
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/users`, reqInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response?.data?.message,{autoClose:2500})
                    setdisableShowConfirm(false)
                    setcurrObj({
                        id: '',
                        action: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error?.response?.data?.message,{autoClose:2500});
            }
        }
    }

    async function deleteHandler() {
        setdeleteshowConfirm(false)

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 80
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/users?id=${currObj.id}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response?.data?.message,{autoClose:2500})
                    setdeleteshowConfirm(false)
                    setcurrObj({
                        id: '',
                        action: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error?.response?.data?.message,{autoClose:2500})
            }
        }

    }

    async function csvSubmitHandler() {
        if (excelData.length <= 0) {
            toast.error('No Data Found Please Check and try Again',{autoClose:2500})
        } else {
            if (hasCookie("token")) {
                let token = getCookie("token");
                let db_name = getCookie("db_name");

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        pass: 'pass'
                    },
                };
                try {
                    const response = await axios.post(Baseurl + `/db/users/owner`, excelData, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response?.data?.message,{autoClose:2500});
                        getDataList();
                        handleClose();
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message,{autoClose:2500});
                    } else {
                        toast.error("Something went wrong!",{autoClose:2500});
                    }
                }
            }
        }

    }

    const channelPartnerFilter=hasCookie("Channel_PartnerFilter") ? JSON.parse(getCookie("Channel_PartnerFilter")) : null;

    const updateUserhandler = async () => {
        if (!hasCookie("token")) return;
        const token = getCookie("token");
        const db_name = getCookie("db_name");
        const header = {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            db: db_name,
            pass:"pass"
          },
        };
        
        let payload = oldAssignTo==null ? 
        {
            db_name: db_name,
            user_code: showAssignTo,
            isAssigned: true
        } :
        {
            db_name: db_name,
            user_code: showAssignTo,
            report_to: oldAssignTo,
            isAssigned: true
        }
       
        try {
          const response = await axios.put(`${Baseurl}/db/users`, payload, header);
          if (response.status === 200 || response.status === 201) {
            toast.success(response?.data?.message,{autoClose:2500});
            setoldAssignTo('')
            setShowAssignTo('')
            toast.success(response?.message,{autoClose:2500})
            if(channelPartnerFilter){
                // if(hasCookie("cp_selected")){
                //     setSelectedOption(getCookie("cp_selected"))
                // }
                getDataList(channelPartnerFilter)
              }
              else{
                getDataList()
              }
          }
        } catch (error) {
          if (error?.response?.data?.status === 422) {
                toast.error(error?.response?.data?.message,{autoClose:2500})
                
          }
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message,{autoClose:2500});
          } else {
            toast.error("Something went wrong!",{autoClose:2500});
          }
        }
    };


    const userListFilterBasisOfRole = (selectedOption, usersList) => {
        if (selectedOption === "Channel Partner") {
            return [{ value: userInfo?.user_id, label: "N.A" },...usersList
                ?.filter(user => user.role_id === 2 || user.role_id === 3)
                ?.map(data => ({
                    value: data?.user_id,
                    label: data?.user,
                }))];
        }
        if (selectedOption === "BST") {
            return [{ value: userInfo?.user_id, label: "N.A" },...usersList
                ?.filter(user => user.role_id === 3)
                ?.map(data => ({
                    value: data?.user_id,
                    label: data?.user,
                }))];
        }
        return [];
    };


    useEffect(() => {
        getUsersList();
        // getDataList()
    }, [selectedOption])

    
    useEffect(()=>{
      if(channelPartnerFilter){
        // if(hasCookie("cp_selected")){
        //     setSelectedOption(getCookie("cp_selected"))
        // }
        getDataList(channelPartnerFilter)
      }
      else{
        getDataList()
      }
    },[selectedOption])

    return (
        <>
        <div className="w-100 ps-4 pe-4 overflow-scroll" >
              
              <div className="main_content">
                  <div className="table_screen">
                      <div className="top_btn_sec my-3" style={{paddingRight:"0px"}} >
                          <div className="d-flex flex-wrap flex-md-nowrap align-items-center gap-2 gap-md-3">
                            <div className='fix-width-1'>
                          {
                                  userInfo?.role_id==null && (
                                      <button className="btn ms-0 Add_btn p-2 w-100 d-flex align-items-center justify-content-center" style={{background:`${clientBtnColor}`}} onClick={()=>goto('/partner/ChannelPartnersDetails')}>
                                  <PlusIcon />
                                  ADD USER
                              </button>
                                  )
                              }</div>
                              <div className='fix-width-2 mt-0 mt-md-0'>
                <DateRange value={value} setValue={setValue} getData={getDataList} filterType={"Channel_Partner"} /></div>
                {
                                hasCookie("channel") &&(userInfo?.role_id==null || userInfo?.role_id==3) &&(
                                    <div style={{ marginBottom: '0' }}>
                        <select 
                          value={selectedOption} 
                          onChange={handleChange} 
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 10px',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#495057',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            borderRadius: '.25rem',
                            transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
                            marginTop: '0px'
                          }}
                        >
                          <option value="Channel Partner">Channel Partner</option>
                          <option value="BST">BST</option>
                          <option value="Director">Director</option>
                        </select>
                      </div>
                                )
                               }

                              
                              
                          </div>
                          
                      </div>
                      <DynamicTable
                          title='Channel Partners'
                          dataList={dataList}
                          loader={loader}
                          disableConfirm={disableConfirm}
                          deleteConfirm={deleteConfirm}
                          setShowAssignTo={setShowAssignTo}
                          setoldAssignTo={setoldAssignTo}
                          oldAssignTo={oldAssignTo}
                          setShowDateFilter={setShowDateFilter}
                          usersList={usersList}
                          getDataList={getDataList}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          channelPartnerFilter={channelPartnerFilter}
                      />
                  </div>
              </div>
          </div>
            

            <Modal className="commonModal" show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>  Import CSV </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="AttendenceFile">Select File</label>
                                    <input type="file"
                                        name="AttendenceFile"
                                        id="AttendenceFile"
                                        accept=".csv"
                                        onChange={importHandler}
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="demoLink text-end py-2">
                                <a className="text-decoration-underline text-primary" href="/Docs/demoUser.csv" download='user-Sample-File.csv'>Views Sample File </a>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-cancel me-2" onClick={handleClose}>Cancel</button>
                    <Button variant="primary" onClick={csvSubmitHandler}>
                        SUBMIT
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal className="commonModal"  show={!showAssignTo? false: true }   onHide={()=>setShowAssignTo("")} style={{}}>
                <Modal.Header closeButton>
                    <Modal.Title>  Assign To </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                   
                                        <Select
                                            id="select"
                                            defaultValue={""}
                                            // options={[{ value: null, label: "N.A" },...usersList?.filter(user => (user.role_id === 2||user.role_id === 3)).map((data) => {
                                            //     return {
                                            //         value: data?.user_id,
                                            //         label: data?.user,
                                            //     };
                                            // })]}
                                            value={usersList?.map((data, index) => {
                                            if (oldAssignTo === data.user_id) {
                                                return {
                                                value: data?.user_id,
                                                label: data?.user,
                                                };
                                            }
                                            })}
                                            options={userListFilterBasisOfRole(selectedOption,usersList)}
                                            onChange={(e) => {
                                            setoldAssignTo(e.value)
                                            
                                            }}
                                        />
                                        
                                      
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className=" btn btn-danger rounded-5" onClick={()=>setShowAssignTo("")}>Cancel</button>
                    <div style={{background:clientBtnColor}} className='btn rounded-5 text-white'  onClick={updateUserhandler} >
                        SUBMIT
                    </div>
                </Modal.Footer>
            </Modal>


            <Modal className="w-100" size="xl" show={showDateFilter} onHide={()=>setShowDateFilter(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>  Assign to </Modal.Title>
                </Modal.Header>
                <Modal.Body className='mx-auto'>
                    <Daterange />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-cancel me-2" onClick={()=>setShowDateFilter(false)}>Cancel</button>
                    <Button variant="primary" >
                        SUBMIT
                    </Button>
                </Modal.Footer>
            </Modal>

           
            
        </>
    )
}

export default ActivePartnersScreen