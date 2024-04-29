import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DateRange = ({value, setValue,getDataList,lead,getVisitList,visit}) => {



  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
    const queryObjLeads={
      f_date:newValue.startDate,
      t_date:newValue.endDate,
    }
    if(lead){
      getDataList(queryObjLeads)
    }
    if(visit){
      getVisitList(queryObjLeads)
    }

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