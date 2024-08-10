import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import DownloadIcon from "../Svg/DownloadIcon";
const DynamicTable = dynamic(() => import("./ClosedWonOpportunitiesTable"), {
  ssr: false,
});
import Select from "react-select";

const ClosedWonOpportunities = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const [dataList, setDataList] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [month, setMonth] = useState("");
  const [opportunityId, setOpportunityId] = useState("");

  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState("");
  const [loader, setLoader] = useState(false);

  const financialYearOptions = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    // Add more years as needed
  ];

  const quarterOptions = [
    { value: "1", label: "Q1" },
    { value: "2", label: "Q2" },
    { value: "3", label: "Q3" },
    { value: "4", label: "Q4" },
  ];

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const getDataList = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 35,
        },
      };

      let query = {};
      if (accountName) (query.type = "ac_name"), (query.ac = accountName);
      if (financialYear) query.financialYear = financialYear;
      if (quarter) query.quarter = quarter;
      if (month) query.month = month;
      if (opportunityId) query.o_id = opportunityId;

      const queryString = new URLSearchParams(query).toString();

      try {
        const response = await axios.get(
          Baseurl + `/db/opportunity/opportunityReport?${queryString} `,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
          setLoader(false);
          setDataList(response.data.data);
        }
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const handleDownload = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 38,
        },
        responseType: "blob",
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/opportunity/download`,
          header
        );

        if (response?.status == 200) {
          const file = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const fileUrl = URL.createObjectURL(file);

          const downloadLink = document.createElement("a");
          downloadLink.href = fileUrl;
          downloadLink.setAttribute("download", "Opportunity.xlsx");
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      } catch (error) {
        console.log(error);
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
      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">CLOSED WON OPPORTUNITY</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/crm">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Closed Won Opportunity
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            
          <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    padding: "10px",
    justifyContent: "space-around",
    gap: "1rem",
  }}
>
  <Select
    name="financial_year"
    options={financialYearOptions}
    value={financialYearOptions.find(
      (option) => option.value === financialYear
    )}
    onChange={(e) => setFinancialYear(e?.value || "")}
    placeholder="Select Financial Year"
    style={{
      
      flex: 1,
    }}
  />

  <Select
    name="quarter"
    options={quarterOptions}
    value={quarterOptions.find((option) => option.value === quarter)}
    onChange={(e) => setQuarter(e?.value || "")}
    placeholder="Select Quarter"
    style={{
      
      flex: 1,
    }}
  />

  <Select
    name="month"
    options={monthOptions}
    value={monthOptions.find((option) => option.value === month)}
    onChange={(e) => setMonth(e?.value || "")}
    placeholder="Select Month"
    style={{
     
      flex: 1,
    }}
  />

  <button
    className="btn btn-primary "
    onClick={getDataList}
    style={{
      flex: 1,
      minWidth: "150px",
    }}
  >
    Apply Filters
  </button>

  <button
    className="btn btn-primary Add_btn"
    onClick={handleDownload}
    style={{
      flex: 1,
      minWidth: "150px",
    }}
  >
    <DownloadIcon />
    EXPORT
  </button>
</div>

            
            <DynamicTable
              title="Opportunity List"
              dataList={dataList}
              loader={loader}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClosedWonOpportunities;
