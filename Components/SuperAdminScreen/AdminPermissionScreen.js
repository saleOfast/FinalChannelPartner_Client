import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Baseurl } from '../../Utils/Constants';
import Collapse from 'react-bootstrap/Collapse';
import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import CaretDownIcon from '../Svg/CaretDownIcon';

const AdminPermissionScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter()
    const { id } = router.query

    const [open, setOpen] = useState({});
    const [reqData, setreqData] = useState([]);
    const [permissionView, setpermissionView] = useState([]);

    function renderMenu(menus) {
        return menus?.map((menu) => {
            const hasChildren = menu.children && menu.children.length > 0;

            return (
                <div className={hasChildren ? 'parent-divs' : 'col-xl-3 col-md-3 col-sm-12 col-12 mrgn-Btn'} key={menu.menu_id} >
                     <div
                        className={hasChildren ? 'first-parent' : 'child-box'} >
                        {hasChildren ? <div className="openToggler" aria-controls={menu.menu_id}
                            aria-expanded={open[menu.menu_id] ? open[menu.menu_id] : false}
                            onClick={() => handleClick(menu.menu_id)}>
                            <CaretDownIcon /> </div> : ''}
                        <input
                            className='input-box form-check-input me-2'
                            type="checkbox"
                            id={`${menu.menu_id}-input`}
                            checked={menu.actions ? true : false}
                            onChange={(e) =>
                                clickHandler(e, menu.menu_id, menu.menu_name, menu.parent_id, menu.children)} />
                        <label htmlFor={`${menu.menu_id}-input`} className='form-check-label'>
                            <span className="check-head">{menu.allais_menu} </span>
                        </label>
                        {/* {hasChildren ? <div className='permissionediticon' onClick={() => EditClicked(menu)} ><EditIcon /></div> : ''} */}
                    </div>

                    {hasChildren && (
                        <Collapse in={open[menu.menu_id]}>
                            <div className={hasChildren ? 'child-box row m-auto' : ''} id={menu.menu_id}>
                                {renderMenu(menu.children)}
                            </div>
                        </Collapse>
                    )}
                </div>
            );
        });
    }


    const handleClick = (id) => {
        setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    }

    function clickHandler(e, menu_id, menu_name, parent_id, childrens) {
        const currArr = updateActionsForParentIdThree([...permissionView], menu_id, e);
        const modifiedArray = addArrayToChildren(permissionView, menu_id, childCheckFuncs(childrens, e));
        checkFuncc(currArr);
    }

    function updateActionsForParentIdThree(arr, menu_id, e) {
        arr.forEach(item => {
            if (item.menu_id === menu_id) {
                item.actions = e.target.checked;
                item.is_active = e.target.checked;
            }
            if (item.children.length > 0) {
                updateActionsForParentIdThree(item.children, menu_id, e);
            }
        });
        return arr;
    }

    function addArrayToChildren(array, menu_id, data) {
        array.forEach(item => {
            if (item.menu_id === menu_id) {
                item.children = data;
            }
        });
        return array;
    }

    function childCheckFuncs(menu, e) {
        menu?.forEach(child => {
            child.is_active = e.target.checked;
            child.actions = e.target.checked;

            if (child.children) {
                childCheckFuncs(child.children, e);
            }
        });
        return menu;
    }

    function checkFuncc(valArr, returnArr = []) {
        valArr?.forEach(data => {
            const checkinfo = {
                menu_id: data.menu_id,
                menu_name: data.menu_name,
                parent_id: data.parent_id,
                actions: data.actions,
                icon_path: data.icon_path,
                link: data.link,
                is_active: data.is_active,
            };
            returnArr.push(checkinfo);
            setreqData(returnArr);
            if (data.children && data.children.length > 0) {
                checkFuncc(data.children, returnArr);
            }
        });
    }

    async function getPermissionList(id) {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/admin/permission?id=${id}`, header);
                setpermissionView(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    }

    async function submitFunc() {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            if (hasCookie('db_name')) {
                let db_name = (getCookie('db_name'));
                const reqOptions = { user_id: router.query.id, permissionData: reqData, db_name: db_name }
                try {
                    const response = await axios.post(Baseurl + `/db/admin/permission`, reqOptions, header);
                    if (response.status === 200 || response.status === 201) {
                        toast.success(response.data.message)
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error('Something went wrong!')
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        getPermissionList(id)
    }, [router.isReady, id]);

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">CLIENT PERMISSIONS</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"> <Link href='/Admin'> All Clients </Link></li>
                        <li className="breadcrumb-item active" aria-current="page"> Client Permissions</li>
                    </ol>
                </nav>
            </div>
            <div className="main_content ">
                <div className="permission-view">

                    {permissionView ? <> {renderMenu(permissionView)}</> : ''}

                    <div className="submit-btn-box">
                        <Link href='/Admin'><button className="btn btn-cancel">Go Back</button></Link>
                        <button onClick={submitFunc} className="btn btn-primary">Submit</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminPermissionScreen