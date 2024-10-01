import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { fetchData } from "../../../Utils/getReq";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { Baseurl } from "../../../Utils/Constants";
import moment from "moment";
import { responsiveFontSizes } from "@mui/material";
import { ConnectingAirportsOutlined } from "@mui/icons-material";
import { formaArray1 } from "./Array";



const ModelUpdateVendorCostAgency = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  getSiteList,
  stateId,
  cityIds,
  selectedSite,
  estimateId,
  printingVendorData,
  setPrintingVendorData,
  printingMaterialData,
  mountingVendorData,
  getContactList,
  getAgencySites,
  estimationTotals
}) => {
  const [printingVendor, setPrintingVendor] = useState([]);
  const [loader, setLoader] = useState(false);
  const [printingCostList, setPrintingCostList] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [printingVendorList, setPrintingVendorList] = useState([]);
  const [printingMaterialList, setPrintingMaterialList] = useState([]);
  const [mountingVendorList, setMountingVendorList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
 
  const [getData, setGetData] = useState([]);
  const [errors, setErrors] = useState({
    final_display_cost: '',
    mounting_vendor_id: '',
    mounting_cost_per_sq_ft: '',
    printing_vendor_id: '',
    pr_m_id: '',
    printing_cost_per_sq_ft: '',
  
  });

  const [formData, setFormData] = useState({
    site_id: "",
    location: "",
    category: "",
    media_format: "",
    media_vehicle: "",
    media_type: "",
    quantity: "",
    width: "",
    height: "",
    total_sq_ft: "",
    campaign_start_date: "",
    campaign_end_date: "",
    campaign_duration: "",
    display_cost_per_month: "",
    buying_price_as_per_duration: "",
    final_display_cost: "",
    finalClientPOCost: "",
    mounting_cost_per_sq_ft: "",
    display_vender_cost: "",
    mounting_cost: "",
    printing_cost_per_sq_ft: "",
    printing_cost: "",
    remarks: "",
    mounting_vendor_id: "",
    printing_vendor_id: "",
    pr_m_id: "",
  });

  useEffect(()=>{
    console.log("selectedSite respose i s",selectedSite)
  },[show])

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "width" ||
      name === "height" ||
      name === "quantity" ||
      name === "finalClientPOCost" ||
      name === "mounting_cost_per_sq_ft" ||
      name === "printing_cost_per_sq_ft"
        ? parseFloat(value) || ""
        : value;

    const newFormData = {
      ...formData,
      [name]: parsedValue,
    };

    if (name === "width" || name === "height") {
      const width = parseFloat(newFormData.width) || 0;
      const height = parseFloat(newFormData.height) || 0;
      newFormData.total_sq_ft = (width * height).toFixed(2);
    }

    setFormData(newFormData);

  };



  const handleSelectChange = (name, selectedOption) => {
    // If the selected field is 'printing_vendor_id', clear 'pr_m_id' and reset related data

    if (name === "mounting_vendor_id") {
      setFormData({
        ...formData,
        [name]: selectedOption ? selectedOption.value : "",
        mo_c_id: "", // Clear 'mo_c_id' or any other related field
      });
    } else if (name === "printing_vendor_id") {
      setFormData({
        ...formData,
        [name]: selectedOption ? selectedOption.value : "",
        pr_m_id: "", // Clear 'pr_m_id'
        printing_cost_per_sq_ft: "", // Optionally clear 'printing_cost_per_sq_ft'
      });
    } else if (name === "pr_m_id") {
      setFormData({
        ...formData,
        [name]: selectedOption ? selectedOption.value : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: selectedOption ? selectedOption.value : "",
      });
    }
  };


  
  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.final_display_cost) {
      newErrors.final_display_cost = 'Final Display Cost is required.';
      valid = false;
    }
    if (!formData.mounting_vendor_id) {
      newErrors.mounting_vendor_id = 'Mounting Vendor is required.';
      valid = false;
    }
    if (!formData.mounting_cost_per_sq_ft) {
      newErrors.mounting_cost_per_sq_ft = 'Mounting Cost / Sq. Ft. is required.';
      valid = false;
    }

    if (!formData.printing_vendor_id) {
      newErrors.printing_vendor_id = 'Printing Vendor is required.';
      valid = false;
    }
    if (!formData.pr_m_id) {
      newErrors.pr_m_id = 'Printing Material is required.';
      valid = false;
    }
    if (!formData.printing_cost_per_sq_ft) {
      newErrors.printing_cost_per_sq_ft = 'Printing Cost / Sq. Ft. is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    if (formData.pr_m_id) {
      const selectedMaterial = printingMaterialData.find(
        (item) => item.pr_m_id === formData.pr_m_id  && item.acc_id == formData. printing_vendor_id
      );
      if (selectedMaterial) {
        setFormData((prevData) => ({
          ...prevData,
          printing_cost_per_sq_ft: selectedMaterial.pr_c_cost || "",
        }));
      }
    } else {
      // Optionally reset 'printing_cost_per_sq_ft' if 'pr_m_id' is cleared
      setFormData((prevData) => ({
        ...prevData,
        printing_cost_per_sq_ft: "",
      }));
    }
  }, [formData.pr_m_id]);

  useEffect(() => {
    if (formData.mounting_vendor_id) {
      const selectedMountingVendor = mountingVendorData.find(
        (item) => item.acc_id === formData.mounting_vendor_id
      );

      console.log(
        "selectedMountingVendor",
        selectedMountingVendor,
        "aggi",
        formData.mounting_vendor_id
      );
      if (selectedMountingVendor) {
        setFormData((prevData) => ({
          ...prevData,
          mounting_cost_per_sq_ft: selectedMountingVendor.mo_c_cost || "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        mo_c_id: "",
      }));
    }
  }, [formData.mounting_vendor_id]);

  const updateVendorCostSheetAgencyForParticularSite = async () => {
  if(validate()){
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
      const newData = {
        ...formData,
        site_id: selectedSite?.site_id,
        estimate_id: selectedSite?.estimate_id,
        campaign_id: selectedSite?.campaign_id,
        vcs_id: getData.vcs_id,
      };
      const datas={
        ...newData,totals:estimationTotals
      }
      try {
        const response = await axios.put(
          Baseurl +
            `/db/media/costSheet/vendorCostSheet/updateAgencyVendorCostSheet`,
        
            datas,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setLoading(false);
          handleClose();
          setFlag(false);
          getAgencySites()
          getContactList()
        }
      } catch (error) {
        console.log("errosdkthhfhkghkgjkhgjka",error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setLoading(false);
      }
    }}
  };

  const saveVendorCostSheetAgencyForParticularSite = async () => {
    if(validate()){
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
      const newData = {
        ...formData,
        site_id: selectedSite?.site_id,
        estimate_id: selectedSite?.estimate_id,
        campaign_id: selectedSite?.campaign_id,
      };
      const datas={
        ...newData,totals:estimationTotals
      }
      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/costSheet/vendorCostSheet/createAgencyVendorCostSheet`,
            datas,
          header

        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);

          // getAssetSites()
          setLoading(false);
          handleClose();
          setFlag(false);
          getAgencySites()
          getContactList()
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
    }}
  };

  const getVendorCostSheetInfoForParticularSite = async () => {
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
            `/db/media/costSheet/vendorCostSheet/getAgencyVendorCostSheet
?estimate_id=${selectedSite?.estimate_id}&site_id=${selectedSite?.site_id}`,
          header
        );
        

        console.log("response is ", response);
        if (
          (response?.status == 200 || response?.status == 201) &&
          response?.data?.data !== null 
        ) {
          setFlag(true);
          setGetData(response?.data?.data);

          setFormData({
            ...formData,
            ccs_id: response?.data?.data?.ccs_id || "",
            site_id: response?.data?.data?.site_id || "",
            state: response?.data?.data?.state || "",
            city: response?.data?.data?.city || "",
            location: response?.data?.data?.db_sites_agency?.location || "",
            category: response?.data?.data?.category || "",
            media_format: response?.data?.data?.media_format || "",
            media_vehicle: response?.data?.data?.media_vehicle || "",
            media_type: response?.data?.data?.media_type || "",
            quantity: response?.data?.data?.quantity || "",
            width: response?.data?.data?.width || "",
            final_display_cost: response?.data?.data?.final_display_cost || "",
            height: response?.data?.data?.height || "",
            total_sq_ft:
              Number(response?.data?.data?.total_sq_ft).toFixed(2) || 0,
            campaign_start_date:
              moment(response?.data?.data?.campaign_start_date).format(
                "YYYY-MM-DD"
              ) || "",
            campaign_end_date:
              moment(response?.data?.data?.campaign_end_date).format(
                "YYYY-MM-DD"
              ) || "",
            campaign_duration:
              response?.data?.data?.db_media_campaign?.campaign_duration || "",
            display_cost_per_month:
              response?.data?.data?.display_cost_per_month || 0,
            display_vender_cost:
              response?.data?.data?.display_vender_cost || "",
            buying_price_as_per_duration:
              response?.data?.data?.buying_price_as_per_duration || 0,
            // final_client_po_cost: response?.data?.data?.final_client_po_cost || 0,
            mounting_cost_per_sq_ft:
              response?.data?.data?.mounting_cost_per_sq_ft || 0,
            mounting_cost: response?.data?.data?.mounting_cost || 0,
            remarks: response?.data?.data?.remarks || "",
            mounting_vendor_id: response?.data?.data?.mounting_vendor_id || "",
            pr_m_id: response?.data?.data?.pr_m_id || "",
            printing_vendor_id: response?.data?.data?.printing_vendor_id || "",
            printing_cost_per_sq_ft:
              response?.data?.data?.printing_cost_per_sq_ft || 0,
          });

          console.log("answer is 1 is  printingVendorData",printingVendorData,"other one is selectedSite",selectedSite)
          // const filteredVendorData = printingVendorData.filter(
          //   (item) =>
          //     item.m_t_id ===
          //       selectedSite.db_site.db_media_type.m_t_id &&
          //     item.db_account.bill_state === selectedSite.db_site.db_state.state_id
          // );

          const filteredVendorData = printingVendorData.filter(
            (item) =>
              item?.db_media_type?.m_t_name ==
                selectedSite?.media_type &&
                item?.db_account?.billState?.state_name == selectedSite?.state
          );
          const uniqueFilteredVendorData = filteredVendorData.reduce((acc, current) => {
            const x = acc.find(item => item.acc_id === current.acc_id);
            if (!x) {
              acc.push(current);
            }
            return acc;
          }, []);

          const printingVendorNames = uniqueFilteredVendorData.map((item) => ({
            value: item.acc_id,
            label: item.acc_name,
          }));

          setPrintingVendorList(printingVendorNames);

          const filteredMountingVendorData = mountingVendorData.filter(
            (item) =>
              item.db_media_type.m_t_name ==
                selectedSite.media_type &&
              item.db_account.billState?.state_name ==
                selectedSite.state
          );
          const uniqueFilteredMountingVendorData = filteredMountingVendorData.reduce((acc, current) => {
            const x = acc.find(item => item.acc_id === current.acc_id);
            if (!x) {
              acc.push(current);
            }
            return acc;
          }, []);

          const mountingVendorNames = uniqueFilteredMountingVendorData.map(
            (item) => ({
              value: item.acc_id,
              label: item.acc_name,
              mo_c_id: item.mo_c_id,
            })
          );
          setMountingVendorList(mountingVendorNames);
          console.log("mounting vendor data", filteredMountingVendorData);

          console.log(
            "material",
            printingMaterialData,
            "and ",
            formData.printing_vendor_id
          );

          console.log(
            "formdata is",
            formData,
            "print",
            printingVendorData,
            "filer",
            filteredVendorData,
            "sec",
            selectedSite
          );
        } else {
          console.log("alhgljlgjljsejglajfhgogjflhaks  i ma ajrunningljlkf ");
          setFormData({
            site_id: selectedSite?.site || "",
            estimate_id: selectedSite?.estimate_id || "",
            state: selectedSite?.state || "",
            city: selectedSite?.city || "",
            location: selectedSite?.location || "",
            // category:
            //   selectedSite?.site_cat_name || "",
            media_format:
              selectedSite?.media_format || "",
            media_vehicle:
              selectedSite?.media_vehicle || "",
            media_type: selectedSite?.media_type || "",
            quantity: selectedSite?.quantity || "",
            width: selectedSite?.width || "",
            height: selectedSite?.height || "",
            total_sq_ft:selectedSite?.total_sq_ft.toFixed(2) || "",
            campaign_start_date:
              moment(
                selectedSite?.campaign_start_date
              ).format("YYYY-MM-DD") || "",
            campaign_end_date:
              moment(
                selectedSite?.campaign_end_date
              ).format("YYYY-MM-DD") || "",
            campaign_duration:
            moment(selectedSite?.campaign_end_date).diff(moment(selectedSite?.campaign_start_date), 'days') ||
              "",
            display_vender_name:
              selectedSite?.display_vendor_name || 0,
              display_cost_per_month:
              selectedSite?.display_cost_per_month || 0,
              // display_cost_per_month: selectedSite?.display_selling_cost || 0,
              buying_price_as_per_duration:
              selectedSite?.selling_price_as_per_duration || 0,
            // final_client_po_cost: selectedSite?.db_estimate?.final_client_po_cost || 0,
            mounting_cost_per_sq_ft:
              selectedSite?.mounting_cost_per_sq_ft || 0,
            mounting_cost:Number(selectedSite?.mounting_cost).toFixed(2) || 0,
            printing_cost_per_sq_ft:
              selectedSite?.printing_cost_per_sq_ft || 0,
            printing_cost:Number(selectedSite?.printing_cost).toFixed(2) || 0,
            remarks: selectedSite?.remarks || "",
          });
          
          console.log("printing vendor data is ",printingVendorData,"and selected site is ",selectedSite)
          const filteredVendorData = printingVendorData.filter(
            (item) =>
              item?.db_media_type?.m_t_name ==
                selectedSite?.media_type &&
                item?.db_account?.billState?.state_name == selectedSite?.state
          );

          // const filteredVendorData = printingVendorData.filter(
          //   (item) =>
          //     item.m_t_id ===
          //       selectedSite.db_site.db_media_type.m_t_id &&
          //     item.db_account.bill_state === selectedSite.db_site.db_state.state_id
          // );

          console.log("fileterd data for printing si ",filteredVendorData)

          const uniqueFilteredVendorData = filteredVendorData.reduce((acc, current) => {
            const x = acc.find(item => item.acc_id == current.acc_id);
            if (!x) {
              acc.push(current);
            }
            return acc;
          }, []);

          const printingVendorNames = uniqueFilteredVendorData.map((item) => ({
            value: item.acc_id,
            label: item.acc_name,
          }));

          setPrintingVendorList(printingVendorNames);

          // console.log("anwer 1 mountingvendor",mountingVendorData,"and here selected siet is",selectedSite)
          

          const filteredMountingVendorData = mountingVendorData.filter(
            (item) =>
              item.db_media_type.m_t_name ==
                selectedSite.media_type &&
              item.db_account.billState?.state_name ==
                selectedSite.state
          );

          // console.log("answer 400 filteredMountingVendorData",filteredMountingVendorData)

          const uniqueFilteredMountingVendorData = filteredMountingVendorData.reduce((acc, current) => {
            const x = acc.find(item => item.acc_id == current.acc_id);
            if (!x) {
              acc.push(current);
            }
            return acc;
          }, []);



          const mountingVendorNames = uniqueFilteredMountingVendorData.map(
            (item) => ({
              value: item.acc_id,
              label: item.acc_name,
              mo_c_id: item.mo_c_id,
            })
          );
          setMountingVendorList(mountingVendorNames);
          // console.log("mounting vendor data", mountingVendorNames);

          console.log(
            "material",
            printingMaterialData,
            "and ",
            formData.printing_vendor_id
          );
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
    console.log("printingMaterialData data is ",printingMaterialData)
    if (formData.printing_vendor_id) {
      const fileterPrintingMdaterialData = printingMaterialData.filter(
        (item) => item.acc_id == formData.printing_vendor_id && item.db_media_type.m_t_name ==  selectedSite.media_type
      );

      const printingMaterial = fileterPrintingMdaterialData.map((item) => ({
        value: item.pr_m_id,
        label: item.db_printing_material.pr_m_name,
      }));
 
      setPrintingMaterialList(printingMaterial);
      console.log(
        "material list",
        printingMaterial,
        "vhgh",
        fileterPrintingMdaterialData
      );
    }
  }, [formData.printing_vendor_id]);

// commetned
  useEffect(() => {
    const mountingCostPerSqFt = parseFloat(formData.mounting_cost_per_sq_ft) || 0;
    const printingCostPerSqFt = parseFloat(formData.printing_cost_per_sq_ft) || 0;
    const total = parseFloat(formData.total_sq_ft) || 0;
  
    let updatedData = { ...formData };
  
    if (formData.mounting_cost_per_sq_ft && formData.total_sq_ft) {
      const TotalMountingCost = (mountingCostPerSqFt * total).toFixed(2);
      updatedData.mounting_cost = TotalMountingCost;
    }
  
    if (formData.printing_cost_per_sq_ft && formData.total_sq_ft) {
      const TotalPrintingCost = (printingCostPerSqFt * total).toFixed(2);
      updatedData.printing_cost = TotalPrintingCost;
    }
  
    setFormData(updatedData);
  
  }, [formData.mounting_cost_per_sq_ft, formData.printing_cost_per_sq_ft, formData.total_sq_ft]);
  


// useEffect(()=>{
// if(formData.final_display_cost){
//  const  calculate_display_cost_per_month = formData.final_display_cost /12;
//  setFormData((prevData) => ({
//   ...prevData,
//    display_cost_per_month: calculate_display_cost_per_month.toFixed(2),
//  }));
// } 

// },[formData.final_display_cost])

// useEffect(() => {
//   if (formData.final_display_cost && !isNaN(formData.final_display_cost)) {
//     // Calculate the cost per month only if final_display_cost is a valid number
//     const calculate_display_cost_per_month = formData.final_display_cost / 12;
//     setFormData((prevData) => ({
//       ...prevData,
//       display_cost_per_month: calculate_display_cost_per_month.toFixed(2),
//     }));
//   } else {
//     // Clear display_cost_per_month if final_display_cost is empty or invalid
//     setFormData((prevData) => ({
//       ...prevData,
//       display_cost_per_month: "",
//     }));
//   }
// }, [formData.final_display_cost]);




  useEffect(() => {
    setErrors({}); 
  }, [show]);




  // useEffect(()=>{
  //   if(formData.pr_m_id){
  //     const selectedMaterial = printingMaterialData.find(
  //       (item) => item.db_printing_material.pr_m_id === formData.pr_m_id
  //     );
  //     console.log("selectedMaterial: " ,selectedMaterial)
  //      setFormData((prevData) => ({
  //       ...prevData,
  //       printing_cost_per_sq_ft: selectedMaterial.pr_c_cost || "",
  //     }));
  //   }

  // },[formData.pr_m_id])

  useEffect(() => {
    if (show && selectedSite) {
      getVendorCostSheetInfoForParticularSite();
    }

    // getPrintingCost()
  }, [show, selectedSite]);

  return (
    <>
      <Modal
        size="xl"
        show={show}
        onHide={() => {
          setFlag(false);
          handleClose();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Vendor Cost Sheet (Agency)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              {formaArray1.map((field, index) => (
                <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === "select" ? (
                      <>
                        <Select
                          id={field.name}
                          name={field.name}
                          // options={
                          //   field.name === "mounting_vendor_id"
                          //     ? vendorOptions
                          //     : field.name === "printing_vendor_id"
                          //     ? printingVendorList
                          //     : field.name === "pr_m_id"
                          //     ? materialOptions
                          //     : []
                          // }
                          options={
                            field.name === "mounting_vendor_id"
                              ? mountingVendorList
                              : field.name === "printing_vendor_id"
                              ? printingVendorList
                              : field.name === "pr_m_id"
                              ? printingMaterialList
                              : []
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange(field.name, selectedOption)
                          }
                          value={
                            field.name === "mounting_vendor_id"
                              ? mountingVendorList.find(
                                  (option) =>
                                    option.value === formData[field.name]
                                ) || null
                              : field.name === "printing_vendor_id"
                              ? printingVendorList.find(
                                  (option) =>
                                    option.value === formData[field.name]
                                ) || null
                              : field.name === "pr_m_id"
                              ? printingMaterialList.find(
                                  (option) =>
                                    option.value === formData[field.name]
                                ) || null
                              : null
                          }
                          isDisabled={field.disabled || false}
                        />
                      </>
                    ) : (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        id={field.name}
                        placeholder={`Enter ${field.label}`}
                        className="form-control"
                        onChange={handleChange}
                        value={formData[field.name] || ""}
                        disabled={field.disabled || false}
                      />
                    )}
                       {errors[field.name] && (
              <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors[field.name]}
              </div>
            )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="primary" onClick={saveClientCostSheetAssetForParticularSite}>
            SUBMIT
          </Button> */}

          <Button
            disabled={loading}
            variant="primary"
            onClick={() => {
              flag == false
                ? saveVendorCostSheetAgencyForParticularSite()
                : updateVendorCostSheetAgencyForParticularSite();
            }}
          >
            {flag == false
              ? loading
                ? "Saving..."
                : "Save"
              : loading
              ? "Updating..."
              : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateVendorCostAgency;
