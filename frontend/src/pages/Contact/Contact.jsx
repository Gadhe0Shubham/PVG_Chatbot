import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faClock, faCheckCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Admission Inquiry',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ fullName: '', email: '', subject: 'Admission Inquiry', message: '' });

      // Auto-dismiss success toast after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Firebase error:', err);
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again later.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="contact-page-ak"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="ak-toast ak-toast-success"
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Message sent successfully! We'll get back to you soon.</span>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="ak-toast ak-toast-error"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">Contact Us</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto font-medium">
            Have questions? Reach out to our admissions office or visit our campus for a personal tour.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="ak-contact-card">
              <div className="ak-icon-box bg-green-100 text-green-700">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="mt-6">
                <h4 className="text-xl font-bold mb-2">Campus Address</h4>
                <p className="text-muted font-medium leading-relaxed">
                  206-Dindori Road, Behind Reliance Petrol Pump, Near MERI, Mhasrul, Nashik - 422004
                </p>
              </div>
            </div>

            <div className="ak-contact-card">
              <div className="ak-icon-box bg-blue-100 text-blue-700">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="mt-6">
                <h4 className="text-xl font-bold mb-2">Call Us</h4>
                <p className="text-muted font-medium">0253-6480036, 1800-266-5330</p>
              </div>
            </div>

            <div className="ak-contact-card">
              <div className="ak-icon-box bg-yellow-100 text-yellow-700">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="mt-6">
                <h4 className="text-xl font-bold mb-2">Email</h4>
                <p className="text-muted font-medium">pvgcoenashik@gmail.com</p>
              </div>
            </div>

            <div className="ak-contact-card">
              <div className="ak-icon-box bg-slate-100 text-slate-700">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="mt-6">
                <h4 className="text-xl font-bold mb-2">Visit Hours</h4>
                <p className="text-muted font-medium">Monday to Saturday, 10:00 AM to 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="ak-form-card shadow-2xl p-12 bg-white">
              <h3 className="text-3xl font-black mb-10">Send us a Message</h3>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                    <input 
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className="ak-input"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      className="ak-input"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="ak-input bg-white"
                  >
                    <option>Admission Inquiry</option>
                    <option>Course Information</option>
                    <option>Campus Visit Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                  <textarea 
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..." 
                    className="ak-input resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="ak-btn-primary w-full py-5 text-xl"
                  disabled={status === 'loading'}
                  style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
                >
                  {status === 'loading' ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '10px' }} />
                      Sending...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-24 ak-map-container overflow-hidden shadow-2xl h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1874.2259654133464!2d73.8058457!3d20.031525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddc26e111a8b9d%3A0xe5a2879685a3c004!2sPune%20Vidyarthi%20Griha's%20College%20of%20Engineering%20and%20S.S.%20Dhamankar%20Institute%20of%20Management%20Nashik!5e0!3m2!1sen!2sin!4v1713250000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Campus Map"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
