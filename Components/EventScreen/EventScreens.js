import React, { useEffect, useState } from "react";
import PlusIcon from '../Svg/PlusIcon';
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
import DownloadIcon from "../Svg/DownloadIcon";
const DynamicTable = dynamic(
  () => import('./EventMuiTable'),
  { ssr: false }
)

export default function EventScreens() {
  const sideView = useSelector((state) => state.sideView.value);

  const [dataList, setDataList] = useState([]);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState("");
  const[loader,setLoader]=useState(false)

  const getAuthHeaders = (extra = {}) => ({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer ".concat(getCookie("token")),
      db: getCookie("db_name"),
      ...extra,
    },
  });

  const extractList = (response) => {
    const payload = response?.data?.data ?? response?.data;
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    const nested =
      payload.rows ||
      payload.calls ||
      payload.events ||
      payload.list ||
      payload.data;
    return Array.isArray(nested) ? nested : [];
  };

  const fetchLookupList = async (url) => {
    try {
      const response = await axios.get(Baseurl + url, getAuthHeaders({ pass: "pass" }));
      return extractList(response);
    } catch (error) {
      return [];
    }
  };

  const getLeadId = (item = {}) =>
    item?.db_lead?.lead_id ||
    item?.lead?.lead_id ||
    item?.lead_id ||
    null;

  const getOppId = (item = {}) =>
    item?.db_opportunity?.opp_id ||
    item?.linkWithOpportunity?.opp_id ||
    item?.opportunity?.opp_id ||
    item?.link_with_opportunity ||
    item?.opp_id ||
    null;

  const getDataList = async () => {
    setLoader(true)
    if (hasCookie("token")) {
      try {
        let response;
        try {
          response = await axios.get(Baseurl + `/db/leads/calls`, getAuthHeaders({ m_id: 237 }));
        } catch (error) {
          response = await axios.get(Baseurl + `/db/leads/calls`, getAuthHeaders({ pass: "pass" }));
        }

        const [leads, opportunities] = await Promise.all([
          fetchLookupList("/db/leads"),
          fetchLookupList("/db/opportunity"),
        ]);
        const leadNames = Object.fromEntries(
          (leads || []).map((lead) => [lead?.lead_id, lead?.lead_name]).filter(([id]) => id)
        );
        const oppNames = Object.fromEntries(
          (opportunities || []).map((opp) => [opp?.opp_id, opp?.opp_name]).filter(([id]) => id)
        );

        const events = extractList(response).map((item) => {
          const leadId = getLeadId(item);
          const oppId = getOppId(item);
          return {
            ...item,
            db_lead: item?.db_lead || item?.lead || (leadId ? {
              lead_id: leadId,
              lead_name: item?.lead_name || leadNames[leadId] || `Lead #${leadId}`,
            } : null),
            db_opportunity: item?.db_opportunity || item?.linkWithOpportunity || item?.opportunity || (oppId ? {
              opp_id: oppId,
              opp_name: item?.opp_name || oppNames[oppId] || `Opportunity #${oppId}`,
            } : null),
          };
        });

        setDataList(events);
      } catch (error) {
        setDataList([]);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      } finally {
        setLoader(false)
      }
    } else {
      setLoader(false)
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
          m_id: 239,
        },
      };

      try {
        const response = await axios.delete(Baseurl + `/db/leads/single?event_id=${currObj}`, header);
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

  const handleDownload = () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Change the Accept type to Excel
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
        responseType: 'blob' // set the response type as blob
      };

      axios.get(Baseurl + `/db/calls/download`, header)
        .then(response => {
          const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
          const fileUrl = URL.createObjectURL(file);
          // programmatically create and trigger the download link
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.setAttribute('download', 'calls.xlsx'); // specify the file name
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }).catch(error => {
          console.error(error);
        });
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
          <h3 className="content_head">EVENTS</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"> <Link href='/crm'>Home   </Link></li>
              <li className="breadcrumb-item active" aria-current="page">Events List</li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <div className="d-flex">
                <Link href='/crm/AddEvent'>
                  <button className="btn btn-primary Add_btn">
                    <PlusIcon />
                    ADD EVENT
                  </button>
                </Link>
                {/*  <button className="btn btn-primary Add_btn " onClick={handleDownload}>
                  <DownloadIcon />
                  EXPORT
                </button> */}
              </div>
            </div>
            <DynamicTable
              title="Events List"
              dataList={dataList}
              disableConfirm={disableConfirm}
              loader={loader}
            />
          </div>
        </div>
      </div>
    </>
  )
}
