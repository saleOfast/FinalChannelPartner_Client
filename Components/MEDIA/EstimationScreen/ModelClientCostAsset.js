import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import DeleteIcon from "../../Svg/DeleteIcon";
import ConfirmBox from "../../Basics/ConfirmBox";
import { Table } from "react-bootstrap";
import { fetchData } from "../../../Utils/getReq";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import ViewIcon from "../../Svg/ViewIcon";
import ModelUpdateClientCostAsset from "./ModelUpdateClientCostAsset";
import Link from "next/link";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";


const ModelClientCostAsset = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  getSiteList,
  stateId,
  cityIds,
  estimateId,
}) => {
  const [assetSiteLists, setAssetSiteLists] = useState([]);
  const [assetDeleteShowConfirm, setAssetDeleteShowConfirm] = useState(false);
  const [busiessTypeList, setBusinessTypeList] = useState([]);
  const [errorToast, setErrorToast] = useState(false);
  const [deleteSiteAssetId, setDeleteSiteAssetId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [show1,setShow1]=useState(false);
  const [selectedSite, setSelectedSite] = useState(null);


  const [userInfo, setUserInfo] = useState({
    estimate_type: "",
    campaign_id: null,
    campaign_name: "",
    acc_id: "",
    package_offer: "",
    contact: "",
    campaign_brand: "",
    cmpn_s_id: null,
    campaign_start_date: "",
    campaign_end_date: "",
    campaign_duration: 0,
    cmpn_p_id: null,
    proof_attachment: null,
    cmpn_b_t_id: null,
    package_cost_display: 0,
    package_cost_printing: 0,
    package_cost_mounting: 0,
    // client_display_cost: 0,
    total_agency_commision: 0,
    // client_mounting_cost: 0,
    // client_printing_cost: 0,
    agency_commission_mounting: 0,
    total_client_cost: 0,
    total_sales_order_value: 0,
    total_credit_note_value: 0,
    total_receipt_from_client: 0,
    total_client_outstanding: 0,
    agency_commission_display: 0,
    total_ndp_days: 0,
    total_sales_invoice_value: 0,
    total_vendor_display_cost: 0,
    total_vendor_mounting_cost: 0,
    total_vendor_printing_cost: 0,
    total_vendor_cost: 0,
    total_purchase_order_value: 0,
    agency_commission_printing: 0,
    total_debit_note_value: 0,
    total_vendor_payment: 0,
    total_vendor_outstanding: 0,
    total_ndp_value: 0,
    overall_margin: 0,
    display_margin: 0,
    mounting_margin: 0,
    printing_margin: 0,
    overall_margin_percentage: 0,
    display_margin_percentage: 0,
    mounting_margin_percentage: 0,
    printing_margin_percentage: 0,

    gst: false,
    cgst: false,
    sgst: false,
  });


  const handleClose1= () => {
    setShow1(false);
  };




  const deleteAssetSite = async () => {
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
        const response = await axios.post(
          Baseurl +
            `/db/media/estimationAssetBusiness/addEstimationAssetBusiness`,
          {
            estimate_id: estimateId,
            sites: [
              {
                site_id: deleteSiteAssetId,
                status: false,
              },
            ],
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setAssetDeleteShowConfirm(false);
          getAssetSites();
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
            console.log("error",error.response?.data?.message);
          toast.error(error?.response?.data?.message);
          setDeleteSiteAssetId('')
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };

  async function getBusinessTypeList() {
    await fetchData(
      `/db/media/campaign/campaignBusinessType/getCampaignBusinessType`,
      setBusinessTypeList,
      errorToast,
      setErrorToast
    );
  }

  async function getAssetSites() {
    await fetchData(
      `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
      setAssetSiteLists,
      errorToast,
      setErrorToast
    );
  }

  useEffect(() => {
    getAssetSites();
    getBusinessTypeList();
  }, [show]);

  return (
    <>

    
<ModelUpdateClientCostAsset
        show={show1}
        handleClose={handleClose1}
        getAssetSites={getAssetSites}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimateId}
        selectedSite={selectedSite} 
        
      />
      {/* <ConfirmBox
        showConfirm={assetDeleteShowConfirm}
        setshowConfirm={setAssetDeleteShowConfirm}
        actionType={deleteAssetSite}
        title={"Are You Sure you want to Delete ?"}
      /> */}
      
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Client Cost Sheet Update for Asset Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <ConfirmBox
              showConfirm={assetDeleteShowConfirm}
              setshowConfirm={setAssetDeleteShowConfirm}
              actionType={deleteAssetSite}
              title={"Are You Sure you want to Delete ?"}
            />
            <div className="add_screen_head">
              <span className="text_bold">Asset Sites</span>
            </div>
            <div className="add_user_form">
              <div className="row ">
                {assetSiteLists?.filter((item) => item.status == true).length >
                0 ? (
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Site ID</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Media Format</th>
                        <th>Media Vehicle</th>
                        <th>Media Type</th>
                        <th>Quantity</th>
                        <th>Height (Ft.)</th>
                        <th>Width (Ft.)</th>
                        <th>Total Sq. Ft.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetSiteLists
                        ?.filter((item) => item.status == true)
                        ?.map((site) => (
                          <tr key={site.site_id}>
                            <td style={{ color: "blue", textDecoration: "underline", textDecorationColor: "blue" }}>
                            <Link href={`/media/AddSites?id=${site.site_id}&vw=md`}>
                                {site.site_id}
                            </Link>
                            </td>

                            <td>{site?.db_site?.db_state?.state_name}</td>
                            <td>{site?.db_site?.db_city?.city_name}</td>
                            <td>{site?.db_site?.location}</td>
                            <td>
                              {site?.db_site?.db_site_category?.site_cat_name}
                            </td>
                            <td>{site?.db_site?.db_media_format?.m_f_name}</td>
                            <td>{site?.db_site?.db_media_vehicle?.m_v_name}</td>
                            <td>{site?.db_site?.db_media_type?.m_t_name}</td>
                            <td>{site?.db_site.quantity}</td>
                            <td>{site?.db_site.height}</td>
                            <td>{site?.db_site.width}</td>
                            <td>
                              {site?.db_site.height * site?.db_site.width}
                            </td>
                            {/* {!viewMode ? ( */}
                            <td className="table_btns d-flex">
                              <button
                                className="action_btn"
                                title="Delete"
                                onClick={() => {
                                  // deleteAssetSite(site.site_id);
                                  setAssetDeleteShowConfirm(true);
                                  setDeleteSiteAssetId(site.site_id);
                                }}
                              >
                                <DeleteIcon />
                              </button>
                              <button
                                className="action_btn"
                                onClick={() => {
                                //   setEstimationId(tableMeta?.rowData[3]);
                                setSelectedSite(site);
                                  setShow1(true);
                                }}
                                title="Client Cost Sheet Update"
                              >
                                <ViewIcon />
                              </button>
                            </td>
                            <td className="table_btns">
                              {/* <button
                                className="action_btn"
                                title="Delete"
                                onClick={() => {
                                  // deleteAssetSite(site.site_id);
                                  setAssetDeleteShowConfirm(true);
                                  setDeleteSiteAssetId(site.site_id);
                                }}
                              >
                                <ViewIcon />
                              </button> */}

                              

                            </td>
                            {/* ) : (
                                      ""
                                    )} */}
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No sites available</p>
                )}
              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={getSiteList}>
            SUBMIT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelClientCostAsset;
