import React from "react";

const sliderData = [
  {
    img: "/images/slider 1.jpg",
    heading: "MINIMUM 50% OFF",
    sub: "Shop Now & Save Big!"
  },
  {
    img: "/images/slider 2.jpg",
    heading: "GENERIC MEDICINE",
    sub: "Quality & Savings Together"
  },
  {
    img: "/images/slider 3.jpg",
    heading: "WELLNESS JOURNEY STARTS HERE!",
    sub: "2000+ Products | 1000+ Stores"
  },
  {
    img: "/images/slider 4.jpg",
    heading: "TRUSTED BY MILLIONS",
    sub: "1.5 CR+ Happy Customers"
  }
];


const Slider = () => {
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderData.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  const goToPrev = () => setCurrent((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  const goToNext = () => setCurrent((prev) => (prev + 1) % sliderData.length);

  return (
    <div className="w-full mb-10">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-lg group"
        style={{height: '40vw', maxHeight: '420px', minHeight: '220px'}}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {sliderData.map((slide, idx) => (
          <React.Fragment key={`${slide.img}-${idx}`}>
            <img
              src={slide.img}
              alt={`Banner ${idx + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${current === idx ? "opacity-100 z-20" : "opacity-0 z-10"}`}
              style={{transition: 'opacity 0.7s'}}
            />
            {/* Gradient overlay */}
            <div
              className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/60 via-black/20 to-transparent transition-opacity duration-700 pointer-events-none ${current === idx ? "opacity-100 z-30" : "opacity-0 z-0"}`}
            ></div>
            {/* Animated heading/sub */}
            {current === idx && (
              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 text-white animate-fade-in">
                <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow mb-2 animate-slide-in">{slide.heading}</h2>
                <p className="text-lg md:text-2xl font-medium drop-shadow mb-4 animate-slide-in delay-150">{slide.sub}</p>
                <button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-200 animate-fade-in-up">Shop Now</button>
              </div>
            )}
          </React.Fragment>
        ))}
        {/* Navigation arrows */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 z-50 bg-white/70 hover:bg-white text-emerald-600 hover:text-blue-600 rounded-full p-2 shadow transition-all duration-200"
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-left text-xl"></i>
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 z-50 bg-white/70 hover:bg-white text-emerald-600 hover:text-blue-600 rounded-full p-2 shadow transition-all duration-200"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-right text-xl"></i>
        </button>
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
          {sliderData.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${current === idx ? "bg-emerald-600 scale-125" : "bg-gray-300"} transition-transform duration-200 cursor-pointer border-2 border-white/70`}
              onClick={() => setCurrent(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
