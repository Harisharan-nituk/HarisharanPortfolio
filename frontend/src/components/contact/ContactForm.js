// frontend/src/components/contact/ContactForm.js
import React, { useState } from 'react';
import api from '../../services/api';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('');
    setMessageType('');

    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage('Please fill in all required fields: Name, Email, and Message.');
      setMessageType('error');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatusMessage('Please enter a valid email address.');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/contact', formData);
      setStatusMessage(response.data.message || 'Message sent successfully! Thank you.');
      setMessageType('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again later.';
      setStatusMessage(errorMessage);
      setMessageType('error');
      console.error('Contact form error:', error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-slate-700/50 dark:text-white sm:text-sm transition-shadow placeholder-gray-400 dark:placeholder-gray-500";
  const labelClasses = "block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="e.g., Ada Lovelace"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className={labelClasses}>
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
          placeholder="Project Inquiry, Collaboration, etc."
        />
      </div>
      <div>
        <label htmlFor="message" className={labelClasses}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          className={`${inputClasses} resize-none`}
          placeholder="Tell me about your idea..."
        ></textarea>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-3 p-3.5 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
            ${messageType === 'success'
              ? 'bg-green-50 dark:bg-green-600/20 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-500'
              : 'bg-red-50 dark:bg-red-600/20 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-500'}`}
          role="alert"
        >
          {messageType === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{statusMessage}</span>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out group transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;