import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table ,Alert} from "react-bootstrap";
import { fetchData } from "../../../Utils/getReq";
import EditIcon from "../../Svg/EditIcon";
import { getCookie, hasCookie } from "cookies-next";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";
import { toast } from "react-toastify";

const CampaignEstimates = ({ id, link }) => {
  const [relatedEstimates, setRelatedEstimates] = useState();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getRelatedEstimates = async (id) => {
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
          Baseurl + `/db/media/estimation/getEstimation?campaign_id=${id}`,
          header
        );

        if (
          (response?.status == 200 || response?.status == 201) &&
          response?.data?.data?.length>0
        ) {
          const data = response?.data?.data;
          setRelatedEstimates(data)
        }
      } catch (error) {
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    if(id){
      getRelatedEstimates(id);
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!salesOrder?.s_o_date)
      newErrors.s_o_date = "Sales Order Date is required";
    if (!salesOrder?.campaign_id)
      newErrors.campaign_id = "Campaign ID is required";
    if (!salesOrder?.acc_id)
      newErrors.acc_id = "Client/Agency Name is required";
    if (!salesOrder?.estimate_id)
      newErrors.estimate_id = "Estimate ID is required";
    if (!salesOrder?.s_o_po_number)
      newErrors.s_o_po_number = "Sales PO Number is required";
    if (!salesOrder?.s_o_po_date)
      newErrors.s_o_po_date = "Sales PO Date is required";
    if (!salesOrder?.s_o_po_value)
      newErrors.s_o_po_value = "Sales PO Value is required";
    if (!salesOrder?.s_o_po_remarks)
      newErrors.s_o_po_remarks = "Remarks are required";

    return newErrors;
  };

  const handleUpdate = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowError(true);
    } else {
      // Submit the form data
      setShowError(false);
      if (hasCookie("token")) {
        setLoading(true);
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
          const response = await axios.put(
            Baseurl +
              `/db/media/salesOrder/updateSalesOrder?id=${salesOrder?.s_o_id}`,
            salesOrder,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
            setLoading(false);
            setShow(false)
          }
        } catch (error) {
          console.log(error);
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Something went wrong!");
          }
          setLoading(false);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalesOrder({ ...salesOrder, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: false }); // Clear the error for that field if it's corrected
    }
  };

  return (
    <>
      <div className="add_screen_head">
        <span className="text_bold">Estimations</span>
      </div>
      <div className="add_user_form">
        <div className="row">
          {
            relatedEstimates ? (
              <div
              style={{
                maxHeight: "350px", // Set the maximum height for the table
                overflowY: "auto", // Enable vertical scrolling
                marginBottom: "20px", // Add some space below the table
              }}
            >
              <Table bordered responsive>
                <thead>
                  <tr>
                    {/* <th>Sales Order Number</th> */}
                    <th>Estimated ID</th>
                    <th>Estimate Type</th>
                    <th>Estimate Status</th>
                    <th>Client Printing Cost</th>
                    <th>Client Mounting Cost</th>
                    <th>Client Display Cost</th>
                  </tr>
                </thead>
  
                <tbody>
                  
                    {
                      relatedEstimates.map((item, index) => (
                        <tr key={index}>
                        <td ><Link className=" text-decoration-underline" href={`/media/AddEstimations/?id=${item?.estimate_id}&vw=mds`}>{item?.estimation_code}</Link></td>
                        <td >{item?.db_estimation_type?.est_t_name}</td>
                        <td >{item?.estimateStatus?.est_s_name}</td>
                        <td >{item?.printing_selling_cost}</td>
                        <td >{item?.mounting_selling_cost}</td>
                        <td >{item?.display_selling_cost}</td>
                        </tr>
                        ))
                    }
                  
                </tbody>
              </Table>
            </div>
            )
            :
            <p>No Related Estimates</p>
          }
          
        </div>
      </div>

    </>
  );
};

export default CampaignEstimates;
