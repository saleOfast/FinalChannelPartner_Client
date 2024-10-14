import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { hasCookie,getCookie } from 'cookies-next';
import { clearTheme } from '../store/themeSlice';
import { clearValue } from '../store/permissionSlice';
import { userLogOut } from '../store/ClientLoginSlice';
import { toast } from 'react-toastify';
import axios from 'axios'; // You may use axios or fetch for token validation
import { Baseurl } from '../Utils/Constants';

const dmsIndexHOC = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const dispatch=useDispatch()
    const userLogin = useSelector((state) => state.userLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    let key=true;
     

    useEffect(() => {
      const validateToken = async () => {
        try {
          if(key==true){
            key=false
          let token = getCookie("token");
          // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGJfbmFtZSI6Ik1VTFRJX1VTRVI1MDU0NzczMyIsInVzZXJfY29kZSI6IlVTRVI1MDU0NzczMyIsImlhdCI6MTcyNzMyNjgyMSwiZXhwIjoxNzI3MzU1NjIxfQ.5vFWtlNkaOFvNhEn5M6-8A-rGxC4guNXN2PWTRMe7qQ";
          let db_name = getCookie("db_name");

          let header = {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              db: db_name,
              pass:"pass"
            },
          };

          if (!token) {
            throw new Error('No token found');
          }

          // Example API call to validate token
          const response = await axios.get(
            Baseurl + `/db/checkToken`,
            header
          );
          if (response.data?.message!=="Token Verified") {
            throw new Error('Invalid token');
          }
          }
        } catch (error) {
          // If token is invalid, clear state and redirect
          if(router.pathname==="/dms" && hasCookie("token")){
            toast.warning("Session expired, please log in again",{autoClose:2500});
          }
          dispatch(userLogOut()); 
          dispatch(clearTheme());
          dispatch(clearValue());
          router.push('/');
          return;
        }

        // Token is valid, proceed to render component
        setRendercomponent(true);
      };

      // Check if necessary cookies exist
      if (hasCookie("SaLsUsr")) {
        router.push('/admin');
      }else if(!hasCookie("dms") && hasCookie("user")){
        dispatch(clearTheme());
        dispatch(clearValue())
        dispatch(userLogOut()); 
         toast.warning("Illegal Route Access")
         router.push('/')
      } else {
        // Validate the token before rendering the component
        validateToken();
      }
    }, [userLogin]);

    return rendercomponent ? <WrappedComponent {...rest} /> : null ;
  };
};

export default dmsIndexHOC;

