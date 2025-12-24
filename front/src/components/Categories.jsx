import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cartSlice';

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSource, setActiveSource] = useState('jan-aushadhi');
  const [activeCategory, setActiveCategory] = useState('all');
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  // Medicine Sources
  const sources = [
    { id: 'jan-aushadhi', name: 'Jan Aushadhi', color: '#00897B', icon: 'fa-hospital', file: '/Category/Jan Aushadhi.csv' },
    { id: 'dava-india', name: 'Dava India', color: '#E65100', icon: 'fa-pills', file: '/Category/Dava India.csv' },
    { id: 'zeelabs', name: 'Zeelabs', color: '#7B1FA2', icon: 'fa-flask', file: '/Category/Zeelabs.csv' },
  ];

  // Category Icons mapping
  const categoryIcons = {
    'Analgesic/Antipyretic/Anti-Inflammatory': { icon: 'fa-fire-alt', color: '#E74C3C' },
    'Antibiotics': { icon: 'fa-shield-virus', color: '#3498DB' },
    'Anti-Diabetic': { icon: 'fa-tint', color: '#9B59B6' },
    'Anti-Viral': { icon: 'fa-virus', color: '#E91E63' },
    'Cardiovascular System (CVS)': { icon: 'fa-heartbeat', color: '#E74C3C' },
    'Central Nervous System (CNS)': { icon: 'fa-brain', color: '#8E44AD' },
    'Dermatology/Topical/External': { icon: 'fa-spa', color: '#FF9800' },
    'Gastrointestinal (GIT)': { icon: 'fa-stomach', color: '#4CAF50' },
    'Respiratory': { icon: 'fa-lungs', color: '#00BCD4' },
    'Steroids & Hormones': { icon: 'fa-venus-mars', color: '#E91E63' },
    'Anti-Histaminic': { icon: 'fa-allergies', color: '#FF5722' },
    'Supplement/Vitamin/Mineral': { icon: 'fa-capsules', color: '#FFC107' },
    'Opthalmic/Otic': { icon: 'fa-eye', color: '#2196F3' },
    'Oncology': { icon: 'fa-ribbon', color: '#9C27B0' },
    'Anti-Malarial': { icon: 'fa-mosquito', color: '#795548' },
    'Surgical & Medical Consumables': { icon: 'fa-syringe', color: '#607D8B' },
    'Anti-Fungal': { icon: 'fa-bacteria', color: '#795548' },
    'Anti-Retroviral': { icon: 'fa-shield-alt', color: '#673AB7' },
    'Gynaecology': { icon: 'fa-female', color: '#E91E63' },
    'Hepato-Protective': { icon: 'fa-liver', color: '#8D6E63' },
    'Anthelmintic': { icon: 'fa-worm', color: '#A1887F' },
    'Anti-T.B': { icon: 'fa-lungs-virus', color: '#546E7A' },
    'Urology': { icon: 'fa-kidneys', color: '#FF7043' },
    'Diuretic': { icon: 'fa-tint', color: '#4FC3F7' },
    'Anaesthetics': { icon: 'fa-syringe', color: '#90A4AE' },
    'Vaccines': { icon: 'fa-syringe', color: '#66BB6A' },
    'Nutraceuticals': { icon: 'fa-leaf', color: '#8BC34A' },
    'Ayurvedic': { icon: 'fa-mortar-pestle', color: '#4CAF50' },
    'Antiseptic/Disinfectants': { icon: 'fa-spray-can', color: '#26A69A' },
    'Anti-Emetic': { icon: 'fa-stomach', color: '#7CB342' },
    'Anticoagulant': { icon: 'fa-tint', color: '#EF5350' },
    'Other': { icon: 'fa-pills', color: '#78909C' },
    'default': { icon: 'fa-pills', color: '#0057B8' }
  };

  // Main categories list - jo is list mein nahi hain woh "Other" mein jayengi
  const mainCategories = [
    'Analgesic/Antipyretic/Anti-Inflammatory',
    'Antibiotics',
    'Anti-Diabetic',
    'Anti-Viral',
    'Cardiovascular System (CVS)',
    'Central Nervous System (CNS)',
    'Dermatology/Topical/External',
    'Gastrointestinal (GIT)',
    'Respiratory',
    'Steroids & Hormones',
    'Anti-Histaminic',
    'Supplement/Vitamin/Mineral',
    'Opthalmic/Otic',
    'Oncology',
    'Anti-Malarial',
    'Surgical & Medical Consumables',
    'Anti-Fungal',
    'Anti-Retroviral',
    'Gynaecology',
    'Hepato-Protective',
    'Anthelmintic',
    'Anti-T.B',
    'Urology',
    'Diuretic',
    'Anaesthetics',
    'Vaccines',
    'Nutraceuticals',
    'Ayurvedic',
    'Antiseptic/Disinfectants',
    'Anti-Emetic',
    'Anticoagulant',
  ];

  // Category mapping for Dava India (maps Dava India categories to main categories)
  const categoryMapping = {
    // Analgesic related
    'analgesic/antipyretic': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'analgesic/nsaid': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'nsaid/analgesic': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'muscle relaxant/analgesic': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'opioid analgesics': 'Analgesic/Antipyretic/Anti-Inflammatory',
    // Antibiotics
    'antibacterials': 'Antibiotics',
    'antibacterial': 'Antibiotics',
    // CNS
    'antiepileptics': 'Central Nervous System (CNS)',
    'preanaesthetic/anxiolytic': 'Central Nervous System (CNS)',
    'anxiolytic': 'Central Nervous System (CNS)',
    // CVS
    'lipid-lowering agent': 'Cardiovascular System (CVS)',
    'antiplatelet': 'Cardiovascular System (CVS)',
    'cardiac glycoside': 'Cardiovascular System (CVS)',
    // GIT
    'h2 blocker': 'Gastrointestinal (GIT)',
    'antiemetic': 'Gastrointestinal (GIT)',
    'gastrokinetic': 'Gastrointestinal (GIT)',
    'laxative': 'Gastrointestinal (GIT)',
    'antidiarrhoeal': 'Gastrointestinal (GIT)',
    'antacid': 'Gastrointestinal (GIT)',
    'anti-ulcer/ppi': 'Gastrointestinal (GIT)',
    // Respiratory
    'bronchodilator': 'Respiratory',
    'anti-asthmatic': 'Respiratory',
    'mucolytic/expectorant': 'Respiratory',
    'antitussive': 'Respiratory',
    'cough preparation': 'Respiratory',
    'respiratory care': 'Respiratory',
    // Derma
    'topical anti-infective': 'Dermatology/Topical/External',
    'topical corticosteroid': 'Dermatology/Topical/External',
    'keratolytic': 'Dermatology/Topical/External',
    'wound healing': 'Dermatology/Topical/External',
    'skin care': 'Dermatology/Topical/External',
    'hair care': 'Dermatology/Topical/External',
    // Anti-Histaminic
    'antiallergics': 'Anti-Histaminic',
    'antihistamine': 'Anti-Histaminic',
    // Supplements
    'nutritional supplement': 'Supplement/Vitamin/Mineral',
    'vitamin/mineral': 'Supplement/Vitamin/Mineral',
    'electrolyte': 'Supplement/Vitamin/Mineral',
    'iron preparation': 'Supplement/Vitamin/Mineral',
    'calcium supplement': 'Supplement/Vitamin/Mineral',
    'fitness/nutrition': 'Supplement/Vitamin/Mineral',
    // Ophthalmic
    'ophthalmic': 'Opthalmic/Otic',
    'ophthalmic/otic': 'Opthalmic/Otic',
    // Others mappings
    'dmards': 'Oncology',
    'immunosuppressant': 'Oncology',
    'drugs for gout': 'Anti-Diabetic',
    'antifilarials': 'Anthelmintic',
    'antihelminthic agents': 'Anthelmintic',
    'antitubercular': 'Anti-T.B',
    'antiretroviral': 'Anti-Retroviral',
    'antifungal': 'Anti-Fungal',
    'antiviral': 'Anti-Viral',
    'antimalarial': 'Anti-Malarial',
    'anticoagulant/thrombolytic': 'Anticoagulant',
    'corticosteroid': 'Steroids & Hormones',
    'hormone': 'Steroids & Hormones',
    'thyroid': 'Steroids & Hormones',
    'sex hormone': 'Steroids & Hormones',
    'uterine stimulant': 'Gynaecology',
    'feminine hygiene': 'Gynaecology',
    'local anaesthetic': 'Anaesthetics',
    'vaccine': 'Vaccines',
    'nutraceutical': 'Nutraceuticals',
    'ayurvedic/herbal': 'Ayurvedic',
    'herbal': 'Ayurvedic',
    'antiseptic': 'Antiseptic/Disinfectants',
    'disinfectant': 'Antiseptic/Disinfectants',
    'first aid': 'Surgical & Medical Consumables',
    'medical device': 'Surgical & Medical Consumables',
    'orthopedic support': 'Surgical & Medical Consumables',
    'diabetes care': 'Anti-Diabetic',
    'baby care': 'Nutraceuticals',
    'oral care': 'Antiseptic/Disinfectants',
    'personal care': 'Other',
    'home essentials': 'Other',
    // Zeelabs category mappings
    'cardiovascular (heart)': 'Cardiovascular System (CVS)',
    'cardiovascular': 'Cardiovascular System (CVS)',
    'gastrointestinal': 'Gastrointestinal (GIT)',
    'gastrointestinal/pain': 'Gastrointestinal (GIT)',
    'gastrointestinal, cns, and others': 'Gastrointestinal (GIT)',
    'nutritional supplements': 'Supplement/Vitamin/Mineral',
    'metabolic (diabetes)': 'Anti-Diabetic',
    'metabolic (gout)': 'Anti-Diabetic',
    'metabolic': 'Anti-Diabetic',
    'cns and psychiatric agents': 'Central Nervous System (CNS)',
    'cns': 'Central Nervous System (CNS)',
    'pain/musculoskeletal': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'pain': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'musculoskeletal': 'Analgesic/Antipyretic/Anti-Inflammatory',
    'anti-infectives (antibiotic)': 'Antibiotics',
    'anti-infectives (antiviral)': 'Anti-Viral',
    'anti-infectives (antifungal)': 'Anti-Fungal',
    'anti-infectives (antimalarial)': 'Anti-Malarial',
    'anti-infectives (anthelmintic)': 'Anthelmintic',
    'anti-infectives (ophthalmic)': 'Opthalmic/Otic',
    'anti-infectives': 'Antibiotics',
    'dermatological': 'Dermatology/Topical/External',
    'respiratory/ent': 'Respiratory',
    'ent': 'Respiratory',
    'hormonal (thyroid)': 'Steroids & Hormones',
    'hormonal (steroids)': 'Steroids & Hormones',
    'hormonal': 'Steroids & Hormones',
    'genitourinary': 'Urology',
    "women's health": 'Gynaecology',
    'oncology/immunosuppressant': 'Oncology',
  };

  // Function to normalize category names
  const normalizeCategory = (category) => {
    if (!category || category.trim() === '') return 'Other';
    
    const trimmedCategory = category.trim();
    
    // Check if category matches any main category (case-insensitive)
    const matchedCategory = mainCategories.find(
      mainCat => mainCat.toLowerCase() === trimmedCategory.toLowerCase()
    );
    
    if (matchedCategory) return matchedCategory;
    
    // Check in categoryMapping (for Dava India categories)
    const lowerCategory = trimmedCategory.toLowerCase();
    for (const [key, value] of Object.entries(categoryMapping)) {
      if (lowerCategory.includes(key) || key.includes(lowerCategory.split('/')[0])) {
        return value;
      }
    }
    
    // If not found in main categories or mapping, return "Other"
    return 'Other';
  };

  // Load CSV data
  useEffect(() => {
    loadMedicinesFromCSV();
  }, [activeSource]);

  const loadMedicinesFromCSV = async () => {
    setLoading(true);
    const source = sources.find(s => s.id === activeSource);
    
    try {
      const response = await fetch(source.file);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().replace(/\s+/g, ' '), // Clean header names
        complete: (results) => {
          const data = results.data.map((row, index) => {
            // Dynamic column detection for different CSV formats
            const headers = Object.keys(row);
            
            // Find Group/Category column (Jan Aushadhi: "Group Name", Dava India: "Group")
            const groupKey = headers.find(key => 
              key.toLowerCase().replace(/\s+/g, '').includes('groupname') ||
              key.toLowerCase() === 'group'
            );
            
            // Find Medicine Name column (Jan Aushadhi: "Generic Name", Dava India: "Medicine Name")
            const nameKey = headers.find(key => 
              key.toLowerCase().includes('generic name') ||
              key.toLowerCase().includes('medicine name')
            );
            
            // Find Price column (Jan Aushadhi: "MRP", Dava India: "MRP (INR)")
            const priceKey = headers.find(key => 
              key.toLowerCase().includes('mrp')
            );
            
            // Find Unit Size column
            const unitKey = headers.find(key => 
              key.toLowerCase().includes('unit size') ||
              key.toLowerCase().includes('unitsize')
            );
            
            const groupName = groupKey ? row[groupKey] : '';
            
            return {
              id: index + 1,
              srNo: row['Sr No'] || index + 1,
              drugCode: row['Drug Code'] || '',
              name: nameKey ? row[nameKey] : '',
              unitSize: unitKey ? row[unitKey] : '',
              price: priceKey ? (parseFloat(row[priceKey]) || 0) : 0,
              category: normalizeCategory(groupName),
              source: activeSource
            };
          });
          
          // Filter out empty entries
          const validData = data.filter(item => item.name && item.name.trim() !== '');
          
          setMedicines(validData);
          
          // Extract unique categories and sort (keeping "Other" at the end)
          const uniqueCategories = [...new Set(validData.map(m => m.category))].filter(c => c);
          const sortedCategories = uniqueCategories
            .filter(c => c !== 'Other')
            .sort()
            .concat(uniqueCategories.includes('Other') ? ['Other'] : []);
          setCategories(sortedCategories);
          setLoading(false);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setMedicines([]);

          setCategories([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      setMedicines([]);
      setCategories([]);
      setLoading(false);
    }
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    for (const key of Object.keys(categoryIcons)) {
      if (category.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(category.toLowerCase().split('/')[0])) {
        return categoryIcons[key];
      }
    }
    return categoryIcons['default'];
  };

  // Filter medicines by category
  const filteredMedicines = activeCategory === 'all' 
    ? medicines 
    : medicines.filter(m => m.category === activeCategory);

  // Calculate discount
  const getDiscount = (price) => {
    const discountPercent = Math.floor(Math.random() * 31) + 60; // 60-90%
    const mrp = Math.round(price / (1 - discountPercent / 100));
    return { mrp, discountPercent };
  };

  // Add to cart handler
  const handleAddToCart = (medicine, e) => {
    e.preventDefault();
    e.stopPropagation();
    const { mrp, discountPercent } = getDiscount(medicine.price);
    dispatch(addToCart({
      name: medicine.name,
      price: `₹${medicine.price}`,
      mrp: `₹${mrp}`,
      discount: discountPercent,
      source: activeSource,
      unitSize: medicine.unitSize,
      quantity: 1
    }));
    setAddedId(medicine.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Jan Aushadhi & Generic Medicines</h1>
          <p className="text-blue-100 text-lg mb-6">Quality medicines at affordable prices - Save up to 85%</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
              <i className="fas fa-certificate text-yellow-300 mr-2"></i>
              <span>WHO-GMP Certified</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
              <i className="fas fa-truck text-green-300 mr-2"></i>
              <span>Free Delivery on ₹500+</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
              <i className="fas fa-shield-alt text-blue-200 mr-2"></i>
              <span>100% Genuine</span>
            </div>
          </div>
        </div>
      </div>
      {/* Source Selection Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => { setActiveSource(source.id); setActiveCategory('all'); }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeSource === source.id
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeSource === source.id ? { backgroundColor: source.color } : {}}
              >
                <i className={`fas ${source.icon} mr-2`}></i>
                {source.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-36">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-th-large text-[#0057B8] mr-2"></i>
                Medicine Categories
              </h3>
              
              {/* All Medicines Button */}
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 font-medium transition-all flex items-center justify-between ${
                  activeCategory === 'all'
                    ? 'bg-[#0057B8] text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center">
                  <i className="fas fa-pills mr-3"></i>
                  All Medicines
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${activeCategory === 'all' ? 'bg-white/20' : 'bg-gray-200'}`}>
                  {medicines.length}
                </span>
              </button>

              {/* Category List */}
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                {categories.map((category) => {
                  const iconData = getCategoryIcon(category);
                  const count = medicines.filter(m => m.category === category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group ${
                        activeCategory === category
                          ? 'bg-[#0057B8] text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center text-sm">
                        <span 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            activeCategory === category ? 'bg-white/20' : ''
                          }`}
                          style={{ backgroundColor: activeCategory !== category ? `${iconData.color}15` : '' }}
                        >
                          <i 
                            className={`fas ${iconData.icon} text-xs`} 
                            style={{ color: activeCategory === category ? 'white' : iconData.color }}
                          ></i>
                        </span>
                        <span className="line-clamp-1">{category}</span>
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === category ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Medicines Grid */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {activeCategory === 'all' ? 'All Medicines' : activeCategory}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {filteredMedicines.length} medicines found from {sources.find(s => s.id === activeSource)?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]">
                    <option>Name (A-Z)</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                <div className="w-16 h-16 border-4 border-[#0057B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Loading medicines...</p>
              </div>
            ) : filteredMedicines.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            ) : (
              /* Medicine Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMedicines.slice(0, 40).map((medicine) => {
                  const { mrp, discountPercent } = getDiscount(medicine.price);
                  const isAdded = addedId === medicine.id;
                  
                  return (
                    <div
                      key={medicine.id}
                      className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                        isAdded ? 'ring-2 ring-green-500' : ''
                      }`}
                    >
                      {/* Card Header with Discount */}
                      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          {discountPercent}% OFF
                        </span>
                        <span className="absolute top-3 right-3 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                          {medicine.unitSize}
                        </span>
                        {/* Source Badge */}
                        <span 
                          className="absolute bottom-2 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: sources.find(s => s.id === activeSource)?.color }}
                        >
                          {sources.find(s => s.id === activeSource)?.name}
                        </span>
                        <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform">
                          <i className="fas fa-pills text-3xl text-[#0057B8]"></i>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-4">
                        {/* Category Badge */}
                        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-[#0057B8] mb-2">
                          {medicine.category}
                        </span>
                        
                        {/* Medicine Name */}
                        <h3 
                          className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-[#0057B8] transition-colors min-h-[40px]"
                          onClick={() => navigate(`/medicines/${encodeURIComponent(medicine.name)}`)}
                        >
                          {medicine.name}
                        </h3>
                        
                        {/* Price Section */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-[#0057B8]">₹{medicine.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-400 line-through">₹{mrp}</span>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleAddToCart(medicine, e)}
                          disabled={isAdded}
                          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                            isAdded
                              ? 'bg-green-500 text-white'
                              : 'bg-[#0057B8] text-white hover:bg-[#004494]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <i className="fas fa-check"></i>
                              Added to Cart
                            </>
                          ) : (
                            <>
                              <i className="fas fa-cart-plus"></i>
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More Button */}
            {filteredMedicines.length > 40 && (
              <div className="text-center mt-8">
                <button className="bg-white border-2 border-[#0057B8] text-[#0057B8] px-8 py-3 rounded-xl font-semibold hover:bg-[#0057B8] hover:text-white transition-all">
                  Load More Medicines ({filteredMedicines.length - 40} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bottom Info Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#E8F4FD] to-[#F0F8FF] rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Why Choose Jan Aushadhi?
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Jan Aushadhi Kendras are government-run stores that provide quality generic medicines 
                  at affordable prices. These medicines are equally effective as branded ones but cost 
                  up to 85% less!
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span className="text-gray-700">Government approved quality medicines</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span className="text-gray-700">WHO-GMP certified manufacturing</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span className="text-gray-700">Save up to 85% on medicine bills</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span className="text-gray-700">2400+ medicines available</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="text-6xl font-bold text-[#0057B8] mb-2">85%</div>
                  <div className="text-gray-600 text-lg">Average Savings</div>
                  <div className="mt-4 text-sm text-gray-500">on generic medicines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 bg-[#0057B8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{medicines.length}+</div>
              <div className="text-white/80 text-sm">Medicines Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{categories.length}</div>
              <div className="text-white/80 text-sm">Health Categories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">85%</div>
              <div className="text-white/80 text-sm">Average Savings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-white/80 text-sm">Genuine Medicines</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
