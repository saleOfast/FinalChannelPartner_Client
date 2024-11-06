// import React from 'react'
// import { Button, Modal } from 'react-bootstrap';
// import Select from 'react-select';

// const ModelAssetSite1 = ({show,handleClose,stateList,setStateId,setCityIds,cityList,getSiteList,stateId,cityIds,setStartDate,setEndDate,min,max}) => {
//   return (
//     <>
//          <Modal className="commonModal" show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Offer Asset Site</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               <div className="col-xl-12 col-md-12 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="state">State *</label>
//                   <Select
//                     id="state"
//                     value={stateList
//                       .map((item) => ({
//                         value: item.state_id,
//                         label: item.state_name,
//                       }))
//                       .find((option) => option.value === stateId)}
//                     options={stateList.map((state) => ({
//                       value: state.state_id,
//                       label: state.state_name,
//                     }))}
//                     onChange={(e) => {
//                       setStateId(e.value);
//                       setCityIds([]);
//                     }}
//                     placeholder="Select State"
//                   />
//                 </div>
//               </div>
//               <div className="col-xl-12 col-md-12 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="cities">Cities *</label>
//                   <Select
//                     id="cities"
//                     isMulti
//                     value={cityList
//                       .filter((city) => cityIds.includes(city.city_id))
//                       .map((city) => ({
//                         value: city.city_id,
//                         label: city.city_name,
//                       }))}
//                     options={cityList.map((city) => ({
//                       value: city.city_id,
//                       label: city.city_name,
//                     }))}
//                     onChange={(selectedOptions) => {
//                       setCityIds(selectedOptions.map((option) => option.value));
//                     }}
//                     placeholder="Select Cities"
//                   />
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
//   )
// }

// export default ModelAssetSite1


import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

const ModelAssetSite1 = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  getSiteList,
  stateId,
  cityIds,
  setStartDate,
  setEndDate,
  min,
  max,
  setDuration,
  duration
}) => {
  const [startDate, setLocalStartDate] = useState('');
  const [endDate, setLocalEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setDuration(durationInDays);
    } else {
      setDuration('');
    }
  }, [startDate, endDate]);

  return (
    <>
      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Offer Asset Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="state">State *</label>
                  <Select
                    id="state"
                    value={stateList
                      .map((item) => ({
                        value: item.state_id,
                        label: item.state_name,
                      }))
                      .find((option) => option.value === stateId)}
                    options={stateList.map((state) => ({
                      value: state.state_id,
                      label: state.state_name,
                    }))}
                    onChange={(e) => {
                      setStateId(e.value);
                      setCityIds([]);
                    }}
                    placeholder="Select State"
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="cities">Cities *</label>
                  <Select
                    id="cities"
                    isMulti
                    value={cityList
                      .filter((city) => cityIds.includes(city.city_id))
                      .map((city) => ({
                        value: city.city_id,
                        label: city.city_name,
                      }))}
                    options={cityList.map((city) => ({
                      value: city.city_id,
                      label: city.city_name,
                    }))}
                    onChange={(selectedOptions) => {
                      setCityIds(selectedOptions.map((option) => option.value));
                    }}
                    placeholder="Select Cities"
                  />
                </div>
              </div>
              {/* Start Date Field */}
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="start-date">Start Date *</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    className="form-control"
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setLocalStartDate(selectedDate);
                      setStartDate(selectedDate);
                    }}
                    min={min}
                    max={max}
                  />
                </div>
              </div>
              {/* End Date Field */}
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="end-date">End Date *</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    className="form-control"
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setLocalEndDate(selectedDate);
                      setEndDate(selectedDate);
                    }}
                    disabled={!startDate}
                    min={startDate} // Ensure end date is after start date
                    max={max}
                  />
                </div>
              </div>
              {/* Duration Display */}
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <label>Duration (Days):</label>
                    <input
                    type="texr"
                    id="end-date"
                    disabled
                    value={duration}
                    className="form-control"
                  />
                  </div>
                </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={getSiteList}>
            SUBMIT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelAssetSite1;