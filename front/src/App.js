


import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Categories from './components/Categories';
import SaltFinder from './components/SaltFinder';
import GenericMedicineInfo from './components/GenericMedicineInfo';
import FeaturedProducts from './components/FeaturedProducts';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { AuthProvider } from './components/AuthContext';
import MedicinesPage from './components/MedicinesPage';
import MedicineDetailPage from './components/MedicineDetailPage';
import WellnessPage from './components/WellnessPage';
import SupportPage from './components/SupportPage';
import GenericFinder from './components/GenericFinder';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans min-h-screen flex flex-col bg-[#F5F7FA] relative overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <HeroBanner />
                <SaltFinder />
                <Categories />
                <WhyChooseUs />
                <FeaturedProducts />
                <Testimonials />
                <FAQ />
              </>
            } />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/:name" element={<MedicineDetailPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/find-generic" element={<GenericFinder />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
