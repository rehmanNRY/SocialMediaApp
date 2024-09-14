import React from 'react';
import AuthRedirect from '@/components/AuthRedirect';

const ContactPage = () => {
  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Contact Us</h1>

        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your message..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </form>

          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600">
              We would love to hear from you! Whether you have a question about features, trials, pricing,
              need a demo, or anything else, our team is ready to answer all your questions.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 2a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8a6 6 0 016-6h8z"
                  ></path>
                </svg>
                <span className="text-gray-700">+1 (234) 567-890</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12H8m4 8l-4-4h8l-4 4zM4 4l8 8-8 8"
                  ></path>
                </svg>
                <span className="text-gray-700">contact@example.com</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3.1V21H3V3h18v5.9M19 10l-5-5m0 0v8m0-8H6"
                  ></path>
                </svg>
                <span className="text-gray-700">1234 Street Name, City, State, 56789</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
};

export default ContactPage;