import { BACKEND_BASE } from '../api';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cartSlice';

const GenericFinder = () => {
    const dispatch = useDispatch();
    const [brandName, setBrandName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [addedItems, setAddedItems] = useState({}); // Track added items

    const handleAddToCart = (medicine) => {
        dispatch(addToCart({
            name: medicine.name,
            price: medicine.price,
            disease: medicine.genericSource || 'Generic',
            salts: medicine.salts,
            qty: 1
        }));
        
        // Show success feedback
        setAddedItems(prev => ({ ...prev, [medicine.name]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [medicine.name]: false }));
        }, 2000);
    };

    const [loadingMessage, setLoadingMessage] = useState('');

    const searchGeneric = async () => {
        if (!brandName.trim()) {
            setError('Please enter a medicine name');
            return;
        }

        setLoading(true);
        setLoadingMessage('Searching in our database...');
        setError('');
        setResult(null);

        try {
            // Start a timer to show "scraping" message after 2 seconds
            const scrapingTimer = setTimeout(() => {
                setLoadingMessage('Not found locally, searching 1mg.com...');
            }, 2000);

            const response = await fetch(`${BACKEND_BASE}/api/find-generic?brandName=${encodeURIComponent(brandName.trim())}`);
            
            clearTimeout(scrapingTimer);
            
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Failed to search. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchGeneric();
        }
    };

    // Common branded medicines for quick selection
    const commonBrands = [
        'Crocin', 'Dolo 650', 'Combiflam', 'Sinarest', 'Cetzine', 
        'Azithral 500', 'Augmentin 625', 'Pan D', 'Omez 20', 'Shelcal 500'
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🔍 Find Generic Alternative
                </h1>
                <p className="text-gray-600">
                    Enter any branded medicine name to find affordable generic alternatives
                </p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branded Medicine Name
                        </label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., Crocin, Dolo 650, Combiflam..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                        />
                    </div>
                    <button
                        onClick={searchGeneric}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed md:self-end"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {loadingMessage || 'Searching...'}
                            </span>
                        ) : (
                            'Find Generic'
                        )}
                    </button>
                </div>

                {/* Quick Search Tags */}
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Quick search:</p>
                    <div className="flex flex-wrap gap-2">
                        {commonBrands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => {
                                    setBrandName(brand);
                                    setResult(null);
                                }}
                                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    <p className="flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </p>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Salt Composition */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    {result.brandedMedicine}
                                </h2>
                                {result.saltComposition ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-blue-200">Salt Composition:</span>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                            {result.saltComposition.join(' + ')}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-blue-200">Salt composition not found</p>
                                )}
                            </div>
                            {/* Data source badge */}
                            {result.saltComposition && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    result.verified 
                                        ? 'bg-green-500/20 text-green-100 border border-green-400/50' 
                                        : 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/50'
                                }`}>
                                    {result.verified ? '✓ Verified Database' : '🌐 Scraped from 1mg'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Results Content */}
                    <div className="p-6">
                        {result.success ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        ✅ {result.totalAlternatives} Generic Alternative(s) Found
                                    </h3>
                                    {result.cheapestPrice && (
                                        <div className="text-green-600 font-semibold">
                                            Starting from ₹{result.cheapestPrice}
                                        </div>
                                    )}
                                </div>

                                {/* Generic Alternatives List */}
                                <div className="space-y-3">
                                    {result.genericAlternatives.map((med, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800">
                                                    {med.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                        {med.genericSource || 'Generic'}
                                                    </span>
                                                    {med.salts && med.salts.length > 0 && (
                                                        <span className="text-xs text-gray-500">
                                                            {med.salts.join(', ')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-green-600">
                                                    ₹{med.price || 'N/A'}
                                                </div>
                                                <button 
                                                    onClick={() => handleAddToCart(med)}
                                                    className={`mt-1 px-4 py-1 text-white text-sm rounded-lg transition-all ${
                                                        addedItems[med.name] 
                                                            ? 'bg-green-600 scale-105' 
                                                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                                    }`}
                                                >
                                                    {addedItems[med.name] ? '✓ Added!' : '🛒 Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Savings Info */}
                                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <p className="text-green-800 text-center">
                                        💰 <strong>Save up to 85%</strong> by choosing generic alternatives!
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Generic Alternative Not Found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {result.message}
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                                    <p className="text-yellow-800 text-sm">
                                        💡 <strong>Tip:</strong> Try searching with the full medicine name including strength (e.g., "Dolo 650" instead of just "Dolo")
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* How it works */}
            {!result && (
                <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        How it works?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">💊</div>
                            <h4 className="font-medium text-gray-800">Step 1</h4>
                            <p className="text-sm text-gray-600">Enter branded medicine name</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">🔬</div>
                            <h4 className="font-medium text-gray-800">Step 2</h4>
                            <p className="text-sm text-gray-600">We find its salt composition</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">✅</div>
                            <h4 className="font-medium text-gray-800">Step 3</h4>
                            <p className="text-sm text-gray-600">Get affordable generic alternatives</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenericFinder;
