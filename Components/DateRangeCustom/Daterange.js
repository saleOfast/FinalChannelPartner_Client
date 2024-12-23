import { setCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DateRange = ({value,setValue,getData,filterType}) => {



  const handleValueChange = (newValue) => {
    setValue(newValue);
    const queryObjLeads={
      f_date:newValue.startDate,
      t_date:newValue.endDate,
    }
    setCookie(`${filterType}Filter`,queryObjLeads)
    getData(queryObjLeads)

  }
  return (
    <Datepicker
      showFooter={true}
      value={value}
      onChange={handleValueChange}
      displayFormat={"DD-MM-YYYY"}
      showShortcuts={true}
      primaryColor={"blue"}
      popoverDirection="down"
      containerClassName="relative border rounded-md border-black text-black inline-block "
    /> 
  );
};
export default DateRange;