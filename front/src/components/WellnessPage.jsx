import React, { useState } from "react";

// Wellness content in both languages
const wellnessContent = {
  en: {
    pageTitle: "Wellness & Health Awareness",
    pageSubtitle: "Awareness is key to a healthy life! Learn what to do, what to avoid, and how to keep yourself and your family safe.",
    languageToggle: "हिंदी में देखें",
    sections: [
      {
        title: "Daily Healthy Habits",
        desc: "Small habits, big impact! Adopt everyday good habits and prevent diseases.",
        icon: "fa-leaf",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        gradient: "from-emerald-500 to-teal-500",
        tips: [
          "Walk or exercise for at least 30 minutes every day",
          "Drink plenty of water (8-10 glasses) and eat a balanced diet",
          "Get complete sleep (7-8 hours) every night",
          "Avoid smoking and limit alcohol consumption",
          "Wash hands regularly and maintain cleanliness"
        ],
        funFact: "Did you know? Walking 10,000 steps daily can reduce heart disease risk by 35%!"
      },
      {
        title: "Personal Hygiene & Prevention",
        desc: "Adopt cleanliness, keep diseases away! Protect yourself and family from infections.",
        icon: "fa-hands-wash",
        color: "text-blue-600",
        bg: "bg-blue-100",
        gradient: "from-blue-500 to-cyan-500",
        tips: [
          "Wash hands with soap, especially before eating and after using restroom",
          "Wear a mask when in crowded places",
          "Drink clean water and avoid street food",
          "Trim nails regularly and bathe daily",
          "Maintain distance from sick individuals"
        ],
        funFact: "Proper handwashing can prevent up to 80% of common infections!"
      },
      {
        title: "Mental Wellness & Stress Management",
        desc: "Healthy mind, healthy body! Reduce stress and stay happy.",
        icon: "fa-brain",
        color: "text-purple-600",
        bg: "bg-purple-100",
        gradient: "from-purple-500 to-pink-500",
        tips: [
          "Practice meditation or yoga for a few minutes daily",
          "Talk to loved ones, don't stay isolated",
          "Limit social media usage to reduce anxiety",
          "Engage in creative activities (painting, music, reading)",
          "Seek professional help if needed - it's okay to ask for support"
        ],
        funFact: "Just 10 minutes of daily meditation can reduce stress hormones by 40%!"
      },
      {
        title: "Immunity & Seasonal Care",
        desc: "Seasons change, stay prepared! Boost immunity and prevent seasonal illnesses.",
        icon: "fa-shield-virus",
        color: "text-orange-600",
        bg: "bg-orange-100",
        gradient: "from-orange-500 to-red-500",
        tips: [
          "Dress appropriately according to the weather",
          "Eat fruits, green vegetables, and pulses regularly",
          "Consult a doctor if you have fever, cough, or cold",
          "Get vaccinations on time as recommended",
          "Keep your home and surroundings clean"
        ],
        funFact: "Vitamin C rich foods can boost immune response by up to 25%!"
      },
      {
        title: "Nutrition & Diet Tips",
        desc: "You are what you eat! Make smart food choices for a healthier life.",
        icon: "fa-apple-alt",
        color: "text-red-600",
        bg: "bg-red-100",
        gradient: "from-red-500 to-rose-500",
        tips: [
          "Include proteins, carbs, and healthy fats in every meal",
          "Eat at least 5 servings of fruits and vegetables daily",
          "Reduce sugar, salt, and processed food intake",
          "Don't skip breakfast - it's the most important meal",
          "Chew food properly and eat slowly for better digestion"
        ],
        funFact: "A colorful plate with different vegetables provides more nutrients!"
      },
      {
        title: "Exercise & Fitness",
        desc: "Stay active, stay fit! Regular exercise is the key to longevity.",
        icon: "fa-running",
        color: "text-cyan-600",
        bg: "bg-cyan-100",
        gradient: "from-cyan-500 to-blue-500",
        tips: [
          "Choose an activity you enjoy - walking, swimming, cycling, or dancing",
          "Start slow and gradually increase intensity",
          "Warm up before exercise and cool down after",
          "Stay consistent - even 15 minutes daily is beneficial",
          "Mix cardio with strength training for best results"
        ],
        funFact: "Regular exercise releases endorphins - natural mood boosters!"
      }
    ],
    healthCalculators: "Health Calculators",
    bmiTitle: "BMI Calculator",
    weightLabel: "Weight (kg)",
    heightLabel: "Height (cm)",
    calculateBtn: "Calculate BMI",
    bmiResult: "Your BMI",
    bmiCategories: {
      underweight: "Underweight",
      normal: "Normal Weight",
      overweight: "Overweight",
      obese: "Obese"
    },
    waterTitle: "Daily Water Intake",
    waterDesc: "How much water should you drink?",
    waterResult: "glasses/day recommended",
    quickTips: "Quick Health Tips",
    emergencyTitle: "Emergency Numbers",
    emergencyNumbers: [
      { name: "Ambulance", number: "102", icon: "fa-ambulance" },
      { name: "Health Helpline", number: "104", icon: "fa-phone-alt" },
      { name: "Emergency", number: "112", icon: "fa-exclamation-triangle" }
    ],
    disclaimer: "Disclaimer: This information is for educational purposes only. Please consult a healthcare professional for medical advice."
  },
  hi: {
    pageTitle: "स्वास्थ्य और जागरूकता",
    pageSubtitle: "स्वस्थ जीवन के लिए जागरूकता ज़रूरी है! जानिए क्या करें, क्या न करें और कैसे रखें खुद को और अपने परिवार को सुरक्षित।",
    languageToggle: "View in English",
    sections: [
      {
        title: "दैनिक स्वस्थ आदतें",
        desc: "छोटी-छोटी आदतें, बड़ा असर! रोज़मर्रा की अच्छी आदतें अपनाएं और बीमारियों से बचें।",
        icon: "fa-leaf",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        gradient: "from-emerald-500 to-teal-500",
        tips: [
          "हर दिन कम-से-कम 30 मिनट वॉक या व्यायाम करें",
          "भरपूर पानी पिएं (8-10 गिलास) और संतुलित आहार लें",
          "नींद पूरी करें (7-8 घंटे) हर रात",
          "धूम्रपान और शराब से बचें",
          "रोज़ाना हाथ धोएं और सफाई रखें"
        ],
        funFact: "क्या आप जानते हैं? रोज़ाना 10,000 कदम चलने से हृदय रोग का खतरा 35% कम हो सकता है!"
      },
      {
        title: "व्यक्तिगत स्वच्छता और बचाव",
        desc: "स्वच्छता अपनाएं, रोग दूर भगाएं! खुद को और परिवार को संक्रमण से बचाएं।",
        icon: "fa-hands-wash",
        color: "text-blue-600",
        bg: "bg-blue-100",
        gradient: "from-blue-500 to-cyan-500",
        tips: [
          "साबुन से हाथ धोना न भूलें, खासकर खाने से पहले",
          "भीड़ में जाने पर मास्क पहनें",
          "साफ पानी पिएं और बाहर के खाने से बचें",
          "नियमित रूप से नाखून काटें और नहाएं",
          "बीमार व्यक्ति से दूरी बनाएं"
        ],
        funFact: "सही तरीके से हाथ धोने से 80% तक सामान्य संक्रमण रोके जा सकते हैं!"
      },
      {
        title: "मानसिक स्वास्थ्य और तनाव प्रबंधन",
        desc: "मन स्वस्थ तो तन स्वस्थ! तनाव कम करें और खुश रहें।",
        icon: "fa-brain",
        color: "text-purple-600",
        bg: "bg-purple-100",
        gradient: "from-purple-500 to-pink-500",
        tips: [
          "हर दिन कुछ समय ध्यान या योग करें",
          "अपनों से बात करें, अकेले न रहें",
          "सोशल मीडिया का सीमित उपयोग करें",
          "रचनात्मक गतिविधियों में भाग लें (पेंटिंग, म्यूजिक, पढ़ना)",
          "जरूरत हो तो डॉक्टर से सलाह लें - मदद मांगना सही है"
        ],
        funFact: "रोज़ाना सिर्फ 10 मिनट ध्यान करने से तनाव हार्मोन 40% तक कम हो सकते हैं!"
      },
      {
        title: "प्रतिरक्षा और मौसमी देखभाल",
        desc: "मौसम बदलता है, ध्यान रखें! इम्युनिटी बढ़ाएं और मौसमी बीमारियों से बचें।",
        icon: "fa-shield-virus",
        color: "text-orange-600",
        bg: "bg-orange-100",
        gradient: "from-orange-500 to-red-500",
        tips: [
          "मौसम के अनुसार कपड़े पहनें",
          "फल, हरी सब्ज़ियां और दालें खाएं",
          "बुखार, खांसी या सर्दी हो तो डॉक्टर से मिलें",
          "टीकाकरण समय पर करवाएं",
          "घर और आसपास सफाई रखें"
        ],
        funFact: "विटामिन C युक्त खाद्य पदार्थ प्रतिरक्षा प्रतिक्रिया को 25% तक बढ़ा सकते हैं!"
      },
      {
        title: "पोषण और आहार सुझाव",
        desc: "आप वही हैं जो आप खाते हैं! स्वस्थ जीवन के लिए स्मार्ट भोजन चुनें।",
        icon: "fa-apple-alt",
        color: "text-red-600",
        bg: "bg-red-100",
        gradient: "from-red-500 to-rose-500",
        tips: [
          "हर भोजन में प्रोटीन, कार्ब्स और स्वस्थ वसा शामिल करें",
          "रोज़ाना कम से कम 5 फल और सब्ज़ियां खाएं",
          "चीनी, नमक और प्रोसेस्ड फूड कम करें",
          "नाश्ता न छोड़ें - यह सबसे महत्वपूर्ण भोजन है",
          "खाना अच्छी तरह चबाएं और धीरे खाएं"
        ],
        funFact: "अलग-अलग रंगों की सब्ज़ियों वाली थाली ज़्यादा पोषक तत्व देती है!"
      },
      {
        title: "व्यायाम और फिटनेस",
        desc: "सक्रिय रहें, स्वस्थ रहें! नियमित व्यायाम लंबी उम्र की कुंजी है।",
        icon: "fa-running",
        color: "text-cyan-600",
        bg: "bg-cyan-100",
        gradient: "from-cyan-500 to-blue-500",
        tips: [
          "ऐसी गतिविधि चुनें जो आपको पसंद हो - चलना, तैरना, साइकिल चलाना",
          "धीरे शुरू करें और धीरे-धीरे तीव्रता बढ़ाएं",
          "व्यायाम से पहले वार्म अप और बाद में कूल डाउन करें",
          "नियमित रहें - रोज़ाना 15 मिनट भी फायदेमंद है",
          "कार्डियो के साथ स्ट्रेंथ ट्रेनिंग मिलाएं"
        ],
        funFact: "नियमित व्यायाम एंडोर्फिन छोड़ता है - प्राकृतिक मूड बूस्टर!"
      }
    ],
    healthCalculators: "स्वास्थ्य कैलकुलेटर",
    bmiTitle: "BMI कैलकुलेटर",
    weightLabel: "वज़न (किग्रा)",
    heightLabel: "ऊंचाई (सेमी)",
    calculateBtn: "BMI गणना करें",
    bmiResult: "आपका BMI",
    bmiCategories: {
      underweight: "कम वज़न",
      normal: "सामान्य वज़न",
      overweight: "अधिक वज़न",
      obese: "मोटापा"
    },
    waterTitle: "दैनिक पानी की मात्रा",
    waterDesc: "आपको कितना पानी पीना चाहिए?",
    waterResult: "गिलास/दिन अनुशंसित",
    quickTips: "त्वरित स्वास्थ्य सुझाव",
    emergencyTitle: "आपातकालीन नंबर",
    emergencyNumbers: [
      { name: "एम्बुलेंस", number: "102", icon: "fa-ambulance" },
      { name: "स्वास्थ्य हेल्पलाइन", number: "104", icon: "fa-phone-alt" },
      { name: "आपातकाल", number: "112", icon: "fa-exclamation-triangle" }
    ],
    disclaimer: "अस्वीकरण: यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। कृपया चिकित्सा सलाह के लिए स्वास्थ्य विशेषज्ञ से परामर्श करें।"
  }
};

// Quick rotating tips
const quickTips = [
  { en: "Drink a glass of water first thing in the morning", hi: "सुबह उठते ही एक गिलास पानी पिएं" },
  { en: "Take short breaks every hour if working at a desk", hi: "डेस्क पर काम करते समय हर घंटे छोटा ब्रेक लें" },
  { en: "Practice deep breathing when feeling stressed", hi: "तनाव महसूस होने पर गहरी सांस लें" },
  { en: "Eat your last meal at least 2 hours before bed", hi: "सोने से कम से कम 2 घंटे पहले खाना खाएं" },
  { en: "Smile more - it releases happy hormones!", hi: "ज़्यादा मुस्कुराएं - यह खुशी के हार्मोन छोड़ता है!" }
];

const WellnessPage = () => {
  const [language, setLanguage] = useState('en');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const content = wellnessContent[language];

  // Rotate quick tips
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % quickTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate BMI
  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
    }
  };

  // Get BMI category
  const getBMICategory = (bmiValue) => {
    const val = parseFloat(bmiValue);
    if (val < 18.5) return { category: content.bmiCategories.underweight, color: 'text-blue-600', bg: 'bg-blue-100' };
    if (val < 25) return { category: content.bmiCategories.normal, color: 'text-green-600', bg: 'bg-green-100' };
    if (val < 30) return { category: content.bmiCategories.overweight, color: 'text-orange-600', bg: 'bg-orange-100' };
    return { category: content.bmiCategories.obese, color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Calculate water intake
  const getWaterIntake = () => {
    if (weight) {
      return Math.round(weight * 0.033 * 4); // glasses (250ml each)
    }
    return 8;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0057B8] via-[#00A6E3] to-[#00C9B7] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all font-medium"
            >
              <i className="fas fa-globe"></i>
              {content.languageToggle}
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">{content.pageSubtitle}</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <i className="fas fa-heart text-3xl mb-2"></i>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-white/80">{language === 'en' ? 'Health Topics' : 'स्वास्थ्य विषय'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <i className="fas fa-lightbulb text-3xl mb-2"></i>
                <div className="text-2xl font-bold">30+</div>
                <div className="text-sm text-white/80">{language === 'en' ? 'Expert Tips' : 'विशेषज्ञ सुझाव'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <i className="fas fa-calculator text-3xl mb-2"></i>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-white/80">{language === 'en' ? 'Health Tools' : 'स्वास्थ्य उपकरण'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Rotating Tip Banner */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-white">
          <i className="fas fa-lightbulb text-xl animate-pulse"></i>
          <span className="font-medium">{language === 'en' ? 'Quick Tip: ' : 'त्वरित सुझाव: '}</span>
          <span className="transition-all duration-500">{quickTips[currentTipIndex][language]}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Health Calculators Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-[#0057B8] text-white rounded-xl flex items-center justify-center">
              <i className="fas fa-calculator"></i>
            </span>
            {content.healthCalculators}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* BMI Calculator */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-weight text-[#0057B8]"></i>
                {content.bmiTitle}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">{content.weightLabel}</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">{content.heightLabel}</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                    placeholder="170"
                  />
                </div>
              </div>
              <button
                onClick={calculateBMI}
                className="w-full bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                {content.calculateBtn}
              </button>
              
              {bmi && (
                <div className="mt-4 p-4 rounded-xl bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{content.bmiResult}</p>
                    <p className="text-4xl font-bold text-[#0057B8] my-2">{bmi}</p>
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getBMICategory(bmi).bg} ${getBMICategory(bmi).color}`}>
                      {getBMICategory(bmi).category}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Water Intake Calculator */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-tint text-blue-500"></i>
                {content.waterTitle}
              </h3>
              <p className="text-gray-600 mb-4">{content.waterDesc}</p>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(Math.min(getWaterIntake(), 10))].map((_, i) => (
                    <i key={i} className="fas fa-glass-water text-2xl text-blue-500"></i>
                  ))}
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-1">{getWaterIntake()}</p>
                <p className="text-sm text-gray-600">{content.waterResult}</p>
                <p className="text-xs text-gray-500 mt-2">
                  ({getWaterIntake() * 250}ml {language === 'en' ? 'total' : 'कुल'})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wellness Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {content.sections.map((section, index) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${section.gradient} p-5 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <i className={`fas ${section.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-lg font-bold">{section.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-gray-600 mb-4 text-sm">{section.desc}</p>
                
                <ul className="space-y-2 mb-4">
                  {section.tips.slice(0, expandedSection === index ? section.tips.length : 3).map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>

                {section.tips.length > 3 && (
                  <button
                    onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                    className="text-[#0057B8] text-sm font-medium hover:underline"
                  >
                    {expandedSection === index 
                      ? (language === 'en' ? 'Show Less' : 'कम दिखाएं')
                      : (language === 'en' ? `+${section.tips.length - 3} more tips` : `+${section.tips.length - 3} और सुझाव`)
                    }
                  </button>
                )}

                {/* Fun Fact */}
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-lightbulb text-amber-500 mt-0.5"></i>
                    <p className="text-xs text-amber-800">{section.funFact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Numbers */}
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-6 mb-12 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-phone-volume"></i>
            {content.emergencyTitle}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {content.emergencyNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="bg-white/20 rounded-xl p-4 text-center hover:bg-white/30 transition-all"
              >
                <i className={`fas ${item.icon} text-2xl mb-2`}></i>
                <p className="font-bold text-2xl">{item.number}</p>
                <p className="text-sm text-white/80">{item.name}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            <i className="fas fa-info-circle mr-2"></i>
            {content.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WellnessPage;
