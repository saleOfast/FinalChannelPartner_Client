import React from 'react'
import { Button, Modal, Table } from 'react-bootstrap';

const ModelAssetSite2 = ({ show2,
    handleClose2,
    siteLists = [],
    isLoading,
    selectedSites = [], // Default to an empty array if undefined
    addAssetInSite,
    handleSelectSite,}) => {
  return (
    <>
        <Modal  show={show2} onHide={handleClose2} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Offer Asset Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {siteLists.length > 0 ? (
            <Table striped bordered hover responsive>
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
                {siteLists.map((site) => (
                  <tr key={site.site_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.site_id)}
                        onChange={() => handleSelectSite(site.site_id)}
                      />
                    </td>
                    <td>{site.site_id}</td>
                    <td>{site?.db_state?.state_name}</td>
                    <td>{site?.db_city?.city_name}</td>
                    <td>{site.location}</td>
                    <td>{site?.db_site_category?.site_cat_name}</td>
                    <td>{site?.db_media_format?.m_f_name}</td>
                    <td>{site?.db_media_vehicle?.m_v_name}</td>
                    <td>{site?.db_media_type?.m_t_name}</td>
                    <td>{site.quantity}</td>
                    <td>{site.height}</td>
                    <td>{site.width}</td>
                    <td>{site.total_area}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No sites available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => {
              const formattedSites = selectedSites.map((site_id) => ({
                site_id,
                status: true,
              }));
                addAssetInSite(formattedSites)                      
            }}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModelAssetSite2