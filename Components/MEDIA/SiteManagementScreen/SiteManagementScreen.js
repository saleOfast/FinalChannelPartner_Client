import React, { useEffect, useState } from "react";
import PlusIcon from '../../Svg/PlusIcon';
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../../Utils/Constants";
import ConfirmBox from "../../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
import DownloadIcon from "../../Svg/DownloadIcon";
const DynamicTable = dynamic(
  () => import('./TasksMuiTable'), 
  { ssr: false }
)

const SiteManagementScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const [dataList, setDataList] = useState([]);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState("");
  const[loader,setLoader]=useState(false);

  const getDataList = async () => {
    setLoader(true)
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 378,
        },
      };

      try {
        const response = await axios.get(Baseurl + `/db/media/siteManagement/getSite`, header);
        if(response?.status==200|| response?.status==201){
          setLoader(false)
          setDataList(response?.data?.data);
        }
      } catch (error) {
        setLoader(false)
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };
  function disableConfirm(value) {
    setcurrObj(value);
    setdisableShowConfirm(true);
  }

  async function deleteHandler() {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 380,
        },
      };

      try {
        const response = await axios.delete( Baseurl + `/db/media/siteManagement/deleteSite?site_id=${currObj}`, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdisableShowConfirm(false);
          setcurrObj('');
          getDataList();
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

  // const handleDownload = () => {
  //   if (hasCookie("token")) {
  //     let token = getCookie("token");
  //     let db_name = getCookie("db_name");
  
  //     let header = {
  //       headers: {
  //         Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Change the Accept type to Excel
  //         Authorization: "Bearer ".concat(token),
  //         db: db_name,
  //         pass:"pass",
          
  //       },
  //       responseType: 'blob' // set the response type as blob
  //     };
   
  //     axios.get(Baseurl + `/db/tasks/download`, header)
  //     .then(response => {
  //       const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
  //       const fileUrl = URL.createObjectURL(file);
  //       // programmatically create and trigger the download link
  //       const downloadLink = document.createElement('a');
  //       downloadLink.href = fileUrl;
  //       downloadLink.setAttribute('download', 'Tasks.xlsx'); // specify the file name
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);
  //     }).catch(error => {
  //       console.error(error);
  //     });
  //   }
  // };

  const handleDownload = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          // m_id: 17
          pass:"pass"
        },
        responseType: "blob",
      };

      try {
        const response = await axios.get(Baseurl + `/db/tasks/download`, header);
       
       if(response?.status==200){
        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileUrl = URL.createObjectURL(file);

        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.setAttribute("download", "Sites.xlsx");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
       }
        
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Not Authorized!");
        }
      }
    }  
};
  

  useEffect(() => {
    getDataList();
  }, []);
  return (
    <>

    <ConfirmBox
        showConfirm={disableShowConfirm}
        setshowConfirm={setdisableShowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"}
      />
       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">Site Management</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"> <Link href='/media'>Home   </Link></li>
              <li className="breadcrumb-item active" aria-current="page">Site List</li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
            <div className="d-flex">
              <Link href='/media/AddSites'>
              <button className="btn btn-primary Add_btn me-3">
                  <PlusIcon />
                  ADD SITE
                </button>
              </Link>
              {/* <button className="btn btn-primary Add_btn " onClick={handleDownload}>
                  <DownloadIcon />
                  EXPORT
                </button> */}
            </div>
            </div>
            <DynamicTable
              title="Sites List"
              dataList={dataList}
              loader={loader}
              disableConfirm={disableConfirm}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SiteManagementScreen