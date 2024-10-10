import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { Baseurl } from "../../../Utils/Constants"; // Adjust path as needed
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import { getCookie } from "cookies-next";

const ModelAgencySite = ({
  show,
  handleClose3,
  // getSiteList,
  userInfo,
  estimateId,
}) => {
  const [rows, setRows] = useState([
    {
      state: "",
      state_name: "",
      city: "",
      city_name: "",
      location: "",
      mediaFormat: "",
      mediaVehicle: "",
      mediaType: "",
      quantity: "",
      height: "",
      width: "",
      totalSqFt: "",
      clientDisplayCost: "",
      clientMountingCost: "",
      clientPrintingCost: "",
    },
  ]);

  const [mediaFormats, setMediaFormats] = useState([]);
  const [mediaVehicles, setMediaVehicles] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

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
      const response = await fetchData(
        `/db/area/states?cnt_id=${countryId}`,
        "data"
      );
      if (response.status === 200) {
        const states = response.data.map((state) => ({
          value: state.state_id,
          label: state.state_name,
        }));
        setStateList(states);
        setCityList([]); // Reset cities when states are fetched
      }
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  };

  const getCities = async (stateId) => {
    try {
      const response = await fetchData(
        `/db/area/city?st_id=${stateId}`,
        "data"
      );
      if (response.status === 200) {
        const cities = response.data.cityData.map((city) => ({
          value: city.city_id,
          label: city.city_name,
        }));
        setCityList(cities);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const getMediaFormats = async () => {
    await fetchData(`/db/media/mediaFormat/getMediaFormat`, "data").then(
      (response) => {
        const formats = response.data.map((format) => ({
          value: format.m_f_id,
          label: format.m_f_name,
        }));
        setMediaFormats(formats);
      }
    );
  };

  const getMediaVehicles = async () => {
    await fetchData(`/db/media/mediaVehicle/getMediaVehicle`, "data").then(
      (response) => {
        const vehicles = response.data.map((vehicle) => ({
          value: vehicle.m_v_id,
          label: vehicle.m_v_name,
        }));
        setMediaVehicles(vehicles);
      }
    );
  };

  const getMediaTypes = async () => {
    await fetchData(`/db/media/mediaType/getMediaType`, "data").then(
      (response) => {
        const types = response.data.map((type) => ({
          value: type.m_t_id,
          label: type.m_t_name,
        }));
        setMediaTypes(types);
      }
    );
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

  useEffect(() => {
    if (!show) {
      setRows([
        {
          state: "",
          state_name: "",
          city: "",
          city_name: "",
          location: "",
          mediaFormat: "",
          mediaVehicle: "",
          mediaType: "",
          quantity: "",
          height: "",
          width: "",
          totalSqFt: "",
          clientDisplayCost: "",
          clientMountingCost: "",
          clientPrintingCost: "",
        },
      ]);
    }
  }, [show]);

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setError("");

  //   const token = getCookie("token");
  //   const db_name = getCookie("db_name");

  //   const headers = {
  //     Accept: "application/json",
  //     Authorization: `Bearer ${token}`,
  //     db: db_name,
  //     m_id:439,
  //     "Content-Type": "application/json",
  //   };

  //   // Transform rows to include values instead of IDs
  //   const transformedRows = rows.map((row) => ({
  //     country_id: "India",
  //     estimate_id: estimateId,
  //     state_id: row.state_name,
  //     // state_name: row.state_name,
  //     city_id: row.city_name,
  //     // city_name: row.city_name,
  //     location: row.location,
  //     m_f_id:
  //       mediaFormats.find((option) => option.value === row.mediaFormat)
  //         ?.label || "",

  //     m_v_id:
  //       mediaVehicles.find((option) => option.value === row.mediaVehicle)
  //         ?.label || "",

  //     m_t_id:
  //       mediaTypes.find((option) => option.value === row.mediaType)?.label ||
  //       "",

  //     quantity: row.quantity,
  //     height: row.height,
  //     width: row.width,
  //     total_sqft: row.totalSqFt,
  //     client_display_cost: row.clientDisplayCost,
  //     client_mounting_cost: row.clientMountingCost,
  //     client_printing_cost: row.clientPrintingCost,
  //   }));

  //   try {
  //     const response = await axios.post(
  //       `${Baseurl}/db/media/estimationAgencyBusiness/addSitesForAgencyEstimates`,
  //       { sites: transformedRows },
  //       { headers }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Data saved successfully!");
  //       // getSiteList();
  //       handleClose3();
  //     } else {
  //       toast.error("Failed to save data. Please try again.");
  //     }
  //   } catch (error) {
  //     setError(error?.response?.data?.message || "Something went wrong!");
  //     toast.error(error?.response?.data?.message || "Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const handleSubmit = async () => {
    setLoading(true);
    let hasError = false;
    const newError = {};
  
    // Loop through each row to check if required fields are filled
    rows.forEach((row, index) => {
      if (!row.state) {
        newError[`state-${index}`] = "State is required";
        hasError = true;
      }
      if (!row.city) {
        newError[`city-${index}`] = "City is required";
        hasError = true;
      }
      if (!row.location) {
        newError[`location-${index}`] = "Location is required";
        hasError = true;
      }
      if (!row.mediaFormat) {
        newError[`mediaFormat-${index}`] = "Media Format is required";
        hasError = true;
      }
      if (!row.mediaVehicle) {
        newError[`mediaVehicle-${index}`] = "Media Vehicle is required";
        hasError = true;
      }
      if (!row.mediaType) {
        newError[`mediaType-${index}`] = "Media Type is required";
        hasError = true;
      }
      if (!row.quantity) {
        newError[`quantity-${index}`] = "Quantity is required";
        hasError = true;
      }
      if (!row.height) {
        newError[`height-${index}`] = "Height is required";
        hasError = true;
      }
      if (!row.width) {
        newError[`width-${index}`] = "Width is required";
        hasError = true;
      }
      if (!row.clientDisplayCost) {
        newError[`clientDisplayCost-${index}`] = "Display Cost is required";
        hasError = true;
      }
      if (!row.clientMountingCost) {
        newError[`clientMountingCost-${index}`] = "Mounting Cost is required";
        hasError = true;
      }
      if (!row.clientPrintingCost) {
        newError[`clientPrintingCost-${index}`] = "Printing Cost is required";
        hasError = true;
      }
    });
  
    if (hasError) {
      setError(newError);
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }
  
    // Proceed with submission if no errors
    const token = getCookie("token");
    const db_name = getCookie("db_name");
  
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      db: db_name,
      pass:"pass",
      "Content-Type": "application/json",
    };
  
    const transformedRows = rows.map((row) => ({
      country_id: "India", 
      estimate_id: estimateId,
      state_id: row.state_name,
      city_id: row.city_name,
      location: row.location,
      m_f_id: mediaFormats.find((option) => option.value === row.mediaFormat)?.label || "",
      m_v_id: mediaVehicles.find((option) => option.value === row.mediaVehicle)?.label || "",
      m_t_id: mediaTypes.find((option) => option.value === row.mediaType)?.label || "",
      quantity: row.quantity,
      height: row.height,
      width: row.width,
      total_sqft: row.totalSqFt,
      client_display_cost: row.clientDisplayCost,
      client_mounting_cost: row.clientMountingCost,
      client_printing_cost: row.clientPrintingCost,
    }));

  
    try {
      const response = await axios.post(
        `${Baseurl}/db/media/estimationAgencyBusiness/addSitesForAgencyEstimates`,
        { sites: transformedRows },
        { headers }
      );
  
      if (response.status === 200) {
        toast.success("Data saved successfully!");
        handleClose3();
      } else {
        toast.error("Failed to save data. Please try again.");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong!");
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];

    // Update the specific field
    updatedRows[index] = { ...updatedRows[index], [name]: value };

    // Recalculate Total SqFt if Height or Width changes
    if (name === "height" || name === "width") {
      const height = parseFloat(updatedRows[index].height) || 0;
      const width = parseFloat(updatedRows[index].width) || 0;
      updatedRows[index].totalSqFt = (height * width).toFixed(2);
    }

    setRows(updatedRows);
  };

  const handleSelectChange = (index, fieldName, selectedOption) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [fieldName]: selectedOption ? selectedOption.value : "",
      [`${fieldName}_name`]: selectedOption ? selectedOption.label : "",
    };

    // Reset Media Vehicle if Media Format is cleared
    if (fieldName === "mediaFormat" && !selectedOption) {
      updatedRows[index].mediaVehicle = "";
    }

    setRows(updatedRows);

    // Fetch Media Vehicles if Media Format is selected
    if (fieldName === "mediaFormat" && selectedOption) {
      getMediaVehicles();
    }

    // Get Cities when State changes
    if (fieldName === "state") {
      updatedRows[index].city = ""; // Reset city when state changes
      updatedRows[index].city_name = "";
      setRows(updatedRows);
      getCities(selectedOption ? selectedOption.value : "");
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        state: "",
        state_name: "",
        city: "",
        city_name: "",
        location: "",
        mediaFormat: "",
        mediaVehicle: "",
        mediaType: "",
        quantity: "",
        height: "",
        width: "",
        totalSqFt: "",
        clientDisplayCost: "",
        clientMountingCost: "",
        clientPrintingCost: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (index !== 0) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  return (
    <Modal show={show} onHide={handleClose3} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Agency Site Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <div className="add_user_form">
//           <form>
            <div className="overflow-auto">
              <div className="d-flex flex-column"> */}
        <div className="add_user_form">
          <form>
            <div className="overflow-auto">
              <div className="d-flex flex-column">
                {rows.map((row, index) => (
                  <div key={index} className="row mb-3">
                    <div className="d-flex flex-nowrap">
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`state-${index}`}>State*</label>
                          <Select
                            id={`state-${index}`}
                            isClearable
                            options={stateList}
                            value={stateList.find(
                              (option) => option.value === row.state
                            )}
                            onChange={(option) =>
                              handleSelectChange(index, "state", option)
                            }
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {error[`state-${index}`] && <span className="text-danger">{error[`state-${index}`]}</span>}
                        </div>
                      </div>
                      {/* <input
                type="text"
                className="form-control mt-2"
                value={row.state_name}
                readOnly
              /> */}

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`city-${index}`}>City*</label>
                          <Select
                            id={`city-${index}`}
                            isDisabled={!row.state}
                            isClearable
                            options={cityList}
                            value={cityList.find(
                              (option) => option.value === row.city
                            )}
                            onChange={(option) =>
                              handleSelectChange(index, "city", option)
                            }
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {error[`city-${index}`] && <span className="text-danger">{error[`city-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`location-${index}`}>Location*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="location"
                            placeholder="Enter Location"
                            value={row.location}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`location-${index}`] && <span className="text-danger">{error[`location-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`mediaFormat-${index}`}>
                            Media Format*
                          </label>
                          <Select
                            id={`mediaFormat-${index}`}
                            isClearable
                            options={mediaFormats}
                            value={mediaFormats.find(
                              (option) => option.value === row.mediaFormat
                            )}
                            onChange={(option) =>
                              handleSelectChange(index, "mediaFormat", option)
                            }
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {error[`mediaFormat-${index}`] && <span className="text-danger">{error[`mediaFormat-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`mediaVehicle-${index}`}>
                            Media Vehicle*
                          </label>
                          <Select
                            id={`mediaVehicle-${index}`}
                            isClearable
                            options={mediaVehicles}
                            value={mediaVehicles.find(
                              (option) => option.value === row.mediaVehicle
                            )}
                            onChange={(option) =>
                              handleSelectChange(index, "mediaVehicle", option)
                            }
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {error[`mediaVehicle-${index}`] && <span className="text-danger">{error[`mediaVehicle-${index}`]}</span>}
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`mediaType-${index}`}>
                            Media Type*
                          </label>
                          <Select
                            id={`mediaType-${index}`}
                            isClearable
                            options={mediaTypes}
                            value={mediaTypes.find(
                              (option) => option.value === row.mediaType
                            )}
                            onChange={(option) =>
                              handleSelectChange(index, "mediaType", option)
                            }
                            menuPosition="fixed"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {error[`mediaType-${index}`] && <span className="text-danger">{error[`mediaType-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`quantity-${index}`}>Quantity*</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Quantity"
                            name="quantity"
                            value={row.quantity}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`quantity-${index}`] && <span className="text-danger">{error[`quantity-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`height-${index}`}>Height*</label>
                          <input
                            type="number"
                            className="form-control"
                            name="height"
                            placeholder="Enter Height"
                            value={row.height}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`height-${index}`] && <span className="text-danger">{error[`height-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`width-${index}`}>Width*</label>
                          <input
                            type="number"
                            className="form-control"
                            name="width"
                            placeholder="Enter Width"
                            value={row.width}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`width-${index}`] && <span className="text-danger">{error[`width-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`totalSqFt-${index}`}>
                            Total Sq Ft*
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Total SqFt"
                            name="totalSqFt"
                            value={row.totalSqFt}
                            disabled
                            readOnly
                          />
                          {error[`totalSqFt-${index}`] && <span className="text-danger">{error[`totalSqFt-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`clientDisplayCost-${index}`}>
                            Client Display Cost / Sq. Ft*
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Display Cost"
                            name="clientDisplayCost"
                            value={row.clientDisplayCost}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`clientDisplayCost-${index}`] && <span className="text-danger">{error[`clientDisplayCost-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`clientMountingCost-${index}`}>
                            Client Mounting Cost / Sq. Ft*
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="clientMountingCost"
                            placeholder="Enter Mounting Cost"
                            value={row.clientMountingCost}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`clientMountingCost-${index}`] && <span className="text-danger">{error[`clientMountingCost-${index}`]}</span>}
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
                        <div className="input_box">
                          <label htmlFor={`clientPrintingCost-${index}`}>
                            Client Printing Cost / Sq. Ft*
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Printing Cost"
                            name="clientPrintingCost"
                            value={row.clientPrintingCost}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                          />
                          {error[`clientPrintingCost-${index}`] && <span className="text-danger">{error[`clientPrintingCost-${index}`]}</span>}
                        </div>
                      </div>
                      {index !== 0 && (
                        <div className="col-md-12 mb-3">
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveRow(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="primary" onClick={handleAddRow}>
              Add Row
            </Button>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose3}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelAgencySite;
