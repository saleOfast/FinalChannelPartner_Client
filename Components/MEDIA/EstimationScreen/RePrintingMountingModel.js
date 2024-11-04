import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useRouter } from 'next/router';
import { fetchData } from '../../../Utils/getReq';


const RePrintingMountingModel = ({ id, show, setShowRePrMo }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reasons,setReasons] = useState();
  const router = useRouter();
  const [errorToast, setErrorToast] = useState({});

  async function getNDPReasons() {
    await fetchData(
      `/db/media/ndpReason/getNDPReason`,
      setReasons,
      errorToast,
      setErrorToast
    );
  }

  useEffect(()=>{
    if(id){
      getNDPReasons();
    }
  },[id])


  const handleSave = async () => {
    if (!selectedOption) {
      alert('Please select an option before saving.');
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your API endpoint
      const response = await axios.post('/api/reprinting', {
        id,
        reason: selectedOption.value,
      });
      
      if (response.status === 200) {
        router.push('/Estimations'); 
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsLoading(false);
      setShowRePrMo(false); // Close the modal after operation
    }
  };

  return (
    <Modal show={show} onHide={() => setShowRePrMo(false)} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Re-Printing Mounting</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Select
         value={reasons?.map((item)=>{
          if(selectedOption == item?.ndp_r_id){
            return {
              value: item?.ndp_r_id,
              label: item?.ndp_r_name,
              }
          }
        })}
          onChange={(e)=>{
            setSelectedOption(e.value)
          }}
          options={reasons?.map((item)=>{
            return {
              value: item?.ndp_r_id,
              label: item?.ndp_r_name,
              }
          })}
          placeholder="Select a reason..."
          isClearable
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowRePrMo(false)}>
          Cancel
        </Button>
        <Button variant="primary"  disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RePrintingMountingModel;