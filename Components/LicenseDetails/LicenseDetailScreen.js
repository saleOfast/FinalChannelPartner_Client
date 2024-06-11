import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";


const LicenseDetailScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const userInfo = hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : null;
  const clientLogo = hasCookie("clientLogo") ? JSON.parse(getCookie("clientLogo")) : null;
  const [licenseDetails,setLicenseDtails]=useState([]);

  const formatDate = (dateString) => {  
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`;
  };

  const renderDetail = (label, value) => (
    <div className="detail-row" style={{display:"flex",justifyContent:"space-between",padding:"10px 0px",borderBottom:"1px solid #ddd"}}>
      <div className="detail-label" style={{fontWeight:"bold"}}>{label}</div>
      <div className="detail-value">{value}</div>
    </div>
  );

  const renderSection = (title, licenseCount, startDate, endDate) => (
    <div className="section mb-1" style={{border:"1px solid #ddd"}}>
      <div className="section-header text-white text-center" style={{ background: clientLogo?.sidebar_color,padding:"10px",fontSize:"1.2em" }}>
        {title}
      </div>
      <div className="section-body" style={{padding:"10px"}}>
        {renderDetail("No of License", licenseCount)}
        {renderDetail("License Used", startDate === null ? "------" : startDate)}
        {renderDetail("License Expiry Date", endDate === null ? "------" : formatDate(endDate))}
      </div>
    </div>
  );

  const getEmailConfig = async () => {

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
            const {data} = await axios.get(Baseurl + `/db/dashboard/getcountData`,header);
            setLicenseDtails(data?.data)
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
}

useEffect(()=>{
  getEmailConfig()
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[])

  return (
    <div className={`main_Box ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">License Details</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/crm">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Email Configuration
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="container py-5">
          <div className="container mt-5 border p-2">
          {renderSection(
            "CRM",
            userInfo?.no_of_license,
            licenseDetails[0]?.db_user_platforms?.length > 0 ? 
              licenseDetails[0]?.db_user_platforms[0]?.usedLicences : null, 
            licenseDetails[0]?.subscription_end_date
          )}

            {renderSection("DMS", userInfo?.no_of_dms_license, licenseDetails[1]?.db_user_platforms?.length > 0 ? 
              licenseDetails[1]?.db_user_platforms[0]?.usedLicences : null,licenseDetails[1]?.subscription_end_date_dms)}

            {renderSection("SALES", userInfo?.no_of_sales_license, licenseDetails[2]?.db_user_platforms?.length > 0 ? 
              licenseDetails[2]?.db_user_platforms[0]?.usedLicences : null,licenseDetails[2]?.subscription_end_date_sales)}

            {renderSection("CHANNEL PARTNER", userInfo?.no_of_channel_license,licenseDetails[3]?.db_user_platforms?.length > 0 ? 
              licenseDetails[3]?.db_user_platforms[0]?.usedLicences : null,licenseDetails[3]?.subscription_end_date_channel)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseDetailScreen;

