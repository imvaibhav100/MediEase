import React, { useState } from "react";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    category: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hello! 👋 Welcome to MediEase Support. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Support categories
  const supportCategories = [
    { id: 'order', label: 'Order Related', icon: 'fa-shopping-bag' },
    { id: 'delivery', label: 'Delivery Issues', icon: 'fa-truck' },
    { id: 'return', label: 'Returns & Refunds', icon: 'fa-undo' },
    { id: 'payment', label: 'Payment Problems', icon: 'fa-credit-card' },
    { id: 'medicine', label: 'Medicine Query', icon: 'fa-pills' },
    { id: 'other', label: 'Other', icon: 'fa-question-circle' }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting 'My Orders' section. You'll also receive SMS and email updates about your order status."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery for damaged, expired, or wrong medicines. Refrigerated medicines and opened packages cannot be returned due to safety regulations."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-5 business days depending on your location. Express delivery (available in select cities) delivers within 24-48 hours."
    },
    {
      question: "Are generic medicines safe?",
      answer: "Yes! All our generic medicines are WHO-GMP certified and contain the same active ingredients as branded medicines. They undergo strict quality checks."
    },
    {
      question: "Do I need a prescription?",
      answer: "Prescription medicines require a valid prescription upload. OTC (Over-the-Counter) medicines can be purchased without a prescription."
    },
    {
      question: "How can I cancel my order?",
      answer: "You can cancel your order from 'My Orders' section if it hasn't been shipped yet. For shipped orders, please contact our support team."
    }
  ];

  // Contact info
  const contactInfo = [
    {
      icon: 'fa-phone-alt',
      title: 'Phone Support',
      value: '+91 1800-XXX-XXXX',
      subtext: 'Toll Free (9 AM - 9 PM)',
      color: 'bg-green-500'
    },
    {
      icon: 'fa-envelope',
      title: 'Email Us',
      value: 'support@MediEase.in',
      subtext: 'Response within 24 hours',
      color: 'bg-blue-500'
    },
    {
      icon: 'fa-comments',
      title: 'Live Chat',
      value: 'Chat with us',
      subtext: 'Available 24/7',
      color: 'bg-purple-500',
      action: () => setChatOpen(true)
    },
    {
      icon: 'fa-whatsapp',
      title: 'WhatsApp',
      value: '+91 98XXX-XXXXX',
      subtext: 'Quick responses',
      color: 'bg-emerald-500'
    }
  ];

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send data to backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderNumber: '',
        category: '',
        message: ''
      });
    }, 3000);
  };

  // Handle chat
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { type: 'user', message: chatInput }]);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! Our support team will get back to you shortly.",
        "I understand your concern. Let me connect you with a support specialist.",
        "For order-related queries, please share your order number and I'll help you track it.",
        "Is there anything else I can help you with today?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { type: 'bot', message: randomResponse }]);
    }, 1000);
    
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0057B8] via-[#00A6E3] to-[#00C9B7] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-headset text-4xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help You?</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Our dedicated support team is here to assist you 24/7. Get help with orders, medicines, or any queries.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-white/80 text-sm">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">&lt;2hr</div>
              <div className="text-white/80 text-sm">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-white/80 text-sm">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-white/80 text-sm">Issues Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className={`bg-white rounded-2xl shadow-lg p-5 text-center hover:shadow-xl transition-all ${item.action ? 'cursor-pointer hover:-translate-y-1' : ''}`}
            >
              <div className={`w-14 h-14 ${item.color} text-white rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <i className={`fab fa-whatsapp text-2xl ${item.icon === 'fa-whatsapp' ? '' : 'hidden'}`}></i>
                <i className={`fas ${item.icon} text-2xl ${item.icon === 'fa-whatsapp' ? 'hidden' : ''}`}></i>
              </div>
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <p className="text-[#0057B8] font-semibold">{item.value}</p>
              <p className="text-xs text-gray-500">{item.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            {[
              { id: 'contact', label: 'Contact Form', icon: 'fa-envelope' },
              { id: 'faq', label: 'FAQs', icon: 'fa-question-circle' },
              { id: 'track', label: 'Track Order', icon: 'fa-search' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0057B8] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Form Tab */}
        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-[#0057B8] text-white rounded-xl flex items-center justify-center">
                  <i className="fas fa-paper-plane"></i>
                </span>
                Send Us a Message
              </h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-4xl text-green-500"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Order Number (if any)</label>
                      <input
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent"
                        placeholder="ORD-XXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Issue Category *</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {supportCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.category === cat.id
                              ? 'border-[#0057B8] bg-blue-50 text-[#0057B8]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <i className={`fas ${cat.icon} text-lg mb-1`}></i>
                          <div className="text-xs font-medium">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Your Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent resize-none"
                      placeholder="Describe your issue or query in detail..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-paper-plane"></i>
                    Submit Request
                  </button>
                </form>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Help */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-bolt text-yellow-500"></i>
                  Quick Help
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Track your order', icon: 'fa-truck', color: 'text-blue-500' },
                    { label: 'Request a refund', icon: 'fa-money-bill-wave', color: 'text-green-500' },
                    { label: 'Change delivery address', icon: 'fa-map-marker-alt', color: 'text-red-500' },
                    { label: 'Upload prescription', icon: 'fa-file-medical', color: 'text-purple-500' }
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left">
                      <i className={`fas ${item.icon} ${item.color}`}></i>
                      <span className="text-gray-700">{item.label}</span>
                      <i className="fas fa-chevron-right text-gray-400 ml-auto text-sm"></i>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Office Address */}
              <div className="bg-gradient-to-br from-[#0057B8] to-[#00A6E3] rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-building"></i>
                  Our Office
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-start gap-2">
                    <i className="fas fa-map-marker-alt mt-1"></i>
                    <span>MediEase Healthcare Pvt. Ltd.<br/>123, Health Plaza, Sector 15<br/>New Delhi - 110001</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="fas fa-clock"></i>
                    Mon - Sat: 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-2xl shadow-md group"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-semibold text-gray-800 flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#0057B8] text-white rounded-lg flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {faq.question}
                    </span>
                    <i className="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600 pl-11">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
            
            <div className="text-center mt-8 p-6 bg-blue-50 rounded-2xl">
              <p className="text-gray-600 mb-3">Still have questions?</p>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-[#0057B8] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#004a9e] transition-all"
              >
                Contact Support Team
              </button>
            </div>
          </div>
        )}

        {/* Track Order Tab */}
        {activeTab === 'track' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-4xl text-[#0057B8]"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Order</h2>
              <p className="text-gray-600 mb-6">Enter your order number to check the current status</p>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g., ORD-123456)"
                  className="flex-1 px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
                <button className="bg-[#0057B8] text-white px-6 rounded-xl font-semibold hover:bg-[#004a9e] transition-all">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              
              {/* Sample Order Timeline */}
              <div className="mt-8 text-left">
                <h3 className="font-semibold text-gray-800 mb-4">Sample Order Status</h3>
                <div className="space-y-4">
                  {[
                    { status: 'Order Placed', time: 'Dec 10, 2025 - 10:30 AM', done: true, icon: 'fa-check' },
                    { status: 'Order Confirmed', time: 'Dec 10, 2025 - 11:00 AM', done: true, icon: 'fa-check' },
                    { status: 'Packed & Ready', time: 'Dec 11, 2025 - 09:00 AM', done: true, icon: 'fa-box' },
                    { status: 'Out for Delivery', time: 'Dec 12, 2025 - 08:00 AM', done: false, icon: 'fa-truck', current: true },
                    { status: 'Delivered', time: 'Expected Today', done: false, icon: 'fa-home' }
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.done ? 'bg-green-500 text-white' : step.current ? 'bg-[#0057B8] text-white animate-pulse' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <i className={`fas ${step.icon}`}></i>
                      </div>
                      <div className={`flex-1 pb-4 ${i < 4 ? 'border-l-2 border-dashed ml-5 pl-6 -mt-2' : ''} ${step.done ? 'border-green-300' : 'border-gray-200'}`}>
                        <p className={`font-medium ${step.current ? 'text-[#0057B8]' : 'text-gray-800'}`}>{step.status}</p>
                        <p className="text-sm text-gray-500">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#0057B8] to-[#00A6E3] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-headset"></i>
              </div>
              <div>
                <h3 className="font-bold">MediEase Support</h3>
                <p className="text-xs text-white/80">● Online</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 p-2 rounded-lg transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.type === 'user' 
                    ? 'bg-[#0057B8] text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
              <button
                onClick={handleChatSend}
                className="bg-[#0057B8] text-white px-4 rounded-xl hover:bg-[#004a9e] transition-all"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button (when chat is closed) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white rounded-full shadow-lg hover:scale-110 transition-all z-50 flex items-center justify-center"
        >
          <i className="fas fa-comments text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default SupportPage;
