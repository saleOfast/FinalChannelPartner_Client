import React from 'react'
import { Table } from 'react-bootstrap'
import EditIcon from '../../Svg/EditIcon'
import DeleteIcon from '../../Svg/DeleteIcon'
import ModelEditAgencySite from './ModelEditAgencySite'
import ConfirmBox from "../../Basics/ConfirmBox";
import AgencyClientCostSheet from './AgencyClientCostSheet'
import AgencyVendorCostSheet from './AgencyVendorCostSheet'

const AgencySites = ({busiessTypeList,userInfo,deleteshowConfirm,setdeleteshowConfirm,deleteAgencySite,agencySiteLists,viewMode,show,setGetAgencyData,handleClose,getAgencyData,agencySiteData,setAgencySiteData,setShow,setDeleteSiteAgencyId,id}) => {
  return (
    <>
        {busiessTypeList?.find(
                  (item) =>
                    item?.cmpn_b_t_id ==
                    userInfo?.db_media_campaign?.cmpn_b_t_id
                )?.cmpn_b_t_name == "Agency" && (
                  <>
                    <ConfirmBox
                      showConfirm={deleteshowConfirm}
                      setshowConfirm={setdeleteshowConfirm}
                      actionType={deleteAgencySite}
                      title={"Are You Sure you want to Delete ?"}
                    />
                    <div className="add_screen_head">
                      <span className="text_bold">Agency Sites</span>
                    </div>
                    <div className="add_user_form">
                      <div className="row ">
                        {agencySiteLists?.filter((item) => item.status == true)
                          .length > 0 ? (
                          <Table bordered hover responsive>
                            <thead>
                              <tr>
                                <th>Site ID</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Location</th>
                                <th>Media Format</th>
                                <th>Media Vehicle</th>
                                <th>Media Type</th>
                                <th>Quantity</th>
                                <th>Height (Ft.)</th>
                                <th>Width (Ft.)</th>
                                <th>Total Sq. Ft.</th>
                                <th>Client Display Cost / Sq. Ft.</th>
                                <th>Client Mounting Cost / Sq. Ft.</th>
                                <th>Client Printing Cost / Sq. Ft.</th>
                                {!viewMode && (
                                  <>
                                    {/* <th>Edit</th>
                                    <th>Delete</th> */}
                                    <th>Actions</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {agencySiteLists
                                ?.filter((item) => item.status == true)
                                ?.map((site) => (
                                  <tr key={site.site_id}>
                                    <td>{site.site_id}</td>
                                    <td>{site?.state_id}</td>
                                    <td>{site?.city_id}</td>
                                    <td>{site?.location}</td>

                                    <td>{site?.m_f_id}</td>
                                    <td>{site?.m_v_id}</td>
                                    <td>{site?.m_t_id}</td>
                                    <td>{site?.quantity}</td>
                                    <td>{site?.height}</td>
                                    <td>{site?.width}</td>
                                    <td>{site?.height * site?.width}</td>
                                    <td>{site?.client_display_cost}</td>
                                    <td>{site?.client_mounting_cost}</td>
                                    <td>{site?.client_printing_cost}</td>

                                    {!viewMode ? (
                                      <td className="table_btns d-flex">
                                        <button
                                          className="action_btn"
                                          title="Edit"
                                          onClick={() => {
                                            setAgencySiteData(site);
                                            setShow(true);
                                          }}
                                        >
                                          <EditIcon />
                                        </button>
                                        <button
                                          className="action_btn"
                                          title="Delete"
                                          onClick={() => {
                                            setdeleteshowConfirm(true);
                                            setDeleteSiteAgencyId(site.site_id);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </button>
                                      </td>
                                    ) : (
                                      ""
                                    )}

                                    {/* {!viewMode ? (
                                      <td className="table_btns">
                                        <button
                                          className="action_btn"
                                          title="Delete"
                                          onClick={() => {
                                            setdeleteshowConfirm(true);
                                            setDeleteSiteAgencyId(site.site_id);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </button>
                                      </td>
                                    ) : (
                                      ""
                                    )} */}
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No sites available</p>
                        )}
                        {
                          <ModelEditAgencySite
                            show={show}
                            setGetAgencyData={setGetAgencyData}
                            handleClose={handleClose}
                            getAgencyData={getAgencyData}
                            agencySiteData={agencySiteData}
                          />
                        }
                      </div>
                    </div>

                    <AgencyClientCostSheet 
                        id={id}
                    />

                    <AgencyVendorCostSheet 
                        id={id}
                    />
                    
                  </>
                )}
    </>
  )
}

export default AgencySites