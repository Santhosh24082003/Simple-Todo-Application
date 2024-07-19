import React, { useState } from 'react';

interface NavbarProps {
  title: string;
  onLogout: () => void;
  avatarSrc: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, onLogout, avatarSrc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">{title}</div>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none"
          onClick={handleMenuToggle}
        >
          <img
            src={avatarSrc}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </button>
        {isMenuOpen && (
          <div className="absolute top-12 right-0 w-40 bg-white text-black shadow-lg rounded-sm">
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-200"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
