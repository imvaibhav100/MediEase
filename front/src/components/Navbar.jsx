
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import { useSelector, useDispatch } from "react-redux";
import { setSearchValue, clearSearch, clearSearchOverlay, fetchGenericMedicine } from "../searchSlice";
import { fetchCart } from "../cartSlice";
import Papa from "papaparse";

const navLinks = [
	{ name: "Home", href: "/" },
	{ name: "Medicines", href: "/medicines" },
	{ name: "Find Generic", href: "/find-generic" },
	{ name: "Wellness", href: "/wellness" },
	{ name: "Support", href: "/support" },
];

// Category Icons mapping based on CSV Group Names
const categoryIconsMap = {
	'Analgesic/Antipyretic/Anti-Inflammatory': { icon: 'fa-fire-alt', color: 'bg-red-100 text-red-600', shortName: 'Pain Relief' },
	'Antibiotics': { icon: 'fa-shield-virus', color: 'bg-blue-100 text-blue-600', shortName: 'Antibiotics' },
	'Anti-Diabetic': { icon: 'fa-tint', color: 'bg-purple-100 text-purple-600', shortName: 'Diabetes' },
	'Anti-Viral': { icon: 'fa-virus', color: 'bg-pink-100 text-pink-600', shortName: 'Anti-Viral' },
	'Cardiovascular System (CVS)': { icon: 'fa-heartbeat', color: 'bg-red-100 text-red-600', shortName: 'Heart Health' },
	'Central Nervous System (CNS)': { icon: 'fa-brain', color: 'bg-indigo-100 text-indigo-600', shortName: 'Brain & Nerves' },
	'Dermatology/Topical/External': { icon: 'fa-spa', color: 'bg-orange-100 text-orange-600', shortName: 'Skin Care' },
	'Gastrointestinal (GIT)': { icon: 'fa-stomach', color: 'bg-green-100 text-green-600', shortName: 'Digestive' },
	'Respiratory': { icon: 'fa-lungs', color: 'bg-cyan-100 text-cyan-600', shortName: 'Respiratory' },
	'Steroids & Hormones': { icon: 'fa-venus-mars', color: 'bg-rose-100 text-rose-600', shortName: 'Hormonal' },
	'Anti-Histaminic': { icon: 'fa-allergies', color: 'bg-amber-100 text-amber-600', shortName: 'Allergy' },
	'Supplement/Vitamin/Mineral': { icon: 'fa-capsules', color: 'bg-yellow-100 text-yellow-600', shortName: 'Vitamins' },
	'Opthalmic/Otic': { icon: 'fa-eye', color: 'bg-sky-100 text-sky-600', shortName: 'Eye & Ear' },
	'Oncology': { icon: 'fa-ribbon', color: 'bg-violet-100 text-violet-600', shortName: 'Cancer Care' },
	'Anti-Malarial': { icon: 'fa-mosquito', color: 'bg-lime-100 text-lime-600', shortName: 'Anti-Malarial' },
	'Surgical & Medical Consumables': { icon: 'fa-syringe', color: 'bg-gray-100 text-gray-600', shortName: 'Surgical' },
	'Anti-Fungal': { icon: 'fa-bacteria', color: 'bg-amber-100 text-amber-700', shortName: 'Anti-Fungal' },
	'Anti-Retroviral': { icon: 'fa-shield-alt', color: 'bg-indigo-100 text-indigo-700', shortName: 'Anti-Retroviral' },
	'Gynaecology': { icon: 'fa-female', color: 'bg-pink-100 text-pink-600', shortName: 'Gynaecology' },
	'Hepato-Protective': { icon: 'fa-liver', color: 'bg-amber-100 text-amber-800', shortName: 'Liver Care' },
	'Anthelmintic': { icon: 'fa-worm', color: 'bg-stone-100 text-stone-600', shortName: 'Anthelmintic' },
	'Anti-T.B': { icon: 'fa-lungs-virus', color: 'bg-slate-100 text-slate-600', shortName: 'Anti-T.B' },
	'Urology': { icon: 'fa-kidneys', color: 'bg-orange-100 text-orange-700', shortName: 'Urology' },
	'Diuretic': { icon: 'fa-tint', color: 'bg-sky-100 text-sky-700', shortName: 'Diuretic' },
	'Anaesthetics': { icon: 'fa-syringe', color: 'bg-gray-100 text-gray-500', shortName: 'Anaesthetics' },
	'Vaccines': { icon: 'fa-syringe', color: 'bg-green-100 text-green-600', shortName: 'Vaccines' },
	'Nutraceuticals': { icon: 'fa-leaf', color: 'bg-lime-100 text-lime-700', shortName: 'Nutraceuticals' },
	'Ayurvedic': { icon: 'fa-mortar-pestle', color: 'bg-green-100 text-green-700', shortName: 'Ayurvedic' },
	'Antiseptic/Disinfectants': { icon: 'fa-spray-can', color: 'bg-teal-100 text-teal-600', shortName: 'Antiseptic' },
	'Anti-Emetic': { icon: 'fa-stomach', color: 'bg-lime-100 text-lime-600', shortName: 'Anti-Emetic' },
	'Anticoagulant': { icon: 'fa-tint', color: 'bg-red-100 text-red-500', shortName: 'Anticoagulant' },
	'Other': { icon: 'fa-pills', color: 'bg-slate-100 text-slate-600', shortName: 'Other' },
	'default': { icon: 'fa-pills', color: 'bg-blue-100 text-blue-600', shortName: 'Other' }
};

// Main categories list - jo is list mein nahi hain woh "Other" mein jayengi
const mainCategoriesList = [
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
const categoryMappingNav = {
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
const normalizeCategoryName = (category) => {
	if (!category || category.trim() === '') return 'Other';
	const trimmedCategory = category.trim();
	
	// Check if category matches any main category (case-insensitive)
	const matchedCategory = mainCategoriesList.find(
		mainCat => mainCat.toLowerCase() === trimmedCategory.toLowerCase()
	);
	
	if (matchedCategory) return matchedCategory;
	
	// Check in categoryMappingNav (for Dava India categories)
	const lowerCategory = trimmedCategory.toLowerCase();
	for (const [key, value] of Object.entries(categoryMappingNav)) {
		if (lowerCategory.includes(key) || key.includes(lowerCategory.split('/')[0])) {
			return value;
		}
	}
	
	return 'Other';
};

// Medicine sources/brands
const medicineSources = [
	{ id: "jan-aushadhi", name: "Jan Aushadhi", icon: "fa-hospital", color: "bg-teal-600", description: "Government Generic Stores", file: "/Category/Jan Aushadhi.csv" },
	{ id: "dava-india", name: "Dava India", icon: "fa-pills", color: "bg-orange-600", description: "Affordable Generics", file: "/Category/Dava India.csv" },
	{ id: "zeelabs", name: "Zeelabs", icon: "fa-flask", color: "bg-purple-600", description: "Quality Generics", file: "/Category/Zeelabs.csv" },
];

const Navbar = () => {
	const dispatch = useDispatch();
	const searchValue = useSelector((state) => state.search.value);
	const searchResult = useSelector((state) => state.search.result);
	const searchError = useSelector((state) => state.search.error);
	const searchStatus = useSelector((state) => state.search.status);
	const cartItems = useSelector((state) => state.cart.items);
	const cartTotalItems = useSelector((state) => state.cart.totalItems);
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);
	const [signupOpen, setSignupOpen] = useState(false);
	const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
	const [profileDropdown, setProfileDropdown] = useState(false);
	const [categoryDropdown, setCategoryDropdown] = useState(false);
	const [selectedSource, setSelectedSource] = useState(null);
	const [sourceCategories, setSourceCategories] = useState([]);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const categoryRef = useRef(null);
	const searchRef = useRef(null);
	const { user, isAuthenticated, logout } = useAuth();

	// Fetch cart when user is authenticated
	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchCart());
		}
	}, [dispatch, isAuthenticated]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (categoryRef.current && !categoryRef.current.contains(event.target)) {
				setCategoryDropdown(false);
				setSelectedSource(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleClickOutsideSearch = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				if (searchResult || searchError || searchStatus === 'loading') {
					dispatch(clearSearchOverlay());
				}
			}
		};
		document.addEventListener("mousedown", handleClickOutsideSearch);
		return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
	}, [dispatch, searchResult, searchError, searchStatus]);

	// Load categories when source is selected
	useEffect(() => {
		if (selectedSource) {
			loadCategoriesFromCSV(selectedSource);
		}
	}, [selectedSource]);

	const loadCategoriesFromCSV = async (sourceId) => {
		const source = medicineSources.find(s => s.id === sourceId);
		if (!source) return;

		setLoadingCategories(true);
		try {
			const response = await fetch(source.file);
			const csvText = await response.text();
			
			Papa.parse(csvText, {
				header: true,
				skipEmptyLines: true,
				transformHeader: (header) => header.trim().replace(/\s+/g, ' '),
				complete: (results) => {
					// Find Group Name column dynamically (Jan Aushadhi: "Group Name", Dava India: "Group")
					const groupNameKey = results.meta.fields.find(field => 
						field.toLowerCase().replace(/\s+/g, '').includes('groupname') ||
						field.toLowerCase() === 'group'
					);
					
					// Normalize categories and merge small ones into "Other"
					const normalizedCategories = results.data
						.map(row => normalizeCategoryName(groupNameKey ? row[groupNameKey] : ''))
						.filter(c => c);
					
					// Get unique categories and sort (keeping "Other" at end)
					const uniqueCategories = [...new Set(normalizedCategories)];
					const sortedCategories = uniqueCategories
						.filter(c => c !== 'Other')
						.sort()
						.concat(uniqueCategories.includes('Other') ? ['Other'] : []);
					
					setSourceCategories(sortedCategories);
					setLoadingCategories(false);
				}
			});
		} catch (error) {
			console.error('Error loading categories:', error);
			setSourceCategories([]);
			setLoadingCategories(false);
		}
	};

	const getCategoryIcon = (category) => {
		for (const key of Object.keys(categoryIconsMap)) {
			if (category?.toLowerCase().includes(key.toLowerCase().split('/')[0])) {
				return categoryIconsMap[key];
			}
		}
		return categoryIconsMap['default'];
	};

	const handleCategoryClick = (source, category) => {
		setCategoryDropdown(false);
		setSelectedSource(null);
		navigate(`/medicines?source=${source}&category=${encodeURIComponent(category)}`);
	};

	const handleSourceClick = (sourceId) => {
		setCategoryDropdown(false);
		setSelectedSource(null);
		navigate(`/medicines?source=${sourceId}`);
	};

	const handleProfileClick = () => {
		if (isAuthenticated) {
			setProfileDropdown((prev) => !prev);
		} else {
			setLoginOpen(true);
		}
	};

	const handleSwitchToSignup = () => {
		setLoginOpen(false);
		setSignupOpen(true);
	};

	const handleSwitchToLogin = () => {
		setSignupOpen(false);
		setForgotPasswordOpen(false);
		setLoginOpen(true);
	};

	const handleForgotPassword = () => {
		setLoginOpen(false);
		setForgotPasswordOpen(true);
	};

	const handleSearchInput = (e) => {
		dispatch(setSearchValue(e.target.value));
	};

	const handleSearchKeyDown = (e) => {
		if (e.key === 'Enter' && searchValue.trim()) {
			dispatch(fetchGenericMedicine(searchValue.trim()));
		}
	};

	const handleSearchClick = () => {
		if (searchValue.trim()) {
			dispatch(fetchGenericMedicine(searchValue.trim()));
		}
	};

	return (
		<>
			{/* Top Info Bar */}
			<div className="bg-[#0057B8] text-white py-2 px-4 text-sm hidden md:block">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<div className="flex items-center space-x-6">
						<span className="flex items-center">
							<i className="fas fa-phone-alt mr-2"></i>
							1800-XXX-XXXX (Toll Free)
						</span>
						<span className="flex items-center">
							<i className="fas fa-envelope mr-2"></i>
							support@MeduEase.com
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<span className="flex items-center">
							<i className="fas fa-truck mr-2"></i>
							Free Delivery on ₹500+
						</span>
						<span className="flex items-center">
							<i className="fas fa-certificate mr-2"></i>
							100% Genuine Medicines
						</span>
					</div>
				</div>
			</div>

			{/* Main Navbar */}
			<nav className="bg-white shadow-lg px-4 py-3 w-full sticky top-0 z-50 border-b border-gray-100">
				<div className="flex items-center justify-between max-w-7xl mx-auto">
					{/* Logo & Tagline */}
					<Link to="/" className="flex items-center space-x-3">
						<img 
							src="/images/logo.png" 
							alt="MeduEase" 
							className="w-16 h-16 rounded-xl shadow-lg object-cover"
						/>
						<div className="flex flex-col items-start">
							<span className="text-2xl font-bold bg-gradient-to-r from-[#0057B8] to-[#00A6E3] bg-clip-text text-transparent tracking-wide">
								MeduEase
							</span>
							<span className="text-[10px] text-gray-500 font-medium">aapka apna sathii</span>
						</div>
					</Link>

					{/* Search Bar - Enhanced */}
					<div className="hidden md:flex flex-1 mx-8 max-w-2xl">
						<div ref={searchRef} className="relative w-full">
							<div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#0057B8] focus-within:bg-white transition-all shadow-sm">
								<i className="fas fa-search text-gray-400 ml-4"></i>
								<input
									type="text"
									value={searchValue}
									onChange={handleSearchInput}
									onKeyDown={handleSearchKeyDown}
									placeholder="Search for medicines, health products, brands..."
									className="w-full px-4 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
								/>
								<button 
									onClick={handleSearchClick}
									className="bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white px-6 py-3 rounded-r-xl hover:opacity-90 transition-all font-medium">
									Search
								</button>
							</div>
								{/* Search Results Dropdown */}
								{searchStatus === 'loading' && (
									<div className="absolute left-0 top-12 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
										<div className="flex items-center text-[#0057B8]">
											<i className="fas fa-spinner fa-spin mr-2"></i> Searching...
										</div>
									</div>
								)}
								{searchResult && (
									<div className="absolute left-0 top-12 w-full z-50">
										<div className="bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-y-auto">
											{/* Header with Verified Badge */}
											<div className="p-3 bg-[#0057B8] text-white font-semibold flex items-center justify-between">
												<span><i className="fas fa-pills mr-2"></i>Search Results</span>
												{searchResult.verified && (
													<span className="text-xs bg-green-500 px-2 py-1 rounded-full flex items-center">
														<i className="fas fa-check-circle mr-1"></i>Verified
													</span>
												)}
											</div>
											
											{/* Searched Medicine Info */}
											<div className="p-3 border-b border-gray-100">
												<div className="font-semibold text-gray-800">{searchResult.medicines[0]?.name}</div>
												{searchResult.saltComposition && searchResult.saltComposition.length > 0 ? (
													<div className="text-sm text-green-600 flex items-center">
														<i className="fas fa-flask mr-1"></i>
														<span className="font-medium">Salt:</span>&nbsp;
														{searchResult.saltComposition.join(' + ')}
														{searchResult.verified && <i className="fas fa-check-circle ml-2 text-green-500" title="Verified Salt Composition"></i>}
													</div>
												) : (
													<div className="text-sm text-red-500 bg-red-50 p-2 rounded mt-1">
														<i className="fas fa-exclamation-triangle mr-1"></i>
														Medicine not found in verified database. Please check spelling.
													</div>
												)}
											</div>

											{/* Generic Alternatives */}
											{searchResult.alternatives && searchResult.alternatives.length > 0 ? (
												<>
													<div className="p-3 bg-green-600 text-white font-semibold flex items-center justify-between">
														<span><i className="fas fa-leaf mr-2"></i>Verified Generic Alternatives</span>
														<span className="text-xs bg-white/20 px-2 py-0.5 rounded">{searchResult.alternatives.length} found</span>
													</div>
													<ul className="divide-y divide-gray-100">
														{searchResult.alternatives.slice(0, 5).map((alt, idx) => (
															<Link 
																key={alt.id || idx} 
																to={`/medicines/${encodeURIComponent(alt.name)}`}
																state={{ medicine: { ...alt, salts: searchResult.saltComposition || [] } }}
																onClick={() => dispatch(clearSearch())}
																className={`block p-3 hover:bg-green-50 cursor-pointer transition-colors ${idx === 0 ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
																<div className="flex justify-between items-start">
																	<div>
																		<div className="font-semibold text-gray-800 flex items-center">
																			{alt.name}
																			<i className="fas fa-check-circle ml-2 text-green-500 text-xs" title="Verified Generic"></i>
																		</div>
																		<div className="text-xs text-gray-500">
																			<span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{alt.genericSource || 'Jan Aushadhi'}</span>
																		</div>
																	</div>
																	<div className="text-right">
																		<div className="text-green-600 font-bold">₹{alt.price}</div>
																		{idx === 0 && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Best Match</span>}
																	</div>
																</div>
															</Link>
														))}
													</ul>
													{searchResult.alternatives.length > 5 && (
														<Link 
															to={`/find-generic?q=${encodeURIComponent(searchValue)}`}
															onClick={() => dispatch(clearSearch())}
															className="block p-2 text-center bg-gray-50 text-sm text-blue-600 cursor-pointer hover:bg-blue-50">
															View all {searchResult.alternatives.length} alternatives →
														</Link>
													)}
													{/* Medical Disclaimer */}
													<div className="p-2 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-800">
														<i className="fas fa-info-circle mr-1"></i>
														<strong>Note:</strong> Always consult a doctor before switching medicines. Generic alternatives have same salt composition.
													</div>
												</>
											) : (
												<div className="p-4 text-center">
													<div className="text-gray-500 mb-2">
														<i className="fas fa-search mr-2"></i>
														{searchResult.message || 'No verified generic alternatives found'}
													</div>
													{!searchResult.verified && (
														<div className="text-xs text-red-500 bg-red-50 p-2 rounded">
															<i className="fas fa-exclamation-triangle mr-1"></i>
															Please check the medicine name spelling or consult a pharmacist.
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								)}
								{searchError && (
									<div className="absolute left-0 top-12 w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 z-50">
										<i className="fas fa-exclamation-circle mr-2"></i>{searchError}
									</div>
								)}
							</div>
						</div>

						{/* Right Side Actions */}
						<div className="flex items-center space-x-3">
							{/* Upload Prescription */}
							<button className="hidden lg:flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-all font-medium text-sm border border-green-200">
								<i className="fas fa-file-upload mr-2"></i>
								Upload Rx
							</button>

							{/* Offers */}
							<button className="hidden md:flex items-center text-gray-600 hover:text-[#0057B8] transition-colors text-sm font-medium px-3 py-2">
								<i className="fas fa-tags mr-2 text-orange-500"></i>
								Offers
							</button>

							{/* Cart */}
							<Link to="/cart" className="relative flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all">
								<i className="fas fa-shopping-cart text-[#0057B8] text-lg"></i>
								<span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Cart</span>
								{(cartTotalItems > 0 || cartItems.length > 0) && (
									<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
										{cartTotalItems || cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
									</span>
								)}
							</Link>

							{/* User Account */}
							{isAuthenticated ? (
								<div className="relative">
									<button onClick={handleProfileClick} className="flex items-center space-x-2 bg-[#0057B8] text-white px-4 py-2 rounded-lg hover:bg-[#004494] transition-colors">
										<span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
											{(user?.name?.[0] || 'U').toUpperCase()}
										</span>
										<span className="hidden md:block text-sm font-medium">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
										<i className="fas fa-chevron-down text-xs"></i>
									</button>
									{profileDropdown && (
										<div className="absolute right-0 top-14 bg-white rounded-xl shadow-2xl py-4 px-5 min-w-[240px] border border-gray-200 z-50">
											<div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
												<span className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0057B8] to-[#00A6E3] flex items-center justify-center text-white font-bold text-xl">
													{(user?.name?.[0] || 'U').toUpperCase()}
												</span>
												<div>
													<p className="font-semibold text-gray-800">Hi, {user?.name?.split(' ')[0] || 'User'}</p>
													<p className="text-gray-500 text-xs">Welcome back!</p>
												</div>
											</div>
											<div className="space-y-2">
												<Link to="/orders" className="flex items-center text-gray-700 hover:text-[#0057B8] hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
													<i className="fas fa-box mr-3 w-5"></i> My Orders
												</Link>
												<Link to="/prescriptions" className="flex items-center text-gray-700 hover:text-[#0057B8] hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
													<i className="fas fa-file-medical mr-3 w-5"></i> Prescriptions
												</Link>
												<button onClick={() => { logout(); setProfileDropdown(false); }} className="w-full flex items-center text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all">
													<i className="fas fa-sign-out-alt mr-3 w-5"></i> Logout
												</button>
											</div>
										</div>
									)}
								</div>
							) : (
								<button onClick={handleProfileClick} className="flex items-center bg-[#0057B8] text-white px-4 py-2 rounded-lg hover:bg-[#004494] transition-colors text-sm font-medium">
									<i className="fas fa-user mr-2"></i>
									Login
								</button>
							)}

							{/* Mobile Menu Toggle */}
							<button className="md:hidden text-2xl text-gray-600 hover:text-[#0057B8] transition-colors p-2" onClick={() => setMenuOpen(!menuOpen)}>
								<i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
							</button>
						</div>
					</div>

					{/* Category Navigation Bar */}
					<div className="hidden md:block bg-gradient-to-r from-[#0057B8] to-[#00A6E3] mt-3 -mx-4 px-4">
						<div className="max-w-7xl mx-auto flex items-center justify-between py-2">
							{/* Category Dropdown */}
							<div className="relative" ref={categoryRef}>
								<button 
									onClick={() => setCategoryDropdown(!categoryDropdown)}
									className="flex items-center text-white font-semibold px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
								>
									<i className="fas fa-th-large mr-2"></i>
									Shop by Category
									<i className={`fas fa-chevron-down ml-2 text-xs transition-transform ${categoryDropdown ? 'rotate-180' : ''}`}></i>
								</button>

								{/* Mega Menu Dropdown */}
								{categoryDropdown && (
									<div className="absolute left-0 top-14 bg-white rounded-xl shadow-2xl w-[900px] z-50 border border-gray-200 overflow-hidden">
										<div className="flex">
											{/* Source Tabs */}
											<div className="w-1/4 bg-gray-50 border-r border-gray-200 py-4">
												<p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-3">Medicine Sources</p>
												{medicineSources.map((source) => (
													<button
														key={source.id}
														onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
														className={`w-full flex items-center px-4 py-3 text-left transition-all ${
															selectedSource === source.id 
																? 'bg-[#0057B8] text-white' 
																: 'text-gray-700 hover:bg-gray-100'
														}`}
													>
														<span className={`w-10 h-10 rounded-lg ${source.color} flex items-center justify-center mr-3 ${selectedSource === source.id ? 'bg-white/20' : ''}`}>
															<i className={`fas ${source.icon} text-white`}></i>
														</span>
														<div>
															<p className="font-semibold text-sm">{source.name}</p>
															<p className={`text-xs ${selectedSource === source.id ? 'text-white/70' : 'text-gray-500'}`}>{source.description}</p>
														</div>
														<i className={`fas fa-chevron-right ml-auto ${selectedSource === source.id ? 'text-white' : 'text-gray-400'}`}></i>
													</button>
												))}
											</div>

											{/* Category Grid */}
											<div className="w-3/4 p-6">
												<div className="flex items-center justify-between mb-4">
													<p className="text-sm font-semibold text-gray-800">
														{selectedSource 
															? `Browse ${medicineSources.find(s => s.id === selectedSource)?.name} Categories`
															: 'Select a source to browse categories'
														}
													</p>
													{selectedSource && (
														<button 
															onClick={() => handleSourceClick(selectedSource)}
															className="text-xs text-[#0057B8] hover:underline font-medium"
														>
															View All Medicines →
														</button>
													)}
												</div>
												{selectedSource ? (
													loadingCategories ? (
														<div className="flex items-center justify-center h-48">
															<div className="w-8 h-8 border-3 border-[#0057B8] border-t-transparent rounded-full animate-spin"></div>
														</div>
													) : (
														<div className="grid grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2">
															{sourceCategories.map((category) => {
																const iconData = getCategoryIcon(category);
																return (
																	<button
																		key={category}
																		onClick={() => handleCategoryClick(selectedSource, category)}
																		className="flex flex-col items-center p-3 rounded-xl border border-gray-200 hover:border-[#0057B8] hover:shadow-md transition-all group"
																	>
																		<span className={`w-10 h-10 rounded-xl ${iconData.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
																			<i className={`fas ${iconData.icon} text-sm`}></i>
																		</span>
																		<span className="text-xs font-medium text-gray-700 text-center line-clamp-2">{iconData.shortName}</span>
																	</button>
																);
															})}
														</div>
													)
												) : (
													<div className="flex items-center justify-center h-48 text-gray-400">
														<div className="text-center">
															<i className="fas fa-hand-pointer text-4xl mb-3"></i>
															<p>Select a medicine source from the left</p>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Bottom Banner */}
										<div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 flex items-center justify-between">
											<div className="flex items-center text-white">
												<i className="fas fa-percentage text-2xl mr-3"></i>
												<div>
													<p className="font-bold">Save up to 85% on Generic Medicines!</p>
													<p className="text-sm text-white/80">Same quality, same composition, better prices</p>
												</div>
											</div>
											<Link to="/medicines" onClick={() => setCategoryDropdown(false)} className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
												Explore All
											</Link>
										</div>
									</div>
								)}
							</div>

							{/* Quick Links */}
							<div className="flex items-center space-x-6">
								<Link to="/" className="text-white/90 hover:text-white font-medium text-sm transition-colors flex items-center">
									<i className="fas fa-home mr-2"></i> Home
								</Link>
								<Link to="/medicines" className="text-white/90 hover:text-white font-medium text-sm transition-colors flex items-center">
									<i className="fas fa-pills mr-2"></i> All Medicines
								</Link>
								<Link to="/wellness" className="text-white/90 hover:text-white font-medium text-sm transition-colors flex items-center">
									<i className="fas fa-heart mr-2"></i> Wellness
								</Link>
								<a href="#offers" className="text-white/90 hover:text-white font-medium text-sm transition-colors flex items-center">
									<i className="fas fa-gift mr-2"></i> Today's Deals
								</a>
								<Link to="/support" className="text-white/90 hover:text-white font-medium text-sm transition-colors flex items-center">
									<i className="fas fa-headset mr-2"></i> Support
								</Link>
							</div>
						</div>
					</div>

					{/* Mobile Menu */}
					{menuOpen && (
						<div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
							<div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
								<div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0057B8] to-[#00A6E3]">
									<span className="text-white font-bold text-lg">Menu</span>
									<button onClick={() => setMenuOpen(false)} className="text-white text-2xl">
										<i className="fas fa-times"></i>
									</button>
								</div>
								
								{/* Mobile Search */}
								<div className="p-4 border-b border-gray-200">
									<div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
										<i className="fas fa-search text-gray-400 mr-2"></i>
										<input 
											type="text" 
											placeholder="Search medicines..." 
											className="bg-transparent flex-1 outline-none text-sm"
											value={searchValue}
											onChange={handleSearchInput}
										/>
									</div>
								</div>

								{/* Mobile Nav Links */}
								<div className="p-4 space-y-2">
									{navLinks.map((link) => (
										<Link 
											key={link.name} 
											to={link.href} 
											onClick={() => setMenuOpen(false)}
											className="flex items-center text-gray-700 hover:text-[#0057B8] hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-colors"
										>
											<i className={`fas ${link.name === 'Home' ? 'fa-home' : link.name === 'Medicines' ? 'fa-pills' : link.name === 'Wellness' ? 'fa-heart' : 'fa-headset'} mr-3 w-5 text-[#0057B8]`}></i>
											{link.name}
										</Link>
									))}
								</div>

								{/* Mobile Category Section */}
								<div className="p-4 border-t border-gray-200">
									<p className="text-xs font-semibold text-gray-500 uppercase mb-3">Shop by Source</p>
									{medicineSources.map((source) => (
										<Link 
											key={source.id}
											to={`/medicines?source=${source.id}`}
											onClick={() => setMenuOpen(false)}
											className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-all"
										>
											<span className={`w-10 h-10 rounded-lg ${source.color} flex items-center justify-center mr-3`}>
												<i className={`fas ${source.icon} text-white`}></i>
											</span>
											<div>
												<p className="font-semibold text-gray-800 text-sm">{source.name}</p>
												<p className="text-xs text-gray-500">{source.description}</p>
											</div>
										</Link>
									))}
								</div>

								{/* Mobile Upload Prescription */}
								<div className="p-4 border-t border-gray-200">
									<button className="w-full bg-green-50 text-green-600 py-3 px-4 rounded-lg font-medium flex items-center justify-center border border-green-200">
										<i className="fas fa-file-upload mr-2"></i>
										Upload Prescription
									</button>
								</div>
							</div>
						</div>
					)}
				</nav>

		{/* Login Modal */}
		<Login 
			isOpen={loginOpen} 
			onClose={() => setLoginOpen(false)} 
			onSwitchToSignup={handleSwitchToSignup}
			onForgotPassword={handleForgotPassword}
		/>

		{/* Signup Modal */}
		<Signup 
			isOpen={signupOpen} 
			onClose={() => setSignupOpen(false)} 
			onSwitchToLogin={handleSwitchToLogin}
		/>

		{/* Forgot Password Modal */}
		<ForgotPassword 
			isOpen={forgotPasswordOpen} 
			onClose={() => setForgotPasswordOpen(false)} 
			onBackToLogin={handleSwitchToLogin}
		/>
	</>
	);
};

export default Navbar;
