import React, { useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import NDPDetailsModal from './NDPDetailsModal';

const UpdateNDPModel = ({ id,assetSiteLists, show, handleClose }) => {
  const [selectedSites, setSelectedSites] = useState([]);
  const [showNDPModal, setShowNDPModal] = useState(false);

  const handleSiteSelect = (siteId) => {
    setSelectedSites((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const handleNext = () => {
    if (selectedSites.length > 0) {
      setShowNDPModal(true); // Show the NDP Details Modal
    }
  };

  return (
    <>
      <Modal show={show} onHide={()=>{
        setSelectedSites([])
        handleClose()
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Asset Sites</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assetSiteLists?.filter((item) => item.status === true).length > 0 ? (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Site ID</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Media Format</th>
                  <th>Media Vehicle</th>
                  <th>Media Type</th>
                  <th>Quantity</th>
                  <th>Height (Ft.)</th>
                  <th>Width (Ft.)</th>
                  <th>Total Sq. Ft.</th>
                </tr>
              </thead>
              <tbody>
                {assetSiteLists
                  ?.filter((item) => item.status === true)
                  ?.map((site) => (
                    <tr key={site.site_id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedSites.includes(site.site_id)}
                          onChange={() => handleSiteSelect(site.site_id)}
                        />
                      </td>
                      <td>{site?.db_site?.site_code}</td>
                      <td>{site?.db_site?.db_state?.state_name}</td>
                      <td>{site?.db_site?.db_city?.city_name}</td>
                      <td>{site?.db_site?.location}</td>
                      <td>{site?.db_site?.db_site_category?.site_cat_name}</td>
                      <td>{site?.db_site?.db_media_format?.m_f_name}</td>
                      <td>{site?.db_site?.db_media_vehicle?.m_v_name}</td>
                      <td>{site?.db_site?.db_media_type?.m_t_name}</td>
                      <td>{site?.db_site.quantity}</td>
                      <td>{site?.db_site.height}</td>
                      <td>{site?.db_site.width}</td>
                      <td>{site?.db_site.height * site?.db_site.width}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <p>No sites available</p>
          )}
        </Modal.Body>

        {/* Footer with Next button */}
        <Modal.Footer>
          <Button variant="primary" disabled={selectedSites.length === 0} onClick={handleNext}>
            Next
          </Button>
        </Modal.Footer>

      </Modal>

      {/* NDP Details Modal */}
      {showNDPModal && (
        <NDPDetailsModal 
          selectedSites={selectedSites}
          setSelectedSites={setSelectedSites}
          show={showNDPModal}
          handleClose={() => setShowNDPModal(false)}
        />
      )}
    </>
  );
};

export default UpdateNDPModel