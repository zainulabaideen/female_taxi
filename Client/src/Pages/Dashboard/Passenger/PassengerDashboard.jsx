import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PassengerLayout from './PassengerLayout';
import PassengerHome from './PassengerHome';
import DriversList from './DriversList';
import EmergencyButton from './EmergencyButton';

const PassengerDashboard = () => {
  return (
    <PassengerLayout>
      <Routes>
        <Route index element={<PassengerHome />} />
        <Route path="drivers" element={<DriversList />} />
        <Route path="bookings" element={<PassengerHome />} />
        <Route path="emergency" element={<EmergencyButton />} />
        <Route path="profile" element={<PassengerHome />} />
      </Routes>
    </PassengerLayout>
  );
};

export default PassengerDashboard;
