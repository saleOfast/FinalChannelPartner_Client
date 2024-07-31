
import QuotationScreen from "../../Components/QuotationScreens/QuotationScreen";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from "../../store/isActiveSidebarSlice";

export default WithUserhoc_MEDIA (function Quotations() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'quotation')
      dispatch(setIsActive('quotation'))
  }, [dispatch]);
  return (
    <>
 
          <QuotationScreen />

    </>
  );
})
