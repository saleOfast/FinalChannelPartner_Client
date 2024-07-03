// import React, { useEffect, useState } from 'react'
// import DashAdminSetCard from './DashAdminSetCard';
// import CubesIcon from '../Svg/CubesIcon';
// import GroupIcon from '../Svg/GroupIcon';
// import Hierarchy from '../Svg/Hierarchy';
// import Link from 'next/link';
// import { hasCookie, getCookie } from "cookies-next";
// import { useSelector } from 'react-redux';
// import { Baseurl } from '../../Utils/Constants';
// import axios from 'axios';

// const Admindashboard = () => {
//     const sideView = useSelector((state) => state.sideView.value);
//     const [dynamicFields, setDynamicFields] = useState([]);

//     useEffect(()=>{
//         getSidebarInfo('admin-nav')
//     },[])

//     const getSidebarInfo = async (navLink) => {
//         if (!hasCookie('token')) {
//           return;
//         }
    
//         const token = getCookie('token');
//         const db_name = getCookie('db_name');
//         const header = {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//             db: db_name,
//             pass: 'pass'
//           }
//         };
    
//         try {
//           const { data } = await axios.get(`${Baseurl}/db/permission/${navLink}`, header);
//           setDynamicFields(data?.data[0]?.children);
//         } catch (error) {
//           console.log(error);
//         }
//       };
    
//     return (
//          <div className={`main_Box  ${sideView}`}>
//             <div className="bread_head">
//                 <h3 className="content_head">ADMIN DASHBOARD</h3>
//             </div>
//             <div className="main_content admin_dashboard">
//                 <div className="top_search_bar">
//                     <div className="col-md-5 col-xl-5 col-sm-12 col-12">
//                         <input type="text"
//                             name="search"
//                             id="search"
//                             placeholder='Search by Keywords'
//                             className='form-control'
//                         />
//                     </div>
//                 </div>
//                 <div className="settings_super_admin">
//                     <div className="settings_heads">
//                         Settings Super Admin
//                     </div>
//                     <div className="settings_cards">
//                         <div className="row">

//                             <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                                 <Link href='/UserProfileManagement'>
//                                     <DashAdminSetCard name='User Profiles Master' />
//                                 </Link>
//                             </div>
//                             <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                                 <Link href='/UserProfileManagement'>
//                                     <DashAdminSetCard name='Profile Permission Master' />
//                                 </Link>
//                             </div>
//                             <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                                 <Link href='/EmailConfiguration'>
//                                     <DashAdminSetCard name='Email Configuration' />
//                                 </Link>
//                             </div>
//                             <div className="col-xl-3 col-md-3 col-sm-12 col-12">
//                                 <Link href='/LicenseDetails'>
//                                     <DashAdminSetCard name='License Details' />
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="admin_setings_lists">
//                     <div className="row">
//                         <div className="col-xl-6 col-md-6 col-sm-12 col-12">


//                             {
//                                 dynamicFields?.map((item,index) => (
//                                     index % 2 == 0 ? (
//                                         // Your JSX or component here
//                                         <div key={index} className="card_wrapper">
//                                             <div className="card_lists">
//                                                 <div className="card_head"> {item?.allais_menu}: </div>
//                                                 <ul className="settings_list" >
//                                                 {
//                                                     item?.children?.map((i)=>(
//                                                             <Link href={`/${i.link}`} key={i?.menu_id}>
//                                                                 <li className="list_item"  >{i?.allais_menu}</li>
//                                                             </Link>
//                                                     ))
//                                                 }
//                                                 </ul>
                                                
//                                             </div>
//                                             <div className="icons">
//                                                 <Hierarchy />
//                                             </div>
//                                         </div>
//                                     ) : null
//                                 ))
//                             }


                            
                            
//                         </div>
//                         <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                            

//                             {
//                                 dynamicFields?.map((item,index) => (
//                                     index % 2 !== 0 ? (
//                                         // Your JSX or component here
//                                         <div key={index} className="card_wrapper">
//                                             <div className="card_lists">
//                                                 <div className="card_head"> {item?.allais_menu}: </div>
//                                                 <ul className="settings_list" >
//                                                 {
//                                                     item?.children?.map((i)=>(
//                                                             <Link href={`/${i.link}`} key={i?.menu_id}>
//                                                                 <li className="list_item"  >{i?.allais_menu}</li>
//                                                             </Link>
//                                                     ))
//                                                 }
//                                                 </ul>
                                                
                                                
//                                             </div>
//                                             <div className="icons">
//                                                 <Hierarchy />
//                                             </div>
//                                         </div>
//                                     ) : null
//                                 ))
//                             }

                            


 
                            

//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default Admindashboard


import React, { useEffect, useState } from 'react';
import DashAdminSetCard from './DashAdminSetCard';
import CubesIcon from '../Svg/CubesIcon';
import GroupIcon from '../Svg/GroupIcon';
import Hierarchy from '../Svg/Hierarchy';
import Link from 'next/link';
import { hasCookie, getCookie } from "cookies-next";
import { useSelector } from 'react-redux';
import { Baseurl } from '../../Utils/Constants';
import axios from 'axios';
import Loader from "../Loader/Loader"
import commonIndexHOC from '../../HOC/commonIndexHOC';

const Admindashboard = () => {
    const sideView = useSelector((state) => state.sideView.value);
    const [dynamicFields, setDynamicFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loader,setLoader]=useState(false)
    useEffect(() => {
        getSidebarInfo('admin-nav');
    }, []);

    const getSidebarInfo = async (navLink) => {
        if (!hasCookie('token')) {
            return;
        }

        const token = getCookie('token');
        const db_name = getCookie('db_name');
        const header = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                db: db_name,
                pass: 'pass'
            }
        };

        try {
            setLoader(true)
            const { data } = await axios.get(`${Baseurl}/db/permission/${navLink}`, header);
            if(data?.status==200){
                setLoader(false)
                setDynamicFields(data?.data[0]?.children);
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const results = [];
            dynamicFields.forEach((item) => {
                if (item.allais_menu.toLowerCase().includes(searchTerm.toLowerCase())) {
                    item.children.forEach((i) => {
                        results.push({ ...i, parentMenu: item.allais_menu });
                    });
                } else {
                    item.children.forEach((i) => {
                        if (i.allais_menu.toLowerCase().includes(searchTerm.toLowerCase())) {
                            results.push({ ...i, parentMenu: item.allais_menu });
                        }
                    });
                }
            });
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, dynamicFields]);

    return (
        <>
                {
            loader ?<div className={`main_Box ${sideView}`} ><Loader/></div>  :(
                <div className={`main_Box ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">ADMIN DASHBOARD</h3>
                </div>
                <div className="main_content admin_dashboard">
                    <div className="top_search_bar">
                        <div className="col-md-5 col-xl-5 col-sm-12 col-12 position-relative">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder='Search by Keywords'
                                className='form-control'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && suggestions.length > 0 && (
                                <ul className="suggestions_list">
                                    {suggestions.map((s, index) => (
                                        <li key={index} className="suggestion_item">
                                            <Link href={`/${s.link}`}>
                                                <div className="suggestion_link">{s.parentMenu} - {s.allais_menu}</div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="settings_super_admin">
                        <div className="settings_heads">
                            Settings Admin
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
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <Link href='/EmailConfiguration'>
                                        <DashAdminSetCard name='Email Configuration' />
                                    </Link>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <Link href='/LicenseDetails'>
                                        <DashAdminSetCard name='License Details' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="admin_setings_lists">
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                {dynamicFields?.map((item, index) => (
                                    index % 2 === 0 ? (
                                        <div key={index} className="card_wrapper">
                                            <div className="card_lists">
                                                <div className="card_head">{item?.allais_menu}:</div>
                                                <ul className="settings_list">
                                                    {item?.children?.map((i) => (
                                                        <Link href={`/${i.link}`} key={i?.menu_id}>
                                                            <li className="list_item">{i?.allais_menu}</li>
                                                        </Link>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="icons">
                                                <Hierarchy />
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                {dynamicFields?.map((item, index) => (
                                    index % 2 !== 0 ? (
                                        <div key={index} className="card_wrapper">
                                            <div className="card_lists">
                                                <div className="card_head">{item?.allais_menu}:</div>
                                                <ul className="settings_list">
                                                    {item?.children?.map((i) => (
                                                        <Link href={`/${i.link}`} key={i?.menu_id}>
                                                            <li className="list_item">{i?.allais_menu}</li>
                                                        </Link>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="icons">
                                                <Hierarchy />
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .position-relative {
                        position: relative;
                    }
                    .suggestions_list {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        width: 100%;
                        max-height: 200px;
                        overflow-y: auto;
                        background: #fff;
                        border: 1px solid #ccc;
                        border-top: none;
                        z-index: 1000;
                    }
                    .suggestion_item {
                        padding: 8px 16px;
                        cursor: pointer;
                        border-bottom: 1px solid #eee;
                    }
                    .suggestion_item:last-child {
                        border-bottom: none;
                    }
                    .suggestion_item:hover {
                        background: #f0f0f0;
                    }
                    .suggestion_link {
                        text-decoration: none;
                        color: #333;
                        display: block;
                    }
                    .suggestion_link:hover {
                        text-decoration: underline;
                    }
                `}</style>
            </div>
            )
        }
        </>
    )
}

export default Admindashboard;
