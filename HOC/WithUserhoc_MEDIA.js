import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { hasCookie } from 'cookies-next';
import { clearTheme } from '../store/themeSlice';
import { clearValue } from '../store/permissionSlice';
import { LoggedOut } from '../store/adMinLoginSlice';
import { userLogOut } from '../store/ClientLoginSlice';
import { toast } from 'react-toastify';

const WithUserhoc_MEDIA = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const dispatch=useDispatch()
    const userLogin = useSelector((state) => state.userLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    const dbMode = useSelector((state) => state.dbMode.value);

    useEffect(() => {
      
      if (hasCookie("SaLsUsr")) {
        router.push('/admin');
      }else if(!hasCookie("user")){
        router.push('/');
      }
      else if(!hasCookie("media")){
               dispatch(clearTheme());
            dispatch(clearValue())
            const isAdminMode = dbMode === "admin";
            dispatch(isAdminMode ? LoggedOut()  : userLogOut()); 
            toast.warning("Illegal Route Access")
                 router.push('/')
              }
      else{
        setRendercomponent(true)
      }
      
    }, [userLogin]);

    return rendercomponent ? <WrappedComponent {...rest} /> : null ;
  }
 

};

export default WithUserhoc_MEDIA;
