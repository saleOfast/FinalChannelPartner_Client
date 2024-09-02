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

const formaArray = [
  {
    label: "Site Code",
    name: "site_id",
    type: "number",
    disabled: true,
  },
  { label: "State", name: "state", disabled: true, type: "text" },
  { label: "City", name: "city", disabled: true, type: "text" },
  {
    label: "Location",
    name: "location",
    disabled: true,
    type: "text",
  },
  {
    label: "Category",
    name: "category",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Format",
    name: "media_format",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Vehicle",
    name: "media_vehicle",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Type",
    name: "media_type",
    disabled: true,
    type: "text",
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "text",
    disabled: true,
  },
  {
    label: "Width (Ft.)",
    name: "width",
    type: "text",
    disabled: true,
  },
  {
    label: "Height (Ft.)",
    name: "height",
    type: "text",
    disabled: true,
  },
  {
    label: "Total (Sq. Ft.)",
    name: "total_sq_ft",
    type: "text",
    disabled: true,
  },
  {
    label: "Campaign Start Date",
    name: "campaign_start_date",
    type: "date",
    disabled: true,
  },
  {
    label: "Campaign End Date",
    name: "campaign_end_date",
    type: "date",
    disabled: true,
  },
  {
    label: "Campaign Duration",
    name: "campaign_duration",
    disabled: true,
    type: "text",
  },
  {
    label: "Display Vendor Name",
    name: "display_vender_cost",
    disabled: true,
    type: "text",
  },
  {
    label: "Display Cost / Month",
    name: "display_cost_per_month",
    disabled: true,
    type: "text",
  },
  {
    label: "Buying Price as Per Duration",
    name: "buying_price_as_per_duration",
    disabled: true,
    type: "text",
  },
  {
    label: "Final Display Cost",
    name: "final_display_cost",
    type: "number",
  },
  {
    label: "Mounting Vendor",
    name: "mounting_vendor_id",
    type: "select",
  },
  {
    label: "Mounting Cost / Sq. Ft.",
    name: "mounting_cost_per_sq_ft",
    type: "number",
  },
  {
    label: "Mounting Cost",
    name: "mounting_cost",
    disabled: true,
    type: "number",
  },
  {
    label: "Printing Vendor",
    name: "printing_vendor_id",
    type: "select",
  },
  {
    label: "Printing Material",
    name: "pr_m_id",
    type: "select",
  },
  {
    label: "Printing Cost / Sq. Ft.",
    name: "printing_cost_per_sq_ft",
    type: "number",
  },
  {
    label: "Printing Cost",
    name: "printing_cost",
    disabled: true,
    type: "number",
  },
  { label: "Remarks", name: "remarks" },
];

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
        (item) => item.pr_m_id === formData.pr_m_id
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
        eab_id: selectedSite?.eab_id,
        campaign_id: selectedSite?.db_estimate?.campaign_id,
        vcs_id: getData.vcs_id,
      };
      try {
        const response = await axios.put(
          Baseurl +
            `/db/media/costSheet/vendorCostSheet/updateAgencyVendorCostSheet`,
        
          newData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setLoading(false);
          handleClose();
          setFlag(false);
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
        eab_id: selectedSite?.eab_id,
        campaign_id: selectedSite?.db_estimate?.campaign_id,
      };
      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/costSheet/vendorCostSheet/createAgencyVendorCostSheet`,
          newData,
          header

        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);

          // getAssetSites()
          setLoading(false);
          handleClose();
          setFlag(false);
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
?eab_id=${selectedSite?.eab_id}&site_id=${selectedSite?.site_id}`,
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
            location: response?.data?.data?.db_site?.location || "",
            category: response?.data?.data?.category || "",
            media_format: response?.data?.data?.media_format || "",
            media_vehicle: response?.data?.data?.media_vehicle || "",
            media_type: response?.data?.data?.media_type || "",
            quantity: response?.data?.data?.db_site?.quantity || "",
            width: response?.data?.data?.db_site?.width || "",
            final_display_cost: response?.data?.data?.final_display_cost || "",
            height: response?.data?.data?.db_site?.height || "",
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
              response?.data?.data?.display_cost_per_month || "0",
            display_vender_cost:
              response?.data?.data?.display_vender_cost || "",
            buying_price_as_per_duration:
              response?.data?.data?.buying_price_as_per_duration || "0",
            // final_client_po_cost: response?.data?.data?.final_client_po_cost || "0",
            mounting_cost_per_sq_ft:
              response?.data?.data?.mounting_cost_per_sq_ft || "0",
            mounting_cost: response?.data?.data?.mounting_cost || "0",
            remarks: response?.data?.data?.remarks || "",
            mounting_vendor_id: response?.data?.data?.mounting_vendor_id || "",
            pr_m_id: response?.data?.data?.pr_m_id || "",
            printing_vendor_id: response?.data?.data?.printing_vendor_id || "",
            printing_cost_per_sq_ft:
              response?.data?.data?.printing_cost_per_sq_ft || "0",
          });
          const filteredVendorData = printingVendorData.filter(
            (item) =>
              item.m_t_id ===
                selectedSite.db_site.db_media_type.m_t_id &&
              item.db_account.bill_state === selectedSite.db_site.db_state.state_id
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
              item.db_media_type.m_t_id ===
                selectedSite.db_site.db_media_type.m_t_id &&
              item.db_account.bill_state ===
                selectedSite.db_site.db_state.state_id
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
            site_id: selectedSite?.db_site?.site_id || "",
            estimate_id: selectedSite?.estimate_id || "",
            state: selectedSite?.db_site?.db_state?.state_name || "",
            city: selectedSite?.db_site?.db_city?.city_name || "",
            location: selectedSite?.db_site?.location || "",
            category:
              selectedSite?.db_site?.db_site_category?.site_cat_name || "",
            media_format:
              selectedSite?.db_site?.db_media_format?.m_f_name || "",
            media_vehicle:
              selectedSite?.db_site?.db_media_vehicle?.m_v_name || "",
            media_type: selectedSite?.db_site?.db_media_type?.m_t_name || "",
            quantity: selectedSite?.db_site?.quantity || "",
            width: selectedSite?.db_site?.width || "",
            height: selectedSite?.db_site?.height || "",
            total_sq_ft:
              (
                selectedSite?.db_site?.width * selectedSite?.db_site?.height
              ).toFixed(2) || "",
            campaign_start_date:
              moment(
                selectedSite?.db_estimate?.db_media_campaign
                  ?.campaign_start_date
              ).format("YYYY-MM-DD") || "",
            campaign_end_date:
              moment(
                selectedSite?.db_estimate?.db_media_campaign?.campaign_end_date
              ).format("YYYY-MM-DD") || "",
            campaign_duration:
              selectedSite?.db_estimate?.db_media_campaign?.campaign_duration ||
              "",
            display_vender_cost:
              selectedSite?.db_estimate?.display_vender_cost || "0",
            display_cost_per_month:
              selectedSite?.db_estimate?.display_cost_per_month || "0",
            buying_price_as_per_duration:
              selectedSite?.db_estimate?.buying_price_as_per_duration || "0",
            // final_client_po_cost: selectedSite?.db_estimate?.final_client_po_cost || "0",
            mounting_cost_per_sq_ft:
              selectedSite?.db_estimate?.mounting_cost_per_sq_ft || "0",
            mounting_cost:
              (
                (selectedSite?.db_estimate?.mounting_cost_per_sq_ft || 0) *
                selectedSite?.db_site?.width *
                selectedSite?.db_site?.height
              ).toFixed(2) || "0",
            printing_cost_per_sq_ft:
              selectedSite?.db_estimate?.printing_cost_per_sq_ft || "0",
            printing_cost:
              (
                (selectedSite?.db_estimate?.printing_cost_per_sq_ft || 0) *
                selectedSite?.db_site?.width *
                selectedSite?.db_site?.height
              ).toFixed(2) || "0",
            remarks: selectedSite?.db_site?.remarks || "",
          });

          const filteredVendorData = printingVendorData.filter(
            (item) =>
              item.db_media_type.m_t_id ===
                selectedSite.db_site.db_media_type.m_t_id &&
                item.db_account.bill_state === selectedSite.db_site.db_state.state_id
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
              item.db_media_type.m_t_id ===
                selectedSite.db_site.db_media_type.m_t_id &&
              item.db_account.bill_state ===
                selectedSite.db_site.db_state.state_id
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
    if (formData.printing_vendor_id) {
      const fileterPrintingMdaterialData = printingMaterialData.filter(
        (item) => item.acc_id == formData.printing_vendor_id
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

//commetned
  // useEffect(() => {
  //   const mountingCostPerSqFt = parseFloat(formData.mounting_cost_per_sq_ft) || 0;
  //   const printingCostPerSqFt = parseFloat(formData.printing_cost_per_sq_ft) || 0;
  //   const total = parseFloat(formData.total_sq_ft) || 0;
  
  //   let updatedData = { ...formData };
  
  //   if (formData.mounting_cost_per_sq_ft && formData.total_sq_ft) {
  //     const TotalMountingCost = (mountingCostPerSqFt * total).toFixed(2);
  //     updatedData.mounting_cost = TotalMountingCost;
  //   }
  
  //   if (formData.printing_cost_per_sq_ft && formData.total_sq_ft) {
  //     const TotalPrintingCost = (printingCostPerSqFt * total).toFixed(2);
  //     updatedData.printing_cost = TotalPrintingCost;
  //   }
  
  //   setFormData(updatedData);
  
  // }, [formData.mounting_cost_per_sq_ft, formData.printing_cost_per_sq_ft, formData.total_sq_ft]);
  
useEffect(()=>{
if(formData.final_display_cost){
 const  calculate_display_cost_per_month = formData.final_display_cost /12;
 setFormData((prevData) => ({
  ...prevData,
   display_cost_per_month: calculate_display_cost_per_month.toFixed(2),
 }));
} 

},[formData.final_display_cost])

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
              {formaArray.map((field, index) => (
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



























// // 1
// // import React, { useState ,useEffect} from 'react';
// // import { fetchData } from "../../../Utils/getReq";
// // import { hasCookie, getCookie } from "cookies-next";
// // import { toast } from "react-toastify";
// // import { Button, Modal } from 'react-bootstrap';
// // import Select from 'react-select';

// // const ModelUpdateVendorCostAsset = ({
// //   show,
// //   handleClose,
// //   stateList,
// //   setStateId,
// //   setCityIds,
// //   cityList,
// //   stateId,
// //   cityIds,
// //   estimateId,
// //   selectedSite
// // }) => {
// //   const [formData, setFormData] = useState({
// //     siteCode: '',
// //     location: '',
// //     category: '',
// //     mediaFormat: '',
// //     mediaVehicle: '',
// //     mediaType: '',
// //     quantity: '',
// //     width: '',
// //     height: '',
// //     total: '',
// //     campaignStartDate: '',
// //     campaignEndDate: '',
// //     campaignDuration: '',
// //     displayCostPerMonth: '',
// //     sellingPriceAsPerDuration: '',
// //     finalClientPOCost: '',
// //     mountingCostPerSqFt: '',
// //     mountingCost: '',
// //     printingCostPerSqFt: '',
// //     printingCost: '',
// //     remarks: '',
// //   });
// //   const [assetSiteLists, setAssetSiteLists] = useState([]);
// //   const [errorToast, setErrorToast] = useState(false);



// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     // Convert numeric values to numbers
// //     const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
// //                         name === 'finalClientPOCost' || name === 'mountingCostPerSqFt' ||
// //                         name === 'printingCostPerSqFt'
// //                         ? parseFloat(value) || ''
// //                         : value;

// //     // Update formData state
// //     const newFormData = {
// //       ...formData,
// //       [name]: parsedValue,
// //     };

// //     // If width or height changes, update total
// //     if (name === 'width' || name === 'height') {
// //       const width = parseFloat(newFormData.width) || 0;
// //       const height = parseFloat(newFormData.height) || 0;
// //       newFormData.total = (width * height).toFixed(2); // Update total
// //     }

// //     setFormData(newFormData);
// //   };


  
// //   async function getAssetSites() {
// //     await fetchData(
// //       `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
// //       setAssetSiteLists,
// //       errorToast,
// //       setErrorToast
// //     );
// //   }

// //   const handleUpdate = async () => {
// //     try {
// //       const response = await fetch('https://dummyapi.com/update', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(formData),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //       }

// //       const data = await response.json();
// //       console.log('Update successful:', data);
// //       handleClose(); // Close the modal after successful update
// //     } catch (error) {
// //       console.error('Error updating data:', error);
// //     }
// //   };
// //   useEffect(()=>{
// //     getAssetSites()
// //     console.log("asucc",selectedSite)
// //   },[])

// //   return (
// //     <>
// //       <Modal show={show} onHide={handleClose} size="xl">
// //         <Modal.Header closeButton>
// //           <Modal.Title>vendor Cost Sheet(Asset)</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <div className="add_user_form">
// //             <div className="row">
// //               {[{label:'Site Code',name:'siteCode', type: 'number',disabled:true},
// //               {label:'State',name:'state', disabled: true},
// //               {label:'City',name:'city', disabled: true},
// //               { label: 'Location', name: 'location', disabled: true },
// //               { label: 'Category', name: 'category', disabled: true },
// //               { label: 'Media Format', name: 'mediaFormat', disabled: true },
// //               { label: 'Media Vehicle', name: 'mediaVehicle', disabled: true },
// //               { label: 'Media Type', name: 'mediaType', disabled: true },
// //                 { label: 'Quantity', name: 'quantity', type: 'text',disabled: true },
// //                 { label: 'Width (Ft.)', name: 'width', type: 'text',disabled: true },
// //                 { label: 'Height (Ft.)', name: 'height', type: 'text',disabled: true },
// //                 { label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true },
// //                 { label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date',disabled: true },
// //                 { label: 'Campaign End Date', name: 'campaignEndDate', type: 'date',disabled: true },
// //                 { label: 'Campaign Duration', name: 'campaignDuration', disabled:true },
// //                 { label: 'Display Vendor Name', name: 'displayVendorName', disabled:true },

// //                 { label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true },
// //                 { label: 'Buying price as per duration ', name: 'BuyingPriceAsPerDuration ', disabled:true },
// //                 { label: 'Final Display Cost', name: 'finalDisplayCost', type: 'number' },
// //                 { label: 'Mounting Vendor', name: 'mountingVendor', type: 'text' },

// //                 { label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number' },
// //                 { label: 'Mounting Cost', name: 'mountingCost', disabled: true  },
// //                 { label: 'Printing Vendor', name: 'printingVendor' },
// //                 { label: 'Printing Material', name: 'printingMaterial'  },
// //                 { label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number' },
// //                 { label: 'Printing Cost', name: 'printingCost', disabled: true },
// //                 { label: 'Remarks', name: 'remarks' }
// //               ].map((field, index) => (
// //                 <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
// //                   <div className="input_box">
// //                     <label htmlFor={field.name}>{field.label}</label>
// //                     <input
// //                       type={field.type || 'text'}
// //                       name={field.name}
// //                       id={field.name}
// //                       placeholder={`Enter ${field.label}`}
// //                       className="form-control"
// //                       onChange={handleChange}
// //                       value={formData[field.name] || ''}
// //                       disabled={field.disabled || false}
// //                     />
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="primary" onClick={handleUpdate}>
// //             Update
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </>
// //   );
// // };

// // export default ModelUpdateVendorCostAsset;







// import React, { useState, useEffect } from 'react';
// import { fetchData } from "../../../Utils/getReq";
// import { Button, Modal } from 'react-bootstrap';
// import { hasCookie, getCookie } from "cookies-next";
// import { toast } from "react-toastify";
// import Select from 'react-select';
// import { Baseurl } from "../../../Utils/Constants";
// import axios from "axios";



// const ModelUpdateVendorCostAsset = ({
//   show,
//   handleClose,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   stateId,
//   cityIds,
//   estimateId,
//   selectedSite
// }) => {
//   const [formData, setFormData] = useState({
//     siteCode: '',
//     location: '',
//     category: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     width: '',
//     height: '',
//     total: '',
//     campaignStartDate: '',
//     campaignEndDate: '',
//     campaignDuration: '',
//     displayCostPerMonth: '',
//     sellingPriceAsPerDuration: '',
//     finalClientPOCost: '',
//     mountingCostPerSqFt: '',
//     mountingCost: '',
//     printingCostPerSqFt: '',
//     printingCost: '',
//     remarks: '',
//   });

//   const [assetSiteLists, setAssetSiteLists] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);

//   // Options for Select fields
//   const [vendorOptions, setVendorOptions] = useState([]);
//   const [materialOptions, setMaterialOptions] = useState([]);
//   const[loader,setLoader]=useState(false);
//   const [dataList, setDataList] = useState([]);




//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Convert numeric values to numbers
//     const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
//                         name === 'finalClientPOCost' || name === 'mountingCostPerSqFt' ||
//                         name === 'printingCostPerSqFt'
//                         ? parseFloat(value) || ''
//                         : value;

//     // Update formData state
//     const newFormData = {
//       ...formData,
//       [name]: parsedValue,
//     };

//     // If width or height changes, update total
//     if (name === 'width' || name === 'height') {
//       const width = parseFloat(newFormData.width) || 0;
//       const height = parseFloat(newFormData.height) || 0;
//       newFormData.total = (width * height).toFixed(2); // Update total
//     }

//     setFormData(newFormData);
//   };

//   const handleSelectChange = (name, selectedOption) => {
//     setFormData({
//       ...formData,
//       [name]: selectedOption ? selectedOption.value : ''
//     });
//   };

//   async function getAssetSites() {
//     await fetchData(
//       `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
//       setAssetSiteLists,
//       errorToast,
//       setErrorToast
//     );
//   }

//   const handleUpdate = async () => {
//     try {
//       const response = await fetch('https://dummyapi.com/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log('Update successful:', data);
//       handleClose(); // Close the modal after successful update
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };

//   const getDataList = async () => {
//     setLoader(true)
//     if (hasCookie("token")) {
//       let token = getCookie("token");
//       let db_name = getCookie("db_name");

//       let header = {
//         headers: {
//           Accept: "application/json",
//           Authorization: "Bearer ".concat(token),
//           db: db_name,
//           m_id: 14,

//         },
//       };
       
//       try {
//         const response = await axios.get(Baseurl + `/db/media/mountingCost/getMountingCost`, header);
//         console.log("response ",response)
//         if(response?.status==200|| response?.status==201){
//           setLoader(false)
//         //   setDataList(response?.data?.data);
//         //   console.log("mounag",dataList)

//         console.log("mountingcostdat is ",response.data.data)


//         const filteredData = response.data.data.filter(item =>
//             item.db_media_type.m_t_id === selectedSite.db_site.db_media_type.m_t_id &&
//             item.db_account.bill_state === selectedSite.db_site.db_state.state_id
//           );
  
//           // Extract acc_name from filtered data
//           const accNames = filteredData.map(item => item.acc_name);
  
//           console.log("Filtered Account Names: ", accNames);
//           setDataList(filteredData);

//         }
//       } catch (error) {
//         setLoader(false)
//         if (error?.response?.data?.message) {
//           toast.error(error.response.data.message);
//         } else {
//           toast.error("Something went wrong!");
//         }
//       }
//     }
//   };

//   useEffect(() => {   
//      if (show && selectedSite) {
//       setFormData({
//         siteCode: selectedSite?.site_id || '',
//         state:selectedSite?.db_site?.db_state?.state_name || '',
//         city:selectedSite?.db_site?.db_city?.city_name || '',

//         location: selectedSite?.db_site?.location || '',
//         category: selectedSite?.db_site?.db_site_category?.site_cat_name || '',
//         mediaFormat: selectedSite?.db_site?.db_media_format?.m_f_name|| '',
//         mediaVehicle: selectedSite?.db_site?.db_media_vehicle?.m_v_name || '',
//         mediaType: selectedSite?.db_site?.db_media_type?.m_t_name || '',
//         quantity: selectedSite?.db_site.quantity || '',
//         width:selectedSite?.db_site.width || '',
//         height:selectedSite?.db_site.height || '',
//         total: (selectedSite?.db_site.width *selectedSite?.db_site.height).toFixed(2) || '',
//         campaignStartDate: selectedSite.campaignStartDate || '',
//         campaignEndDate: selectedSite.campaignEndDate || '',
//         campaignDuration: selectedSite.campaignDuration || '',
//         displayCostPerMonth: selectedSite.displayCostPerMonth || '',
//         sellingPriceAsPerDuration: selectedSite.sellingPriceAsPerDuration || '',
//         finalClientPOCost: selectedSite.finalClientPOCost || '',
//         mountingCostPerSqFt: selectedSite.mountingCostPerSqFt || '',
//         mountingCost: selectedSite.mountingCost || '',
//         printingCostPerSqFt: selectedSite.printingCostPerSqFt || '',
//         printingCost: selectedSite.printingCost || '',
//         remarks: selectedSite?.db_site?.remarks || '',
//       });
//     }
    
//     getDataList();

//     console.log("agjg",selectedSite)
//   }, [show, selectedSite]);

//   useEffect(() => {
//     // Fetch vendor and material options (replace with actual fetching logic)
//     setVendorOptions([
//       { value: 'vendor1', label: 'Vendor 1' },
//       { value: 'vendor2', label: 'Vendor 2' },
//       // Add more vendor options as needed
//     ]);

//     setMaterialOptions([
//       { value: 'material1', label: 'Material 1' },
//       { value: 'material2', label: 'Material 2' },
//       // Add more material options as needed
//     ]);
//   }, []);

  

//   return (
//     <>
//       <Modal show={show} onHide={handleClose} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Vendor Cost Sheet (Asset)</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               {[
//                 {label:'Site Code', name:'siteCode', type: 'number', disabled:true},
//                 {label:'State', name:'state', disabled: true,type:"text"},
//                 {label:'City', name:'city', disabled: true,type:"text"},
//                 {label: 'Location', name: 'location', disabled: true,type:"text"},
//                 {label: 'Category', name: 'category', disabled: true,type:"text"},
//                 {label: 'Media Format', name: 'mediaFormat', disabled: true,type:"text"},
//                 {label: 'Media Vehicle', name: 'mediaVehicle', disabled: true,type:"text"},
//                 {label: 'Media Type', name: 'mediaType', disabled: true,type:"text"},
//                 {label: 'Quantity', name: 'quantity', type: 'text', disabled: true},
//                 {label: 'Width (Ft.)', name: 'width', type: 'text', disabled: true},
//                 {label: 'Height (Ft.)', name: 'height', type: 'text', disabled: true},
//                 {label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true},
//                 {label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date', disabled: true},
//                 {label: 'Campaign End Date', name: 'campaignEndDate', type: 'date', disabled: true},
//                 {label: 'Campaign Duration', name: 'campaignDuration', disabled:true,type:"text"},
//                 {label: 'Display Vendor Name', name: 'displayVendorName', disabled:true,type:"text"},
//                 {label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true,type:"text"},
//                 {label: 'Buying Price as Per Duration ', name: 'BuyingPriceAsPerDuration ', disabled:true,type:"text"},
//                 {label: 'Final Display Cost', name: 'finalDisplayCost', type: 'number'},
//                 {label: 'Mounting Vendor', name: 'mountingVendor', type: 'select'},
//                 {label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number'},
//                 {label: 'Mounting Cost', name: 'mountingCost', disabled: true,type:'number'},
//                 {label: 'Printing Vendor', name: 'printingVendor', type: 'select'},
//                 {label: 'Printing Material', name: 'printingMaterial', type: 'select'},
//                 {label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number'},
//                 {label: 'Printing Cost', name: 'printingCost', disabled: true,type:"number"},
//                 {label: 'Remarks', name: 'remarks'}
//               ].map((field, index) => (
//                 <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className="input_box">
//                     <label htmlFor={field.name}>{field.label}</label>
//                     {field.type === 'select' ? (
//                       <Select
//                         id={field.name}
//                         name={field.name}
//                         options={field.name === 'mountingVendor' ? vendorOptions : 
//                                   field.name === 'printingVendor' ? vendorOptions : 
//                                   field.name === 'printingMaterial' ? materialOptions : []}
//                         onChange={(selectedOption) => handleSelectChange(field.name, selectedOption)}
//                         value={(formData[field.name] && { value: formData[field.name], label: formData[field.name] }) || null}
//                         isDisabled={field.disabled || false}
//                       />
//                     ) : (
//                       <input
//                         type={field.type || 'text'}
//                         name={field.name}
//                         id={field.name}
//                         placeholder={`Enter ${field.label}`}
//                         className="form-control"
//                         onChange={handleChange}
//                         value={formData[field.name] || ''}
//                         disabled={field.disabled || false}
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleUpdate}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelUpdateVendorCostAsset;





