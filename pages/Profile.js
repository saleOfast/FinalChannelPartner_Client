import Head from 'next/head';
import { useEffect, useState } from 'react'
import SideBar from '../Components/Basics/SideBar';
import Topnav from '../Components/Basics/Topnav';
import ProfileScreen from '../Components/ProfileScreens.js/ProfileScreen';
import { useDispatch } from 'react-redux'
import { getCookie, hasCookie } from 'cookies-next';
import { adminMode } from '../store/dbModeSlice'
import EditProfileScreen from '../Components/ProfileScreens.js/EditProfileScreen';
import { Baseurl } from '../Utils/Constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import withAdmin from '../HOC/Withhoc';

function Profile() {
  const dispatch = useDispatch()
  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState({})
  
  const getSingleData = async () => {
    if (hasCookie('saLsTkn')) {
      const token = getCookie('saLsTkn');
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
        }
      }
      try {
        const response = await axios.get(Baseurl + `/db/admin/profile`, header);
        setUserData(response.data.data);
      } catch (error) {
        if (error?.response?.data?.mesage) {
          toast.error(error.response.data.mesage);
        }
        else {
          toast.error('Something went wrong!')
        }
      }
    }
  }

  useEffect(() => {
    if (hasCookie('Admin')) {
      dispatch(adminMode())
    }
    getSingleData();
  }, [])

  return (
    <>
      <Head>
        <title>LeadShyne</title>
        <meta name="description" content="Leadshyne CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main_wrapper">
        <Topnav />
        <div className="content_wrapper">
          <SideBar isactive='profile' />
          {!editMode ? <ProfileScreen
            setEditMode={setEditMode}
            userData={userData}
          /> :
            <EditProfileScreen
              setEditMode={setEditMode}
              userData={userData}
            />}
        </div>
      </main>
    </>
  )
}

export default withAdmin(Profile)