import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SideBar from '../Basics/SideBar'
import Topnav from '../Basics/Topnav'
import PlusIcon from '../Svg/PlusIcon'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router'
import { Baseurl } from '../../Utils/Constants';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import ConfirmBox from '../Basics/ConfirmBox'
import { toast } from 'react-toastify'
import axios from 'axios'
import moment from "moment";
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import DownloadIcon from '../Svg/DownloadIcon'
const DynamicTable = dynamic(
  () => import('./ClientsMuiTable'),
  { ssr: false }
)
export default function AdminDashboard() {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter()
  const [showConfirm, setshowConfirm] = useState(false);
  const [enableconfirm, setenableconfirm] = useState(false)
  const [clientList, setClientList] = useState([])
  const [renewSubsValue, setrenewSubsValue] = useState({ months: null, days: null })
  const [currObj, setcurrObj] = useState('')
  const [show, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState({})
  const handleClose = () => {
    setShow(false);
    setrenewSubsValue({ months: null, days: null })
  }

  const handleShow = () => setShow(true);

  const getClientsList = async () => {
    if (hasCookie('saLsTkn')) {
      const token = getCookie('saLsTkn');
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
        }
      }
      try {
        const response = await axios.get(Baseurl + `/db/admin`, header);
        setClientList(response.data.data)
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.mesage) {
          toast.error(error.response.data.mesage);
        }
        else {
          toast.error('Something went wrong!')
        }
      }
    }
  }

  function openEnableBox(value) {
    setenableconfirm(true)
    getSingleData(value)
  }

  const getSingleData = async (id) => {
    if (hasCookie('saLsTkn')) {
      const token = getCookie('saLsTkn');
      try {
        const response = await axios.get(Baseurl + `/db/admin?id=${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const { user_id, user_code, subscription_end_date } = response.data.data;
        setUserInfo({ user_id, user_code, subscription_end_date });
      } catch (error) {
        const errorMessage = error?.response?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    }
  };


  function renewSubscription(value) {
    handleShow();
    getSingleData(value)
  }

  async function renewSubsHandler() {
    if (!hasCookie('saLsTkn')) return;

    const token = getCookie('saLsTkn');
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };

    if (!renewSubsValue.months && !renewSubsValue.days) {
      toast.error('Please enter either Months or Days');
      return;
    }

    const oldDate = moment(userInfo.subscription_end_date, "YYYY-MM-DD");
    const newDate = oldDate.add(renewSubsValue.days, 'days').add(renewSubsValue.months, 'months').format('YYYY-MM-DD');
    const myObj = { ...userInfo, subscription_end_date: newDate };

    try {
      const res = await axios.put(Baseurl + `/db/admin`, myObj, header);
      if (res.status === 200 || res.status === 204) {
        toast.success('Subscription Extended');
        handleClose();
        getClientsList();
        setUserInfo({});
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  }

  async function enablehandler() {
    if (hasCookie('saLsTkn')) {
      const token = getCookie('saLsTkn');
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
        }
      }
      let myObj = { user_status: true, user_id: userInfo.user_id, user_code: userInfo.user_code }
      try {
        const res = await axios.put(Baseurl + `/db/admin`, myObj, header);
        if (res.status === 200 || res.status === 204) {
          toast.success('Client Enabled')
          setenableconfirm(false);
          getClientsList();
          setUserInfo({})
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        else {
          toast.error('Something went wrong!')
        }
      }
    }
  }

  function redirectPermission(id, db_name) {
    if (hasCookie('db_name')) {
      deleteCookie('db_name')
      setCookie('db_name', db_name);
      router.push(`/AdminPermissions?id=${id}`)
    } else {
      setCookie('db_name', db_name);
      router.push(`/AdminPermissions?id=${id}`)
    }
  }

  function opnCnfrmBox(value) {
    setcurrObj(value);
    setshowConfirm(!showConfirm)
  }

  function changeSubsHandler(e) {
    const { name, value } = e.target;
    const obj = {
      ...renewSubsValue,
      [name]: Math.max(0, Math.min(value, name === 'months' ? 60 : 30))
    };
    setrenewSubsValue(obj);
  }

  async function deleteHandler() {
    if (hasCookie('saLsTkn')) {
      const token = getCookie('saLsTkn');
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
        }
      }
      try {
        const response = await axios.delete(Baseurl + `/db/admin?id=${currObj}`, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setshowConfirm(false)
          setcurrObj('')
          getClientsList();
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        else {
          toast.error('Something went wrong!')
        }
      }
    }

  }

  const handleDownload = () => {
    axios.get(Baseurl + `/db/login`, {
      responseType: 'blob'
    }).then(response => {
      const file = new Blob([response.data], { type: 'application/pdf' }); // change the content type as per the received file
      const fileUrl = URL.createObjectURL(file);

      // programmatically create and trigger the download link
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.setAttribute('download', 'client.xlsx'); // specify the file name
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }).catch(error => {
      console.error(error);
    });
  };

  useEffect(() => {
    getClientsList();
  }, [])

  return (
    <>
      <ConfirmBox
        showConfirm={showConfirm}
        setshowConfirm={setshowConfirm}
        actionType={deleteHandler}
        title={"Are you sure to Disable?"} />
      <ConfirmBox
        showConfirm={enableconfirm}
        setshowConfirm={setenableconfirm}
        actionType={enablehandler}
        title={"Are you sure to Enable?"} />
      <Head>
        <title>LeadShyne</title>
        <meta name="description" content="Leadshyne CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main_wrapper">
        <Topnav />
        <div className="content_wrapper">
          <SideBar mode='admin' />
          <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
              <h3 className="content_head">CLIENTS</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">ALL CLIENTS</li>
                </ol>
              </nav>
            </div>
            <div className="main_content">
              <div className="table_screen">
                <div className="top_btn_sec">
                  <div className="d-flex">
                    <Link href='/AddClient'>
                      <button className="btn btn-primary Add_btn me-3">
                        <PlusIcon />
                        ADD CLIENTS
                      </button>
                    </Link>

                    <button className="btn btn-primary Add_btn" onClick={handleDownload}>
                      <DownloadIcon />
                      EXPORT
                    </button>
                  </div>
                </div>

                <DynamicTable
                  redirectPermission={redirectPermission}
                  clientList={clientList}
                  opnCnfrmBox={opnCnfrmBox}
                  openEnableBox={openEnableBox}
                  renewSubscription={renewSubscription}
                  handleDownload={handleDownload}

                  title='Clients List' />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Renew Subscription </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="months">Month</label>
                  <input
                    type="number"
                    name="months"
                    placeholder='Enter No. of Months'
                    id="months"
                    onChange={(e) => changeSubsHandler(e)}
                    className="form-control"
                    value={renewSubsValue.months ? renewSubsValue.months : ''}
                  />
                </div>
                <div className="input_box">
                  <label htmlFor="days"> Days</label>
                  <input
                    type="number"
                    name="days"
                    id="days"
                    placeholder='Enter no of days'
                    onChange={(e) => changeSubsHandler(e)}
                    className="form-control"
                    value={renewSubsValue.days ? renewSubsValue.days : ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={renewSubsHandler}>  Submit  </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
