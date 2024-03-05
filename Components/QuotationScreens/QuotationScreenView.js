import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from "../../Utils/Constants";
import { useReactToPrint } from "react-to-print";
import PdfComponent from "./PdfComponent";
import { useSelector } from "react-redux";


const QuotationScreenView = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;
    const componentpdf = useRef();

    const [dataList, setDataList] = useState(null);
    const [loginDetails, setloginDetails] = useState({});

    const pdfview = useReactToPrint({
        content: () => componentpdf.current,
        documentTitle: "User Bill Detail",
        onAfterPrint: () => {
            toast.success("Completed")
        },
    })

    const getDataList = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:50
                },
            };

            try {
                const response = await axios.get(
                    Baseurl + `/db/quatMaster?qm_id=${id}`,
                    header
                );
                setDataList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    function checkLogin() {
        if (hasCookie("userInfo")) {
            let token = getCookie("userInfo");
            setloginDetails(JSON.parse(token));
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            getDataList(id);
        }
    }, [router.isReady, id]);

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <>
             <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">View Quotations</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/Quotations"> Quotations </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                View Quotations
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className='main_content'>
                    <div className="lead_box">
                        <div ref={componentpdf} style={{ width: '100%' }}>
                            <PdfComponent dataList={dataList} loginDetails={loginDetails} />
                        </div>
                        <div className="pdf_buttonBox">
                            <button className="btn btn-primary" onClick={pdfview} >PRINT</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuotationScreenView;
