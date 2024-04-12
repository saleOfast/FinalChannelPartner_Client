import React, { useState } from 'react'
import DashAdminSetCard from './DashAdminSetCard';
import CubesIcon from '../Svg/CubesIcon';
import GroupIcon from '../Svg/GroupIcon';
import Hierarchy from '../Svg/Hierarchy';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Admindashboard = () => {
    const sideView = useSelector((state) => state.sideView.value);

    return (
         <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">ADMIN DASHBOARD</h3>
            </div>
            <div className="main_content admin_dashboard">
                <div className="top_search_bar">
                    <div className="col-md-5 col-xl-5 col-sm-12 col-12">
                        <input type="text"
                            name="search"
                            id="search"
                            placeholder='Search by Keywords'
                            className='form-control'
                        />
                    </div>
                </div>
                <div className="settings_super_admin">
                    <div className="settings_heads">
                        Settings Super Admin
                    </div>
                    <div className="settings_cards">
                        <div className="row">

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <Link href='/UserProfileManagement'>
                                    <DashAdminSetCard name='User Profiles Master' />
                                </Link>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <Link href='/UserProfileManagement'>
                                    <DashAdminSetCard name='Profile Permission Master' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin_setings_lists">
                    <div className="row">
                        <div className="col-xl-6 col-md-6 col-sm-12 col-12">

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> User Master:  </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageUsers'>
                                            <li className="list_item">User Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <svg
                                        width={85}
                                        height={85}
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M62.605 44.462A18.634 18.634 0 1 0 81.24 63.096a18.733 18.733 0 0 0-18.635-18.634Zm3.27 20.27a3.906 3.906 0 0 1-1.472-.328l-7.028 7.03c-.395.39-.918.622-1.472.653a1.635 1.635 0 0 1-1.47-.654 2.272 2.272 0 0 1 0-3.106l7.028-7.029a4.774 4.774 0 0 1-.327-1.47 5.67 5.67 0 0 1 5.558-6.212 3.906 3.906 0 0 1 1.471.327c.327 0 .327.327.163.49l-3.269 3.106a.458.458 0 0 0 0 .817l2.125 2.125a.622.622 0 0 0 .981 0l3.106-3.106c.163-.163.654-.163.654.164.17.475.28.969.327 1.471a5.837 5.837 0 0 1-6.375 5.721ZM35.471 45.443c11.646 0 21.087-9.441 21.087-21.087 0-11.646-9.44-21.086-21.087-21.086-11.645 0-21.086 9.44-21.086 21.086 0 11.646 9.44 21.087 21.086 21.087ZM41.193 81.404c3.596 0 1.635-2.452 1.635-2.452a25.238 25.238 0 0 1-5.558-15.855 24.52 24.52 0 0 1 2.288-10.462c.07-.187.181-.355.327-.49 1.145-2.289-1.144-2.452-1.144-2.452a19.77 19.77 0 0 0-3.106-.164A32.186 32.186 0 0 0 3.924 76.991c0 1.634.49 4.577 5.558 4.577h31.22c.328-.164.328-.164.491-.164Z"
                                            fill="#0080FF"
                                            fillOpacity={0.25}
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Taxes Master: </div>
                                    <ul className="settings_list">
                                        <Link href='/TaxScreen'>
                                            <li className="list_item">Taxes Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <Hierarchy />
                                </div>
                            </div> 
                            
                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Account Type Master: </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageAccountType'>
                                            <li className="list_item"> Account Type Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <Hierarchy />
                                </div>
                            </div>

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Product Master:  </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageProductCategory'>
                                            <li className="list_item">Product Category Master</li>
                                        </Link>
                                    </ul>
                                    <ul className="settings_list">
                                        <Link href='/Products'>
                                            <li className="list_item">Product Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <CubesIcon />
                                </div>
                            </div>
                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Opportunity Master:  </div>
                                    <ul className="settings_list">
                                        <Link href='/OpportunityManagement'>
                                            <li className="list_item">Opportunity Stage Master</li>
                                        </Link>
                                    </ul>
                                    <ul className="settings_list">
                                        <Link href='/ManageOpportunityTypeMaster'>
                                            <li className="list_item">Opportunity Type Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <GroupIcon />
                                </div>
                            </div>
                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Task Master :  </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageTaskStatus'>
                                            <li className="list_item">Task Status Master</li>
                                        </Link>
                                        <Link href='/ManageTaskPriority'>
                                            <li className="list_item">Task Priority Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                <CubesIcon />
                                </div>
                            </div>

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Hr Process Master :  </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageLeaveHeadScreen'>
                                            <li className="list_item">Leave Head Master</li>
                                        </Link>
                                        <Link href='/ManagePolicyHeadScreen'>
                                            <li className="list_item">Policy Head Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                <GroupIcon />
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Organization Master: </div>
                                    <ul className="settings_list">
                                        <Link href='/Managedivision'>
                                            <li className="list_item">Division Master</li>
                                        </Link>
                                        <Link href='/ManageDepartment'>
                                            <li className="list_item">Department Master</li>
                                        </Link>

                                        <Link href='/ManageDesignation'>
                                            <li className="list_item">Designation Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <Hierarchy />
                                </div>
                            </div>

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Lead Master: </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageLeadIndustry'>
                                            <li className="list_item">Lead Industry Master</li>
                                        </Link>
                                        <Link href='/ManageLeadRating'>
                                            <li className="list_item">Lead Rating Master</li>
                                        </Link>
                                        <Link href='/ManageLeadSource'>
                                            <li className="list_item">Lead Source Master</li>
                                        </Link>
                                        <Link href='/ManageLeadStage'>
                                            <li className="list_item">Lead Stage Master</li>
                                        </Link>
                                        <Link href='/ManageLeadType'>
                                            <li className="list_item">Lead Type Master</li>
                                        </Link>
                                        <Link href='/ManageLossReason'>
                                            <li className="list_item">Loss Reason Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <Hierarchy />
                                </div>
                            </div>

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Quotation Status Master:  </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageQuotationStatus'>
                                            <li className="list_item">Quotation Status Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                    <CubesIcon />
                                </div>
                            </div>

                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Hr Process Master :  </div>
                                    <ul className="settings_list">
                                        <Link href='/ManageLeaveHeadScreen'>
                                            <li className="list_item">Leave Head Master</li>
                                        </Link>
                                        <Link href='/ManagePolicyHeadScreen'>
                                            <li className="list_item">Policy Head Master</li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                <GroupIcon />
                                </div>
                            </div>


                            <div className="card_wrapper">
                                <div className="card_lists">
                                    <div className="card_head"> Dynamic Field Master :  </div>
                                    <ul className="settings_list">
                                        <Link href='/AdditionalFields'>
                                            <li className="list_item">Dynamic Field </li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className="icons">
                                <CubesIcon />
                                </div>
                            </div>


 
                            

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Admindashboard