import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DateRange = ({value,setValue,getData}) => {



  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
    const queryObjLeads={
      f_date:newValue.startDate,
      t_date:newValue.endDate,
    }
    getData(queryObjLeads)

  }
  return (
    <Datepicker
      value={value}
      onChange={handleValueChange}
      showShortcuts={true} 
      primaryColor={"blue"}
      containerClassName="relative w-64 mt-8 border rounded-md mb-4 border-black  text-black inline-block" 
    />
  );
};
export default DateRange;