import React from 'react';

const ButtonComponent: React.FC = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <nav className="bg-black p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-lg font-bold">Logo</div>
        <div className="relative inline-flex group">
          <div
            className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
          ></div>
          <a
            href="#"
            title="Get quote now"
            onClick={handleClick}
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            role="button"
          >
            Get it now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default ButtonComponent;
