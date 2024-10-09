// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useDispatch, useSelector } from 'react-redux';
// import { hasCookie } from 'cookies-next';
// import { clearTheme } from '../store/themeSlice';
// import { clearValue } from '../store/permissionSlice';
// import { LoggedOut } from '../store/adMinLoginSlice';
// import { userLogOut } from '../store/ClientLoginSlice';
// import { toast } from 'react-toastify';

// const withUser = (WrappedComponent) => {
//   return ({ ...rest }) => {
//     const router = useRouter();
//     const dispatch=useDispatch()
//     const userLogin = useSelector((state) => state.userLogin.value)
//     const [rendercomponent, setRendercomponent] = useState(false)
//     const dbMode = useSelector((state) => state.dbMode.value);
     

//     useEffect(() => {
      
//       if (hasCookie("SaLsUsr")) {
//         router.push('/admin');
//       }else if(!hasCookie("user")){
//         router.push('/');
        
//       }
//       else if(!hasCookie("crm")){
//        dispatch(clearTheme());
//     dispatch(clearValue())
//     const isAdminMode = dbMode === "admin";
//     dispatch(isAdminMode ? LoggedOut()  : userLogOut()); 
//     toast.warning("Illegal Route Access")
//          router.push('/')
//       }
//       else{
//         setRendercomponent(true)
//       }
      
//     }, [userLogin]);

//     return rendercomponent ? <WrappedComponent {...rest} /> : null ;
//   };
// };

// export default withUser;


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { hasCookie, getCookie } from 'cookies-next'; // getCookie to fetch the token
import { clearTheme } from '../store/themeSlice';
import { clearValue } from '../store/permissionSlice';
import { LoggedOut } from '../store/adMinLoginSlice';
import { userLogOut } from '../store/ClientLoginSlice';
import { toast } from 'react-toastify';
import axios from 'axios'; // You may use axios or fetch for token validation
import { Baseurl } from '../Utils/Constants';

const withUser = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin.value);
    const [renderComponent, setRenderComponent] = useState(false);
    const dbMode = useSelector((state) => state.dbMode.value);

    useEffect(() => {
      const validateToken = async () => {
        try {
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
        } catch (error) {
          // If token is invalid, clear state and redirect
          dispatch(clearTheme());
          dispatch(clearValue());
          const isAdminMode = dbMode === "admin";
          dispatch(isAdminMode ? LoggedOut() : userLogOut());
          toast.warning("Session expired, please log in again",{autoClose:2500});
          router.push('/');
          return;
        }

        // Token is valid, proceed to render component
        setRenderComponent(true);
      };

      // Check if necessary cookies exist
      if (hasCookie("SaLsUsr")) {
        router.push('/admin');
      } else if (!hasCookie("user")) {
        router.push('/');
      } else if (!hasCookie("crm")) {
        dispatch(clearTheme());
        dispatch(clearValue());
        const isAdminMode = dbMode === "admin";
        dispatch(isAdminMode ? LoggedOut() : userLogOut());
        toast.warning("Illegal Route Access");
        router.push('/');
      } else {
        // Validate the token before rendering the component
        validateToken();
      }
    }, [userLogin]);

    return renderComponent ? <WrappedComponent {...rest} /> : null;
  };
};

export default withUser;


