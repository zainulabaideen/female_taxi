import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverLayout from './DriverLayout';
import DriverHome from './DriverHome';

const DriverDashboard = () => {
  return (
    <DriverLayout>
      <Routes>
        <Route index element={<DriverHome />} />
        <Route path="schedule" element={<DriverHome />} />
        <Route path="history" element={<DriverHome />} />
        <Route path="profile" element={<DriverHome />} />
      </Routes>
    </DriverLayout>
  );
};

export default DriverDashboard;
