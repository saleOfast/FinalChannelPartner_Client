import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

const ModelAssetSite1 = ({show,handleClose,stateList,setStateId,setCityIds,cityList,getSiteList,stateId,cityIds}) => {
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
  )
}

export default ModelAssetSite1