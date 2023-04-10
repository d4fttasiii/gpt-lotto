// src/Profile.js
import React from 'react';
import BuyTicket from '../components/BuyTicket';

const Profile = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Profile</h1>
      <p>This is the profile page.</p>
      <BuyTicket />
    </div>
  );
};

export default Profile;
