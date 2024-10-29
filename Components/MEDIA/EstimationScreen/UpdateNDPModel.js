import React, { useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'

const UpdateNDPModel = ({id,assetSiteLists,show,handleClose}) => {
    const [isLoading,setIsLoading] = useState(false)
  return (
    <>
     <Modal  show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Asset Sites</Modal.Title>
        </Modal.Header>
                <Modal.Body>
                {assetSiteLists?.filter((item) => item.status == true)
                          .length > 0 ? (
                          <Table bordered hover responsive>
                            <thead>
                              <tr>
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
                                ?.filter((item) => item.status == true)
                                ?.map((site) => (
                                  <tr key={site.site_id}>
                                    <td>{site.site_id}</td>
                                    <td>
                                      {site?.db_site?.db_state?.state_name}
                                    </td>
                                    <td>{site?.db_site?.db_city?.city_name}</td>
                                    <td>{site?.db_site?.location}</td>
                                    <td>
                                      {
                                        site?.db_site?.db_site_category
                                          ?.site_cat_name
                                      }
                                    </td>
                                    <td>
                                      {site?.db_site?.db_media_format?.m_f_name}
                                    </td>
                                    <td>
                                      {
                                        site?.db_site?.db_media_vehicle
                                          ?.m_v_name
                                      }
                                    </td>
                                    <td>
                                      {site?.db_site?.db_media_type?.m_t_name}
                                    </td>
                                    <td>{site?.db_site.quantity}</td>
                                    <td>{site?.db_site.height}</td>
                                    <td>{site?.db_site.width}</td>
                                    <td>
                                      {site?.db_site.height *
                                        site?.db_site.width}
                                    </td>
                                    
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
          >
            {isLoading ? "Loading..." : "Next"}
          </Button>
        </Modal.Footer>
      </Modal>

                        
                      

    </>
  )
}

export default UpdateNDPModel