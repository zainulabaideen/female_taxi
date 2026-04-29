import React from "react";
import { Routes, Route } from "react-router-dom";
import DriverLayout from "./DriverLayout";
import DriverHome from "./DriverHome";
import DriverProfile from "./DriverProfile";

const DriverDashboard = () => {
  return (
    <DriverLayout>
      <Routes>
        <Route index element={<DriverHome />} />
        <Route path="profile" element={<DriverProfile />} />
      </Routes>
    </DriverLayout>
  );
};

export default DriverDashboard;
