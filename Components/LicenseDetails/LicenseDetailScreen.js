import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import Link from "next/link";


const LicenseDetailScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const userInfo=hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : null;
  const subscriptionInfo=hasCookie("subscriptionInfo") ? JSON.parse(getCookie("subscriptionInfo")) : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`;
};
 



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
        
  <div className="container mt-5 border">
    
    <div className="row mb-4 mt-3">
      <div className="col">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th colSpan={2} className="bg-primary text-white text-center">CRM</th>
            </tr>
          </thead>
          <tbody className="table-bordered">
            <tr>
              <td>No of License</td>
              <td>{userInfo?.no_of_license}</td>
            </tr>
            <tr>
              <td>License Used</td>
              <td>{subscriptionInfo?.subscription_start_date===null ? "------" :formatDate(subscriptionInfo.subscription_start_date)}</td>
            </tr>
            <tr>
              <td>License Expiry Date</td>
              <td>{subscriptionInfo?.subscription_end_date===null ? "------" :formatDate(subscriptionInfo.subscription_end_date)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="row mb-4">
      <div className="col">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th colSpan={2} className="bg-primary text-white text-center">DMS</th>
            </tr>
          </thead>
          <tbody className="table-bordered">
            <tr>
              <td>No of License</td>
              <td>{userInfo?.no_of_license}</td>
            </tr>
            <tr>
              <td>License Used</td>
              <td>{subscriptionInfo?.subscription_start_date_dms===null ? "------" :formatDate(subscriptionInfo.subscription_start_date_dms)}</td>
            </tr>
            <tr>
              <td>License Expiry Date</td>
              <td>{subscriptionInfo?.subscription_end_date_dms===null ? "------" :formatDate(subscriptionInfo.subscription_end_date_dms)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="row mb-4">
      <div className="col">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th colSpan={2} className="bg-primary text-white text-center">Sales</th>
            </tr>
          </thead>
          <tbody className="table-bordered">
            <tr>
              <td>No of License</td>
              <td>{userInfo?.no_of_license}</td>
            </tr>
            <tr>
              <td>License Used</td>
              <td>{subscriptionInfo?.subscription_start_date_sales===null ? "------" :formatDate(subscriptionInfo.subscription_start_date_sales)}</td>
            </tr>
            <tr>
              <td>License Expiry Date</td>
              <td>{subscriptionInfo?.subscription_end_date_sales===null ? "------" :formatDate(subscriptionInfo.subscription_end_date_sales)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="row mb-4">
      <div className="col">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th colSpan={2} className="bg-primary text-white text-center">Channel Partner</th>
            </tr>
          </thead>
          <tbody className="table-bordered">
            <tr>
              <td>No of License</td>
              <td>{userInfo?.no_of_license}</td>
            </tr>
            <tr>
              <td>License Used</td>
              <td>{subscriptionInfo?.subscription_start_date_channel===null ? "------" :formatDate(subscriptionInfo.subscription_start_date_channel)}</td>
            </tr>
            <tr>
              <td>License Expiry Date</td>
              <td>{subscriptionInfo?.subscription_end_date_channel===null ? "------" :formatDate(subscriptionInfo.subscription_end_date_channel)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>


        </div>
      </div>
    </div>
  );
};

export default LicenseDetailScreen;