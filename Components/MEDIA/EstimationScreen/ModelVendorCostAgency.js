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
import ModelUpdateVendorCostAgency from "./ModelUpdateVendorCostAgency";
import Link from "next/link";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";


const ModeVendorCostAgency = ({
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
  const [deleteSiteAgencyId, setDeleteSiteAgencyId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [show1,setShow1]=useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [agencySiteLists, setAgencySiteLists] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [printingVendorData,setPrintingVendorData]=useState([]);
  const [mountingVendorData,setMountingVendorData]=useState([]);
  const [printingMaterialData,setPrintingMaterialData]=useState([]);
  const [loader,setLoader]=useState(false)


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





  const getPrintingVendor = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 320,
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/media/printingCost/getPrintingCost`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
        
       setPrintingVendorData(response?.data?.data);
       console.log("response of printing vendor is ",response.data?.data)
   
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };


  const getMountingVendor = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 14,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/mountingCost/getMountingCost`,
          header
        );
  
      if (response?.status === 200 || response?.status === 201) {
        setLoader(false);
 
        setMountingVendorData(response?.data?.data)
      }

    
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };


  const getPrintingMaterial = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");
  
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 320,
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/media/printingCost/getPrintingCost`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
        
          setPrintingMaterialData(response.data.data);
          // if(!printingCostList.length){
          //   setPrintingCostList(response.data.data);
          // }
          console.log("answer 3 is",response?.data?.data,"printinigCostLIstData is");
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };





  const handleClose1= () => {
    setShow1(false);
  };





  async function getBusinessTypeList() {
    await fetchData(
      `/db/media/campaign/campaignBusinessType/getCampaignBusinessType`,
      setBusinessTypeList,
      errorToast,
      setErrorToast
    );
  }

  async function getAgencySites() {
    await fetchData(
      `/db/media/estimationAgencyBusiness/getSitesForAgencyEstimates?estimate_id=${estimateId}`,

      setAgencySiteLists,
      errorToast,
      setErrorToast
    );
  }

  const deleteAgencySite = async () => {
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
        const response = await axios.delete(
          Baseurl +
            `/db/media/estimationAgencyBusiness/deleteSitesForAgencyEstimates?site_id=${deleteSiteAgencyId}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAgencySites();
          setdeleteshowConfirm(false);
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
          setDeleteSiteAgencyId("");
        } else {
          toast.error("Something went wrong!");
          setdeleteshowConfirm(false);
        }
        setisLoading(false);
      }
    }
  };

  async function getAssetSites() {
    await fetchData(
      `/db/media/estimationAgencyBusiness/getSitesForAgencyEstimates?estimate_id=${estimateId}`,
      setAssetSiteLists,
      errorToast,
      setErrorToast
    );
  }

  useEffect(() => {
    getPrintingVendor();
    getPrintingMaterial();
    getMountingVendor();

    getAgencySites();
    getBusinessTypeList();
  }, [show]);

  return (
    <>

    
<ModelUpdateVendorCostAgency
        show={show1}
        handleClose={handleClose1}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimateId}
        getAgencySites={getAgencySites}
        selectedSite={selectedSite}
        printingVendorData={printingVendorData}
        setPrintingVendorData={setPrintingVendorData}
        printingMaterialData={printingMaterialData}
        mountingVendorData={mountingVendorData}
      />
      {/* <ConfirmBox
        showConfirm={assetDeleteShowConfirm}
        setshowConfirm={setAssetDeleteShowConfirm}
        actionType={deleteAssetSite}
        title={"Are You Sure you want to Delete ?"}
      /> */}
      
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Vendor Cost Sheet Update for Agency Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
          <ConfirmBox
                      showConfirm={deleteshowConfirm}
                      setshowConfirm={setdeleteshowConfirm}
                      actionType={deleteAgencySite}
                      title={"Are You Sure you want to Delete ?"}
                    />
            <div className="add_screen_head">
              <span className="text_bold">Agency Sites</span>
            </div>
            <div className="add_user_form">
              <div className="row ">
                {agencySiteLists?.filter((item) => item.status == true).length >
                0 ? (
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Site ID</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Location</th>
                        <th>Media Format</th>
                        <th>Media Vehicle</th>
                        <th>Media Type</th>
                        <th>Quantity</th>
                        <th>Height (Ft.)</th>
                        <th>Width (Ft.)</th>
                        <th>Total Sq. Ft.</th>
                        <th>Client Display Cost</th>
                                <th>Client Mounting Cost / Sq. Ft.</th>
                                <th>Client Printing Cost / Sq. Ft.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencySiteLists
                        ?.filter((item) => item.status == true)
                        ?.map((site) => (
                          <tr key={site.site_id}>
                            <td>
                            
                                {site.site_id}
                        
                            </td>

                            <td>{site?.state_id}</td>
                            <td>{site?.city_id}</td>
                            <td>{site?.location}</td>
                          
                            <td>{site?.m_f_id}</td>
                            <td>{site?.m_v_id}</td>
                            <td>{site?.m_t_id}</td>
                            <td>{site?.quantity}</td>
                            <td>{site?.height}</td>
                            <td>{site?.width}</td>
                            <td>
                              {site?.height * site?.width}
                            </td>
                            <td>{site?.client_display_cost}</td>
                                    <td>{site?.client_mounting_cost}</td>
                                    <td>{site?.client_printing_cost}</td>
                            {/* {!viewMode ? ( */}
                            <td className="table_btns d-flex">
                            <button
                                          className="action_btn"
                                          title="Delete"
                                          onClick={() => {
                                            setdeleteshowConfirm(true);
                                            setDeleteSiteAgencyId(site.site_id);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </button>
                              <button
                                className="action_btn"
                                onClick={() => {
                                //   setEstimationId(tableMeta?.rowData[3]);
                                  setShow1(true);
                                  setSelectedSite(site)
                                  console.log("selected site selected",selectedSite);
                                }}
                                title="Vendor Cost Sheet Update"
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
      </Modal>
    </>
  );
};

export default ModeVendorCostAgency;
