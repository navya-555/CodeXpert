import { useState, useEffect } from 'react';
import clsx from 'clsx';

const navItems = [
  { name: 'Products', id: 'products' },
  { name: 'Pricing', id: 'pricing' },
  { name: 'FAQs', id: 'faqs' },
  { name: 'Team', id: 'team' },
];

const Navbar = () => {
  const [active, setActive] = useState('products');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(id);
    }
  };

  return (
    <div
      className={clsx(
        'w-full flex justify-center py-4 sticky top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-transparent' : 'bg-white/70'
      )}
    >
      <div
        className={clsx(
          'w-[90%] md:w-[80%] flex justify-between items-center px-6 py-4 transition-all duration-300 font-semibold',
          'rounded-full',
          'bg-gray-100 border border-gray-300 shadow-md'
        )}
        style={{ fontFamily: `'Poppins', 'Segoe UI', sans-serif` }}
      >
        {/* Logo */}
        <a href="/" className="text-xl md:text-2xl font-extrabold text-black tracking-wide">
          &lt;<span className="text-blue-600">CodeXpert</span> /&gt;
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-base">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={clsx(
                'font-bold transition-all duration-200',
                active === item.id ? 'text-blue-600' : 'text-gray-800',
                'hover:text-blue-600'
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button className="text-base text-gray-800 font-semibold hover:text-blue-600 transition">
            Login
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-bold px-5 py-2 rounded-full hover:bg-blue-500 transition">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
