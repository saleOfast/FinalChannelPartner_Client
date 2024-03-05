
import QuotationScreen from "../Components/QuotationScreens/QuotationScreen";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import withUser from "../HOC/WithUserhoc";
import { setIsActive } from "../store/isActiveSidebarSlice";

export default withUser (function Quotations() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'quotation')
      dispatch(setIsActive('quotation'))
  }, []);
  return (
    <>
 
          <QuotationScreen />

    </>
  );
})
