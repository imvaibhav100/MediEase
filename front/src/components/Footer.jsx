import React from "react";

const Footer = () => (
  <footer className="bg-[#1a1a2e] text-white pt-12 pb-6 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Top Section - App Download & Newsletter */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-gray-700">
        <div className="flex items-center">
          <div className="mr-6">
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=120&q=80" alt="Mobile App" className="w-24 rounded-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Download Our App</h3>
            <p className="text-gray-400 text-sm mb-3">Get exclusive offers on the MeduEase App</p>
            <div className="flex gap-3">
              <a href="#" className="bg-black px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors">
                <i className="fab fa-google-play mr-2"></i>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">GET IT ON</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </a>
              <a href="#" className="bg-black px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors">
                <i className="fab fa-apple mr-2 text-xl"></i>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Subscribe to Newsletter</h3>
          <p className="text-gray-400 text-sm mb-3">Get updates on new medicines & special offers</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0057B8] text-white"
            />
            <button className="bg-[#0057B8] px-6 py-3 rounded-r-lg font-medium hover:bg-[#004494] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* About */}
        <div>
          <h4 className="font-bold text-white mb-4">About</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Press</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Blog</a></li>
          </ul>
        </div>
        
        {/* Services */}
        <div>
          <h4 className="font-bold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Order Medicine</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Upload Prescription</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Store Locator</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Franchise</a></li>
          </ul>
        </div>
        
        {/* Browse */}
        <div>
          <h4 className="font-bold text-white mb-4">Browse</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Generic Medicines</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Jan Aushadhi</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Zeelabs</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Dava India</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Health Products</a></li>
          </ul>
        </div>
        
        {/* Policies */}
        <div>
          <h4 className="font-bold text-white mb-4">Policies</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-[#0057B8] transition-colors">FAQs</a></li>
          </ul>
        </div>
        
        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center">
              <i className="fas fa-envelope mr-3 text-[#0057B8]"></i>
              <a href="mailto:support@MeduEase.in" className="hover:text-[#0057B8] transition-colors">support@MeduEase.in</a>
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone mr-3 text-[#0057B8]"></i>
              <a href="tel:+919876543210" className="hover:text-[#0057B8] transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-start">
              <i className="fas fa-map-marker-alt mr-3 text-[#0057B8] mt-1"></i>
              <span>Mumbai, Maharashtra, India</span>
            </li>
          </ul>
          {/* Social Links */}
          <div className="flex space-x-3 mt-4">
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#0057B8] rounded-full flex items-center justify-center transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#E1306C] rounded-full flex items-center justify-center transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#25D366] rounded-full flex items-center justify-center transition-colors">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#1DA1F2] rounded-full flex items-center justify-center transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-gray-700">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-gray-400 text-sm mr-4">We Accept:</span>
          <div className="flex space-x-3">
            <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
            <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
            <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
            <i className="fab fa-google-pay text-2xl text-gray-400"></i>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img src="https://img.icons8.com/color/48/000000/verified-badge.png" alt="Verified" className="w-8 h-8" />
          <span className="text-gray-400 text-sm">100% Secure Payments</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
        <div className="flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-[#0057B8] mr-2">MeduEase</span>
          <span className="text-gray-400">- Generic Medicines at Best Prices</span>
        </div>
        © 2025 MeduEase. All rights reserved. Made with <span className="text-red-400">❤</span> in India 🇮🇳
      </div>
    </div>
  </footer>
);

export default Footer;
