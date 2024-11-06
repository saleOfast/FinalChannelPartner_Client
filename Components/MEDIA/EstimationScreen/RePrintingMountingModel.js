import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useRouter } from 'next/router';
import { fetchData } from '../../../Utils/getReq';
import { toast } from 'react-toastify';
import { getCookie, hasCookie } from 'cookies-next';
import { Baseurl } from '../../../Utils/Constants';


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
      toast.warning('Please select an option before saving.',{autoClose:1500});
      return;
    }

    console.log(selectedOption)
    console.log(id)

    setIsLoading(true);
    
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          // m_id:444
          pass:"pass"
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimation/addReprintEstimate`,
          {
            estimate_id: id,
            ndp_r_id: selectedOption,
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          router.push('/media/Estimations'); 
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
      finally {
        setIsLoading(false);
        setShowRePrMo(false); // Close the modal after operation
        setSelectedOption(null)
      }
    }
  };

  return (
    <Modal show={show} onHide={() =>{
       setShowRePrMo(false)
       setSelectedOption(null)
       }} size="md">
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
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowRePrMo(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={()=>{
          handleSave()
        }}  disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RePrintingMountingModel;