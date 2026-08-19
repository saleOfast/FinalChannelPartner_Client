import React, { useEffect, useState } from "react";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { loadTargetVsAchievement } from "../../Utils/reportApi";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Row, Col, Container } from "react-bootstrap";

const DynamicTable = dynamic(() => import("./TargetVsAchievementTable"), {
  ssr: false,
});

const TargetVsAchievementScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const [dataList, setDataList] = useState([]);
  const [loader, setLoader] = useState(false);

  const getDataList = async () => {
    setLoader(true);
    try {
      const list = await loadTargetVsAchievement();
      setDataList(Array.isArray(list) ? list : []);
    } catch (error) {
      setDataList([]);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  const handleDownload = async () => {
    if (!hasCookie("token")) return;
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        Authorization: "Bearer ".concat(token),
        db: db_name,
        pass: "pass",
      },
      responseType: "blob",
    };
    const query = new URLSearchParams({ type: "target_vs_achievement" }).toString();
    try {
      const response = await axios.get(
        Baseurl + `/db/opportunity/opportunityReport/downloadExcelData?${query}`,
        header
      );
      if (response?.status == 200) {
        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileUrl = URL.createObjectURL(file);
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.setAttribute("download", "Target_Vs_Achievement.xlsx");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Not Authorized!");
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
          <h3 className="content_head">TARGET VS ACHIEVEMENT</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/crm">Home </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Target Vs Achievement
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <Container className="table_screen">
            <Row className="align-items-end mb-3">
              <Col xs={12} className="d-flex justify-content-end align-items-end">
                <button className="btn btn-primary" onClick={handleDownload}>
                  EXPORT
                </button>
              </Col>
            </Row>
            <DynamicTable
              title="Target Vs Achievement List"
              dataList={dataList}
              loader={loader}
            />
          </Container>
        </div>
      </div>
    </>
  );
};

export default TargetVsAchievementScreen;
