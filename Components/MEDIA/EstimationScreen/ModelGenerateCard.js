import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Baseurl } from '../../../Utils/Constants';

const ModelGenerateCard = ({ show, handleClose, estimateID, businessType, getSingleData }) => {
  const [selectedVendors, setSelectedVendors] = useState({
    printing: false,
    mounting: false,
    display: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedVendors((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleGenerateCard = async() => {
    const selectedTypes = [];

    if (selectedVendors.printing) {
      selectedTypes.push("13");
    }
    if (selectedVendors.mounting) {
      selectedTypes.push("14" );
    }
    if (selectedVendors.display) {
      businessType == 1 ? selectedTypes.push("12") :selectedTypes.push("10")
    }

    if (selectedTypes.length === 0) {
      toast.warning('Please select at least one vendor.',{autoClose:1500});
      return;
    }

    const payload = {
      estimate_id:estimateID,
      types: selectedTypes,
    };

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
            `/db/media/jobCard/addJobCard`,
            payload,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          handleClose(); // Close the modal after generating the card
          setSelectedVendors({})
          getSingleData(estimateID)
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }

    // Call your function to send the payload
   


    
    
    
   
  };

  return (
    <Modal className="commonModal" show={show} onHide={()=>{
      handleClose()
      setSelectedVendors({})
    }}>
      <Modal.Header closeButton>
        <Modal.Title>Generate Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="checkbox"
            label="Printing Vendors"
            name="printing"
            checked={selectedVendors.printing}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Mounting Vendors"
            name="mounting"
            checked={selectedVendors.mounting}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Display Vendors"
            name="display"
            checked={selectedVendors.display}
            onChange={handleCheckboxChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGenerateCard}>
          Generate Card
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelGenerateCard;