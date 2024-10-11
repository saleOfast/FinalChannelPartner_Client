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
import moment from "moment";


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
  getContactList
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
  const [estimationTotals,setEstimationTotals] =useState({})
  const [displayVendorsList,setDisplayVendorsList] =useState([])



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
          pass:"pass"
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
          pass:"pass"
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/mountingCost/getMountingCost`,
          header
        );
  
      if (response?.status === 200 || response?.status === 201) {
        setMountingVendorData(response?.data?.data)
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
          pass:"pass"
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

  const getDisplayVendors = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");
  
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass:"pass"
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/account`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
          const data=response?.data?.data?.filter((item)=>item?.db_account_type?.account_type_name=="OOH Agencies")
          setDisplayVendorsList(data);
          console.log(data)
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

  async function getAgencySites1() {
    await fetchData(
      `/db/media/costSheet/vendorCostSheet/getAgencyCostSheetsData?estimate_id=${estimateId}`,

      setAgencySiteLists,
      errorToast,
      setErrorToast
    );
  }

  const getAgencySites = async () => {
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
            const response = await axios.get(Baseurl +`/db/media/costSheet/vendorCostSheet/getAgencyCostSheetsData?estimate_id=${estimateId}`, header);
            setAgencySiteLists(response?.data?.data);
            setEstimationTotals(response?.data?.totals)
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error('Something went wrong!')
            }
        }
    }
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

    getAgencySites();
    getBusinessTypeList();
  }, [show]);

  useEffect(()=>{
    getPrintingVendor();
    getPrintingMaterial();
    getMountingVendor();
    getDisplayVendors()

  },[show])

  const totals = agencySiteLists?.reduce(
    (acc, site) => {
      acc.display += site.buying_price_as_per_duration || 0;
      acc.printing += site.printing_cost || 0;
      acc.mounting += site.mounting_cost || 0;
      return acc;
    },
    { display: 0, printing: 0, mounting: 0 }
  );

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
        getContactList={getContactList}
        estimationTotals={estimationTotals}
        displayVendorsList={displayVendorsList}
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
                {agencySiteLists?.length >
                0 ? (
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                      <th>SN</th>
                        <th>Site Code</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Location</th>
                        {/* <th>Category</th> */}
                        <th>Media Format</th>
                        <th>Media Vehicle</th>
                        <th>Media Type</th>
                        <th>Quantity</th>
                        <th>Width (Ft.)</th>
                        <th>Height (Ft.)</th>
                        <th>Total (Sq. Ft.)</th>
                        <th>Campaign Start Date</th>
                        <th>Campaign End Date</th>
                        <th>Campaign Duration</th>
                        <th>Display Vendor Name </th>
                        <th>Display Cost / Month</th>
                        <th>Buying Price as per Duration</th>
                        <th>Final Display Cost </th>
                        <th>Mounting Vendor </th>
                        <th>Mounting Cost / Sq. Ft.</th>
                        <th>Mounting Cost</th>
                        <th>Printing Vendor </th>
                        <th>Printing Material </th>
                        <th>Printing Cost / Sq. Ft.</th>
                        <th>Printing Cost</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencySiteLists?.map((site,index) => (
                          <tr key={site.site_id}>
                            <td>
                            {index+1}
                            </td>
                            <td style={{ color: "blue", textDecoration: "underline", textDecorationColor: "blue" }}>
                            {/* <Link href={`/media/AddSites?id=${site.site_id}&vw=md`}> */}
                                {site?.site_code}
                            {/* </Link> */}
                            </td>

                            <td>{site?.state}</td>
                            <td>{site?.city}</td>
                            <td>{site?.location}</td>
                            {/* <td>{site?.category}</td> */}
                            <td>{site?.media_format}</td>
                            <td>{site?.media_vehicle}</td>
                            <td>{site?.media_type}</td>
                            <td>{site?.quantity}</td>
                            <td>{site?.height}</td>
                            <td>{site?.width}</td>
                            <td>{site?.total_sq_ft}</td>
                            <td>
                              {moment(site?.campaign_start_date).format("DD/MM/YYYY")}
                            </td>
                            <td>
                              {moment(site?.campaign_end_date).format("DD/MM/YYYY")}
                            </td>
                            <td>
                              {moment(site?.campaign_end_date).diff(moment(site?.campaign_start_date), 'days')}
                            </td>
                            <td>
                              {site?.display_vendor_name}
                            </td>
                            <td>
                              {site?.display_cost_per_month}
                            </td>
                            <td>
                            {Number(site?.buying_price_as_per_duration).toFixed(2)}
                            </td>
                            <td>
                            {Number(site?.buying_price_as_per_duration).toFixed(2)}
                            </td>
                            <td>
                            {site?.mounting_vendor_name}
                            </td>
                            <td>
                            {site?.mounting_cost_per_sq_ft}
                            </td>
                            <td>
                            {Number(site?.mounting_cost).toFixed(2)}
                            </td>
                            <td>
                            {site?.printing_vendor_name}
                            </td>
                            <td>
                            {site?.pr_m_name}
                            </td>
                            <td>
                            {site?.printing_cost_per_sq_ft}
                            </td>
                            <td>
                            {Number(site?.printing_cost).toFixed(2)}
                            </td>
                            <td>
                            {site?.remarks}
                            </td>
                            {/* {!viewMode ? ( */}
                            <td className="table_btns d-flex">
                            {/* <button
                                          className="action_btn"
                                          title="Delete"
                                          onClick={() => {
                                            setdeleteshowConfirm(true);
                                            setDeleteSiteAgencyId(site.site_id);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </button> */}
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
                    <tfoot>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={16}></td>
                  <td >Total</td>
                  <td>{totals.display.toFixed(2)}</td>
                  <td colSpan={3}></td>
                  <td>{totals.mounting.toFixed(2)}</td>
                  <td colSpan={3}></td>
                  <td>{totals.printing.toFixed(2)}</td>
                </tr>
              </tfoot>
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
