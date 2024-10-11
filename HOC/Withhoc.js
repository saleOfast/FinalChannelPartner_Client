import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { hasCookie } from 'cookies-next';
import { clearTheme } from '../store/themeSlice';
import { clearValue } from '../store/permissionSlice';
import { userLogOut } from '../store/ClientLoginSlice';
import { toast } from 'react-toastify';

const withAdmin = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const adminLogin = useSelector((state) => state.adminLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    const dispatch=useDispatch()

    useEffect(() => {
      // If the user is not loading and not authenticated and not on the login page, redirect to login
      if (!hasCookie("SaLsUsr") && hasCookie("user")) {
        dispatch(clearTheme());
        dispatch(clearValue())
        dispatch(userLogOut())
        toast.warning("Illegal Route Access")
        router.push('/');
      }else{
        setRendercomponent(true)
      }
      
    }, [adminLogin]);

    // Render the wrapped component only if authenticated and not on the login page
 

    return rendercomponent ? <WrappedComponent {...rest} /> : null ;
  };
};

export default withAdmin;




// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useDispatch, useSelector } from 'react-redux';
// import { hasCookie , getCookie } from 'cookies-next';
// import { clearTheme } from '../store/themeSlice';
// import { clearValue } from '../store/permissionSlice';
// import { userLogOut } from '../store/ClientLoginSlice';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { Baseurl } from '../Utils/Constants';

// const withAdmin = (WrappedComponent) => {
//   return ({ ...rest }) => {
//     const router = useRouter();
//     const adminLogin = useSelector((state) => state.adminLogin.value)
//     const [rendercomponent, setRendercomponent] = useState(false)
//     const dispatch=useDispatch()

//     useEffect(() => {
//       const validateToken = async () => {
//         try {
//           let token = getCookie("token");
//           // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGJfbmFtZSI6Ik1VTFRJX1VTRVI1MDU0NzczMyIsInVzZXJfY29kZSI6IlVTRVI1MDU0NzczMyIsImlhdCI6MTcyNzMyNjgyMSwiZXhwIjoxNzI3MzU1NjIxfQ.5vFWtlNkaOFvNhEn5M6-8A-rGxC4guNXN2PWTRMe7qQ";
//           let db_name = getCookie("db_name");

//           let header = {
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//               db: db_name,
//               pass:"pass"
//             },
//           };

//           if (!token) {
//             throw new Error('No token found');
//           }

//           // Example API call to validate token
//           const response = await axios.get(
//             Baseurl + `/db/checkToken`,
//             header
//           );
//           if (response.data?.message!=="Token Verified") {
//             throw new Error('Invalid token');
//           }
//         } catch (error) {
//           // If token is invalid, clear state and redirect
//           dispatch(clearTheme());
//           dispatch(clearValue())
//           dispatch(userLogOut())
//           toast.warning("Session expired, please log in again",{autoClose:2500});
//           router.push('/');
//           return;
//         }

//         // Token is valid, proceed to render component
//         setRendercomponent(true);
//       };

//       // Check if necessary cookies exist
//       if (!hasCookie("SaLsUsr") && hasCookie("user")) {
//         dispatch(clearTheme());
//         dispatch(clearValue())
//         dispatch(userLogOut())
//         toast.warning("Illegal Route Access")
//         router.push('/');
//       } else {
//         // Validate the token before rendering the component
//         validateToken();
//       }
//     }, [adminLogin]);

//     // Render the wrapped component only if authenticated and not on the login page
 

//     return rendercomponent ? <WrappedComponent {...rest} /> : null ;
//   };
// };

// export default withAdmin;



