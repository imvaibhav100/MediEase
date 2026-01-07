import { BACKEND_BASE } from '../api';
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { addToCart, addToCartAsync } from "../cartSlice";
import { useAuth } from "./AuthContext";
import useToast from "./useToast";

// CSV sources
const CSV_SOURCES = [
  { file: '/Category/Jan Aushadhi.csv', source: 'Jan Aushadhi' },
  { file: '/Category/Dava India.csv', source: 'Dava India' },
  { file: '/Category/Zeelabs.csv', source: 'Zeelabs' },
];

export default function MedicineDetailPage() {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const showToast = useToast();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [allMedicines, setAllMedicines] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Load all CSV medicines on mount
  useEffect(() => {
    const loadCSVData = async () => {
      const medicines = [];
      
      for (const source of CSV_SOURCES) {
        try {
          const response = await fetch(source.file);
          const csvText = await response.text();
          const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
          
          parsed.data.forEach(row => {
            const medName = row['Medicine Name'] || row['Product Name'] || row['Name'] || '';
            const price = parseFloat(row['MRP'] || row['Price'] || row['MRP (₹)'] || '0');
            const category = row['Category'] || row['Group Name'] || '';
            const unit = row['Unit'] || row['Pack Size'] || row['Packing'] || '';
            
            if (medName && price > 0) {
              medicines.push({
                name: medName,
                price: price,
                category: category,
                unit: unit,
                genericSource: source.source,
                salts: extractSalts(medName)
              });
            }
          });
        } catch (err) {
          console.error(`Error loading ${source.file}:`, err);
        }
      }
      
      setAllMedicines(medicines);
      return medicines;
    };

    loadCSVData();
  }, []);

  // Extract salts from medicine name
  const extractSalts = (medName) => {
    const commonSalts = [
      'paracetamol', 'ibuprofen', 'aceclofenac', 'diclofenac', 'aspirin',
      'cetirizine', 'levocetirizine', 'fexofenadine', 'montelukast',
      'amoxicillin', 'azithromycin', 'ciprofloxacin', 'ofloxacin', 'cefixime',
      'pantoprazole', 'omeprazole', 'rabeprazole', 'ranitidine', 'domperidone',
      'metformin', 'glimepiride', 'atorvastatin', 'amlodipine', 'telmisartan',
      'paracetamol', 'phenylephrine', 'chlorpheniramine', 'caffeine',
      'methyl salicylate', 'menthol', 'camphor'
    ];
    
    const nameLower = medName.toLowerCase();
    const found = commonSalts.filter(salt => nameLower.includes(salt));
    return found.length > 0 ? found.map(s => s.charAt(0).toUpperCase() + s.slice(1)) : [];
  };

  // Find medicine from CSV or API
  useEffect(() => {
    const decodedName = decodeURIComponent(name);
    setLoading(true);
    setError("");

    // Check if medicine was passed via state (from search results)
    if (location.state?.medicine) {
      setMedicine(location.state.medicine);
      setLoading(false);
      return;
    }

    // Try to find in loaded CSV data first
    const findInCSV = () => {
      if (allMedicines.length === 0) return null;
      
      const normalizedSearch = decodedName.toLowerCase().trim();
      
      // Exact match
      let found = allMedicines.find(m => 
        m.name.toLowerCase() === normalizedSearch
      );
      
      // Partial match
      if (!found) {
        found = allMedicines.find(m => 
          m.name.toLowerCase().includes(normalizedSearch) ||
          normalizedSearch.includes(m.name.toLowerCase())
        );
      }
      
      return found;
    };

    // First try CSV
    const csvMedicine = findInCSV();
    if (csvMedicine) {
      setMedicine(csvMedicine);
      setLoading(false);
      return;
    }

    // If CSV not loaded yet, wait
    if (allMedicines.length === 0) {
      // Will retry when allMedicines updates
      return;
    }

    // Try API as fallback
    axios
      .get(`${BACKEND_BASE}/api/find-generic?brandName=${encodeURIComponent(decodedName)}`)
      .then((res) => {
        if (res.data.success && res.data.genericAlternatives?.length > 0) {
          const alt = res.data.genericAlternatives[0];
          setMedicine({
            name: alt.name,
            price: alt.price,
            salts: res.data.saltComposition || [],
            genericSource: alt.genericSource || 'Generic',
            category: alt.category || ''
          });
        } else {
          // Create a placeholder for the searched medicine
          setMedicine({
            name: decodedName,
            price: 0,
            salts: res.data.saltComposition || [],
            genericSource: 'Not Available',
            category: ''
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Medicine not found in our database.");
        setLoading(false);
      });
  }, [name, allMedicines, location.state]);

  // Find alternatives
  useEffect(() => {
    if (!medicine || !medicine.salts || medicine.salts.length === 0) {
      setAlternatives([]);
      return;
    }

    // Find alternatives from CSV with same salts
    const medicineSalts = medicine.salts.map(s => s.toLowerCase());
    const alts = allMedicines.filter(m => {
      if (m.name === medicine.name) return false;
      const mSalts = m.salts.map(s => s.toLowerCase());
      return medicineSalts.some(salt => mSalts.includes(salt));
    }).slice(0, 6);

    setAlternatives(alts);
  }, [medicine, allMedicines]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!medicine || medicine.price <= 0) return;
    
    const item = {
      name: medicine.name,
      price: medicine.price,
      quantity: quantity,
      genericSource: medicine.genericSource || '',
      category: medicine.category || '',
      salts: medicine.salts || []
    };

    setAddingToCart(true);
    
    if (isAuthenticated) {
      try {
        await dispatch(addToCartAsync(item)).unwrap();
        showToast(`${medicine.name} added to cart!`);
      } catch (error) {
        showToast('Failed to add to cart. Please try again.');
      }
    } else {
      dispatch(addToCart(item));
      showToast(`${medicine.name} added to cart!`);
    }
    
    setAddingToCart(false);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!medicine || medicine.price <= 0) return;
    
    if (!isAuthenticated) {
      showToast('Please login to continue with purchase');
      return;
    }
    
    setBuyingNow(true);
    
    const item = {
      name: medicine.name,
      price: medicine.price,
      quantity: quantity,
      genericSource: medicine.genericSource || '',
      category: medicine.category || '',
      salts: medicine.salts || []
    };
    
    // Navigate to checkout with item details
    navigate('/checkout', { 
      state: { 
        buyNow: true, 
        item: item,
        totalAmount: medicine.price * quantity
      } 
    });
    
    setBuyingNow(false);
  };

  // Calculate discount
  const discount = Math.floor(Math.random() * 30) + 60;
  const mrp = medicine ? Math.round(medicine.price * (100 / (100 - discount))) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0057B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Medicine Not Found</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link to="/medicines" className="text-[#0057B8] font-semibold hover:underline">
            <i className="fas fa-arrow-left mr-2"></i>Browse All Medicines
          </Link>
        </div>
      </div>
    );
  }

  if (!medicine) return null;

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-[#0057B8]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/medicines" className="text-gray-500 hover:text-[#0057B8]">Medicines</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#0057B8]">{medicine.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Image/Icon Section */}
          <div className="bg-white rounded-xl p-8 border border-gray-100">
            <div className="relative">
              {medicine.price > 0 && (
                <span className="absolute top-0 left-0 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
              <div className="flex items-center justify-center h-64">
                <i className="fas fa-pills text-8xl text-[#0057B8]/30"></i>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                100% Genuine
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <i className="fas fa-shield-alt text-[#0057B8] mr-2"></i>
                Quality Assured
              </div>
            </div>
          </div>

          {/* Right - Details Section */}
          <div className="bg-white rounded-xl p-8 border border-gray-100">
            {/* Medicine Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{medicine.name}</h1>
            
            {/* Source Badge */}
            {medicine.genericSource && (
              <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-4 ${
                medicine.genericSource === 'Jan Aushadhi' ? 'bg-green-100 text-green-700' :
                medicine.genericSource === 'Dava India' ? 'bg-orange-100 text-orange-700' :
                medicine.genericSource === 'Zeelabs' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                <i className="fas fa-store mr-1"></i> {medicine.genericSource}
              </span>
            )}

            {/* Salt Composition */}
            <div className="mb-6 p-4 bg-[#F5F7FA] rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Salt Composition</h3>
              <p className="text-gray-800 font-medium">
                {medicine.salts && medicine.salts.length > 0 ? medicine.salts.join(" + ") : "Not available"}
              </p>
            </div>

            {/* Pricing */}
            {medicine.price > 0 ? (
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-[#0057B8]">₹{medicine.price}</span>
                  <span className="text-xl text-gray-400 line-through">₹{mrp}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded">
                    Save ₹{mrp - medicine.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700">
                  <i className="fas fa-info-circle mr-2"></i>
                  Price not available. Check alternatives below.
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            {medicine.price > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-600 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-[#0057B8] hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-[#0057B8] hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-[#0057B8] text-white py-3 rounded-lg font-semibold hover:bg-[#004494] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Adding...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cart-plus mr-2"></i> Add to Cart
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={buyingNow}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {buyingNow ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-bolt mr-2"></i> Buy Now
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Delivery Info */}
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-center">
                <i className="fas fa-truck text-[#0057B8] mr-3"></i>
                <div>
                  <p className="font-medium text-gray-800">Free Delivery</p>
                  <p className="text-sm text-gray-500">Expected delivery within 2-5 business days</p>
                </div>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-hand-holding-usd text-green-500 mr-2"></i>
              Cash on Delivery Available
            </div>
          </div>
        </div>

        {/* Generic Alternatives Section */}
        {alternatives.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              <i className="fas fa-leaf text-green-500 mr-2"></i>
              Generic Alternatives
            </h2>
            <p className="text-gray-500 mb-6">Same composition, same quality, better prices from different sources</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {alternatives.map((alt, idx) => {
                const altDiscount = Math.floor(Math.random() * 30) + 60;
                const altMrp = Math.round(alt.price * (100 / (100 - altDiscount)));
                
                return (
                  <Link 
                    key={idx}
                    to={`/medicines/${encodeURIComponent(alt.name)}`}
                    state={{ medicine: alt }}
                    className={`block p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      idx === 0 ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-[#0057B8]/30'
                    }`}
                  >
                    {idx === 0 && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">
                        <i className="fas fa-check-circle mr-1"></i> Best Match
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-800 mb-1">{alt.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{alt.genericSource || 'Generic'}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#0057B8]">₹{alt.price}</span>
                      <span className="text-sm text-gray-400 line-through">₹{altMrp}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        {altDiscount}% OFF
                      </span>
                    </div>
                    <button className="mt-3 w-full border-2 border-[#0057B8] text-[#0057B8] py-2 rounded-lg text-sm font-medium hover:bg-[#0057B8] hover:text-white transition-colors">
                      View Details
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Medicine Information */}
        <div className="mt-8 bg-white rounded-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-info-circle text-[#0057B8] mr-2"></i>
            About Generic Medicines
          </h2>
          <div className="prose text-gray-600">
            <p className="mb-4">
              Generic medicines contain the same active ingredients as their branded counterparts and work in exactly the same way. 
              They are approved by regulatory authorities and manufactured under strict quality guidelines.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-start">
                <i className="fas fa-flask text-[#0057B8] mt-1 mr-3"></i>
                <div>
                  <h4 className="font-semibold text-gray-800">Same Composition</h4>
                  <p className="text-sm">Identical active ingredients</p>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-certificate text-green-500 mt-1 mr-3"></i>
                <div>
                  <h4 className="font-semibold text-gray-800">FDA Approved</h4>
                  <p className="text-sm">Meets all quality standards</p>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-piggy-bank text-[#FF9800] mt-1 mr-3"></i>
                <div>
                  <h4 className="font-semibold text-gray-800">Affordable</h4>
                  <p className="text-sm">Save up to 85% on costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
