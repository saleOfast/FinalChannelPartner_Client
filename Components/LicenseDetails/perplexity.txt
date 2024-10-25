import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";

const platformImage = [
  '/images/platform/CRM.png',
  '/images/platform/COMMON.png',
  '/images/platform/CHANNEL.png',
  '/images/platform/DMS.png',
  '/images/platform/MEDIA.png',
];

const LicenseDetailScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const userInfo = hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : null;
  const clientLogo = hasCookie("clientLogo") ? JSON.parse(getCookie("clientLogo")) : null;
  const [licenseDetails, setLicenseDetails] = useState([]);
  
  const licenseConfig = {
    crm: { title: "CRM", countKey: "no_of_license", index: 0, image: platformImage[0], dateKey: "subscription_end_date" },
    dms: { title: "DMS", countKey: "no_of_dms_license", index: 1, image: platformImage[3], dateKey: "subscription_end_date_dms" },
    sales: { title: "SALES", countKey: "no_of_sales_license", index: 2, image: platformImage[4], dateKey: "subscription_end_date_sales" },
    channel: { title: "CHANNEL PARTNER", countKey: "no_of_channel_license", index: 3, image: platformImage[2], dateKey: "subscription_end_date_channel" },
    // media: { title: "MEDIA", countKey: "no_of_media_license", index: 4, image: platformImage[4], dateKey: "subscription_end_date_media" }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`;
  };

  const renderCard = (title, licenseCount, usedLicenses, expiryDate, image) => (
    <div className="license-card" style={{ 
      maxWidth: "250px", // Adjust width as desired
      width: "100%",
      border: "1px solid #ddd", 
      borderRadius: "8px", 
      margin: "10px auto", 
      padding: "20px", 
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)" 
    }}>
      <img src={image} alt={title} style={{ width: "100%", height: "auto", maxHeight: "150px", objectFit: "contain", marginBottom: "10px", borderRadius: "8px 8px 0 0" }} />
      {/* <div className="card-header" style={{ backgroundColor: clientLogo?.sidebar_color, color: "#fff", padding: "10px", textAlign: "center", borderRadius: "8px 8px 0 0" }}>
        <h4>{title}</h4>
      </div> */}
      <div className="card-body" style={{ padding: "10px" }}>
        <p><strong>No of License:</strong> {licenseCount}</p>
        <p><strong>License Used:</strong> {usedLicenses === null ? "------" : usedLicenses}</p>
        <p><strong>License Expiry Date:</strong> {expiryDate === null ? "------" : formatDate(expiryDate)}</p>
      </div>
    </div>
  );

  const getEmailConfig = async () => {
    if (hasCookie('token')) {
      let token = getCookie('token');
      let db_name = getCookie('db_name');
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          m_id: 76,
        }
      };

      try {
        const { data } = await axios.get(Baseurl + `/db/dashboard/getcountData`, header);
        setLicenseDetails(data?.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      }
    }
  };

  const allowedPermissions = hasCookie("allowedpermissions") ? JSON.parse(getCookie("allowedpermissions")) : [];

  useEffect(() => {
    getEmailConfig();
  }, []);

  return (
    <div className={`main_Box ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">License Details</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/setting">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              License Configuration
            </li>
          </ol>
        </nav>
      </div>

      <div className="main_content">
        <div className="container py-5">
          <div className="row">
            {allowedPermissions.map((item, index) => {
              const config = licenseConfig[item];
              if (config) {
                const { title, countKey, index: licenseIndex, image, dateKey } = config;
                return (
                  <div className="col-md-4" key={index}>
                    {renderCard(
                      title,
                      userInfo[countKey],
                      licenseDetails[licenseIndex]?.db_user_platforms?.[0]?.usedLicences || null,
                      licenseDetails[licenseIndex]?.[dateKey],
                      image
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseDetailScreen;
