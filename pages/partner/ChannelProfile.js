import React from "react"
import ChannelProfileScreen from "../../Components/ChannelPartner/Admin/ChannelProfile/ChannelProfileScreen";
import withUser from "../../HOC/WithUserhoc";
import WithUserhoc_CP from "../../HOC/WithUserhoc_CP";

const ChannelProfile = () => {
  return (
    <>
      <ChannelProfileScreen />
    </>
  );
};

export default WithUserhoc_CP(ChannelProfile);
