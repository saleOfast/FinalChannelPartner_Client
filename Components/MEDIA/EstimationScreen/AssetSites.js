import React, { useEffect } from 'react'
import ConfirmBox from "../../Basics/ConfirmBox";
import { Table } from 'react-bootstrap';
import DeleteIcon from '../../Svg/DeleteIcon';
import { fetchData } from '../../../Utils/getReq';
import SiteBookingHistory from './SiteBookingHistory';
import AssetClientCostSheet from './AssetClientCostSheet';
import AssetVendorCostSheet from './AssetVendorCostSheet';


const AssetSites = ({busiessTypeList,userInfo,assetDeleteShowConfirm,setAssetDeleteShowConfirm,viewMode,setDeleteSiteAssetId,id,assetSiteLists,deleteAssetSite,errorToast,setErrorToast}) => {


  return (
    <>
        {busiessTypeList?.find(
                  (item) =>
                    item?.cmpn_b_t_id ==
                    userInfo?.db_media_campaign?.cmpn_b_t_id
                )?.cmpn_b_t_name == "Asset" && (
                  <>
                    <ConfirmBox
                      showConfirm={assetDeleteShowConfirm}
                      setshowConfirm={setAssetDeleteShowConfirm}
                      actionType={deleteAssetSite}
                      title={"Are You Sure you want to Delete ?"}
                    />
                    <div className="add_screen_head">
                      <span className="text_bold">Asset Sites</span>
                    </div>
                    <div className="add_user_form">
                      <div className="row ">
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
                                    <td>{site?.db_site?.site_code}</td>
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
                                    {!viewMode ? (
                                      <td className="table_btns">
                                        <button
                                          className="action_btn"
                                          title="Delete"
                                          onClick={() => {
                                            // deleteAssetSite(site.site_id);
                                            setAssetDeleteShowConfirm(true);
                                            setDeleteSiteAssetId(site.site_id)
                                          }}
                                        >
                                          <DeleteIcon />
                                        </button>
                                      </td>
                                    ) : (
                                      ""
                                    )}
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No sites available</p>
                        )}
                      </div>
                    </div>
                    <SiteBookingHistory 
                      id={id}
                      errorToast={errorToast}
                      setErrorToast={setErrorToast}
                    />
                    
                    <AssetClientCostSheet 
                      id={id}
                    />

                    <AssetVendorCostSheet 
                      id={id}
                    />

                  </>
                )}
                
    </>
  )
}

export default AssetSites