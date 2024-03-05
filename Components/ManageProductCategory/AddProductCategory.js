import Link from "next/link";
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { hasCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";

export default function AddProductCategory() {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter()
  const { id } = router.query;

  const [dataList, setDataList] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [selected, setSelected] = useState({
    p_cat_id: '',
    p_cat_name: ''
  })
  const [userInfo, setUserInfo] = useState({
    p_cat_name: '',
    parent_id: '0'
  })

  const getDataList = async () => {

    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 167
        }
      }
      try {
        const response = await axios.get(Baseurl + `/db/productCat`, header);
        setDataList(response.data.data);
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

  const getSingleData = async (id) => {

    if (hasCookie('token')) {
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 167
        }
      }
      try {
        const response = await axios.get(Baseurl + `/db/productCat/one?p_id=${id}`, header);
        setUserInfo(response.data.data);
        setSelected({ parent_name: response.data.data.parent_name });
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

  const addUserhandler = async () => {
    if (userInfo.p_cat_name == '') {
      toast.error('Please enter the Product Category Name')
    } else if (userInfo.parent_id == '') {
      toast.error('Please Select the Product Patient')
    }
    else {
      if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 167
          }
        }

        try {
          const response = await axios.post(Baseurl + `/db/productCat`, userInfo, header);
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message)
            router.push('/ManageProductCategory');
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

  const updateUserhandler = async () => {
    if (userInfo.p_cat_name == '') {
      toast.error('Please enter the Product Category')
    } else {
      if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 169
          }
        }

        try {
          const response = await axios.put(Baseurl + `/db/productCat`, userInfo, header);
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message)
            router.push('/ManageProductCategory')
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

  function checkChildrens(data, space = 0, i = 0) {
    space += 1;
    let spaces = '';
    for (let i = 0; i < space; i++) {
      spaces += '\u00A0\u00A0'
    }
    if (data?.length > 0) {
      return data?.map(({ p_cat_id, p_cat_name, children }) => {
        return <> <option name={p_cat_name} value={p_cat_id} >
          {spaces}  {p_cat_name}</option>
          {checkChildrens(children, space)}
        </>
      })
    }
  }

  const arr = []

  function getItem(e, dataList, obj = []) {
    let arrData = parentHandlerId(e, dataList, obj = [])
    const object = arrData.find(net => net.p_cat_id == e.target.value);
    if (object) {
      setSelected({ ...selected, p_cat_id: object.p_cat_id, parent_name: object.p_cat_name })
      setUserInfo({ ...userInfo, parent_id: e.target.value, parent_name: object.p_cat_name })
    } else {
      setSelected({ ...selected, p_cat_name: '' })
      setUserInfo({ ...userInfo, parent_id: '0' })
    }
  }

  function parentHandlerId(e, dataList, obj = []) {
    dataList.map((item) => {
      arr.push({
        p_cat_id: item.p_cat_id,
        p_cat_name: item.p_cat_name
      })
      if (item.children.length > 0) {
        return parentHandlerId(e, item.children, arr)
      }
    })

    return arr;
  }

  useEffect(() => {
    getDataList();
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true)
      getSingleData(id)
    }
  }, [router.isReady, id])

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">{editMode ? 'EDIT' : 'ADD'} PRODUCT CATEGORY </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/ManageProductCategory">Product Master</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {editMode ? 'Edit' : 'Add'} Product Category
            </li>
          </ol>
        </nav>
      </div>

      <div className="main_content">
        <div className="Add_user_screen">
          <div className="add_screen_head">
            <span className="text_bold">{editMode ? 'Edit' : 'Add'} Category</span>
          </div>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="task_name">Product Category</label>
                  <input
                    type="text"
                    placeholder="Enter Product Category Name"
                    name="task_name"
                    id="task_name"
                    className="form-control"
                    onChange={(e) => setUserInfo({ ...userInfo, p_cat_name: e.target.value })}
                    value={userInfo.p_cat_name ? userInfo.p_cat_name : ''}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box option_tree">
                  <p className="label_subs">Parent Product Category</p>
                  <div className="select_wrapper">
                    <label className="option_select" htmlFor="parent_id">
                      {selected.parent_name ? selected.parent_name : 'Select parent'}
                    </label>
                    <select
                      name="parent_id" id="parent_id"
                      onChange={(e) => getItem(e, dataList)}
                      className="form-control" >
                      <option value="">Select parent</option>
                      {dataList?.map(({ children, p_cat_id, p_cat_name }, i) => {
                        return (<>
                          <option name={p_cat_name} value={p_cat_id}> {p_cat_name} </option>
                          {checkChildrens(children, p_cat_id, i)}
                        </>
                        )
                      })}
                    </select>
                  </div>

                </div>
              </div>

              <div className="text-end">
                <div className="submit_btn">
                  {editMode ? <button className="btn btn-primary" onClick={updateUserhandler}>Update</button> :
                    <button className="btn btn-primary" onClick={addUserhandler}>Save & Submit</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
