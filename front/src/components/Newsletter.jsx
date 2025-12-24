import React from "react";

const Newsletter = () => (
  <section className="py-10 px-4 flex flex-col items-center justify-center bg-green-100 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Subscribe to our Newsletter</h3>
    <div className="flex w-full max-w-md">
      <input
        type="email"
        placeholder="Enter your email"
        className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
      />
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md font-semibold">Subscribe</button>
    </div>
    <span className="text-gray-500 mt-2 text-sm">Get exclusive deals & health tips directly in your inbox.</span>
  </section>
);

export default Newsletter;
