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
import { Row, Col, Container } from 'react-bootstrap';
const DynamicTable = dynamic(() => import("./AvgDealSizeTable"), {
  ssr: false,
});
import Select from "react-select";

const AvgDealSizeScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const [dataList, setDataList] = useState([]);
  const [financialYear, setFinancialYear] = useState("");
  const [filterBy, setFilterBy] = useState("quarter");
  const [quarter, setQuarter] = useState("");
  const [month, setMonth] = useState("");

  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState("");
  const [loader, setLoader] = useState(false);

  const generateFinancialYearOptions = () => {
    const options = [];
    const startYear = 2022; 
    const endYear = new Date().getFullYear() + 1; 

    for (let i = startYear; i <= endYear; i++) {
      options.push({
        value: `${i}-${i + 1}`,
        label: `${i}-${i + 1}`,
      });
    }
    return options;
  };

  const financialYearOptions = generateFinancialYearOptions();

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
  
      // Calculate the current financial year
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Months are 0-indexed in JS
      const currentYear = today.getFullYear();
      const financialYear = currentMonth >= 4 
        ? `${currentYear}-${currentYear + 1}` 
        : `${currentYear - 1}-${currentYear}`;
  
      // Build the query with only financial year
      let query = {
       type:"expected_weighted",
       subtype:"avg_deal_size"
      };
  
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
          pass:"pass"
        },
        responseType: "blob",
      };
      
      
      let query = {
         type:"expected_weighted",
       subtype:"avg_deal_size"
       };
  
       const queryString = new URLSearchParams(query).toString();
      const fileName = `Average_Deal_Size.xlsx`;
  
      try {
        const response = await axios.get(
          Baseurl + `/db/opportunity/opportunityReport/downloadExcelData?${queryString}`,
          header
        );
  
        if (response?.status == 200) {
          const file = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const fileUrl = URL.createObjectURL(file);
  
          const downloadLink = document.createElement("a");
          downloadLink.href = fileUrl;
          downloadLink.setAttribute("download", fileName);
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
          <h3 className="content_head">AVERAGE DEAL SIZE</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/crm">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Average Deal Size
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
        <Container className="table_screen">
      <Row className="align-items-end mb-3">
        {/* <Col xs={12} sm={6} md={4} lg={2}>
          <label>Financial Year</label>
          <Select
            name="financialYear"
            options={financialYearOptions}
            value={financialYearOptions.find(option => option.value === financialYear)}
            onChange={(e) => setFinancialYear(e?.value || "")}
            placeholder="Financial Year"
          />
        </Col>

        <Col xs={12} sm={6} md={4} lg={2}>
          <label>Filter By</label>
          <Select
            name="filterBy"
            options={[
              { value: "quarter", label: "By Quarter" },
              { value: "month", label: "By Month" },
            ]}
            value={{ value: filterBy, label: `By ${filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}` }}
            onChange={(e) =>{ 
              e.value=="quarter" ? setMonth(""):setQuarter("")
              setFilterBy(e.value)
            }}
            placeholder="Select Filter"
          />
        </Col>

        {filterBy === "quarter" && (
          <Col xs={12} sm={6} md={4} lg={2}>
            <label>Quarter</label>
            <Select
              name="quarter"
              options={quarterOptions}
              value={quarterOptions.find((option) => option.value === quarter)}
              onChange={(e) => setQuarter(e?.value || "")}
              placeholder="Select Quarter"
            />
          </Col>
        )}

        {filterBy === "month" && (
          <Col xs={12} sm={6} md={4} lg={2}>
            <label>Month</label>
            <Select
              name="month"
              options={monthOptions}
              value={monthOptions.find((option) => option.value === month)}
              onChange={(e) => setMonth(e?.value || "")}
              placeholder="Select Month"
            />
          </Col>
        )}

        <Col xs={12} sm={6} md={4} lg={2}>
          <button
            className="btn btn-primary w-100"
            onClick={getDataList}
          >
            Apply Filters
          </button>
        </Col> */}

          <Col xs={12} sm={6} md={4} lg={2} className="d-flex justify-content-end align-items-end w-100">
          <button
            className="btn btn-primary  "
            onClick={handleDownload}
          >
            {/* <DownloadIcon /> */}
            EXPORT
          </button>
        </Col>
      </Row>

      <DynamicTable
        title="Average Deal Size"
        dataList={dataList}
        loader={loader}
      />
        </Container>
        </div>
      </div>
    </>
  );
};

export default AvgDealSizeScreen;

