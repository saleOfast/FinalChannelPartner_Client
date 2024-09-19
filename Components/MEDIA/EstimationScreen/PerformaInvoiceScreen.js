import React, { useEffect, useState } from "react";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { useSelector } from "react-redux";
import generatePDF, { Options } from "react-to-pdf";
import Loader from "../../Loader/Loader";
import { useRouter } from "next/router";
import moment from "moment/moment";
import { ToWords } from 'to-words';

const ProformaInvoiceScreen = () => {
  const router = useRouter();
  const { est_id } = router.query;
  const sideView = useSelector((state) => state.sideView.value);
  const [proformaInfo, setProformaInfo] = useState([]);
  const [loader, setLoader] = useState(false);
  const [primaryCompany, setPrimaryCompany] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [clientState,setClientState] = useState(null);
  const [primaryCompanyState,setPrimaryCompanyState] = useState(null);
  let subTotal = 0;
  const toWords = new ToWords();


  const options = {
    filename: `Proforma_Invoice.pdf`,
    page: {
      format: "A4", // This sets the format to A4 size, standard for printing
      orientation: "portrait", // Choose 'landscape' if needed
      margin: 20,
    },
  };

  const getTargetElement = () => document.getElementById("Proforma-Invoice");

  const downloadPdf = () => {
    generatePDF(getTargetElement, options);
  };

 
  useEffect(() => {
    const getProformaInfo = async () => {
      setLoader(true);
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            pass: "pass",
          },
        };
        try {
          const response = await axios.get(
            Baseurl +
              `/db/media/estimation/proformaInvoice?estimate_id=${est_id}`,
            header
          );
          if (response?.status == 200 || response?.status == 201) {
            setProformaInfo(response?.data?.data);
            setClientState(proformaInfo?.db_media_campaign?.db_account?.billState?.state_id||null)
            setLoader(false);
          }
        } catch (error) {
          console.log(error);
          setLoader(false);
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        } finally {
          setLoader(false);
        }
      }
    };
    if (est_id) {
      getProformaInfo();
    }
  }, [est_id,proformaInfo?.db_media_campaign?.db_account?.billState?.state_id]);

  useEffect(() => {
    const getSignInData = async () => {
      try {
        let baseUrl = window.location.origin;
        if (baseUrl === "http://localhost:3000") {
          baseUrl = "http://192.168.1.38:3000";
        }
        // const { data } = await axios.post(Baseurl + "/db/admin/url", {client_url: `${baseUrl}`});
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              pass: "pass",
            },
          };
          const { data } = await axios.post(Baseurl + "/db/admin/getClientDataByUrl", {client_url: `${baseUrl}`},header);
          setPrimaryCompany(data?.data);
          
          setPrimaryCompanyState(data?.data?.db_state?.state_id)
        }
        
        
      } catch (error) {
        console.log(error);
      }
    };
    getSignInData();
  }, []);
  return (
    <>
      {loader ? (
        <div className="main_Box">
          <Loader />
        </div>
      ) : (
        <>
          {proformaInfo ? (
            <>
              <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                  <h3 className="content_head">Proforma Invoice</h3>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        {" "}
                        <Link href="/media">Home </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Proforma Invoice
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="main_content bg-transparent">
                  <div className="text-end d-flex justify-content-end bg-white shadow-sm">
                    <button className="btn btn-outline-secondary m-2 btn-sm">
                      <Link href={"/media/Estimations"}>Back</Link>
                    </button>
                    <button
                      className="btn btn-outline-primary m-2 btn-sm"
                      onClick={downloadPdf}
                    >
                      Download as PDF
                    </button>
                  </div>
                  <section
                    className="Proforma-Invoice p-2 mt-2 bg-white shadow-sm rounded"
                    id="Proforma-Invoice"
                  >
                    <div className="container">
                      <div className="row mb-4">
                        <div className="col-12 col-md-6 d-flex align-items-center">
                          <img
                            src={`${filesUrl}/logo/images${primaryCompany?.logo}`}
                            alt="Company Logo"
                            className="img-fluid"
                            style={{maxWidth:"200px"}}
                          />
                        </div>
                        <div className="col-12 col-md-6 text-md-end mt-4 mt-md-0">
                          <>
                            <p
                              className="text-dark mb-0"
                              style={{ fontWeight: 500 }}
                            >
                              {primaryCompany?.user}
                            </p>
                            <p className="text-dark mb-0">
                            {primaryCompany?.address},
                              <br />
                              
                              {primaryCompany?.db_city?.city_name},{primaryCompany?.db_state?.state_name} - {primaryCompany?.pincode}, {primaryCompany?.db_country?.country_name}
                            </p>
                            <p className="text-dark mb-0">
                              Mobile: {primaryCompany?.contact_number}
                            </p>
                            <p className="text-dark mb-0">
                              Email: {primaryCompany?.email}
                            </p>
                            <p className="text-dark mb-0">
                              Website: {primaryCompany?.domain}
                              
                            </p>
                          </>
                        </div>
                      </div>
                      <hr
                        style={{
                          height: "2px",
                          backgroundColor: "#000",
                          border: "none",
                        }}
                      />
                    </div>

                    <div className="container mt-3 mt-lg-5">
                      <h1 className="fs-3 fw-bold text-center text-decoration-underline">
                        Proforma Invoice
                      </h1>

                      <div className="row pt-3 pt-lg-5">
                        <div className="col-12 col-md-8">
                          <p>
                            <strong>
                              {
                                proformaInfo?.db_media_campaign?.db_account
                                  ?.acc_name
                              }
                              {/* M/s. AirAsia.com Travel Sdn. Bhd */}
                            </strong>
                            <br />
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.bill_address
                            }
                            <br />
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.billCity?.city_name
                            }
                            ,
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.billState?.state_name
                            }
                            <br />
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.billCountry?.country_name
                            }
                            <br />
                            GSTIN:{" "}
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.gstin_number
                            }
                            <br />
                            PAN:{" "}
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.pan_number
                            }
                          </p>
                        </div>
                        <div className="col-12 col-md-4 text-md-end">
                          <p className="">
                            PI No.:{ proformaInfo?.estimation_code}
                            <br />
                            Date: {moment().format('DD/MM/YYYY')}
                            <br />
                            PAN No.:{" "}
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.pan_number
                            }
                            <br />
                            GST No.:{" "}
                            {
                              proformaInfo?.db_media_campaign?.db_account
                                ?.gstin_number
                            }
                            <br />
                            SAC Code: 998361
                            <br />
                            Advertising Agency Service
                          </p>
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-12">
                          <p className="mb-3">
                            <strong>Dear Sir,</strong>
                            <br />
                            Please find below the estimate for the{" "}
                            {
                              proformaInfo?.db_media_campaign?.campaign_name
                            }{" "}
                            from{" "}
                            {moment(
                              proformaInfo?.db_media_campaign
                                ?.campaign_start_date
                            ).format("DD/MM/YYYY")}{" "}
                            to{" "}
                            {moment(
                              proformaInfo?.db_media_campaign?.campaign_end_date
                            ).format("DD/MM/YYYY")}
                            .
                          </p>

                          <div>
                            <table className="table table-bordered text-center table-compact">
                              <thead className="table-light">
                                <tr>
                                  <th scope="col">S.No.</th>
                                  <th scope="col">Vehicle</th>
                                  <th scope="col">State</th>
                                  <th scope="col">Town</th>
                                  <th scope="col">Location</th>
                                  <th scope="col">Type</th>
                                  <th scope="col">Nos.</th>
                                  <th scope="col">Width (Ft.)</th>
                                  <th scope="col">Height (Ft.)</th>
                                  <th scope="col">Total (Sq.Ft)</th>
                                  <th scope="col">Display Cost</th>
                                  <th scope="col">Printing Cost</th>
                                  <th scope="col">Mounting Cost</th>
                                  <th scope="col">Total Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                {proformaInfo?.costSheets?.map(
                                  (_site, _siteIndex) => {
                                    const totalCost =
                                      parseFloat(_site?.display_cost_per_month || 0) +
                                      parseFloat(_site?.printing_cost || 0) +
                                      parseFloat(_site?.mounting_cost || 0);
                                    subTotal += totalCost;
                                    return (
                                      <tr key={_siteIndex}>
                                        <th scope="row">{_siteIndex+1}</th>
                                        <td>{_site?.media_vehicle}</td>
                                        <td>{_site?.state}</td>
                                        <td>{_site?.city}</td>
                                        <td>{_site?.location}</td>
                                        <td>{_site?.media_type}</td>
                                        <td>{_site?.quantity}</td>
                                        <td>{_site?.width}</td>
                                        <td>{_site?.height}</td>
                                        <td>{_site?.total_sq_ft}</td>
                                        <td>
                                          {_site?.display_cost_per_month.toFixed(
                                            2
                                          )}
                                        </td>
                                        <td>
                                          {_site?.printing_cost.toFixed(2)}
                                        </td>
                                        <td>
                                          {_site?.mounting_cost.toFixed(2)}
                                        </td>
                                        <td>{totalCost.toFixed(2)}</td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <TotalSummary subTotalAmount={subTotal} agencyCommission={proformaInfo?.agency_commission_display} setGrandTotal={setGrandTotal} clientState={clientState} primaryCompanyState={primaryCompanyState}/>
                        <div className="mt-5">
                          <p>
                            <strong>Amount in Words:</strong> {toWords.convert(grandTotal||0)} Only
                          </p>
                          <p className="text-center fw-bold mt-3">
                            This is a system-generated document, seal and
                            signature are not needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

const TotalSummary = ({ subTotalAmount=0, agencyCommission=0, setGrandTotal=null, clientState=null,primaryCompanyState=null }) => {
  const totalAmount = (parseFloat(agencyCommission || 0) + subTotalAmount).toFixed(2);
  const isSameState = clientState == primaryCompanyState && clientState && primaryCompanyState;
  
  // Calculate IGST, CGST, and SGST
  const igst = (totalAmount * 0.18).toFixed(2);
  const cgst = (totalAmount * 0.09).toFixed(2);
  const sgst = (totalAmount * 0.09).toFixed(2);

  // Assuming CGST and SGST are used (local transaction), not IGST (interstate transaction)
  const grandTotalWithCGST_SGST = (parseFloat(totalAmount) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

  // Assuming IGST is used (interstate transaction)
  const grandTotalWithIGST = (parseFloat(totalAmount) + parseFloat(igst)).toFixed(2);

  if(setGrandTotal){
    setGrandTotal(grandTotalWithIGST)
  }
  return (
    <div className="col-12 text-end mt-3">
      <div className="d-flex justify-content-end gap-5">
        <div>
          <p>
            <strong>Sub Total:</strong><br />
            <strong>Agency Commission:</strong><br />
            <strong>Total:</strong><br />
            <strong>CGST @ 9 %:</strong><br />
            <strong>SGST @ 9 %:</strong><br />
            <strong>IGST @ 18 %:</strong><br />
            <strong>Grand Total:</strong>
          </p>
        </div>
        <div>
          <p className="fw-semibold">
            ₹{subTotalAmount.toFixed(2)}<br />
            ₹{parseFloat(agencyCommission || 0).toFixed(2)}<br />
            ₹{totalAmount}<br />
            ₹{isSameState ? cgst : '0.00'}<br />
            ₹{isSameState ? sgst : '0.00'}<br />
            ₹{!isSameState ? igst : '0.00'}<br />
            ₹{grandTotalWithIGST}
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoiceScreen;
