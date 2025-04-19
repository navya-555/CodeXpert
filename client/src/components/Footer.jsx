/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">CodeXpert</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Transforming education through AI-powered learning experiences that adapt to each student's unique needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors duration-300">
                <Facebook size={16} className="text-blue-600" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors duration-300">
                <Twitter size={16} className="text-blue-600" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors duration-300">
                <Instagram size={16} className="text-blue-600" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors duration-300">
                <Youtube size={16} className="text-blue-600" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Features</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Pricing</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">123 Education Street, Learning City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">support@CodeXpert.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Newsletter</h4>
            <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} CodeXpert. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;