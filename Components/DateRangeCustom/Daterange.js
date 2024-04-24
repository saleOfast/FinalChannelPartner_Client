import React from 'react'
import { DateRangePicker } from 'react-date-range';

const Daterange = () => {

    const handleSelect = (ranges) => {
        console.log(ranges);
        // {
        //   selection: {
        //     startDate: [native Date Object],
        //     endDate: [native Date Object],
        //   }
        // }
      }

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }

  return (
    <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        months={2}
        direction='horizontal'
      />
  )
}

export default Daterange