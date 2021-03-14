import React from 'react';
import Login from './Login';
import { RiShip2Fill } from 'react-icons/ri';

function Navbar({ loggedIn }) {
  return (
    <>
      <nav className="bg-red-100" style={{ height: '10vh' }}>
        <div className="p-4 items-center mx-auto flex justify-between">
          <div className="flex flex-row items-center space-x-3">
            <h2 className="text-black font-serif text-4xl italic">Voyage</h2>
            <RiShip2Fill size={'3rem'} color={'black'} />
          </div>
          {loggedIn ? <a>Logout</a> : <Login />}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
