import React, { useState } from 'react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      text: "Excellent service! I saved over 80% on my monthly diabetes medicines. The quality is exactly the same as branded ones. Highly recommend MeduEase to everyone.",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "Fast delivery and genuine medicines. My parents have been using generic medicines from MeduEase for 6 months now. Very satisfied with the quality and price.",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Dr. Amit Patel",
      location: "Ahmedabad",
      rating: 5,
      text: "As a doctor, I recommend generic medicines to all my patients. MeduEase provides WHO-GMP certified medicines at affordable prices. Great initiative!",
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      name: "Sunita Devi",
      location: "Jaipur",
      rating: 5,
      text: "Very easy to order online. The prescription upload feature is very convenient. Medicines were delivered within 2 days. Thank you MeduEase!",
      image: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      name: "Mohd. Imran",
      location: "Hyderabad",
      rating: 5,
      text: "Best prices for generic medicines. I've been ordering from MeduEase for my family's monthly medicines. Saving almost ₹3000 every month!",
      image: "https://randomuser.me/api/portraits/men/5.jpg"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">What Our Customers Say</h2>
          <p className="text-gray-500">Trusted by lakhs of happy customers across India</p>
        </div>

        <div className="relative">
          {/* Testimonial Cards - Show 3 on desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const idx = (currentIndex + offset) % testimonials.length;
              const testimonial = testimonials[idx];
              return (
                <div key={testimonial.id} className="bg-[#F5F7FA] rounded-xl p-6 border border-gray-100">
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400"></i>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  {/* User Info */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-[#0057B8]"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile - Single Card */}
          <div className="md:hidden">
            <div className="bg-[#F5F7FA] rounded-xl p-6 border border-gray-100">
              <div className="flex mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400"></i>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonials[currentIndex].text}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-[#0057B8]"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-gray-500">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border-2 border-[#0057B8] text-[#0057B8] hover:bg-[#0057B8] hover:text-white transition-colors flex items-center justify-center"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {/* Dots */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-[#0057B8] w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border-2 border-[#0057B8] text-[#0057B8] hover:bg-[#0057B8] hover:text-white transition-colors flex items-center justify-center"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
