import React, { useEffect, useState } from "react";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../../Utils/Constants";
import { useSelector } from "react-redux";
import generatePDF, { Options } from 'react-to-pdf';
import Loader from "../../Loader/Loader";
import { useRouter } from "next/router";


const PerformaInvoiceScreen = () => {
    const router=useRouter()
    const {est_id}=router.query;
    const sideView = useSelector((state) => state.sideView.value);
    const [performaInfo, setPerformInfo] = useState([]);
    const[loader,setLoader]=useState(false)
    const [total,setTotal]=useState();
    const [grandTotal,setGrandTotal]=useState()
    


    const getPerformaInfo = async () => {
        setLoader(true)
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass:"pass"
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/media/estimation/proformaInvoice?estimate_id=${est_id}`, header);
                if(response?.status==200 || response?.status==201){
                  setPerformInfo(response?.data?.data);

                  setLoader(false)
                }
            } catch (error) {
                console.log(error)
                setLoader(false)
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    }   

    const options = {
        filename: `Performa_Invoice.pdf`,
        page: {
            format: 'A4',  // This sets the format to A4 size, standard for printing
            orientation: 'portrait',  // Choose 'landscape' if needed
            margin: 20,
        }
    };
    
    const getTargetElement = () => document.getElementById("Proforma-Invoice");
    
      const downloadPdf = () => {
        generatePDF(getTargetElement, options);
      };
    

    useEffect(() => {
      if(est_id){
         getPerformaInfo();
      }
       
    }, [est_id]);
    return (

        <>
            {
                loader ?
                <div className="main_Box">
                    <Loader/> 
                </div>

                : 
                <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">Performa Invoice</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/media'>Home </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Performa Invoice</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                <div className="text-end my-3 d-flex justify-content-end">
                <button className="btn btn-warning m-2" >
                    <Link href={"/media/Estimations"}>
                            Back
                    </Link>
                        </button>
                        <button className="btn btn-primary m-2" onClick={downloadPdf}>
                            Download as PDF
                        </button>
                    </div>
                <section className="my-5 Proforma-Invoice" id="Proforma-Invoice" style={{padding:"10px"}}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 d-flex align-items-lg-center">
            <div>
              <img src="/img.png" alt="" />
            </div>
          </div>
          <div className="col-12 col-md-6 text-lg-end mt-4 mt-lg-0">
            <div>
              <p className="text-dark" style={{ fontWeight: 500 }}>
                Podhigai Ads Pvt. Ltd.<br />Unit No: 6A, 6th Floor, Century Plaza,<br />No 561, 562, Anna Salai, Teynampet<br />Chennai - 600018, Tamil Nadu<br />Mobile: 9840 54 54 74 / 044-42359332<br />Email: enquiry@podhigaiads.com<br />Website: www.podhigaiads.com
              </p>
            </div>
          </div>
          <hr style={{ height: '2px', color: '#000' }} />
        </div>
      </div>

      <div className="container mt-3 mt-lg-5">
        <h1 className="fs-3 fw-bold text-lg-center text-decoration-underline">Proforma Invoice</h1>
        <div className="row pt-3 pt-lg-5">
          <div className="col-12 col-md-8">
            <div>
              <p className="fs-6" style={{ fontWeight: 500 }}>
                <b>M/s.AirAsia.com Travel Sdn. Bhd</b><br />
                Redstation, west wing, level 4, stesen sentral Kuala Lumper 50407 Kuala Lumpur, Malaysia SST reg no.<br />
                W10-2002-32000105,<br />
                - ,<br />
                ,<br />
                India<br />
                06AAHCA5506F1Z0<br />
                AAHCA5506F
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4 text-lg-end">
            <div>
              <p className="text-dark" style={{ fontWeight: 500 }}>
                PI. No: CE024/06/24-25<br />
                Date:10/06/2024<br />
                PAN No.: AAICP5203F<br />
                GST No.:<br />
                33AAICP5203F1ZT<br />
                SAC Code: 998361<br />
                Advertising Agency<br />
                Service
              </p>
            </div>
          </div>
          <div className="mt-3" style={{ fontWeight: 500 }}>
            <p className="mb-3">
              <b>Dear Sir,</b><br />
              Please find below estimate for campaign Tesla Campaign from 14/06/2024 to12/07/2024.
            </p>
          </div>
          <div className="table-responsive">
            <table className="table mt-4" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead style={{ verticalAlign: 'middle' }}>
                <tr>
                  <th scope="col" className="text-center">S.No.</th>
                  <th scope="col" className="text-center">Vehicle</th>
                  <th scope="col" className="text-center">State</th>
                  <th scope="col" className="text-center">Town</th>
                  <th scope="col" className="text-center">Location</th>
                  <th scope="col" className="text-center">Type</th>
                  <th scope="col" className="text-center">Nos.</th>
                  <th scope="col" className="text-center">Width (Ft.)</th>
                  <th scope="col" className="text-center">Height (Ft.)</th>
                  <th scope="col" className="text-center">Total (Sq.Ft)</th>
                  <th scope="col" className="text-center">Display Cost</th>
                  <th scope="col" className="text-center">Printing Cost</th>
                  <th scope="col" className="text-center">Mounting Cost</th>
                  <th scope="col" className="text-center">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Others</td>
                  <td>Tamil Nadu</td>
                  <td>Chennai</td>
                  <td>Across City - Chennai - Mobile Van Innovation</td>
                  <td>BL</td>
                  <td>1</td>
                  <td>220</td>
                  <td>1</td>
                  <td>220.00</td>
                  <td>58824.00</td>
                  <td>880.00</td>
                  <td>2200.00</td>
                  <td>61904.00</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Mobile Van Branding</td>
                  <td>Tamil Nadu</td>
                  <td>Chennai</td>
                  <td>Mobile Van at Paruthipattu Avadi</td>
                  <td>BL</td>
                  <td>1</td>
                  <td>150</td>
                  <td>1</td>
                  <td>150.00</td>
                  <td>20956.00</td>
                  <td>600.00</td>
                  <td>1500.00</td>
                  <td>23056.00</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Billboard</td>
                  <td>Tamil Nadu</td>
                  <td>Chennai</td>
                  <td>Perambur near spectrum mall towards railway station</td>
                  <td>BL</td>
                  <td>1</td>
                  <td>25</td>
                  <td>25</td>
                  <td>625.00</td>
                  <td>20221.00</td>
                  <td>2500.00</td>
                  <td>6250.00</td>
                  <td>28971.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12 col-md-12 d-flex justify-content-end text-end mt-3">
            <div className="d-flex justify-content-space-between" style={{ gap: '120px' }}>
              <div>
                <p className="fw-normal text-dark fs-5">
                  <b>Sub Total:</b><br /><b>Agency Commission:</b><br /><b>Total:</b><br /><b>CGST @ 9 %:</b><br /><b>SGST @ 9 %:</b><br /><b>IGST @ 18 %:</b><br /><b>Grand Total:</b>
                </p>
              </div>
              <div>
                <p className="text-dark fs-5" style={{ fontWeight: 500 }}>
                  113931.00<br /> 0.00<br /> 113931.00<br /> 0.00<br /> 0.00<br /> 20508.00<br />134437.00
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="fs-5" style={{ fontWeight: 500 }}>
              <b>Amount in Words:</b> Rupees One Lakh Thirty Four Thousand Four Hundred Thirty Seven Only<br />
            </p>
            <p className="fs-5">
              <b className="text-center">This is a system generated document, seal and signature is not needed.</b>
            </p>
          </div>
        </div>
      </div>
                </section>
                
                </div>
            </div>
            }
        </>
    )
}

export default PerformaInvoiceScreen
