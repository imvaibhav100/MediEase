import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What are Generic Medicines?",
      answer: "Generic medicines contain the same active ingredients, dosage, and strength as branded medicines. They are equally effective and safe but cost 50-90% less because generic manufacturers don't have to spend on research, development, and marketing like branded companies."
    },
    {
      question: "Are Generic Medicines safe and effective?",
      answer: "Yes, absolutely! All generic medicines sold through MeduEase are approved by the Drug Controller General of India (DCGI) and manufactured in WHO-GMP certified facilities. They undergo the same rigorous quality testing as branded medicines."
    },
    {
      question: "How much can I save with Generic Medicines?",
      answer: "You can save up to 85% on your medicine bills by switching to generic medicines. For example, if you spend ₹5000 per month on branded medicines, you could potentially bring that down to just ₹750-1000 with generic alternatives."
    },
    {
      question: "Do I need a prescription to buy medicines?",
      answer: "Yes, for prescription medicines (Schedule H and H1 drugs), you need to upload a valid prescription from a registered medical practitioner. Over-the-counter medicines can be purchased without a prescription."
    },
    {
      question: "What is your delivery time?",
      answer: "We deliver within 2-5 business days across India. For metros and major cities, delivery is usually within 2-3 days. We also offer express delivery options in select cities."
    },
    {
      question: "What if I receive damaged or wrong medicines?",
      answer: "We have a hassle-free return policy. If you receive damaged, expired, or wrong medicines, contact our customer support within 7 days and we'll arrange a free replacement or full refund."
    }
  ];

  return (
    <section className="py-12 px-4 bg-[#F5F7FA]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-500">Got questions? We've got answers</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <i className={`fas fa-chevron-down text-[#0057B8] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}></i>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a href="#contact" className="inline-flex items-center text-[#0057B8] font-semibold hover:underline">
            <i className="fas fa-headset mr-2"></i>
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
