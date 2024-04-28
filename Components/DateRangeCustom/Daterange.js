import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DateRange = ({value, setValue}) => {



  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);

  }

  return (
    <Datepicker
      value={value}
      onChange={handleValueChange}
      showShortcuts={true} 
      primaryColor={"blue"}
      containerClassName="relative mt-8 border rounded-md mb-4 border-black  text-black inline-block" 
    />

  );
};
export default DateRange;