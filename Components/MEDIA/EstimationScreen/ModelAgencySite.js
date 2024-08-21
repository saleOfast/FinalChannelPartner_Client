import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { getCookie } from "cookies-next";

const ModelAgencySite = ({
  show,
  handleClose3,
  getSiteList,
  userInfo
}) => {
  const [rows, setRows] = useState([{
    state: '',
    city: '',
    location: '',
    mediaFormat: '',
    mediaVehicle: '',
    mediaType: '',
    quantity: '',
    height: '',
    width: '',
    totalSqFt: '',
    clientDisplayCost: '',
    clientMountingCost: '',
    clientPrintingCost: ''
  }]);

  const [mediaFormats, setMediaFormats] = useState([]);
  const [mediaVehicles, setMediaVehicles] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const defaultCountryId = 101;

  const fetchData = async (url, dataKey) => {
    const token = getCookie("token");
    const db_name = getCookie("db_name");

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      db: db_name,
      pass: "pass",
    };

    try {
      const response = await axios.get(Baseurl + url, { headers });
      if (response.status === 200) {
        return { status: response.status, data: response.data[dataKey] };
      }
      throw new Error("Failed to fetch");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      return { status: error.response?.status || 500, data: [] };
    }
  };

  const getStates = async (countryId = defaultCountryId) => {
    try {
      const response = await fetchData(`/db/area/states?cnt_id=${countryId}`, 'data');
      if (response.status === 200) {
        const states = response.data.map(state => ({
          value: state.state_id,
          label: state.state_name
        }));
        setStateList(states);
        setCityList([]); // Reset cities when states are fetched
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const getCities = async (stateId) => {
    try {
      const response = await fetchData(`/db/area/city?st_id=${stateId}`, 'data');
      if (response.status === 200) {
        const cities = response?.data?.cityData?.map(city => ({
          value: city.city_id,
          label: city.city_name
        }));
        setCityList(cities);    
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const getMediaFormats = async () => {
    await fetchData(`/db/media/mediaFormat/getMediaFormat`, 'data').then(response => {
      const formats = response.data.map(format => ({
        value: format.m_f_id,
        label: format.m_f_name
      }));
      setMediaFormats(formats);
    });
  };

  const getMediaVehicles = async () => {
    await fetchData(`/db/media/mediaVehicle/getMediaVehicle`, 'data').then(response => {
      const vehicles = response.data.map(vehicle => ({
        value: vehicle.m_v_id,
        label: vehicle.m_v_name
      }));
      setMediaVehicles(vehicles);
    });
  };

  const getMediaTypes = async () => {
    await fetchData(`/db/media/mediaType/getMediaType`, 'data').then(response => {
      const types = response.data.map(type => ({
        value: type.m_t_id,
        label: type.m_t_name
      }));
      setMediaTypes(types);
    });
  };

  useEffect(() => {
    if (show) {
      getMediaFormats();
      getMediaVehicles();
      getMediaTypes();
      getStates(userInfo?.country_id || defaultCountryId);
    }
  }, [show, userInfo?.country_id]);

  useEffect(() => {
    if (userInfo?.state_id) {
      getCities(userInfo.state_id);
    }
  }, [userInfo?.state_id]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];

    // Update the specific field
    updatedRows[index] = { ...updatedRows[index], [name]: value };

    // Recalculate Total SqFt if Height or Width changes
    if (name === 'height' || name === 'width') {
      const height = parseFloat(updatedRows[index].height) || 0;
      const width = parseFloat(updatedRows[index].width) || 0;
      updatedRows[index].totalSqFt = (height * width).toFixed(2);
    }

    setRows(updatedRows);
  };

  const handleSelectChange = (index, fieldName, selectedOption) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [fieldName]: selectedOption ? selectedOption.value : '' };

    // Reset Media Vehicle if Media Format is cleared
    if (fieldName === 'mediaFormat' && !selectedOption) {
      updatedRows[index].mediaVehicle = '';
    }

    setRows(updatedRows);

    // Fetch Media Vehicles if Media Format is selected
    if (fieldName === 'mediaFormat' && selectedOption) {
      getMediaVehicles();
    }

    // Get Cities when State changes
    if (fieldName === 'state') {
      updatedRows[index].city = ''; // Reset city when state changes
      setRows(updatedRows);
      getCities(selectedOption ? selectedOption.value : '');
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        state: '',
        city: '',
        location: '',
        mediaFormat: '',
        mediaVehicle: '',
        mediaType: '',
        quantity: '',
        height: '',
        width: '',
        totalSqFt: '',
        clientDisplayCost: '',
        clientMountingCost: '',
        clientPrintingCost: ''
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    if (index !== 0) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    console.log('Form data:', rows);
    getSiteList();
  };

  return (
    <Modal show={show} onHide={handleClose3} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Offer Agency Site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="add_user_form">
          <form>
            <div className="overflow-auto">
              <div className="d-flex flex-column">
                {rows.map((row, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex flex-nowrap">
                      {/* State */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`state-${index}`}>State</label>
                          <Select
                            id={`state-${index}`}
                            defaultValue={null}
                            options={stateList}
                            value={stateList.find(option => option.value === row.state)}
                            onChange={(selectedOption) => handleSelectChange(index, 'state', selectedOption)}
                            menuPosition="fixed"    
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),   
                            }}
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`city-${index}`}>City</label>
                          <Select
                            id={`city-${index}`}
                            defaultValue={null}
                            options={cityList}
                            value={cityList?.find(option => option.value === row.city)}
                            onChange={(selectedOption) => handleSelectChange(index, 'city', selectedOption)}
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`location-${index}`}>Location</label>
                          <input
                            type="text"
                            id={`location-${index}`}
                            name="location"
                            placeholder="Enter Location"
                            className="form-control"
                            value={row.location}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Media Format */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
                          <Select
                            id={`mediaFormat-${index}`}
                            defaultValue={null}
                            options={mediaFormats}
                            value={mediaFormats.find(option => option.value === row.mediaFormat)}
                            onChange={(selectedOption) => handleSelectChange(index, 'mediaFormat', selectedOption)}
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                        </div>
                      </div>

                      {/* Media Vehicle */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
                          <Select
                            id={`mediaVehicle-${index}`}
                            defaultValue={null}
                            options={mediaVehicles}
                            isDisabled={!row.mediaFormat}
                            value={mediaVehicles.find(option => option.value === row.mediaVehicle)}
                            onChange={(selectedOption) => handleSelectChange(index, 'mediaVehicle', selectedOption)}
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                        </div>
                      </div>

                      {/* Media Type */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`mediaType-${index}`}>Media Type</label>
                          <Select
                            id={`mediaType-${index}`}
                            defaultValue={null}
                            options={mediaTypes}
                            value={mediaTypes.find(option => option.value === row.mediaType)}
                            onChange={(selectedOption) => handleSelectChange(index, 'mediaType', selectedOption)}
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`quantity-${index}`}>Quantity</label>
                          <input
                            type="text"
                            id={`quantity-${index}`}
                            name="quantity"
                            placeholder="Enter Quantity"
                            className="form-control"
                            value={row.quantity}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Height */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`height-${index}`}>Height</label>
                          <input
                            type="text"
                            id={`height-${index}`}
                            name="height"
                            placeholder="Enter Height"
                            className="form-control"
                            value={row.height}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Width */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`width-${index}`}>Width</label>
                          <input
                            type="text"
                            id={`width-${index}`}
                            name="width"
                            placeholder="Enter Width"
                            className="form-control"
                            value={row.width}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Total SqFt */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`totalSqFt-${index}`}>Total SqFt</label>
                          <input
                            type="text"
                            id={`totalSqFt-${index}`}
                            name="totalSqFt"
                            placeholder="Total SqFt"
                            className="form-control"
                            value={row.totalSqFt}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Client Display Cost */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`clientDisplayCost-${index}`}>Client Display Cost</label>
                          <input
                            type="text"
                            id={`clientDisplayCost-${index}`}
                            name="clientDisplayCost"
                            placeholder="Enter Display Cost"
                            className="form-control"
                            value={row.clientDisplayCost}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Client Mounting Cost */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`clientMountingCost-${index}`}>Client Mounting Cost</label>
                          <input
                            type="text"
                            id={`clientMountingCost-${index}`}
                            name="clientMountingCost"
                            placeholder="Enter Mounting Cost"
                            className="form-control"
                            value={row.clientMountingCost}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Client Printing Cost */}
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`clientPrintingCost-${index}`}>Client Printing Cost</label>
                          <input
                            type="text"
                            id={`clientPrintingCost-${index}`}
                            name="clientPrintingCost"
                            placeholder="Enter Printing Cost"
                            className="form-control"
                            value={row.clientPrintingCost}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      {index !== 0 && (
                        <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1 d-flex align-items-center">
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveRow(index)}
                          >
                            Remove Agency
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleAddRow}
              className="mt-2"
            >
              Add Agency
            </Button>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose3}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelAgencySite;



//9
// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import axios from "axios";
// import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
// import { toast } from "react-toastify";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
// import { getCookie } from "cookies-next";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   getSiteList,
//   userInfo
// }) => {
//   const [rows, setRows] = useState([{
//     state: '',
//     city: '',
//     location: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     height: '',
//     width: '',
//     totalSqFt: '',
//     clientDisplayCost: '',
//     clientMountingCost: '',
//     clientPrintingCost: ''
//   }]);

//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);

//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   const defaultCountryId = 101;

//   const fetchData = async (url, dataKey) => {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const headers = {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//       db: db_name,
//       pass: "pass",
//     };

//     try {
//       const response = await axios.get(Baseurl + url, { headers });
//       if (response.status === 200) {
//         return { status: response.status, data: response.data[dataKey] };
//       }
//       throw new Error("Failed to fetch");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//       return { status: error.response?.status || 500, data: [] };
//     }
//   };

//   const getStates = async (countryId = defaultCountryId) => {
//     try {
//       const response = await fetchData(`/db/area/states?cnt_id=${countryId}`, 'data');
//       if (response.status === 200) {
//         const states = response.data.map(state => ({
//           value: state.state_id,
//           label: state.state_name
//         }));
//         setStateList(states);
//         setCityList([]); // Reset cities when states are fetched
//       }
//     } catch (error) {
//       console.error('Failed to fetch states:', error);
//     }
//   };

//   const getCities = async (stateId) => {
//     try {
//       const response = await fetchData(`/db/area/city?st_id=${stateId}`, 'data');
//       if (response.status === 200) {
//         const cities = response?.data?.cityData?.map(city => ({
//           value: city.city_id,
//           label: city.city_name
//         }));
//         setCityList(cities);    
//         console.log("city is",cityList);
//       }
//     } catch (error) {
//       console.error('Failed to fetch cities:', error);
//     }
//   };

//   const getMediaFormats = async () => {
//     await fetchData(`/db/media/mediaFormat/getMediaFormat`, 'data').then(response => {
//       const formats = response.data.map(format => ({
//         value: format.m_f_id,
//         label: format.m_f_name
//       }));
//       setMediaFormats(formats);
//     });
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(`/db/media/mediaVehicle/getMediaVehicle`, 'data').then(response => {
//       const vehicles = response.data.map(vehicle => ({
//         value: vehicle.m_v_id,
//         label: vehicle.m_v_name
//       }));
//       setMediaVehicles(vehicles);
//     });
//   };

//   const getMediaTypes = async () => {
//     await fetchData(`/db/media/mediaType/getMediaType`, 'data').then(response => {
//       const types = response.data.map(type => ({
//         value: type.m_t_id,
//         label: type.m_t_name
//       }));
//       setMediaTypes(types);
//     });
//   };

//   useEffect(() => {
//     if (show) {
//       getMediaFormats();
//       getMediaVehicles();
//       getMediaTypes();
//       getStates(userInfo?.country_id || defaultCountryId);
//     }
//   }, [show, userInfo?.country_id]);

//   useEffect(() => {
//     if (userInfo?.state_id) {
//       getCities(userInfo.state_id);
//     }
//   }, [userInfo?.state_id]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];

//     // Update the specific field
//     updatedRows[index] = { ...updatedRows[index], [name]: value };

//     // Recalculate Total SqFt if Height or Width changes
//     if (name === 'height' || name === 'width') {
//       const height = parseFloat(updatedRows[index].height) || 0;
//       const width = parseFloat(updatedRows[index].width) || 0;
//       updatedRows[index].totalSqFt = (height * width).toFixed(2);
//     }

//     setRows(updatedRows);
//   };

//   const handleSelectChange = (index, fieldName, selectedOption) => {
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [fieldName]: selectedOption ? selectedOption.value : '' };
//     setRows(updatedRows);

//     if (fieldName === 'state') {
//       updatedRows[index].city = ''; // Reset city when state changes
//       setRows(updatedRows);
//       getCities(selectedOption ? selectedOption.value : '');
//     }
//   };

//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     if (index !== 0) {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     getSiteList();
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="overflow-auto">
//               <div className="d-flex flex-column">
//                 {rows.map((row, index) => (
//                   <div key={index} className="mb-3">
//                     <div className="d-flex flex-nowrap">
//                       {/* State */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`state-${index}`}>State</label>
//                           <Select
//                             id={`state-${index}`}
//                             defaultValue={null}
//                             options={stateList}
//                             value={stateList.find(option => option.value === row.state)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'state', selectedOption)}
//                             menuPosition="fixed"    
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),   
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* City */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`city-${index}`}>City</label>
//                           <Select
//                             id={`city-${index}`}
//                             defaultValue={null}
//                             options={cityList}
//                             value={cityList?.find(option => option.value === row.city)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'city', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Location */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`location-${index}`}>Location</label>
//                           <input
//                             type="text"
//                             id={`location-${index}`}
//                             name="location"
//                             placeholder="Enter Location"
//                             className="form-control"
//                             value={row.location}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Format */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
//                           <Select
//                             id={`mediaFormat-${index}`}
//                             defaultValue={null}
//                             options={mediaFormats}
//                             value={mediaFormats.find(option => option.value === row.mediaFormat)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaFormat', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Vehicle */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
//                           <Select
//                             id={`mediaVehicle-${index}`}
//                             defaultValue={null}
//                             options={mediaVehicles}
//                             value={mediaVehicles.find(option => option.value === row.mediaVehicle)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaVehicle', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Type */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaType-${index}`}>Media Type</label>
//                           <Select
//                             id={`mediaType-${index}`}
//                             defaultValue={null}
//                             options={mediaTypes}
//                             value={mediaTypes.find(option => option.value === row.mediaType)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaType', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Quantity */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`quantity-${index}`}>Quantity</label>
//                           <input
//                             type="text"
//                             id={`quantity-${index}`}
//                             name="quantity"
//                             placeholder="Enter Quantity"
//                             className="form-control"
//                             value={row.quantity}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Height */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`height-${index}`}>Height</label>
//                           <input
//                             type="text"
//                             id={`height-${index}`}
//                             name="height"
//                             placeholder="Enter Height"
//                             className="form-control"
//                             value={row.height}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Width */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`width-${index}`}>Width</label>
//                           <input
//                             type="text"
//                             id={`width-${index}`}
//                             name="width"
//                             placeholder="Enter Width"
//                             className="form-control"
//                             value={row.width}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Total SqFt */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`totalSqFt-${index}`}>Total SqFt</label>
//                           <input
//                             type="text"
//                             id={`totalSqFt-${index}`}
//                             name="totalSqFt"
//                             placeholder="Total SqFt"
//                             className="form-control"
//                             value={row.totalSqFt}
//                             disabled
//                           />
//                         </div>
//                       </div>

//                       {/* Client Display Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientDisplayCost-${index}`}>Client Display Cost</label>
//                           <input
//                             type="text"
//                             id={`clientDisplayCost-${index}`}
//                             name="clientDisplayCost"
//                             placeholder="Enter Display Cost"
//                             className="form-control"
//                             value={row.clientDisplayCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Mounting Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientMountingCost-${index}`}>Client Mounting Cost</label>
//                           <input
//                             type="text"
//                             id={`clientMountingCost-${index}`}
//                             name="clientMountingCost"
//                             placeholder="Enter Mounting Cost"
//                             className="form-control"
//                             value={row.clientMountingCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Printing Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientPrintingCost-${index}`}>Client Printing Cost</label>
//                           <input
//                             type="text"
//                             id={`clientPrintingCost-${index}`}
//                             name="clientPrintingCost"
//                             placeholder="Enter Printing Cost"
//                             className="form-control"
//                             value={row.clientPrintingCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Remove Button */}
//                       {index !== 0 && (
//                         <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1 d-flex align-items-center">
//                           <Button
//                             variant="danger"
//                             onClick={() => handleRemoveRow(index)}
//                           >
//                             Remove Agency
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleAddRow}
//               className="mt-2"
//             >
//               Add Agency
//             </Button>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose3}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleSubmit}>
//           Save Changes
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;




//8
// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import axios from "axios";
// import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
// import { toast } from "react-toastify";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
// import { getCookie } from "cookies-next";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   getSiteList,
//   userInfo
// }) => {
//   const [rows, setRows] = useState([{
//     state: '',
//     city: '',
//     location: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     height: '',
//     width: '',
//     totalSqFt: '',
//     clientDisplayCost: '',
//     clientMountingCost: '',
//     clientPrintingCost: ''
//   }]);

//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);

//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   const defaultCountryId = 101;

//   const fetchData = async (url, dataKey) => {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const headers = {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//       db: db_name,
//       pass: "pass",
//     };

//     try {
//       const response = await axios.get(Baseurl + url, { headers });
//       if (response.status === 200) {
//         return { status: response.status, data: response.data[dataKey] };
//       }
//       throw new Error("Failed to fetch");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//       return { status: error.response?.status || 500, data: [] };
//     }
//   };

//   const getStates = async (countryId = defaultCountryId) => {
//     try {
//       const response = await fetchData(`/db/area/states?cnt_id=${countryId}`, 'data');
//       if (response.status === 200) {
//         const states = response.data.map(state => ({
//           value: state.state_id,
//           label: state.state_name
//         }));
//         setStateList(states);
//         setCityList([]); // Reset cities when states are fetched
//       }
//     } catch (error) {
//       console.error('Failed to fetch states:', error);
//     }
//   };

//   const getCities = async (stateId) => {
//     try {
//       const response = await fetchData(`/db/area/city?st_id=${stateId}`, 'data');
//       if (response.status === 200) {
//         const cities = response?.data?.cityData?.map(city => ({
//           value: city.city_id,
//           label: city.city_name
//         }));
//         setCityList(cities);    
//         console.log("city is",cityList);
//       }
//     } catch (error) {
//       console.error('Failed to fetch cities:', error);
//     }
//   };

//   const getMediaFormats = async () => {
//     await fetchData(`/db/media/mediaFormat/getMediaFormat`, 'data').then(response => {
//       const formats = response.data.map(format => ({
//         value: format.m_f_id,
//         label: format.m_f_name
//       }));
//       setMediaFormats(formats);
//     });
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(`/db/media/mediaVehicle/getMediaVehicle`, 'data').then(response => {
//       const vehicles = response.data.map(vehicle => ({
//         value: vehicle.m_v_id,
//         label: vehicle.m_v_name
//       }));
//       setMediaVehicles(vehicles);
//     });
//   };

//   const getMediaTypes = async () => {
//     await fetchData(`/db/media/mediaType/getMediaType`, 'data').then(response => {
//       const types = response.data.map(type => ({
//         value: type.m_t_id,
//         label: type.m_t_name
//       }));
//       setMediaTypes(types);
//     });
//   };

//   useEffect(() => {
//     if (show) {
//       getMediaFormats();
//       getMediaVehicles();
//       getMediaTypes();
//       getStates(userInfo?.country_id || defaultCountryId);
//     }
//   }, [show, userInfo?.country_id]);

//   useEffect(() => {
//     if (userInfo?.state_id) {
//       getCities(userInfo.state_id);
//     }
//   }, [userInfo?.state_id]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//   };

//   const handleSelectChange = (index, fieldName, selectedOption) => {
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [fieldName]: selectedOption ? selectedOption.value : '' };
//     setRows(updatedRows);

//     if (fieldName === 'state') {
//       updatedRows[index].city = ''; // Reset city when state changes
//       setRows(updatedRows);
//       getCities(selectedOption ? selectedOption.value : '');
//     }
//   };

//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     if (index !== 0) {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     getSiteList();
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="overflow-auto">
//               <div className="d-flex flex-column">
//                 {rows.map((row, index) => (
//                   <div key={index} className="mb-3">
//                     <div className="d-flex flex-nowrap">
//                       {/* State */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`state-${index}`}>State</label>
//                           <Select
//                             id={`state-${index}`}
//                             defaultValue={null}
//                             options={stateList}
//                             value={stateList.find(option => option.value === row.state)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'state', selectedOption)}
//                             menuPosition="fixed"    
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),   
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* City */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`city-${index}`}>City</label>
//                           <Select
//                             id={`city-${index}`}
//                             defaultValue={null}
//                             options={cityList}
//                             value={cityList?.find(option => option.value === row.city)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'city', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Location */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`location-${index}`}>Location</label>
//                           <input
//                             type="text"
//                             id={`location-${index}`}
//                             name="location"
//                             placeholder="Enter Location"
//                             className="form-control"
//                             value={row.location}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Format */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
//                           <Select
//                             id={`mediaFormat-${index}`}
//                             defaultValue={null}
//                             options={mediaFormats}
//                             value={mediaFormats.find(option => option.value === row.mediaFormat)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaFormat', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Vehicle */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
//                           <Select
//                             id={`mediaVehicle-${index}`}
//                             defaultValue={null}
//                             options={mediaVehicles}
//                             value={mediaVehicles.find(option => option.value === row.mediaVehicle)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaVehicle', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Type */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaType-${index}`}>Media Type</label>
//                           <Select
//                             id={`mediaType-${index}`}
//                             defaultValue={null}
//                             options={mediaTypes}
//                             value={mediaTypes.find(option => option.value === row.mediaType)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaType', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Quantity */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`quantity-${index}`}>Quantity</label>
//                           <input
//                             type="text"
//                             id={`quantity-${index}`}
//                             name="quantity"
//                             placeholder="Enter Quantity"
//                             className="form-control"
//                             value={row.quantity}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Height */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`height-${index}`}>Height</label>
//                           <input
//                             type="text"
//                             id={`height-${index}`}
//                             name="height"
//                             placeholder="Enter Height"
//                             className="form-control"
//                             value={row.height}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Width */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`width-${index}`}>Width</label>
//                           <input
//                             type="text"
//                             id={`width-${index}`}
//                             name="width"
//                             placeholder="Enter Width"
//                             className="form-control"
//                             value={row.width}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Total SqFt */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`totalSqFt-${index}`}>Total SqFt</label>
//                           <input
//                             type="text"
//                             id={`totalSqFt-${index}`}
//                             name="totalSqFt"
//                             placeholder="Enter Total SqFt"
//                             className="form-control"
//                             value={row.totalSqFt}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Display Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientDisplayCost-${index}`}>Client Display Cost</label>
//                           <input
//                             type="text"
//                             id={`clientDisplayCost-${index}`}
//                             name="clientDisplayCost"
//                             placeholder="Enter Display Cost"
//                             className="form-control"
//                             value={row.clientDisplayCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Mounting Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientMountingCost-${index}`}>Client Mounting Cost</label>
//                           <input
//                             type="text"
//                             id={`clientMountingCost-${index}`}
//                             name="clientMountingCost"
//                             placeholder="Enter Mounting Cost"
//                             className="form-control"
//                             value={row.clientMountingCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Printing Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientPrintingCost-${index}`}>Client Printing Cost</label>
//                           <input
//                             type="text"
//                             id={`clientPrintingCost-${index}`}
//                             name="clientPrintingCost"
//                             placeholder="Enter Printing Cost"
//                             className="form-control"
//                             value={row.clientPrintingCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Remove Button */}
//                       {index !== 0 && (
//                         <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1 d-flex align-items-center">
//                           <Button
//                             variant="danger"
//                             onClick={() => handleRemoveRow(index)}
//                           >
//                             Remove Agency
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleAddRow}
//               className="mt-2"
//             >
//               Add Agency
//             </Button>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose3}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleSubmit}>
//           Save Changes
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;





//6th important

// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import axios from "axios";
// import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
// import { toast } from "react-toastify";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
// import { getCookie } from "cookies-next";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   getSiteList,
//   userInfo
// }) => {
//   const [rows, setRows] = useState([{
//     state: '',
//     city: '',
//     location: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     height: '',
//     width: '',
//     totalSqFt: '',
//     clientDisplayCost: '',
//     clientMountingCost: '',
//     clientPrintingCost: ''
//   }]);

//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);

//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   const defaultCountryId = 101;

//   const fetchData = async (url, dataKey) => {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const headers = {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//       db: db_name,
//       pass: "pass",
//     };

//     try {
//       const response = await axios.get(Baseurl + url, { headers });
//       if (response.status === 200) {
//         return { status: response.status, data: response.data[dataKey] };
//       }
//       throw new Error("Failed to fetch");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//       return { status: error.response?.status || 500, data: [] };
//     }
//   };

//   const getStates = async (countryId = defaultCountryId) => {
//     try {
//       const response = await fetchData(`/db/area/states?cnt_id=${countryId}`, 'data');
//       if (response.status === 200) {
//         const states = response.data.map(state => ({
//           value: state.state_id,
//           label: state.state_name
//         }));
//         setStateList(states);
//         setCityList([]); // Reset cities when states are fetched
//       }
//     } catch (error) {
//       console.error('Failed to fetch states:', error);
//     }
//   };

//   const getCities = async (stateId) => {
//     try {
//       const response = await fetchData(`/db/area/city?st_id=${stateId}`, 'data');
//       if (response.status === 200) {
//         console.log('Cities response:', response.data); // Debugging line
//         const cities = response.data.map(city => ({
//           value: city.city_id,
//           label: city.city_name
//         }));
//         setCityList(cities);
//       }
//     } catch (error) {
//       console.error('Failed to fetch cities:', error);
//     }
//   };

//   const getMediaFormats = async () => {
//     await fetchData(`/db/media/mediaFormat/getMediaFormat`, 'data').then(response => {
//       const formats = response.data.map(format => ({
//         value: format.m_f_id,
//         label: format.m_f_name
//       }));
//       setMediaFormats(formats);
//     });
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(`/db/media/mediaVehicle/getMediaVehicle`, 'data').then(response => {
//       const vehicles = response.data.map(vehicle => ({
//         value: vehicle.m_v_id,
//         label: vehicle.m_v_name
//       }));
//       setMediaVehicles(vehicles);
//     });
//   };

//   const getMediaTypes = async () => {
//     await fetchData(`/db/media/mediaType/getMediaType`, 'data').then(response => {
//       const types = response.data.map(type => ({
//         value: type.m_t_id,
//         label: type.m_t_name
//       }));
//       setMediaTypes(types);
//     });
//   };

//   useEffect(() => {
//     if (show) {
//       getMediaFormats();
//       getMediaVehicles();
//       getMediaTypes();
//       getStates(userInfo?.country_id || defaultCountryId);
//     }
//   }, [show, userInfo?.country_id]);

//   useEffect(() => {
//     if (userInfo?.state_id) {
//       getCities(userInfo.state_id);
//     }
//   }, [userInfo?.state_id]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//   };

//   const handleSelectChange = (index, fieldName, selectedOption) => {
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [fieldName]: selectedOption ? selectedOption.value : '' };
//     setRows(updatedRows);

//     if (fieldName === 'state') {
//       getCities(selectedOption ? selectedOption.value : '');
//     }
//   };

//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     if (index !== 0) {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     getSiteList();
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="overflow-auto">
//               <div className="d-flex flex-column">
//                 {rows.map((row, index) => (
//                   <div key={index} className="mb-3">
//                     <div className="d-flex flex-nowrap">
//                       {/* State */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`state-${index}`}>State</label>
//                           <Select
//                             id={`state-${index}`}
//                             defaultValue={null}
//                             options={stateList}
//                             value={stateList.find(option => option.value === row.state)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'state', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* City */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`city-${index}`}>City</label>
//                           <Select
//                             id={`city-${index}`}
//                             defaultValue={null}
//                             options={cityList}
//                             value={cityList.find(option => option.value === row.city)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'city', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Location */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`location-${index}`}>Location</label>
//                           <input
//                             type="text"
//                             id={`location-${index}`}
//                             name="location"
//                             placeholder="Enter Location"
//                             className="form-control"
//                             value={row.location}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Format */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
//                           <Select
//                             id={`mediaFormat-${index}`}
//                             defaultValue={null}
//                             options={mediaFormats}
//                             value={mediaFormats.find(option => option.value === row.mediaFormat)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaFormat', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Vehicle */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
//                           <Select
//                             id={`mediaVehicle-${index}`}
//                             defaultValue={null}
//                             options={mediaVehicles}
//                             value={mediaVehicles.find(option => option.value === row.mediaVehicle)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaVehicle', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Media Type */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaType-${index}`}>Media Type</label>
//                           <Select
//                             id={`mediaType-${index}`}
//                             defaultValue={null}
//                             options={mediaTypes}
//                             value={mediaTypes.find(option => option.value === row.mediaType)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaType', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>

//                       {/* Quantity */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`quantity-${index}`}>Quantity</label>
//                           <input
//                             type="text"
//                             id={`quantity-${index}`}
//                             name="quantity"
//                             placeholder="Enter Quantity"
//                             className="form-control"
//                             value={row.quantity}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Height */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`height-${index}`}>Height</label>
//                           <input
//                             type="text"
//                             id={`height-${index}`}
//                             name="height"
//                             placeholder="Enter Height"
//                             className="form-control"
//                             value={row.height}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Width */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`width-${index}`}>Width</label>
//                           <input
//                             type="text"
//                             id={`width-${index}`}
//                             name="width"
//                             placeholder="Enter Width"
//                             className="form-control"
//                             value={row.width}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Total SqFt */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`totalSqFt-${index}`}>Total SqFt</label>
//                           <input
//                             type="text"
//                             id={`totalSqFt-${index}`}
//                             name="totalSqFt"
//                             placeholder="Enter Total SqFt"
//                             className="form-control"
//                             value={row.totalSqFt}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Display Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientDisplayCost-${index}`}>Client Display Cost</label>
//                           <input
//                             type="text"
//                             id={`clientDisplayCost-${index}`}
//                             name="clientDisplayCost"
//                             placeholder="Enter Display Cost"
//                             className="form-control"
//                             value={row.clientDisplayCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Mounting Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientMountingCost-${index}`}>Client Mounting Cost</label>
//                           <input
//                             type="text"
//                             id={`clientMountingCost-${index}`}
//                             name="clientMountingCost"
//                             placeholder="Enter Mounting Cost"
//                             className="form-control"
//                             value={row.clientMountingCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Client Printing Cost */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientPrintingCost-${index}`}>Client Printing Cost</label>
//                           <input
//                             type="text"
//                             id={`clientPrintingCost-${index}`}
//                             name="clientPrintingCost"
//                             placeholder="Enter Printing Cost"
//                             className="form-control"
//                             value={row.clientPrintingCost}
//                             onChange={(event) => handleInputChange(index, event)}
//                           />
//                         </div>
//                       </div>

//                       {/* Remove Button */}
//                       {index !== 0 && (
//                         <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1 d-flex align-items-center">
//                           <Button
//                             variant="danger"
//                             onClick={() => handleRemoveRow(index)}
//                           >
//                             Remove Agency
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleAddRow}
//               className="mt-2"
//             >
//               Add Agency
//             </Button>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;













//5th important
// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import axios from "axios";
// import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
// import { toast } from "react-toastify";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
// import { getCookie } from "cookies-next";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   getSiteList,
//   userInfo
// }) => {
//   const [rows, setRows] = useState([{
//     state: '',
//     city: '',
//     location: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     height: '',
//     width: '',
//     totalSqFt: '',
//     clientDisplayCost: '',
//     clientMountingCost: '',
//     clientPrintingCost: ''
//   }]);

//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);

//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   const defaultCountryId = 101;

//   const getStates = async (countryId = defaultCountryId) => {
//     try {
//       const response = await fetchData(
//         `/db/area/states?cnt_id=${countryId}`,
//         'data'
//       );
//       if (response.status === 200) {
//         const states = response.data.map(state => ({
//           value: state.state_id,
//           label: state.state_name
//         }));
//         setStateList(states);
//         // Optionally reset cities when states are fetched
//         setCityList([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch states:', error);
//     }
//   };

//   const getCities = async (stateId) => {
//     try {
//       const response = await fetchData(
//         `/db/area/city?st_id=${stateId}`,
//         'data'
//       );
//       if (response.status === 200) {
//         const cities = response.data.map(city => ({
//           value: city.city_id,
//           label: city.city_name
//         }));
//         setCityList(cities);
//       }
//     } catch (error) {
//       console.error('Failed to fetch cities:', error);
//     }
//   };

//   const fetchData = async (url, dataKey) => {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const headers = {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//       db: db_name,
//       pass: "pass",
//     };

//     try {
//       const response = await axios.get(Baseurl + url, { headers });
//       if (response.status === 200) {
//         return { status: response.status, data: response.data[dataKey] };
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//       return { status: error.response?.status || 500, data: [] };
//     }
//   };

//   const getMediaFormats = async () => {
//     await fetchData(
//       `/db/media/mediaFormat/getMediaFormat`,
//       'data'
//     ).then(response => {
//       const formats = response.data.map(format => ({
//         value: format.m_f_id,
//         label: format.m_f_name
//       }));
//       setMediaFormats(formats);
//     });
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(
//       `/db/media/mediaVehicle/getMediaVehicle`,
//       'data'
//     ).then(response => {
//       const vehicles = response.data.map(vehicle => ({
//         value: vehicle.m_v_id,
//         label: vehicle.m_v_name
//       }));
//       setMediaVehicles(vehicles);
//     });
//   };

//   const getMediaTypes = async () => {
//     await fetchData(
//       `/db/media/mediaType/getMediaType`,
//       'data'
//     ).then(response => {
//       const types = response.data.map(type => ({
//         value: type.m_t_id,
//         label: type.m_t_name
//       }));
//       setMediaTypes(types);
//     });
//   };

//   useEffect(() => {
//     if (show) {
//       getMediaFormats();
//       getMediaVehicles();
//       getMediaTypes();
//       // Fetch states with default country_id initially
//       getStates(userInfo?.country_id || defaultCountryId);
//     }
//   }, [show, userInfo?.country_id]);

//   useEffect(() => {
//     if (userInfo?.state_id) {
//       getCities(userInfo.state_id);
//     }
//   }, [userInfo?.state_id]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//   };

//   const handleSelectChange = (index, fieldName, selectedOption) => {
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [fieldName]: selectedOption ? selectedOption.value : '' };
//     setRows(updatedRows);

//     if (fieldName === 'state') {
//       getCities(selectedOption ? selectedOption.value : '');
//     }
//   };

//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   const handleRemoveRow = (index) => {
//     if (index !== 0) {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     getSiteList();
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="overflow-auto">
//               <div className="d-flex flex-column">
//                 {rows.map((row, index) => (
//                   <div key={index} className="mb-3">
//                     <div className="d-flex flex-nowrap">
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`state-${index}`}>State</label>
//                           <Select
//                             id={`state-${index}`}
//                             defaultValue={null}
//                             options={stateList}
//                             value={stateList.find(option => option.value === row.state)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'state', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`city-${index}`}>City</label>
//                           <Select
//                             id={`city-${index}`}
//                             defaultValue={null}
//                             options={cityList}
//                             value={cityList.find(option => option.value === row.city)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'city', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       {/* Other fields as before */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
//                           <Select
//                             id={`mediaFormat-${index}`}
//                             defaultValue={null}
//                             options={mediaFormats}
//                             value={mediaFormats.find(option => option.value === row.mediaFormat)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaFormat', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
//                           <Select
//                             id={`mediaVehicle-${index}`}
//                             defaultValue={null}
//                             options={mediaVehicles}
//                             value={mediaVehicles.find(option => option.value === row.mediaVehicle)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaVehicle', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaType-${index}`}>Media Type</label>
//                           <Select
//                             id={`mediaType-${index}`}
//                             defaultValue={null}
//                             options={mediaTypes}
//                             value={mediaTypes.find(option => option.value === row.mediaType)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaType', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       {index !== 0 && (
//                         <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1 d-flex align-items-center">
//                           <Button
//                             variant="danger"
//                             onClick={() => handleRemoveRow(index)}
//                           >
//                             Remove Agency
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleAddRow}
//               className="mt-2"
//             >
//               Add Agency
//             </Button>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;





//4th important
// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import axios from "axios";
// import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
// import { toast } from "react-toastify";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
// import { hasCookie, getCookie } from "cookies-next";

// const fetchData = async (url, setData, key) => {
//   const token = getCookie("token");
//   const db_name = getCookie("db_name");

//   const headers = {
//     Accept: "application/json",
//     Authorization: `Bearer ${token}`,
//     db: db_name,
//     pass: "pass",
//   };

//   try {
//     const response = await axios.get(Baseurl + url, { headers });
//     if (response.status === 200) {
//       setData(response.data.data.map(item => ({
//         value: item[key], // Key should match the ID field in the API response
//         label: item[key.replace('id', 'name')] // Key should match the name field in the API response
//       })));
//     }
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Something went wrong!");
//   }
// };

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   getSiteList,
// }) => {
//   const [rows, setRows] = useState([{
//     state: '',
//     city: '',
//     location: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     height: '',
//     width: '',
//     totalSqFt: '',
//     clientDisplayCost: '',
//     clientMountingCost: '',
//     clientPrintingCost: ''
//   }]);

//   // States for media formats, vehicles, and types
//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);

//   // Fetch media formats from the API
//   const getMediaFormats = async () => {
//     await fetchData(
//       `/db/media/mediaFormat/getMediaFormat`,
//       setMediaFormats,
//       'm_f_id'
//     );
//   };

//   // Fetch media vehicles from the API
//   const getMediaVehicles = async () => {
//     await fetchData(
//       `/db/media/mediaVehicle/getMediaVehicle`,
//       setMediaVehicles,
//       'm_v_id'
//     );
//   };

//   // Fetch media types from the API
//   const getMediaTypes = async () => {
//     await fetchData(
//       `/db/media/mediaType/getMediaType`,
//       setMediaTypes,
//       'm_t_id'
//     );
//   };

//   // Fetch data when the modal opens
//   useEffect(() => {
//     if (show) {
//       getMediaFormats();
//       getMediaVehicles();
//       getMediaTypes();
//     }
//   }, [show]);

//   // Reset rows when modal is closed
//   useEffect(() => {
//     if (!show) {
//       setRows([{
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }]);
//     }
//   }, [show]);

//   // Handle input changes
//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//   };

//   // Handle select changes
//   const handleSelectChange = (index, fieldName, selectedOption) => {
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [fieldName]: selectedOption ? selectedOption.value : '' };
//     setRows(updatedRows);
//   };

//   // Add a new row
//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   // Remove a specific row
//   const handleRemoveRow = (index) => {
//     if (index !== 0) { // Prevent removing the first row
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     getSiteList(); // Assuming you want to call this function on form submit
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="overflow-auto">
//               {/* Container for all rows */}
//               <div className="d-flex flex-column">
//                 {rows.map((row, index) => (
//                   <div key={index} className="mb-3">
//                     {/* Container for fields in a single row */}
//                     <div className="d-flex flex-nowrap">
//                       {[
//                         { name: 'state', label: 'State' },
//                         { name: 'city', label: 'City' },
//                         { name: 'location', label: 'Location' },
//                         { name: 'quantity', label: 'Quantity' },
//                         { name: 'height', label: 'Height (Ft.)' },
//                         { name: 'width', label: 'Width (Ft.)' },
//                         { name: 'totalSqFt', label: 'Total Sq. Ft.' },
//                         { name: 'clientDisplayCost', label: 'Client Display Cost' },
//                         { name: 'clientMountingCost', label: 'Client Mounting Cost / Sq. Ft.' },
//                         { name: 'clientPrintingCost', label: 'Client Printing Cost / Sq. Ft.' }
//                       ].map((field, idx) => (
//                         <div key={idx} className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                           <div className="input_box">
//                             <label htmlFor={`${field.name}-${index}`}>{field.label}</label>
//                             <input
//                               type={['quantity', 'height', 'width', 'totalSqFt', 'clientDisplayCost', 'clientMountingCost', 'clientPrintingCost'].includes(field.name) ? 'number' : 'text'}
//                               name={field.name}
//                               placeholder={`Enter ${field.label}`}
//                               id={`${field.name}-${index}`}
//                               className="form-control"
//                               onChange={(e) => handleInputChange(index, e)}
//                               value={row[field.name]}
//                               readOnly={field.name === 'totalSqFt'} // Example: Total Sq. Ft. is read-only
//                             />
//                           </div>
//                         </div>
//                       ))}
//                       {/* MediaFormat as Select */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
//                           <Select
//                             id={`mediaFormat-${index}`}
//                             defaultValue={null}
//                             options={mediaFormats}
//                             value={mediaFormats.find(option => option.value === row.mediaFormat)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaFormat', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999, // Ensures it appears above other elements
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       {/* MediaVehicle as Select */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
//                           <Select
//                             id={`mediaVehicle-${index}`}
//                             defaultValue={null}
//                             options={mediaVehicles}
//                             value={mediaVehicles.find(option => option.value === row.mediaVehicle)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaVehicle', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999, // Ensures it appears above other elements
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       {/* MediaType as Select */}
//                       <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaType-${index}`}>Media Type</label>
//                           <Select
//                             id={`mediaType-${index}`}
//                             defaultValue={null}
//                             options={mediaTypes}
//                             value={mediaTypes.find(option => option.value === row.mediaType)}
//                             onChange={(selectedOption) => handleSelectChange(index, 'mediaType', selectedOption)}
//                             menuPosition="fixed"
//                             styles={{
//                               menu: (provided) => ({
//                                 ...provided,
//                                 zIndex: 9999, // Ensures it appears above other elements
//                               }),
//                             }}
//                           />
//                         </div>
//                       </div>
//                       {/* Conditionally render the Remove Row Button */}
//                       {index !== 0 && (
//                         <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1 d-flex align-items-center">
//                           <Button
//                             variant="danger"
//                             onClick={() => handleRemoveRow(index)}
//                           >
//                             Remove Agency
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleAddRow}
//               className="mt-2"
//             >
//               Add Agency
//             </Button>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;







//3rd important
// import React, { useState } from "react";
// import { Button, Modal } from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   getSiteList,
// }) => {
//   // State to manage form rows
//   const [rows, setRows] = useState([
//     {
//       state: '',
//       city: '',
//       location: '',
//       mediaFormat: '',
//       mediaVehicle: '',
//       mediaType: '',
//       quantity: '',
//       height: '',
//       width: '',
//       totalSqFt: '',
//       clientDisplayCost: '',
//       clientMountingCost: '',
//       clientPrintingCost: ''
//     }
//   ]);

//   // Handle input changes
//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//   };

//   // Add a new row
//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   // Remove a specific row
//   const handleRemoveRow = (index) => {
//     if (index !== 0) { // Prevent removing the first row
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     // Here you can add logic to handle form submission
//     getSiteList(); // Assuming you want to call this function on form submit
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="overflow-auto">
//               {/* Container for all rows */}
//               <div className="d-flex flex-column">
//                 {rows.map((row, index) => (
//                   <div key={index} className="mb-3">
//                     {/* Container for fields in a single row */}
//                     <div className="d-flex flex-nowrap">
//                       {[
//                         { name: 'state', label: 'State' },
//                         { name: 'city', label: 'City' },
//                         { name: 'location', label: 'Location' },
//                         { name: 'mediaFormat', label: 'Media Format' },
//                         { name: 'mediaVehicle', label: 'Media Vehicle' },
//                         { name: 'mediaType', label: 'Media Type' },
//                         { name: 'quantity', label: 'Quantity' },
//                         { name: 'height', label: 'Height (Ft.)' },
//                         { name: 'width', label: 'Width (Ft.)' },
//                         { name: 'totalSqFt', label: 'Total Sq. Ft.' },
//                         { name: 'clientDisplayCost', label: 'Client Display Cost' },
//                         { name: 'clientMountingCost', label: 'Client Mounting Cost / Sq. Ft.' },
//                         { name: 'clientPrintingCost', label: 'Client Printing Cost / Sq. Ft.' }
//                       ].map((field, idx) => (
//                         <div key={idx} className="col-xl-4 col-md-4 col-sm-4 col-4 p-1">
//                           <div className="input_box">
//                             <label htmlFor={`${field.name}-${index}`}>{field.label}</label>
//                             <input
//                               type={field.name === 'quantity' || field.name === 'height' || field.name === 'width' || field.name === 'totalSqFt' || field.name === 'clientDisplayCost' || field.name === 'clientMountingCost' || field.name === 'clientPrintingCost' ? 'number' : 'text'}
//                               name={field.name}
//                               placeholder={`Enter ${field.label}`}
//                               id={`${field.name}-${index}`}
//                               className="form-control"
//                               onChange={(e) => handleInputChange(index, e)}
//                               value={row[field.name]}
//                               readOnly={field.name === 'totalSqFt'} // Example: Total Sq. Ft. is read-only
//                             />
//                           </div>
//                         </div>
//                       ))}
//                       {/* Conditionally render the Remove Row Button */}
//                       {index !== 0 && (
//                         <div className="col-xl-4 col-md-4 col-sm-4 col-4 p-1 d-flex align-items-center">
//                           <Button
//                             variant="danger"
//                             onClick={() => handleRemoveRow(index)}
//                           >
//                             Remove Agency
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <Button
//               variant="primary"
//               onClick={handleAddRow}
//               className="mt-2"
//             >
//               Add Agency
//             </Button>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;






//2nd important
// import React, { useState } from "react";
// import { Button, Modal } from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   getSiteList,
//   stateId,
//   cityIds,
// }) => {
//   // State to manage form rows
//   const [rows, setRows] = useState([
//     {
//       state: '',
//       city: '',
//       location: '',
//       mediaFormat: '',
//       mediaVehicle: '',
//       mediaType: '',
//       quantity: '',
//       height: '',
//       width: '',
//       totalSqFt: '',
//       clientDisplayCost: '',
//       clientMountingCost: '',
//       clientPrintingCost: ''
//     }
//   ]);

//   // Handle input changes
//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//   };

//   // Add a new row
//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         state: '',
//         city: '',
//         location: '',
//         mediaFormat: '',
//         mediaVehicle: '',
//         mediaType: '',
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         clientDisplayCost: '',
//         clientMountingCost: '',
//         clientPrintingCost: ''
//       }
//     ]);
//   };

//   // Remove a specific row
//   const handleRemoveRow = (index) => {
//     setRows(rows.filter((_, i) => i !== index));
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     console.log('Form data:', rows);
//     // Here you can add logic to handle form submission
//     getSiteList(); // Assuming you want to call this function on form submit
//   };

//   return (
//     <Modal show={show} onHide={handleClose3} size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>Offer Agency Site</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div className="add_user_form">
//           <form>
//             <div className="d-flex flex-column gap-2">
//               {rows.map((row, index) => (
//                 <div key={index} className="mb-3">
//                   <div className="overflow-auto">
//                     {/* Container for all fields */}
//                     <div className="d-flex flex-nowrap">
//                       {/* All Fields in a Single Row */}
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`state-${index}`}>State</label>
//                           <input
//                             type="text"
//                             name="state"
//                             placeholder="State"
//                             id={`state-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.state}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`city-${index}`}>City</label>
//                           <input
//                             type="text"
//                             name="city"
//                             placeholder="City"
//                             id={`city-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.city}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`location-${index}`}>Location</label>
//                           <input
//                             type="text"
//                             name="location"
//                             placeholder="Location"
//                             id={`location-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.location}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaFormat-${index}`}>Media Format</label>
//                           <input
//                             type="text"
//                             name="mediaFormat"
//                             placeholder="Media Format"
//                             id={`mediaFormat-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.mediaFormat}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaVehicle-${index}`}>Media Vehicle</label>
//                           <input
//                             type="text"
//                             name="mediaVehicle"
//                             placeholder="Media Vehicle"
//                             id={`mediaVehicle-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.mediaVehicle}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`mediaType-${index}`}>Media Type</label>
//                           <input
//                             type="text"
//                             name="mediaType"
//                             placeholder="Media Type"
//                             id={`mediaType-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.mediaType}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`quantity-${index}`}>Quantity</label>
//                           <input
//                             type="number"
//                             name="quantity"
//                             placeholder="Quantity"
//                             id={`quantity-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.quantity}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`height-${index}`}>Height (Ft.)</label>
//                           <input
//                             type="number"
//                             name="height"
//                             placeholder="Height (Ft.)"
//                             id={`height-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.height}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`width-${index}`}>Width (Ft.)</label>
//                           <input
//                             type="number"
//                             name="width"
//                             placeholder="Width (Ft.)"
//                             id={`width-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.width}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`totalSqFt-${index}`}>Total Sq. Ft.</label>
//                           <input
//                             type="number"
//                             name="totalSqFt"
//                             placeholder="Total Sq. Ft."
//                             id={`totalSqFt-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.totalSqFt}
//                             readOnly
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientDisplayCost-${index}`}>Client Display Cost</label>
//                           <input
//                             type="number"
//                             name="clientDisplayCost"
//                             placeholder="Display Cost"
//                             id={`clientDisplayCost-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.clientDisplayCost}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientMountingCost-${index}`}>Client Mounting Cost / Sq. Ft.</label>
//                           <input
//                             type="number"
//                             name="clientMountingCost"
//                             placeholder="Mounting Cost / Sq. Ft."
//                             id={`clientMountingCost-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.clientMountingCost}
//                           />
//                         </div>
//                       </div>
//                       <div className="p-1">
//                         <div className="input_box">
//                           <label htmlFor={`clientPrintingCost-${index}`}>Client Printing Cost / Sq. Ft.</label>
//                           <input
//                             type="number"
//                             name="clientPrintingCost"
//                             placeholder="Printing Cost / Sq. Ft."
//                             id={`clientPrintingCost-${index}`}
//                             className="form-control"
//                             onChange={(e) => handleInputChange(index, e)}
//                             value={row.clientPrintingCost}
//                           />
//                         </div>
//                       </div>

//                       {/* Remove Row Button */}
//                       <div className="p-1 d-flex align-items-center">
//                         <Button
//                           variant="danger"
//                           onClick={() => handleRemoveRow(index)}
//                         >
//                           Remove Row
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <Button
//                 variant="primary"
//                 onClick={handleAddRow}
//                 className="mt-2"
//               >
//                 Add Row
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModelAgencySite;















//important
// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import moment from "moment";
// import { hasCookie, getCookie } from "cookies-next";
// import axios from "axios";
// import { Baseurl, filesUrl } from "../../../Utils/Constants";
// import { toast } from "react-toastify";
// import DeleteIcon from "../../Svg/DeleteIcon";
// import DisableIcon from "../../Svg/DisableIcon";
// import PlusIcon from "../../Svg/PlusIcon";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   getSiteList,
//   stateId,
//   cityIds,
// }) => {
//   const [errorData, setErrorData] = useState({});
//   const [countrylist, setcountrylist] = useState([]);
//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);
//   const [statelist, setStatelist] = useState([]);
//   const [citylist, setCitylist] = useState([]);
//   const [rows, setRows] = useState([{ id: Date.now(), userInfo: {} }]);

//   const [userInfo, setUserInfo] = useState({
//     site_code: "",
//     acc_id: "",
//     site_cat_id: "",
//     country_id: "",
//     state_id: "",
//     city_id: "",
//     location: "",
//     m_f_id: "",
//     m_v_id: "",
//     m_t_id: "",
//     s_s_id: "",
//     traffic_from: "",
//     traffic_to: "",
//     position_of_site: "",
//     lat_long: "",
//     rating_id: "",
//     a_s_id: "",
//     available_from: "",
//     available_to: "",
//     remarks: "",
//     lease_from: "",
//     lease_to: "",
//     lease_period: null,
//     lease_cost: null,
//     width: "",
//     height: "",
//     quantity: "",
//     total_sq_ft: "",
//     selling_cost: "",
//     buying_cost: "",
//     leased_cost: "",
//     card_rate: "",
//     selling_cost_sq_ft: "",
//     buying_cost_sq_ft: "",
//     leased_cost_sq_ft: "",
//     card_rate_sq_ft: "",
//     selling_cost_day: "",
//     buying_cost_day: "",
//     leased_cost_day: "",
//     card_rate_day: "",
//     p_close_shot: "",
//     p_long_shot: "",
//     p_night_shot: "",
//     p_close_shot: "",
//     p_close_shot_preview: "",
//     p_long_shot_preview: "",
//     p_night_shot_preview: "",
//   });

//   async function fetchData(url, setData) {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const header = {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//         db: db_name,
//         pass: "pass",
//       },
//     };
//     try {
//       const response = await axios.get(Baseurl + url, header);
//       if (response.status === 204 || response.status === 200) {
//         setData(response.data.data);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//     }
//   }

//   const getMediaFormats = async () => {
//     await fetchData(
//       `/db/media/mediaFormat/getMediaFormat`,
//       setMediaFormats,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(
//       `/db/media/mediaVehicle/getMediaVehicle`,
//       setMediaVehicles,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getMediaTypes = async () => {
//     await fetchData(
//       `/db/media/mediaType/getMediaType`,
//       setMediaTypes,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getState = async () => {
//     await fetchData(
//       `/db/area/states?cnt_id=${101}`,
//       setStatelist,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getcity = async (id) => {
//     await fetchData(
//       `/db/area/city?st_id=${id}`,
//       (data) => setCitylist(data.cityData),
//       errorToast,
//       setErrorData
//     );
//   };

//   useEffect(() => {
//     getState(userInfo?.country_id);
//   }, [userInfo?.country_id]);

//   useEffect(() => {
//     getcity(userInfo?.state_id);
//   }, [userInfo?.state_id]);

//   useEffect(() => {
//     // getAccountList()
//     // getCountryList();
//     // getSiteCategories()
//     getMediaFormats();
//     getMediaVehicles();
//     getMediaTypes();
//     // getSiteStatuses()
//     // getRating()
//     // getAvailabilitySatuses()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const addNewRow = () => {
//     console.log("hello");
//     setRows([...rows, { id: Date.now(), userInfo: {} }]);
//   };

//   return (
//     <>
//       <Modal show={show} onHide={handleClose3} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Offer Agency Site</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="d-flex py-5 gap-2" style={{ overflowX: "scroll" }}>
//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div
//                   className={
//                     errorData?.state_id ? "input_box errorBox" : "input_box"
//                   }
//                 >
//                   <label htmlFor="state">State </label>
//                   <Select
//                     id="state"
//                     defaultValue={""}
//                     // isDisabled={viewMode}
//                     options={statelist?.map((data, index) => {
//                       return {
//                         value: data?.state_id,
//                         label: data?.state_name,
//                       };
//                     })}
//                     value={statelist?.map((data, index) => {
//                       if (userInfo.state_id === data.state_id) {
//                         return {
//                           value: data?.state_id,
//                           label: data?.state_name,
//                         };
//                       }
//                     })}
//                     onChange={(e) => {
//                       setUserInfo({ ...userInfo, state_id: e.value });
//                       setErrorData({ ...errorData, state_id: "" });
//                     }}
//                     //   menuPortalTarget={document.body}
//                     //   styles={{
//                     //     menuPortal: (base) => ({ ...base, zIndex: 9999 })}}
//                     menuPosition="fixed"
//                     styles={{
//                       menu: (provided) => ({
//                         ...provided,
//                         zIndex: 9999, // Ensures it appears above other elements
//                       }),
//                     }}
//                   />
//                   <span className="errorText">
//                     {" "}
//                     {errorData?.state_id ? errorData.state_id : ""}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div
//                   className={
//                     errorData?.city_id ? "input_box errorBox" : "input_box"
//                   }
//                 >
//                   <label htmlFor="city">City </label>
//                   <Select
//                     id="city"
//                     // isDisabled={viewMode}
//                     defaultValue={""}
//                     options={citylist?.map((data, index) => {
//                       return {
//                         value: data?.city_id,
//                         label: data?.city_name,
//                       };
//                     })}
//                     value={citylist?.map((data, index) => {
//                       if (userInfo.city_id === data.city_id) {
//                         return {
//                           value: data?.city_id,
//                           label: data?.city_name,
//                         };
//                       }
//                     })}
//                     onChange={(e) => {
//                       setUserInfo({ ...userInfo, city_id: e.value });
//                       setErrorData({ ...errorData, city_id: "" });
//                     }}
//                     menuPosition="fixed"
//                     styles={{
//                       menu: (provided) => ({
//                         ...provided,
//                         zIndex: 9999, // Ensures it appears above other elements
//                       }),
//                     }}
//                   />
//                   <span className="errorText">
//                     {" "}
//                     {errorData?.city_id ? errorData.city_id : ""}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-3 col-3">
//                 <div className="input_box">
//                   <label htmlFor="location">Location</label>
//                   <input
//                     type="text"
//                     name="Location"
//                     placeholder="Enter Location "
//                     id="location"
//                     // disabled={viewMode}
//                     className="form-control"
//                     onChange={(e) =>
//                       setUserInfo({
//                         ...userInfo,
//                         location: e.target.value,
//                       })
//                     }
//                     value={userInfo?.location ? userInfo.location : ""}
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div
//                   className={
//                     errorData?.m_f_id ? "input_box errorBox" : "input_box"
//                   }
//                 >
//                   <label htmlFor="media_format">Media Format</label>
//                   <Select
//                     id="media_format"
//                     // isDisabled={viewMode}
//                     options={mediaFormats?.map((item) => {
//                       return {
//                         value: item.m_f_id,
//                         label: item.m_f_name,
//                       };
//                     })}
//                     value={mediaFormats?.map((item) => {
//                       if (userInfo?.m_f_id == item?.m_f_id) {
//                         return {
//                           value: item.m_f_id,
//                           label: item.m_f_name,
//                         };
//                       }
//                     })}
//                     onChange={(e) => {
//                       setUserInfo({
//                         ...userInfo,
//                         m_f_id: e.value,
//                       });
//                       setErrorData({ ...errorData, m_f_id: "" });
//                     }}
//                     menuPosition="fixed"
//                     styles={{
//                       menu: (provided) => ({
//                         ...provided,
//                         zIndex: 9999, // Ensures it appears above other elements
//                       }),
//                     }}
//                   />
//                   <span className="errorText">
//                     {errorData?.m_f_id ? errorData.m_f_id : ""}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div
//                   className={
//                     errorData?.m_v_id ? "input_box errorBox" : "input_box"
//                   }
//                 >
//                   <label htmlFor="media_vehicle">Media Vehicle</label>
//                   <Select
//                     id="media_vehicle"
//                     // isDisabled={viewMode}
//                     defaultValue={""}
//                     options={mediaVehicles
//                       ?.filter((item) => item?.m_f_id == userInfo?.m_f_id)
//                       ?.map((item) => {
//                         return {
//                           value: item.m_v_id,
//                           label: item.m_v_name,
//                         };
//                       })}
//                     value={mediaVehicles?.map((item) => {
//                       if (userInfo?.m_v_id == item?.m_v_id) {
//                         return {
//                           value: item.m_v_id,
//                           label: item.m_v_name,
//                         };
//                       }
//                     })}
//                     onChange={(e) => {
//                       setUserInfo({
//                         ...userInfo,
//                         m_v_id: e.value,
//                       });
//                       setErrorData({ ...errorData, m_v_id: "" });
//                     }}
//                     menuPosition="fixed"
//                     styles={{
//                       menu: (provided) => ({
//                         ...provided,
//                         zIndex: 9999, // Ensures it appears above other elements
//                       }),
//                     }}
//                   />
//                   <span className="errorText">
//                     {errorData?.m_v_id ? errorData.m_v_id : ""}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div
//                   className={
//                     errorData?.m_t_id ? "input_box errorBox" : "input_box"
//                   }
//                 >
//                   <label htmlFor="media_type">Media Type</label>
//                   <Select
//                     id="media_type"
//                     // isDisabled={viewMode}
//                     defaultValue={""}
//                     options={mediaTypes?.map((item) => {
//                       return {
//                         value: item.m_t_id,
//                         label: item.m_t_name,
//                       };
//                     })}
//                     value={mediaTypes?.map((item) => {
//                       if (userInfo?.m_t_id == item?.m_t_id) {
//                         return {
//                           value: item.m_t_id,
//                           label: item.m_t_name,
//                         };
//                       }
//                     })}
//                     onChange={(e) => {
//                       setUserInfo({
//                         ...userInfo,
//                         m_t_id: e.value,
//                       });
//                       setErrorData({ ...errorData, m_t_id: "" });
//                     }}
//                     menuPosition="fixed"
//                     styles={{
//                       menu: (provided) => ({
//                         ...provided,
//                         zIndex: 9999, // Ensures it appears above other elements
//                       }),
//                     }}
//                   />
//                   <span className="errorText">
//                     {errorData?.m_t_id ? errorData.m_t_id : ""}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="width">Width</label>
//                   <input
//                     type="number"
//                     name="width"
//                     placeholder="Enter Width"
//                     id="width"
//                     // disabled={viewMode}
//                     className="form-control"
//                     onChange={(e) => {
//                       const value = Math.max(0, e.target.value);
//                       setUserInfo({
//                         ...userInfo,
//                         width: value,
//                         total_sq_ft: value * userInfo?.height,
//                       });
//                     }}
//                     onInput={(e) => {
//                       e.target.value = Math.max(0, e.target.value);
//                     }}
//                     value={userInfo?.width ? userInfo.width : ""}
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="height">Height</label>
//                   <input
//                     type="number"
//                     name="height"
//                     placeholder="Enter Height"
//                     id="height"
//                     // disabled={viewMode}
//                     className="form-control"
//                     onChange={(e) => {
//                       const value = Math.max(0, e.target.value);
//                       setUserInfo({
//                         ...userInfo,
//                         height: value,
//                         total_sq_ft: value * userInfo?.width,
//                       });
//                     }}
//                     onInput={(e) => {
//                       e.target.value = Math.max(0, e.target.value);
//                     }}
//                     value={userInfo?.height ? userInfo.height : ""}
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="quantity">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     placeholder="Enter Quantity"
//                     id="quantity"
//                     //   disabled={viewMode}
//                     className="form-control"
//                     onChange={(e) => {
//                       const value = Math.max(0, e.target.value);
//                       setUserInfo({
//                         ...userInfo,
//                         quantity: value,
//                       });
//                     }}
//                     onInput={(e) => {
//                       e.target.value = Math.max(0, e.target.value);
//                     }}
//                     value={userInfo?.quantity ? userInfo.quantity : ""}
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="total_sq_ft">Total Sq. Ft.</label>
//                   <input
//                     type="number"
//                     name="total_sq_ft"
//                     placeholder="Enter Total Sq. Ft."
//                     id="total_sq_ft"
//                     disabled
//                     className="form-control"
//                     onChange={(e) =>
//                       setUserInfo({
//                         ...userInfo,
//                         total_sq_ft: e.target.value,
//                       })
//                     }
//                     value={
//                       userInfo?.total_sq_ft
//                         ? userInfo.total_sq_ft.toFixed(1)
//                         : ""
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="width">Client Display Cost</label>
//                   <input
//                     type="number"
//                     name="width"
//                     placeholder="Enter Width"
//                     id="width"
//                     // disabled={viewMode}
//                     className="form-control"
//                     onChange={(e) => {
//                       const value = Math.max(0, e.target.value);
//                       setUserInfo({
//                         ...userInfo,
//                         width: value,
//                         total_sq_ft: value * userInfo?.height,
//                       });
//                     }}
//                     onInput={(e) => {
//                       e.target.value = Math.max(0, e.target.value);
//                     }}
//                     value={userInfo?.width ? userInfo.width : ""}
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-4 col-md-4 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="width">Client Mounting Cost / Sq. Ft. </label>
//                   <input
//                     type="number"
//                     name="width"
//                     placeholder="Enter Width"
//                     id="width"
//                     // disabled={viewMode}
//                     className="form-control"
//                     onChange={(e) => {
//                       const value = Math.max(0, e.target.value);
//                       setUserInfo({
//                         ...userInfo,
//                         width: value,
//                         total_sq_ft: value * userInfo?.height,
//                       });
//                     }}
//                     onInput={(e) => {
//                       e.target.value = Math.max(0, e.target.value);
//                     }}
//                     value={userInfo?.width ? userInfo.width : ""}
//                   />
//                 </div>
//               </div>

//               <div className="col-xl-4 col-md-4 col-sm-12 col-12">
//                 <div className="input_box d-flex align-items-center gap-2">
//                   <div>
//                     <label htmlFor="width">
//                       Client Printing Cost / Sq. Ft{" "}
//                     </label>
//                     <input
//                       type="number"
//                       name="width"
//                       placeholder="Enter Width"
//                       id="width"
//                       // disabled={viewMode}
//                       className="form-control"
//                       onChange={(e) => {
//                         const value = Math.max(0, e.target.value);
//                         setUserInfo({
//                           ...userInfo,
//                           width: value,
//                           total_sq_ft: value * userInfo?.height,
//                         });
//                       }}
//                       onInput={(e) => {
//                         e.target.value = Math.max(0, e.target.value);
//                       }}
//                       value={userInfo?.width ? userInfo.width : ""}
//                     />
//                   </div>
//                   <div className="col-xl-4 col-md-4 col-sm-12 col-12 d-flex flex-row  gap-3 mt-4">
//                   <button className="action_btn w-25" onClick={addNewRow}> <PlusIcon/></button>
//                   <button className="action_btn w-25">       <DeleteIcon /></button>
//                 </div>

//                   {/* <div className="col-xl-1 col-md-1 col-sm-12 col-12">
//                     <div className="AddRowBtn">
                      
//                         <button
//                           title="Add Row"
//                           className="actionBtn"
//                         >
//                           <PlusIcon />
//                         </button>
                     
//                         <button
//                           title="Delete Row"
//                           className="actionBtn"
//                         >
//                           <DeleteIcon />
//                         </button>
                      
//                     </div>
//                   </div> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={getSiteList}>
//             SUBMIT
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelAgencySite;



// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import moment from "moment";
// import { hasCookie, getCookie } from "cookies-next";
// import axios from "axios";
// import { Baseurl } from "../../../Utils/Constants";
// import { toast } from "react-toastify";
// import DeleteIcon from "../../Svg/DeleteIcon";
// import PlusIcon from "../../Svg/PlusIcon";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   getSiteList,
//   stateId,
//   cityIds,
// }) => {
//   const [errorData, setErrorData] = useState({});
//   const [countrylist, setcountrylist] = useState([]);
//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);
//   const [statelist, setStatelist] = useState([]);
//   const [citylist, setCitylist] = useState([]);
//   const [rows, setRows] = useState([{ id: Date.now(), userInfo: {} }]);

//   const [userInfo, setUserInfo] = useState({
//     site_code: "",
//     acc_id: "",
//     site_cat_id: "",
//     country_id: "",
//     state_id: "",
//     city_id: "",
//     location: "",
//     m_f_id: "",
//     m_v_id: "",
//     m_t_id: "",
//     s_s_id: "",
//     traffic_from: "",
//     traffic_to: "",
//     position_of_site: "",
//     lat_long: "",
//     rating_id: "",
//     a_s_id: "",
//     available_from: "",
//     available_to: "",
//     remarks: "",
//     lease_from: "",
//     lease_to: "",
//     lease_period: null,
//     lease_cost: null,
//     width: "",
//     height: "",
//     quantity: "",
//     total_sq_ft: "",
//     selling_cost: "",
//     buying_cost: "",
//     leased_cost: "",
//     card_rate: "",
//     selling_cost_sq_ft: "",
//     buying_cost_sq_ft: "",
//     leased_cost_sq_ft: "",
//     card_rate_sq_ft: "",
//     selling_cost_day: "",
//     buying_cost_day: "",
//     leased_cost_day: "",
//     card_rate_day: "",
//     p_close_shot: "",
//     p_long_shot: "",
//     p_night_shot: "",
//     p_close_shot_preview: "",
//     p_long_shot_preview: "",
//     p_night_shot_preview: "",
//   });

//   async function fetchData(url, setData) {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const header = {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//         db: db_name,
//         pass: "pass",
//       },
//     };
//     try {
//       const response = await axios.get(Baseurl + url, header);
//       if (response.status === 204 || response.status === 200) {
//         setData(response.data.data);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//     }
//   }

//   const getMediaFormats = async () => {
//     await fetchData(
//       `/db/media/mediaFormat/getMediaFormat`,
//       setMediaFormats,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(
//       `/db/media/mediaVehicle/getMediaVehicle`,
//       setMediaVehicles,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getMediaTypes = async () => {
//     await fetchData(
//       `/db/media/mediaType/getMediaType`,
//       setMediaTypes,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getState = async () => {
//     await fetchData(
//       `/db/area/states?cnt_id=${101}`,
//       setStatelist,
//       errorToast,
//       setErrorData
//     );
//   };

//   const getCity = async (id) => {
//     await fetchData(
//       `/db/area/city?st_id=${id}`,
//       (data) => setCitylist(data.cityData),
//       errorToast,
//       setErrorData
//     );
//   };

//   useEffect(() => {
//     getState(userInfo?.country_id);
//   }, [userInfo?.country_id]);

//   useEffect(() => {
//     getCity(userInfo?.state_id);
//   }, [userInfo?.state_id]);

//   useEffect(() => {
//     getMediaFormats();
//     getMediaVehicles();
//     getMediaTypes();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const addNewRow = () => {
//     setRows([...rows, { id: Date.now(), userInfo: {} }]);
//   };

//   const removeRow = (id) => {
//     setRows(rows.filter(row => row.id !== id));
//   };

//   const handleChange = (e, index, field) => {
//     const { name, value } = e.target;
//     const updatedRows = [...rows];
//     updatedRows[index].userInfo[name] = value;
//     setRows(updatedRows);
//   };

//   return (
//     <>
//       <Modal show={show} onHide={handleClose3} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Offer Agency Site</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="d-flex py-5 gap-2" style={{ overflowX: "scroll" }}>
//               {rows.map((row, index) => (
//                 <div className="row" key={row.id}>
//                   <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                     <div className={errorData?.state_id ? "input_box errorBox" : "input_box"}>
//                       <label htmlFor={`state-${index}`}>State</label>
//                       <Select
//                         id={`state-${index}`}
//                         defaultValue={""}
//                         options={statelist?.map((data) => ({
//                           value: data?.state_id,
//                           label: data?.state_name,
//                         }))}
//                         value={statelist.find(data => userInfo.state_id === data.state_id) || ""}
//                         onChange={(e) => {
//                           const updatedRows = [...rows];
//                           updatedRows[index].userInfo.state_id = e.value;
//                           setRows(updatedRows);
//                           setErrorData({ ...errorData, state_id: "" });
//                         }}
//                         menuPosition="fixed"
//                         styles={{
//                           menu: (provided) => ({
//                             ...provided,
//                             zIndex: 9999,
//                           }),
//                         }}
//                       />
//                       <span className="errorText">
//                         {errorData?.state_id || ""}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                     <div className="input_box">
//                       <label htmlFor={`quantity-${index}`}>Quantity</label>
//                       <input
//                         type="number"
//                         name="quantity"
//                         placeholder="Enter Quantity"
//                         id={`quantity-${index}`}
//                         className="form-control"
//                         onChange={(e) => handleChange(e, index, 'quantity')}
//                         value={row.userInfo?.quantity || ""}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                     <div className="input_box">
//                       <label htmlFor={`price-${index}`}>Price</label>
//                       <input
//                         type="number"
//                         name="price"
//                         placeholder="Enter Price"
//                         id={`price-${index}`}
//                         className="form-control"
//                         onChange={(e) => handleChange(e, index, 'price')}
//                         value={row.userInfo?.price || ""}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                     <button className="action_btn w-25" onClick={addNewRow}>
//                       <PlusIcon />
//                     </button>
//                     {rows.length > 1 && (
//                       <button className="action_btn w-25" onClick={() => removeRow(row.id)}>
//                         <DeleteIcon />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose3}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => console.log(rows)}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelAgencySite;



// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import Select from "react-select";
// import moment from "moment";
// import { hasCookie, getCookie } from "cookies-next";
// import axios from "axios";
// import { Baseurl, filesUrl } from "../../../Utils/Constants";
// import { toast } from "react-toastify";
// import DeleteIcon from "../../Svg/DeleteIcon";
// import DisableIcon from "../../Svg/DisableIcon";
// import PlusIcon from "../../Svg/PlusIcon";

// const ModelAgencySite = ({
//   show,
//   handleClose3,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   getSiteList,
//   stateId,
//   cityIds,
// }) => {
//   const [errorData, setErrorData] = useState({});
//   const [countrylist, setCountryList] = useState([]);
//   const [mediaFormats, setMediaFormats] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);
//   const [mediaVehicles, setMediaVehicles] = useState([]);
//   const [mediaTypes, setMediaTypes] = useState([]);
//   const [statelist, setStatelist] = useState([]);
//   const [citylist, setCitylist] = useState([]);
//   const [rows, setRows] = useState([{ id: Date.now(), userInfo: {} }]);

//   const [userInfo, setUserInfo] = useState({
//     site_code: "",
//     acc_id: "",
//     site_cat_id: "",
//     country_id: "",
//     state_id: "",
//     city_id: "",
//     location: "",
//     m_f_id: "",
//     m_v_id: "",
//     m_t_id: "",
//     s_s_id: "",
//     traffic_from: "",
//     traffic_to: "",
//     position_of_site: "",
//     lat_long: "",
//     rating_id: "",
//     a_s_id: "",
//     available_from: "",
//     available_to: "",
//     remarks: "",
//     lease_from: "",
//     lease_to: "",
//     lease_period: null,
//     lease_cost: null,
//     width: "",
//     height: "",
//     quantity: "",
//     total_sq_ft: "",
//     selling_cost: "",
//     buying_cost: "",
//     leased_cost: "",
//     card_rate: "",
//     selling_cost_sq_ft: "",
//     buying_cost_sq_ft: "",
//     leased_cost_sq_ft: "",
//     card_rate_sq_ft: "",
//     state_name:"",
//     city_name:"",
//     selling_cost_day: "",
//     buying_cost_day: "",
//     leased_cost_day: "",
//     card_rate_day: "",
//     p_close_shot: "",
//     p_long_shot: "",
//     p_night_shot: "",
//     p_close_shot_preview: "",
//     p_long_shot_preview: "",
//     p_night_shot_preview: "",
//   });

//   async function fetchData(url, setData) {
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const header = {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//         db: db_name,
//         pass: "pass",
//       },
//     };
//     try {
//       const response = await axios.get(Baseurl + url, header);
//       if (response.status === 204 || response.status === 200) {
//         setData(response.data.data);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong!");
//     }
//   }

//   const getMediaFormats = async () => {
//     await fetchData(
//       "/db/media/mediaFormat/getMediaFormat",
//       setMediaFormats
//     );
//   };

//   const getMediaVehicles = async () => {
//     await fetchData(
//       "/db/media/mediaVehicle/getMediaVehicle",
//       setMediaVehicles
//     );
//   };

//   const getMediaTypes = async () => {
//     await fetchData(
//       "/db/media/mediaType/getMediaType",
//       setMediaTypes
//     );
//   };

//   const getState = async () => {
//     await fetchData(
//       `/db/area/states?cnt_id=${101}`,
//       setStatelist
//     );
//   };

//   const getCity = async (id) => {
//     await fetchData(
//       `/db/area/city?st_id=${id}`,
//       (data) => setCitylist(data.cityData)
//     );
//   };

//   useEffect(() => {
//     getState();
//   }, []);

//   useEffect(() => {
//     if (userInfo?.state_id) {
//       getCity(userInfo?.state_id);
//     }
//   }, [userInfo?.state_id]);

//   useEffect(() => {
//     getMediaFormats();
//     getMediaVehicles();
//     getMediaTypes();
//   }, []);

//   const addNewRow = () => {
//     setRows([...rows, { id: Date.now(), userInfo: {} }]);
//   };

//   const removeRow = (id) => {
//     setRows(rows.filter((row) => row.id !== id));
//   };

//   return (
//     <>
//       <Modal show={show} onHide={handleClose3} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Offer Agency Site</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <div className="add_user_form">
//             {rows.map((row) => (
//               <div key={row.id} className="d-flex py-5 gap-2" style={{ overflowX: "scroll" }}>
//                 <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className={errorData?.state_id ? "input_box errorBox" : "input_box"}>
//                     <label htmlFor={`state-${row.id}`}>State </label>
//                     <Select
//                       id={`state-${row.id}`}
//                       options={statelist?.map((data) => ({
//                         value: data?.state_id,
//                         label: data?.state_name,
//                       }))}
//                       value={statelist?.find((data) => userInfo.state_id === data.state_id) ? {
//                         value: userInfo.state_id,
//                         label: statelist.find((data) => data.state_id === userInfo.state_id)?.state_name
//                       } : null}
//                       onChange={(e) => {
//                         const selectedState = statelist.find((data) => data.state_id === e.value);

//                         setUserInfo({ ...userInfo, state_id: e.value ,
//                             state_name: selectedState ? selectedState.state_name : '',
//                         });
//                         setErrorData({ ...errorData, state_id: "" });
//                         console.log("user ",userInfo)
//                       }}
//                       menuPosition="fixed"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                         }),
//                       }}
//                     />
//                     <span className="errorText">
//                       {errorData?.state_id ? errorData.state_id : ""}
//                     </span>
//                   </div>
//                 </div>

//                 {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className={errorData?.city_id ? "input_box errorBox" : "input_box"}>
//                     <label htmlFor={`city-${row.id}`}>City </label>
//                     <Select
//                       id={`city-${row.id}`}
//                       options={citylist?.map((data) => ({
//                         value: data?.city_id,
//                         label: data?.city_name,
//                       }))}
//                       value={citylist?.find((data) => userInfo.city_id === data.city_id) ? {
//                         value: userInfo.city_id,
//                         label: citylist.find((data) => data.city_id === userInfo.city_id)?.city_name
//                       } : null}
//                       onChange={(e) => {
//                         const selectedcity= citylist.find((data) => data.city_id === e.value);

//                         setUserInfo({ ...userInfo, city_id: e.value,
//                             city_name: selectedcity ? selectedcity.city_name : '',
//                         });
//                         setErrorData({ ...errorData, city_id: "" });

//                         console.log("user is ","and ",userInfo)
//                       }}
//                       menuPosition="fixed"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                         }),
//                       }}
//                     />
//                     <span className="errorText">
//                       {errorData?.city_id ? errorData.city_id : ""}
//                     </span>
//                   </div>
//                 </div> */}

// <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//   <div className={errorData?.city_id ? "input_box errorBox" : "input_box"}>
//     <label htmlFor={`city-${row.id}`}>City </label>
//     <Select
//       id={`city-${row.id}`}
//       options={citylist?.map((data) => ({
//         value: data?.city_id,
//         label: data?.city_name,
//       }))}
//       value={citylist?.find((data) => data.city_id === userInfo.city_id) ? {
//         value: userInfo.city_id,
//         label: citylist.find((data) => data.city_id === userInfo.city_id)?.city_name
//       } : null}
//       onChange={(e) => {
//         const selectedCity = citylist.find((data) => data.city_id === e.value);

//         setUserInfo({
//           ...userInfo,
//           city_id: e.value,
//           city_name: selectedCity ? selectedCity.city_name : '',
//         });

//         setErrorData({
//           ...errorData,
//           city_id: "",
//         });

//         console.log("Updated userInfo: ", userInfo);
//       }}
//       menuPosition="fixed"
//       styles={{
//         menu: (provided) => ({
//           ...provided,
//           zIndex: 9999,
//         }),
//       }}
//     />
//     <span className="errorText">
//       {errorData?.city_id ? errorData.city_id : ""}
//     </span>
//   </div>
// </div>



//                 <div className="col-xl-3 col-md-3 col-sm-3 col-3">
//                   <div className="input_box">
//                     <label htmlFor={`location-${row.id}`}>Location</label>
//                     <input
//                       type="text"
//                       name="Location"
//                       placeholder="Enter Location "
//                       id={`location-${row.id}`}
//                       className="form-control"
//                       onChange={(e) =>
//                         setUserInfo({
//                           ...userInfo,
//                           location: e.target.value,
//                         })
//                       }
//                       value={userInfo?.location || ""}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className={errorData?.m_f_id ? "input_box errorBox" : "input_box"}>
//                     <label htmlFor={`media_format-${row.id}`}>Media Format</label>
//                     <Select
//                       id={`media_format-${row.id}`}
//                       options={mediaFormats?.map((item) => ({
//                         value: item.m_f_id,
//                         label: item.m_f_name,
//                       }))}
//                       value={mediaFormats?.find((item) => userInfo?.m_f_id === item.m_f_id) ? {
//                         value: userInfo?.m_f_id,
//                         label: mediaFormats.find((item) => item.m_f_id === userInfo?.m_f_id)?.m_f_name
//                       } : null}
//                       onChange={(e) => {
//                         setUserInfo({
//                           ...userInfo,
//                           m_f_id: e.value,
//                         });
//                         setErrorData({ ...errorData, m_f_id: "" });
//                       }}
//                       menuPosition="fixed"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                         }),
//                       }}
//                     />
//                     <span className="errorText">
//                       {errorData?.m_f_id ? errorData.m_f_id : ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className={errorData?.m_v_id ? "input_box errorBox" : "input_box"}>
//                     <label htmlFor={`media_vehicle-${row.id}`}>Media Vehicle</label>
//                     <Select
//                       id={`media_vehicle-${row.id}`}
//                       options={mediaVehicles?.map((item) => ({
//                         value: item.m_v_id,
//                         label: item.m_v_name,
//                       }))}
//                       value={mediaVehicles?.find((item) => userInfo?.m_v_id === item.m_v_id) ? {
//                         value: userInfo?.m_v_id,
//                         label: mediaVehicles.find((item) => item.m_v_id === userInfo?.m_v_id)?.m_v_name
//                       } : null}
//                       onChange={(e) => {
//                         setUserInfo({
//                           ...userInfo,
//                           m_v_id: e.value,
//                         });
//                         setErrorData({ ...errorData, m_v_id: "" });
//                       }}
//                       menuPosition="fixed"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                         }),
//                       }}
//                     />
//                     <span className="errorText">
//                       {errorData?.m_v_id ? errorData.m_v_id : ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className={errorData?.m_t_id ? "input_box errorBox" : "input_box"}>
//                     <label htmlFor={`media_type-${row.id}`}>Media Type</label>
//                     <Select
//                       id={`media_type-${row.id}`}
//                       options={mediaTypes?.map((item) => ({
//                         value: item.m_t_id,
//                         label: item.m_t_name,
//                       }))}
//                       value={mediaTypes?.find((item) => userInfo?.m_t_id === item.m_t_id) ? {
//                         value: userInfo?.m_t_id,
//                         label: mediaTypes.find((item) => item.m_t_id === userInfo?.m_t_id)?.m_t_name
//                       } : null}
//                       onChange={(e) => {
//                         setUserInfo({
//                           ...userInfo,
//                           m_t_id: e.value,
//                         });
//                         setErrorData({ ...errorData, m_t_id: "" });
//                       }}
//                       menuPosition="fixed"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                         }),
//                       }}
//                     />
//                     <span className="errorText">
//                       {errorData?.m_t_id ? errorData.m_t_id : ""}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Add other fields as required */}

//                 <Button
//                   variant="danger"
//                   onClick={() => removeRow(row.id)}
//                   className="mt-2"
//                 >
//                   <DeleteIcon />
//                 </Button>
//               </div>
//             ))}

//             <Button
//               variant="primary"
//               onClick={addNewRow}
//               className="mt-3"
//             >
//               <PlusIcon /> Add New Row
//             </Button>
//           </div>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose3}>
//             Close
//           </Button>
//           <Button variant="primary">Save Changes</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelAgencySite;
