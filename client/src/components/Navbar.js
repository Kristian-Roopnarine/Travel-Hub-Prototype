import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <Link to="/itinerary/12345">Itinerary 12345</Link>
      <p className="font-mono">This is a nav</p>
    </>
  );
}

export default Navbar;
