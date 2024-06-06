import React from 'react'
import BookingDetailsScreen from '../../Components/ChannelPartner/User/Bookings/BookingDetailsScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const BookingDetails = () => {
  return (
    <BookingDetailsScreen/>
  )
}

export default WithUserhoc_CP(BookingDetails)