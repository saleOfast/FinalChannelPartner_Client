import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import BookingsScreen from '../../Components/ChannelPartner/User/Bookings/BookingsScreen'

const Bookings = () => {
  return (
    <>
        <BookingsScreen/>
    </>
  )
}

export default WithUserhoc_CP(Bookings)