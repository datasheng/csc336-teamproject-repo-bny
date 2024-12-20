'use client';

import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const ContactPage = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('user')
            .select('first_name, last_name, email')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            setFormData((prev) => ({
              ...prev,
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              email: data.email || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('contact_form_submissions')
        .insert({
          user_id: user?.id || null,
          subject: formData.subject,
          message: formData.message,
          status: 'pending',
        });

      if (error) throw error;

      setStatusMessage('Message sent successfully!');
      setFormData((prev) => ({
        ...prev,
        subject: '',
        message: '',
      }));
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Error sending message');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      {/* Header Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 dark:text-white text-black">Contact Us</h1>
          <p className="text-lg dark:text-white text-black">
      Have questions? We'd love to hear from you. <br />
      Send us a message and we'll respond as soon as possible.
    </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-r from-white to-indigo-50 p-8 rounded-xl shadow-lg">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              id="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`mt-4 text-center ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {statusMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md disabled:opacity-50 transition-colors duration-300"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
