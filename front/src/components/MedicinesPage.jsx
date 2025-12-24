import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../cartSlice";
import Papa from "papaparse";

// Medicine Sources Configuration
const sources = [
  { id: 'jan-aushadhi', name: 'Jan Aushadhi', color: '#00897B', icon: 'fa-hospital', file: '/Category/Jan Aushadhi.csv', description: 'Government Generic Store' },
  { id: 'dava-india', name: 'Dava India', color: '#E65100', icon: 'fa-pills', file: '/Category/Dava India.csv', description: 'Affordable Generics' },
  { id: 'zeelabs', name: 'Zeelabs', color: '#7B1FA2', icon: 'fa-flask', file: '/Category/Zeelabs.csv', description: 'Quality Generics' },
];

// Category Icons
const categoryIcons = {
  'Analgesic/Antipyretic/Anti-Inflammatory': { icon: 'fa-fire-alt', color: '#E74C3C', shortName: 'Pain Relief' },
  'Antibiotics': { icon: 'fa-shield-virus', color: '#3498DB', shortName: 'Antibiotics' },
  'Anti-Diabetic': { icon: 'fa-tint', color: '#9B59B6', shortName: 'Diabetes' },
  'Anti-Viral': { icon: 'fa-virus', color: '#E91E63', shortName: 'Anti-Viral' },
  'Cardiovascular System (CVS)': { icon: 'fa-heartbeat', color: '#E74C3C', shortName: 'Heart Health' },
  'Central Nervous System (CNS)': { icon: 'fa-brain', color: '#8E44AD', shortName: 'Brain & Nerves' },
  'Dermatology/Topical/External': { icon: 'fa-spa', color: '#FF9800', shortName: 'Skin Care' },
  'Gastrointestinal (GIT)': { icon: 'fa-stomach', color: '#4CAF50', shortName: 'Digestive' },
  'Respiratory': { icon: 'fa-lungs', color: '#00BCD4', shortName: 'Respiratory' },
  'Steroids & Hormones': { icon: 'fa-venus-mars', color: '#E91E63', shortName: 'Hormonal' },
  'Anti-Histaminic': { icon: 'fa-allergies', color: '#FF5722', shortName: 'Allergy' },
  'Supplement/Vitamin/Mineral': { icon: 'fa-capsules', color: '#FFC107', shortName: 'Vitamins' },
  'Opthalmic/Otic': { icon: 'fa-eye', color: '#2196F3', shortName: 'Eye & Ear' },
  'Oncology': { icon: 'fa-ribbon', color: '#9C27B0', shortName: 'Cancer Care' },
  'Anti-Malarial': { icon: 'fa-mosquito', color: '#795548', shortName: 'Anti-Malarial' },
  'Surgical & Medical Consumables': { icon: 'fa-syringe', color: '#607D8B', shortName: 'Surgical' },
  'Anti-Fungal': { icon: 'fa-bacteria', color: '#795548', shortName: 'Anti-Fungal' },
  'Anti-Retroviral': { icon: 'fa-shield-alt', color: '#673AB7', shortName: 'Anti-Retroviral' },
  'Gynaecology': { icon: 'fa-female', color: '#E91E63', shortName: 'Gynaecology' },
  'Hepato-Protective': { icon: 'fa-liver', color: '#8D6E63', shortName: 'Liver Care' },
  'Anthelmintic': { icon: 'fa-worm', color: '#A1887F', shortName: 'Anthelmintic' },
  'Anti-T.B': { icon: 'fa-lungs-virus', color: '#546E7A', shortName: 'Anti-T.B' },
  'Urology': { icon: 'fa-kidneys', color: '#FF7043', shortName: 'Urology' },
  'Diuretic': { icon: 'fa-tint', color: '#4FC3F7', shortName: 'Diuretic' },
  'Anaesthetics': { icon: 'fa-syringe', color: '#90A4AE', shortName: 'Anaesthetics' },
  'Vaccines': { icon: 'fa-syringe', color: '#66BB6A', shortName: 'Vaccines' },
  'Nutraceuticals': { icon: 'fa-leaf', color: '#8BC34A', shortName: 'Nutraceuticals' },
  'Ayurvedic': { icon: 'fa-mortar-pestle', color: '#4CAF50', shortName: 'Ayurvedic' },
  'Antiseptic/Disinfectants': { icon: 'fa-spray-can', color: '#26A69A', shortName: 'Antiseptic' },
  'Anti-Emetic': { icon: 'fa-stomach', color: '#7CB342', shortName: 'Anti-Emetic' },
  'Anticoagulant': { icon: 'fa-tint', color: '#EF5350', shortName: 'Anticoagulant' },
  'Other': { icon: 'fa-pills', color: '#78909C', shortName: 'Other' },
  'default': { icon: 'fa-pills', color: '#0057B8', shortName: 'Other' }
};

// Main categories list
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

// Category mapping for Dava India
const categoryMapping = {
  'analgesic/antipyretic': 'Analgesic/Antipyretic/Anti-Inflammatory',
  'analgesic/nsaid': 'Analgesic/Antipyretic/Anti-Inflammatory',
  'nsaid/analgesic': 'Analgesic/Antipyretic/Anti-Inflammatory',
  'muscle relaxant/analgesic': 'Analgesic/Antipyretic/Anti-Inflammatory',
  'opioid analgesics': 'Analgesic/Antipyretic/Anti-Inflammatory',
  'antibacterials': 'Antibiotics',
  'antibacterial': 'Antibiotics',
  'antiepileptics': 'Central Nervous System (CNS)',
  'preanaesthetic/anxiolytic': 'Central Nervous System (CNS)',
  'anxiolytic': 'Central Nervous System (CNS)',
  'lipid-lowering agent': 'Cardiovascular System (CVS)',
  'antiplatelet': 'Cardiovascular System (CVS)',
  'cardiac glycoside': 'Cardiovascular System (CVS)',
  'anti-hypertensive': 'Cardiovascular System (CVS)',
  'h2 blocker': 'Gastrointestinal (GIT)',
  'antiemetic': 'Gastrointestinal (GIT)',
  'gastrokinetic': 'Gastrointestinal (GIT)',
  'laxative': 'Gastrointestinal (GIT)',
  'antidiarrhoeal': 'Gastrointestinal (GIT)',
  'antacid': 'Gastrointestinal (GIT)',
  'anti-ulcer/ppi': 'Gastrointestinal (GIT)',
  'bronchodilator': 'Respiratory',
  'anti-asthmatic': 'Respiratory',
  'mucolytic/expectorant': 'Respiratory',
  'antitussive': 'Respiratory',
  'cough preparation': 'Respiratory',
  'respiratory care': 'Respiratory',
  'topical anti-infective': 'Dermatology/Topical/External',
  'topical corticosteroid': 'Dermatology/Topical/External',
  'keratolytic': 'Dermatology/Topical/External',
  'wound healing': 'Dermatology/Topical/External',
  'skin care': 'Dermatology/Topical/External',
  'hair care': 'Dermatology/Topical/External',
  'antiallergics': 'Anti-Histaminic',
  'antihistamine': 'Anti-Histaminic',
  'nutritional supplement': 'Supplement/Vitamin/Mineral',
  'vitamin/mineral': 'Supplement/Vitamin/Mineral',
  'electrolyte': 'Supplement/Vitamin/Mineral',
  'iron preparation': 'Supplement/Vitamin/Mineral',
  'calcium supplement': 'Supplement/Vitamin/Mineral',
  'fitness/nutrition': 'Supplement/Vitamin/Mineral',
  'ophthalmic': 'Opthalmic/Otic',
  'ophthalmic/otic': 'Opthalmic/Otic',
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

// Normalize category function
const normalizeCategory = (category) => {
  if (!category || category.trim() === '') return 'Other';
  const trimmedCategory = category.trim();
  
  const matchedCategory = mainCategories.find(
    mainCat => mainCat.toLowerCase() === trimmedCategory.toLowerCase()
  );
  if (matchedCategory) return matchedCategory;
  
  const lowerCategory = trimmedCategory.toLowerCase();
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (lowerCategory.includes(key) || key.includes(lowerCategory.split('/')[0])) {
      return value;
    }
  }
  return 'Other';
};

const MedicinesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState('jan-aushadhi');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [addedId, setAddedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const medicinesPerPage = 24;

  // Load CSV Data
  useEffect(() => {
    loadMedicinesFromCSV();
  }, [activeSource]);

  // Handle URL params
  useEffect(() => {
    const source = searchParams.get('source');
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    
    if (source) setActiveSource(source);
    if (category) setActiveCategory(category);
    if (searchQuery) setSearch(searchQuery);
  }, [searchParams]);

  const loadMedicinesFromCSV = async () => {
    setLoading(true);
    const source = sources.find(s => s.id === activeSource);
    
    try {
      const response = await fetch(source.file);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().replace(/\s+/g, ' '),
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
          const validData = data.filter(m => m.name && m.name.trim() !== '');
          
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

  // Get category icon
  const getCategoryIcon = (category) => {
    for (const key of Object.keys(categoryIcons)) {
      if (category?.toLowerCase().includes(key.toLowerCase().split('/')[0])) {
        return categoryIcons[key];
      }
    }
    return categoryIcons['default'];
  };

  // Filter and Sort
  const filteredMedicines = medicines
    .filter(m => {
      const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
      const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name?.localeCompare(b.name);
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * medicinesPerPage,
    currentPage * medicinesPerPage
  );

  // Calculate discount
  const getDiscount = (price) => {
    const discountPercent = Math.floor(Math.random() * 31) + 60;
    const mrp = Math.round(price / (1 - discountPercent / 100));
    return { mrp, discountPercent };
  };

  // Add to cart
  const handleAddToCart = (medicine, e) => {
    e.preventDefault();
    e.stopPropagation();
    const { mrp, discountPercent } = getDiscount(medicine.price);
    dispatch(addToCart({
      name: medicine.name,
      price: `₹${medicine.price}`,
      mrp: `₹${mrp}`,
      discount: discountPercent,
      source: sources.find(s => s.id === activeSource)?.name,
      unitSize: medicine.unitSize,
      quantity: 1
    }));
    setAddedId(medicine.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const currentSource = sources.find(s => s.id === activeSource);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0057B8] via-[#0066CC] to-[#00A6E3] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm mb-4 text-blue-100">
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">›</span>
            <span className="text-white font-medium">All Medicines</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Generic Medicines Store
              </h1>
              <p className="text-blue-100 text-lg">
                {filteredMedicines.length} quality medicines • Save up to 85% on your prescriptions
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">{medicines.length}+</div>
                <div className="text-xs text-blue-100">Medicines</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">{categories.length}</div>
                <div className="text-xs text-blue-100">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-xs text-blue-100">Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 py-4 overflow-x-auto">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => { setActiveSource(source.id); setActiveCategory('all'); setCurrentPage(1); }}
                className={`flex items-center px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeSource === source.id
                    ? 'text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeSource === source.id ? { backgroundColor: source.color } : {}}
              >
                <i className={`fas ${source.icon} mr-2`}></i>
                {source.name}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeSource === source.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {activeSource === source.id ? medicines.length : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-search text-[#0057B8] mr-2"></i>
                Search Medicines
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Type medicine name..."
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent"
                />
                <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-36">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-th-large text-[#0057B8] mr-2"></i>
                Categories
              </h3>

              {/* All Button */}
              <button
                onClick={() => { setActiveCategory('all'); setCurrentPage(1); }}
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
              <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                {categories.map((category) => {
                  const iconData = getCategoryIcon(category);
                  const count = medicines.filter(m => m.category === category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
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
                        <span className="line-clamp-1">{iconData.shortName || category.split('/')[0]}</span>
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

            {/* Info Box */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 mt-6 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-shield-alt text-green-600"></i>
                <span className="font-bold text-green-800">100% Genuine</span>
              </div>
              <p className="text-sm text-green-700">All medicines from licensed pharmacies & government stores</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: currentSource?.color }}
                  >
                    <i className={`fas ${currentSource?.icon} text-white`}></i>
                  </span>
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {activeCategory === 'all' ? 'All Medicines' : getCategoryIcon(activeCategory).shortName || activeCategory.split('/')[0]}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {filteredMedicines.length} medicines from {currentSource?.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Mode */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <i className="fas fa-th-large text-gray-600"></i>
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <i className="fas fa-list text-gray-600"></i>
                    </button>
                  </div>
                  
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
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
                <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <>
                {/* Medicine Grid */}
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedMedicines.map((medicine) => {
                    const { mrp, discountPercent } = getDiscount(medicine.price);
                    const isAdded = addedId === medicine.id;
                    const iconData = getCategoryIcon(medicine.category);

                    if (viewMode === 'list') {
                      return (
                        <div
                          key={medicine.id}
                          className={`bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all flex items-center gap-4 ${
                            isAdded ? 'ring-2 ring-green-500' : ''
                          }`}
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                            <i className="fas fa-pills text-2xl text-[#0057B8]"></i>
                            <span 
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-white text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                              style={{ backgroundColor: currentSource?.color }}
                            >
                              {currentSource?.name}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 
                              className="font-semibold text-gray-800 cursor-pointer hover:text-[#0057B8] truncate"
                              onClick={() => navigate(`/medicines/${encodeURIComponent(medicine.name)}`)}
                            >
                              {medicine.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-blue-50 text-[#0057B8] px-2 py-0.5 rounded-full">
                                {iconData.shortName || medicine.category.split('/')[0]}
                              </span>
                              <span className="text-xs text-gray-500">{medicine.unitSize}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-[#0057B8]">₹{medicine.price.toFixed(2)}</div>
                            <div className="text-xs text-gray-400 line-through">₹{mrp}</div>
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(medicine, e)}
                            disabled={isAdded}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                              isAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-[#0057B8] text-white hover:bg-[#004494]'
                            }`}
                          >
                            {isAdded ? <i className="fas fa-check"></i> : <i className="fas fa-cart-plus"></i>}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={medicine.id}
                        className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                          isAdded ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        {/* Card Header */}
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
                            style={{ backgroundColor: currentSource?.color }}
                          >
                            {currentSource?.name}
                          </span>
                          <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i className="fas fa-pills text-3xl text-[#0057B8]"></i>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                          <span 
                            className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full mb-2"
                            style={{ backgroundColor: `${iconData.color}15`, color: iconData.color }}
                          >
                            <i className={`fas ${iconData.icon} mr-1 text-[10px]`}></i>
                            {iconData.shortName || medicine.category.split('/')[0]}
                          </span>

                          <h3
                            className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-[#0057B8] transition-colors min-h-[40px]"
                            onClick={() => navigate(`/medicines/${encodeURIComponent(medicine.name)}`)}
                          >
                            {medicine.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-[#0057B8]">₹{medicine.price.toFixed(2)}</span>
                            <span className="text-sm text-gray-400 line-through">₹{mrp}</span>
                          </div>

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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === pageNum
                              ? 'bg-[#0057B8] text-white'
                              : 'border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                  Page {currentPage} of {totalPages} • Showing {paginatedMedicines.length} of {filteredMedicines.length} medicines
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Save More with Generic Medicines</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Same quality, same composition, same effectiveness - at a fraction of the branded medicine price
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center bg-white/10 px-5 py-3 rounded-xl">
              <i className="fas fa-check-circle text-green-400 mr-2"></i>
              <span>FDA Approved</span>
            </div>
            <div className="flex items-center bg-white/10 px-5 py-3 rounded-xl">
              <i className="fas fa-check-circle text-green-400 mr-2"></i>
              <span>WHO-GMP Certified</span>
            </div>
            <div className="flex items-center bg-white/10 px-5 py-3 rounded-xl">
              <i className="fas fa-check-circle text-green-400 mr-2"></i>
              <span>Up to 85% Savings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;
