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

const formaArray=[
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
]

const ModelUpdateVendorCostAsset = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  stateId,
  cityIds,
  estimateId,
  selectedSite,
  printingCostList,
  setPrintingCostList,
}) => {
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
    final_display_cost:"",
    finalClientPOCost: "",
    mounting_cost_per_sq_ft: "",
    display_vender_cost:"",
    mounting_cost: "",
    printing_cost_per_sq_ft: "",
    printing_cost: "",
    remarks: "",
    mounting_vendor_id: "",
    printing_vendor_id: "",
    pr_m_id: "",
  });

  const [assetSiteLists, setAssetSiteLists] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [accountList, setAccountsList] = useState([]);
  // const [printingCostList,setPrintingCostList]=useState([])
  const [printingMaterialData, setPrintingMaterialData] = useState([]);
  const [printingVendorData,setPrintingVendor]=useState([])
  const [selectedParentMaterial, setSelectedParentMaterial] = useState({});
  const [getVendorData,setGetVendorData]=useState([])
  const [loading,setLoading]=useState(false)
  const [flag,setFlag]= useState(false);
  // const [initialPrintingVendor,setInitialPrintingVendor]=useState(false)
  const [errors,setErrors]=useState({});


  // Handle change in input fields
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

  useEffect(()=>{
    console.log("connsole log is ",formData.mounting_cost_per_sq_ft,"and other is ", formData.total_sq_ft )

    if(formData.mounting_cost_per_sq_ft && formData.total_sq_ft ){
      const mountingCostPerSqFt = parseFloat(formData.mounting_cost_per_sq_ft) || 0;
      const total = parseFloat(formData.total_sq_ft) || 0;
      const TotalMountingCost = (mountingCostPerSqFt * total).toFixed(2);



      setFormData({
        ...formData,mounting_cost:TotalMountingCost
      }
      )
    }
 

  },[formData.mounting_cost_per_sq_ft,formData.total_sq_ft])



  useEffect(()=>{
    if(formData.printing_cost_per_sq_ft && formData.total_sq_ft ){
      const printingCostPerSqFt = parseFloat(formData.printing_cost_per_sq_ft) || 0;
      const total = parseFloat(formData.total_sq_ft) || 0;
      const TotalPrintingCost = (printingCostPerSqFt * total).toFixed(2);



      setFormData({
        ...formData,printing_cost:TotalPrintingCost
      }
      )
    }
 

  },[formData.printing_cost_per_sq_ft,formData.total_sq_ft])

  // Handle change in select fields
  const handleSelectChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  
  };


  // const validate = () => {
  //   const newErrors = {};
  //   // Add required fields validation
  //   const requiredFields = [
  //     'quantity',
  //     'width',
  //     'height',
  //     'campaign_start_date',
  //     'campaign_end_date',
  //     'final_client_po_cost',
  //     'mounting_cost_per_sq_ft',
  //     'printing_cost_per_sq_ft'
  //   ];
  
  //   requiredFields.forEach(field => {
  //     if (!formData[field]) {
  //       newErrors[field] = 'This field is required';
  //     }
  //   });
  
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // useEffect(()=>{
  //   setInitialPrintingVendor(true)
  //   console.log("show is ",show)
  // },[])


  // Fetch asset sites
  async function getAssetSites() {
    await fetchData(
      `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
      setAssetSiteLists,
      errorToast,
      setErrorToast
    );
  }

  // Update data on save
  const handleUpdate = async () => {
    try {
      const response = await fetch("https://dummyapi.com/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log("Update successful:", data);
      handleClose(); // Close the modal after successful update
    } catch (error) {
      // console.error("Error updating data:", error);
    }
  };



  const getClientCostSheetInfoForParticularSite = async () => {
    
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
          // /api/v1/db/media/costSheet/vendorCostSheet/getAssetVendorCostSheet
            const response = await axios.get(Baseurl + `/db/media/costSheet/vendorCostSheet/getAssetVendorCostSheet?eab_id=${selectedSite?.eab_id}&site_id=${selectedSite?.site_id}`, header);


            console.log("response is ",response)
            if((response?.status==200 || response?.status==201 )&& response?.data?.data!==null ){
              getDataList();
              getPrintingMaterial();
              setGetVendorData(response?.data?.data)
                setFlag(true)
                
                setFormData({...formData,
                  ccs_id:response?.data?.data?.ccs_id || '',
                  site_id: response?.data?.data?.site_id || '',
                  state:response?.data?.data?.state || '',
                  city:response?.data?.data?.city || '',
                  location: response?.data?.data?.db_site?.location || '',
                  category: response?.data?.data?.category || '',
                  media_format: response?.data?.data?.media_format|| '',
                  media_vehicle: response?.data?.data?.media_vehicle || '',
                  media_type: response?.data?.data?.media_type || '',
                  quantity: response?.data?.data?.db_site?.quantity || '',
                  width:response?.data?.data?.db_site?.width || '',
                  final_display_cost:response?.data?.data?.final_display_cost ||'',
                  height:response?.data?.data?.db_site?.height || '',
                  total_sq_ft: Number(response?.data?.data?.total_sq_ft).toFixed(2) || 0,
                  campaign_start_date: moment(response?.data?.data?.campaign_start_date).format("YYYY-MM-DD")  || '',
                  campaign_end_date:moment(response?.data?.data?.campaign_end_date).format("YYYY-MM-DD")  || '',
                  campaign_duration: response?.data?.data?.db_media_campaign?.campaign_duration || '',
                  display_cost_per_month: response?.data?.data?.display_cost_per_month || "0",
                  display_vender_cost:response?.data?.data?.display_vender_cost || "0",
                  buying_price_as_per_duration: response?.data?.data?.buying_price_as_per_duration || "0",
                  // final_client_po_cost: response?.data?.data?.final_client_po_cost || "0",
                  mounting_cost_per_sq_ft: response?.data?.data?.mounting_cost_per_sq_ft || "0",
                  mounting_cost: response?.data?.data?.mounting_cost || "0",
                  // printing_cost_per_sq_ft: response?.data?.data?.printing_cost_per_sq_ft || "0",
                  printing_cost: response?.data?.data?.printing_cost || '0',
                  remarks: response?.data?.data?.remarks || '',
                  mounting_vendor_id:response?.data?.data?.mounting_vendor_id || '',
                  pr_m_id:response?.data?.data?.pr_m_id || '',
                  printing_vendor_id:printingVendorData?.find((item)=>item?.value==response?.data?.data?.printing_vendor_id) || '',


         
   
});

                    
  if (formData.pr_m_id && printingMaterialData.length) {
    const selectedVendor = printingMaterialData.find(
      (item) => item?.pr_m_id === formData?.pr_m_id
    );
    if (selectedVendor) {
    
     
      if(printingCostList){
        // console.log("answer 2 is",printingCostList,"and selected data is ",selectedSite);

if(getVendorData){

  console.log("getVendorData is",getVendorData,"printingCostingList is ",printingCostList)
  
  const filteredDataPrinting =printingCostList.filter((item)=>
    item.db_media_type.m_t_id == getVendorData.db_site?.m_t_id && item.db_account.bill_state == getVendorData.db_site?.state_id && item.pr_m_id == selectedVendor.pr_m_id
    )

    console.log("printing filtered data is ",filteredDataPrinting,"and selectedVendor is ",selectedVendor);
    
    const accNamesVendor = filteredDataPrinting.map((item) => ({
      value: item.acc_id,
      label: item.acc_name,
    }));


    setFormData((prevData) => ({
      ...prevData,
      printing_vendor_id:getVendorData? getVendorData.printing_vendor_id:'',
      printing_cost_per_sq_ft:getVendorData.printing_cost_per_sq_ft,

}))


// setFormData((prevData) => ({
//   ...prevData,
//   printing_vendor_id:'',
//   printing_cost_per_sq_ft:'',

// }))

    setPrintingVendor(accNamesVendor);
    console.log("accvendor",accNamesVendor)
}
      }
    }
  }



                // console.log("false")
                // getDataList();
                // getPrintingMaterial();
                // // getContactList();
                // getPrintingCost()
            }
            else{
              console.log(true)
              setFormData({
                site_id: selectedSite?.db_site?.site_id || '',
                estimate_id:selectedSite?.estimate_id||"",
                state:selectedSite?.db_site?.db_state?.state_name || '',
                city:selectedSite?.db_site?.db_city?.city_name || '',
                location: selectedSite?.db_site?.location || '',
                category: selectedSite?.db_site?.db_site_category?.site_cat_name || '',
                media_format: selectedSite?.db_site?.db_media_format?.m_f_name|| '',
                media_vehicle: selectedSite?.db_site?.db_media_vehicle?.m_v_name || '',
                media_type: selectedSite?.db_site?.db_media_type?.m_t_name || '',
                quantity: selectedSite?.db_site?.quantity || '',
                width:selectedSite?.db_site?.width || '',
                height:selectedSite?.db_site?.height || '',
                total_sq_ft: (selectedSite?.db_site?.width*selectedSite?.db_site?.height).toFixed(2) || '',
                campaign_start_date: moment(selectedSite?.db_estimate?.db_media_campaign?.campaign_start_date).format("YYYY-MM-DD")  || '',
                campaign_end_date:moment(selectedSite?.db_estimate?.db_media_campaign?.campaign_end_date).format("YYYY-MM-DD")  || '',
                campaign_duration: selectedSite?.db_estimate?.db_media_campaign?.campaign_duration || '',
                display_vender_cost:selectedSite?.db_estimate?.display_vender_cost || "0",
                display_cost_per_month: selectedSite?.db_estimate?.display_cost_per_month || "0",
                buying_price_as_per_duration: selectedSite?.db_estimate?.buying_price_as_per_duration || "0",
                // final_client_po_cost: selectedSite?.db_estimate?.final_client_po_cost || "0",
                mounting_cost_per_sq_ft:selectedSite?.db_estimate?.mounting_cost_per_sq_ft || "0",
                mounting_cost:((selectedSite?.db_estimate?.mounting_cost_per_sq_ft|| 0)*selectedSite?.db_site?.width*selectedSite?.db_site?.height).toFixed(2) || "0",
                printing_cost_per_sq_ft:selectedSite?.db_estimate?.printing_cost_per_sq_ft || '0',
                printing_cost: ((selectedSite?.db_estimate?.printing_cost_per_sq_ft||0)*selectedSite?.db_site?.width*selectedSite?.db_site?.height).toFixed(2) || "0",
                remarks: selectedSite?.db_site?.remarks || '',
              });

              // getDataList();
              // getPrintingMaterial();
              // // getContactList();
              // getPrintingCost();
            }
    
            // getContactList();
            // getPrintingCost();
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




const saveClientCostSheetAssetForParticularSite = async () => {
  if (hasCookie("token")) {
    setLoading(true)
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
    const newData={...formData,site_id:selectedSite?.site_id,eab_id:selectedSite?.eab_id,campaign_id:selectedSite?.db_estimate?.campaign_id}
    try {
      const response = await axios.post(
        Baseurl +
          `/db/media/costSheet/vendorCostSheet/createAssetVendorCostSheet`,
        newData,
        header
      );
      if (response.status === 204 || response.status === 200) {
        toast.success(response?.data?.message);
        getAssetSites()
        setLoading(false)
        handleClose()
        setFlag(false)
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong!");
      }
      setLoading(false)
    }
  }
};


const updateClientCostSheetAssetForParticularSite = async () => {
  if (hasCookie("token")) {
    setLoading(true)
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
    const newData={...formData,site_id:selectedSite?.site_id,eab_id:selectedSite?.eab_id,campaign_id:selectedSite?.db_estimate?.campaign_id,vcs_id:getVendorData.vcs_id}
    try {
      const response = await axios.put(
        Baseurl +
          `/db/media/costSheet/vendorCostSheet/updateAssetVendorCostSheets`,
        newData,
        header
      );
      if (response.status === 204 || response.status === 200) {
        toast.success(response?.data?.message);
        getAssetSites()
        setLoading(false)
        handleClose()
        setFlag(false)
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong!");
      }
      setLoading(false)
    }
  }
};



useEffect(() => {
  if (show && selectedSite) {
    getClientCostSheetInfoForParticularSite()
  } 
}, [show, selectedSite]);





  // Fetch mounting cost data
  const getDataList = async () => {
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
    if(flag == false){
      if (response?.status === 200 || response?.status === 201) {
        setLoader(false);
        const filteredData = response.data.data.filter(
          (item) =>
            item.db_media_type.m_t_id ===
              selectedSite.db_site.db_media_type.m_t_id &&
            item.db_account.bill_state ===
              selectedSite.db_site.db_state.state_id
        );

        const accNames = filteredData.map((item) => ({
          value: item.acc_id,
          label: item.acc_name,
        }));

        // const vendorOptions = filteredData.map((item) => ({
        //   value: item.vendor_id, // Vendor ID
        //   label: item.acc_name,  // Vendor Name
        // }));

        setDataList(filteredData);
        setVendorOptions(accNames);
      }
    }else{
      if (response?.status === 200 || response?.status === 201) {
        setLoader(false);
        const filteredData = response.data.data.filter(
          (item) =>
            item.db_media_type.m_t_id ===
          getVendorData.db_site?.m_t_id &&
            item.db_account.bill_state ===
            getVendorData.db_site?.state_id
        );

        const accNames = filteredData.map((item) => ({
          value: item.acc_id,
          label: item.acc_name,
        }));

        // const vendorOptions = filteredData.map((item) => ({
        //   value: item.vendor_id, // Vendor ID
        //   label: item.acc_name,  // Vendor Name
        // }));

        setDataList(filteredData);
        setVendorOptions(accNames);
      }

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

  // const getPrintingCost = async () => {
  //   setLoader(true);
  //   if (hasCookie("token")) {
  //     let token = getCookie("token");
  //     let db_name = getCookie("db_name");

  //     let header = {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer ".concat(token),
  //         db: db_name,
  //         m_id: 320,
  //       },
  //     };
  //     try {
  //       const response = await axios.get(
  //         Baseurl + `/db/media/printingCost/getPrintingCost`,
  //         header
  //       );
  //       if (response?.status == 200 || response?.status == 201) {
        
  //         setPrintingCostList(response.data.data);
  //         if(!printingCostList.length){
  //           setPrintingCostList(response.data.data);
  //         }
  //         console.log("answer 3 is",response?.data?.data,"printinigCostLIstData is",printingCostList);
  //         setLoader(false);
  //       }
  //     } catch (error) {
  //       setLoader(false);
  //       if (error?.response?.data?.message) {
  //         toast.error(error.response.data.message);
  //       } else {
  //         toast.error("Something went wrong!");
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    console.log("Updated printingCostList:", printingCostList);
  }, [printingCostList]);
  useEffect(() => {

    if (formData.mounting_vendor_id && dataList.length) {
      const selectedVendor = dataList.find(
        (item) => item.acc_id === formData.mounting_vendor_id
      );
      if (selectedVendor) {
        setFormData((prevData) => ({
          ...prevData,
          mounting_cost_per_sq_ft: selectedVendor.mo_c_cost || "",
        }));
      }
      console.log("form data is ",formData)
    }

  }, [formData.mounting_vendor_id, dataList]);


//   const getContactList = async () => {
//     setLoader(true)
//     if (hasCookie('token')) {
//         let token = (getCookie('token'));
//         let db_name = (getCookie('db_name'));

//         let header = {
//             headers: {
//                 Accept: "application/json",
//                 Authorization: "Bearer ".concat(token),
//                 db: db_name,
//                 m_id: 320,
//             }
//         }
//         try {
//             const response = await axios.get(Baseurl + `/db/media/printingCost/getPrintingCost`, header);
//             if(response?.status==200 || response?.status==201){
//                 setLoader(false)
//                 setAccountsList(response?.data?.data);
//             }
//         } catch (error) {
//             setLoader(false)
//             if (error?.response?.data?.message) {
//                 toast.error(error.response.data.message);
//             }
//             else {
//                 toast.error('Something went wrong!')
//             }
//         }
//     }
// }


  useEffect(() => {
if(flag == false){
  if (formData.pr_m_id && printingMaterialData.length) {
    const selectedVendor = printingMaterialData.find(
      (item) => item?.pr_m_id === formData?.pr_m_id
    );
    if (selectedVendor) {
      // setFormData((prevData) => ({
      //   ...prevData,
      //   mountingCostPerSqFt: selectedVendor.mo_c_cost || "",
      // }));
     
      if(printingCostList){
        // console.log("answer 2 is",printingCostList,"and selected data is ",selectedSite);


const filteredDataPrinting =printingCostList.filter((item)=>
        item.db_media_type.m_t_id === selectedSite.db_site.db_media_type.m_t_id && item.db_account.bill_state === selectedSite.db_site.db_state.state_id && item.pr_m_id === selectedVendor.pr_m_id
        )

        // console.log("printing filtered data is ",filteredDataPrinting,"and selectedVendor is ",selectedVendor);



        
        const accNamesVendor = filteredDataPrinting.map((item) => ({
          value: item.acc_id,
          label: item.acc_name,
        }));

   


        setFormData((prevData) => ({
        ...prevData,
        printing_vendor_id: "",
        printing_cost_per_sq_ft:"",

      }));
        setPrintingVendor(accNamesVendor);

        
      }
    }
    

    // console.log("answer is ",selectedVendor)
  }
}else{

  debugger
  if (formData.pr_m_id && printingMaterialData.length) {
    const selectedVendor = printingMaterialData.find(
      (item) => item?.pr_m_id === formData?.pr_m_id
    );
    if (selectedVendor) {
    
     
      if(printingCostList){
        // console.log("answer 2 is",printingCostList,"and selected data is ",selectedSite);

if(getVendorData){

  console.log("getVendorData is",getVendorData,"printingCostingList is ",printingCostList)
  
  const filteredDataPrinting =printingCostList.filter((item)=>
    item.db_media_type.m_t_id == getVendorData.db_site?.m_t_id && item.db_account.bill_state == getVendorData.db_site?.state_id && item.pr_m_id == selectedVendor.pr_m_id
    )

    console.log("printing filtered data is ",filteredDataPrinting,"and selectedVendor is ",selectedVendor);
    
    const accNamesVendor = filteredDataPrinting.map((item) => ({
      value: item.acc_id,
      label: item.acc_name,
    }));


//     setFormData((prevData) => ({
//       ...prevData,
//       printing_vendor_id:getVendorData? getVendorData.printing_vendor_id:'',
//       printing_cost_per_sq_ft:getVendorData.printing_cost_per_sq_ft,

// }))


setFormData((prevData) => ({
  ...prevData,
  printing_vendor_id:'',
  printing_cost_per_sq_ft:'',

}))

    setPrintingVendor(accNamesVendor);
    console.log("accvendor",accNamesVendor)
}
      }
    }
  }
}
  }, [formData.pr_m_id, printingMaterialData]);
  
  useEffect(()=>{
if(!formData.printing_vendor_id){
  setFormData((prevData) => ({
   ...prevData,
    printing_cost_per_sq_ft: "",
  }));

}
  },[formData.printing_vendor_id])


  useEffect(() => {
    if (formData.printing_vendor_id && printingCostList.length) {
      const selectedprintingVendor = printingCostList.find(
        (item) => item.acc_id === formData.printing_vendor_id
      );
      if (selectedprintingVendor) {
        setFormData((prevData) => ({
          ...prevData,
          printing_cost_per_sq_ft: selectedprintingVendor.pr_c_cost || "",
        }));
      }
    }
  }, [formData.printing_vendor_id,printingCostList]);


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
          m_id: 342,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/printingMaterial/getPrintingMaterial`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
          setLoader(false);
          const materialOptions = response.data.data.map((item) => ({
            value: item.pr_m_id,
            label: item.pr_m_name,
          }));
          setMaterialOptions(materialOptions);
          setPrintingMaterialData(response.data.data);

          
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

  return (
    <>
      <Modal 
      show={show} 
      onHide={()=>{
        setFlag(false)
        handleClose()
      }}  size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Vendor Cost Sheet (Asset)</Modal.Title>
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

                          options={
                            field.name === "mounting_vendor_id"
                              ? vendorOptions
                              : field.name === "printing_vendor_id"
                              ? printingVendorData
                              : field.name === "pr_m_id"
                              ? materialOptions
                              : []
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange(field.name, selectedOption)
                          }
                          // value={
                          //   (formData[field.name] && {
                          //     value: formData[field.name],
                          //     label: formData[field.name],
                          //   }) ||
                          //   null
                          // }

                          value={
                            field.name === "mounting_vendor_id"
                              ? vendorOptions.find(option => option.value === formData[field.name]) || null
                              : field.name === "printing_vendor_id"
                              ? printingVendorData.find(option => option.value === formData[field.name]) || null
                              : field.name === "pr_m_id"
                              ? materialOptions.find(option => option.value === formData[field.name]) || null
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
          {/* <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}

<Button disabled={loading} variant="primary" onClick={()=>{
            flag==false ? saveClientCostSheetAssetForParticularSite() :updateClientCostSheetAssetForParticularSite()
          }}>
            { flag==false ?  loading ? "Saving...":"Save":loading? "Updating...":"Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateVendorCostAsset;
