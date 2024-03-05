import { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Papa from "papaparse";
const DynamicTable = dynamic(
  () => import('./ManageProductCategoryTab'),
  { ssr: false }
)

export default function ManageProductCategoryScreen() {
  const sideView = useSelector((state) => state.sideView.value);

  const [dataList, setDataList] = useState([])
  const [disableShowConfirm, setdisableShowConfirm] = useState(false)
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
  const [confirmText, setconfirmText] = useState("");
  const [currObj, setcurrObj] = useState({ p_cat_id: "", action: "" })
  const [show, setShow] = useState(false);
  const [excelData, setexcelData] = useState([]);

  function disableConfirm(value, type) {
    if (type == 1) {
      setconfirmText("enable");
    } else {
      setconfirmText("Disable");
    }
    setcurrObj({ p_cat_id: value, action: type });
    setdisableShowConfirm(true);
  }

  const handleShow = () => setShow(true);

  function deleteConfirm(value) {
    setcurrObj({ p_cat_id: value, action: "delete" });
    setdeleteshowConfirm(true)
  }

  const getDataList = async () => {

    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 168
        }
      }
      try {
        const response = await axios.get(Baseurl + `/db/productCat/all`, header);
        setDataList(response.data.data);
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

  async function disableHandler() {
    setdisableShowConfirm(false)
    const reqInfo = {
      p_cat_id: currObj.p_cat_id,
      status: currObj.action == 1 ? true : false,
    };
    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 169
        }
      }

      try {
        const response = await axios.put(Baseurl + `/db/productCat`, reqInfo, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setdisableShowConfirm(false)
          setcurrObj({ p_cat_id: "", action: "" })
          getDataList();
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

  async function deleteHandler() {

    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 170
        }
      }

      try {
        const response = await axios.delete(Baseurl + `/db/productCat?p_id=${currObj.p_cat_id}`, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setdeleteshowConfirm(false)
          setcurrObj({ p_cat_id: "", action: "" })
          getDataList();
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

  const handleClose = () => {
    setShow(false);
    setexcelData([])
};

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

async function csvSubmitHandler() {
    if (excelData.length <= 0) {
        toast.error('No Data Found Please Check and try Again')
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
                const response = await axios.post(Baseurl + `/db/productCat/bulk`, excelData, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    getDataList();
                    handleClose();
                    
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

}

  useEffect(() => {
    getDataList();
  }, [])

  return (
    <>
      <ConfirmBox
        showConfirm={disableShowConfirm}
        setshowConfirm={setdisableShowConfirm}
        actionType={disableHandler}
        title={`Are You Sure you want to ${confirmText} ?`} />

      <ConfirmBox
        showConfirm={deleteshowConfirm}
        setshowConfirm={setdeleteshowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"} />

      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h1 className="content_head">PRODUCT CATEGORY MASTER</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Product Category Master
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <div className="d-flex">
                <Link href="AddProductCat">
                  <button className="btn btn-primary Add_btn me-3">
                    <PlusIcon />
                    ADD PRODUCT CATEGORY
                  </button>
                </Link>
                <button className="btn btn-primary Add_btn me-3" onClick={handleShow}>
                  <PlusIcon />
                  IMPORT CSV
                </button>
              </div>
            </div>

            <DynamicTable
              title='Product Category List'
              dataList={dataList}
              disableConfirm={disableConfirm}
              deleteConfirm={deleteConfirm} />
          </div>
        </div>
      </div>
      <Modal className="commonModal" show={show} onHide={handleClose}>
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
                                <a className="text-decoration-underline text-primary" href="/Docs/ProductCategory.csv" download='Product-Category-Sample-File.csv'>Views Sample File </a>
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



    </>
  );
}
