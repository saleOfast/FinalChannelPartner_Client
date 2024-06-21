import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { hasCookie } from "cookies-next";
import { clearTheme } from "../store/themeSlice";
import { clearValue } from "../store/permissionSlice";
import { userLogOut } from "../store/ClientLoginSlice";
import { toast } from "react-toastify";

const mainIndexHOC  = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin.value);
    const [rendercomponent, setRendercomponent] = useState(false);

    useEffect(() => {
      if (hasCookie("SaLsUsr")) {
        router.push("/admin");
      } else if (
        hasCookie("user") &&
        (hasCookie("crm") ||
          hasCookie("dms") ||
          hasCookie("channel") ||
          hasCookie("sales"))
      ) {
        // dispatch(clearTheme());
        // dispatch(clearValue());
        // dispatch(userLogOut());
        // toast.warning("Illegal Route Access");
        router.back()
      } else {
        setRendercomponent(true);
      }
    }, [userLogin]);

    return rendercomponent ? <WrappedComponent {...rest} /> : null;
  };
};

export default mainIndexHOC ;
