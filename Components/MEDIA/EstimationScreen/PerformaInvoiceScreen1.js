import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../../Utils/Constants";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import generatePDF from 'react-to-pdf';
import Loader from "../../Loader/Loader";

const PerformaInvoiceScreen1 = () => {
    const sideView = useSelector((state) => state.sideView.value);
    const [performaInfo, setPerformInfo] = useState([]);
    const [loader, setLoader] = useState(false);

    const PerformaInfo = async () => {
        setLoader(true);
        if (hasCookie('token')) {
            let token = getCookie('token');
            let db_name = getCookie('db_name');

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: "pass",
                },
            };
            try {
                const response = await axios.get(Baseurl + `/db/media/estimation/getEstimation`, header);
                if (response?.status === 200 || response?.status === 201) {
                    setLoader(false);
                    setPerformInfo(response?.data?.data);
                }
            } catch (error) {
                console.log(error);
                setLoader(false);
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Something went wrong!');
                }
            }
        }
    };

    const options = {
        filename: `Performa_Invoice.pdf`,
        page: {
            format: 'A4', // This sets the format to A4 size, standard for printing
            orientation: 'portrait', // Choose 'landscape' if needed
            margin: 20,
        },
    };

    const getTargetElement = () => document.getElementById("Proforma-Invoice");

    const downloadPdf = () => {
        generatePDF(getTargetElement, options);
    };

    const invoiceRef = useRef();

    const handleDownload = () => {
        const input = invoiceRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addImage(imgData, "PNG", 0, 0);
            pdf.save("proforma-invoice.pdf");
        });
    };

    useEffect(() => {
        // PerformaInfo();
    }, []);

    return (
        <>
            {loader ? (
                <div className="main_Box">
                    <Loader />
                </div>
            ) : (
                <div className={`main_Box ${sideView}`}>
                    <div className="bread_head">
                        <h3 className="content_head">Performa Invoice</h3>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href='/media'>Home </Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Performa Invoice
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="main_content">
                        <div>
                            <div ref={invoiceRef} className="invoiceContainer">
                                <h1 className="title">Proforma Invoice</h1>
                                <div className="companyInfo">
                                    <p>Podhigai Ads Pvt. Ltd.</p>
                                    <p>Unit No: 6A, 6th Floor, Century Plaza,</p>
                                    <p>No 561, 562, Anna Salai, Teynampet, Chennai - 600018, Tamil Nadu</p>
                                    <p>Mobile: 9840 54 54 74 / 044-42359332</p>
                                    <p>Email: enquiry@podhigaiads.com</p>
                                    <p>Website: www.podhigaiads.com</p>
                                </div>
                                <div className="invoiceDetails">
                                    <p>PI. No: CE024/06/24-25</p>
                                    <p>Date: 10/06/2024</p>
                                </div>
                                <div className="clientInfo">
                                    <p>M/s. AirAsia.com Travel Sdn. Bhd.</p>
                                    <p>Redstation, west wing, level 4, stesen sentral, Kuala Lumpur, Malaysia</p>
                                    <p>SST reg no. W10-2002-32000105</p>
                                    <p>PAN No.: AAICP5203F</p>
                                    <p>GST No.: 33AAICP5203F1ZT</p>
                                    <p>India SAC Code: 998361</p>
                                </div>
                                <div className="campaignDetails">
                                    <p>Dear Sir,</p>
                                    <p>Please find below estimate for the campaign Tesla Campaign from 14/06/2024 to 12/07/2024.</p>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="tableHeader">S. No.</th>
                                            <th className="tableHeader">Vehicle Type</th>
                                            <th className="tableHeader">State</th>
                                            <th className="tableHeader">Town</th>
                                            <th className="tableHeader">Location</th>
                                            <th className="tableHeader">Width (Ft.)</th>
                                            <th className="tableHeader">Height (Ft.)</th>
                                            <th className="tableHeader">Total Sq. Ft</th>
                                            <th className="tableHeader">Display Cost</th>
                                            <th className="tableHeader">Printing Cost</th>
                                            <th className="tableHeader">Mounting Cost</th>
                                            <th className="tableHeader">Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="tableCell">1</td>
                                            <td className="tableCell">Others</td>
                                            <td className="tableCell">Tamil Nadu</td>
                                            <td className="tableCell">Chennai</td>
                                            <td className="tableCell">Across City - Chennai - Mobile Van Innovation</td>
                                            <td className="tableCell">1</td>
                                            <td className="tableCell">220</td>
                                            <td className="tableCell">1</td>
                                            <td className="tableCell">220.00</td>
                                            <td className="tableCell">58824.00</td>
                                            <td className="tableCell">880.00</td>
                                            <td className="tableCell">2200.00</td>
                                            <td className="tableCell">61904.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="totalSection">
                                    <p>Sub Total: 113931.00</p>
                                    <p>Agency Commission: 0.00</p>
                                    <p>Total: 113931.00</p>
                                    <p>IGST @ 18%: 20508.00</p>
                                    <p>Grand Total: 134437.00</p>
                                    <p>Amount in Words: Rupees One Lakh Thirty Four Thousand Four Hundred Thirty Seven Only</p>
                                </div>
                                <p className="footerNote">This is a system generated document, seal and signature is not needed.</p>
                            </div>
                            <button onClick={handleDownload} className="downloadButton">
                                Download as PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .invoiceContainer {
                    width: 100%;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    background-color: #fff;
                    font-family: Arial, sans-serif;
                }
                .title {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .companyInfo {
                    text-align: left;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .invoiceDetails {
                    text-align: right;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .clientInfo {
                    text-align: left;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .campaignDetails {
                    text-align: left;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .tableHeader {
                    border: 1px solid #ddd;
                    padding: 8px;
                    background-color: #f2f2f2;
                    text-align: left;
                }
                .tableCell {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                .totalSection {
                    text-align: right;
                    font-size: 14px;
                    margin-top: 20px;
                }
                .footerNote {
                    text-align: center;
                    font-size: 12px;
                    margin-top: 20px;
                    color: #888;
                }
                .downloadButton {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
            `}</style>
        </>
    );
};

export default PerformaInvoiceScreen1;
