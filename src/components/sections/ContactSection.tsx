import React, { useState, useRef } from 'react';
import { Link } from 'react-scroll';
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContactForm } from '../../hooks/useContactForm';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/translations';

const ContactSection: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { loading, submitReservation } = useContactForm();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    // Basic validation
    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      setSubmitStatus({
        type: 'error',
        message: language === 'en'
          ? 'Please fill in all required fields.'
          : 'Bitte füllen Sie alle Pflichtfelder aus.'
      });
      return;
    }

    try {
      const reservationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        message: formData.message || undefined,
        status: 'pending' as const
      };

      const { success, error } = await submitReservation(reservationData);

      if (success) {
        setSubmitStatus({
          type: 'success',
          message: language === 'en' 
            ? 'Your reservation has been submitted successfully! We will contact you soon to confirm.'
            : 'Ihre Reservierung wurde erfolgreich übermittelt! Wir werden Sie bald kontaktieren, um zu bestätigen.'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          message: ''
        });
      } else {
        throw new Error(error || 'Submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: language === 'en'
          ? 'There was an error submitting your reservation. Please try again or call us directly.'
          : 'Beim Übermitteln Ihrer Reservierung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <MapPin size={20} />,
      title: translations.contact?.info?.address?.[language] || "Address",
      content: "August-Ruf-Straße 16, 78224 Singen (Hohentwiel)"
    },
    {
      icon: <Phone size={20} />,
      title: translations.contact?.info?.phone?.[language] || "Phone",
      content: "+49 179 423 2002"
    },
    {
      icon: <Mail size={20} />,
      title: translations.contact?.info?.email?.[language] || "Email",
      content: "info@bay-leaf.eu"
    },
    {
      icon: <Clock size={20} />,
      title: translations.contact?.info?.hours?.[language] || "Opening Hours",
      content: (
        <>
          Tue-Sun: 11:30 AM – 2:30 PM / 5:30 PM - 10:00 PM<br />
          Closed on Mondays
        </>
      )
    }
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section 
      id="contact" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
      >
        <img
          src="https://ik.imagekit.io/qcf813yjh/banna%20leaf%20food%20pictures%20(1).webp"
          alt="Banana leaf food background"
          className="absolute w-full h-full object-cover min-h-screen min-w-full"
        />
        <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold text-center mb-4">
            {translations.contact?.title?.[language] || "Contact Us"}
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto text-center mb-12">
            {translations.contact?.subtitle?.[language] || "We'd love to hear from you! Make a reservation or send us your questions."}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/95 backdrop-blur p-8 rounded-lg shadow-xl"
          >
            <h3 className="font-display text-2xl mb-6 text-gray-900">
              {translations.navbar.bookTable[language]}
            </h3>
            
            {/* Status Messages */}
            {submitStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                )}
                <p className="text-sm">{submitStatus.message}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">
                    {translations.contact?.form?.name?.[language] || "Name"} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">
                    {translations.contact?.form?.email?.[language] || "Email"} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                    placeholder="Your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1 font-medium">
                  {translations.contact?.info?.phone?.[language] || "Phone"}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                  placeholder="Your phone number (optional)"
                  disabled={loading}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-1 font-medium">
                    {translations.contact?.form?.date?.[language] || "Date"} *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-gray-700 mb-1 font-medium">
                    {translations.contact?.form?.time?.[language] || "Time"} *
                  </label>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="">Select time</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-gray-700 mb-1 font-medium">
                  {translations.contact?.form?.guests?.[language] || "Number of Guests"} *
                </label>
                <select
                  id="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                  <option value="9">9+ people (please call)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-1 font-medium">
                  {translations.contact?.form?.message?.[language] || "Special Requests"}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent resize-vertical"
                  placeholder="Any special requests or dietary requirements?"
                  disabled={loading}
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {language === 'en' ? 'Submitting...' : 'Wird übermittelt...'}
                  </>
                ) : (
                  translations.contact?.form?.submit?.[language] || "Book Now"
                )}
              </motion.button>
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/95 backdrop-blur p-8 rounded-lg shadow-xl"
          >
            <h3 className="font-display text-2xl mb-8 text-gray-900">Get in Touch</h3>
            
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="bg-spice-100 p-3 rounded-full mr-4">
                    <span className="text-spice-600">{info.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{info.title}</h4>
                    <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              ref={mapRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <h4 className="font-medium text-gray-900 mb-4">Find Us</h4>
              <div className="h-[200px] rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2682.023456696236!2d8.836444776165843!3d47.76159937120448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a7d35eeee6f1f%3A0xe5111ed81e27db8c!2sBay%20Leaf!5e0!3m2!1sen!2sin!4v1748797783448!5m2!1sen!2sin"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="scroll-indicator">
          <div className="scroll-indicator-progress" />
        </div>
        <Link
          to="footer"
          spy={true}
          smooth={true}
          offset={-80}
          duration={800}
          className="text-white/80 flex flex-col items-center cursor-pointer hover:text-white transition-colors"
        >
          <span className="text-sm uppercase tracking-wider mb-2">Follow Us</span>
          <div className="flex space-x-4">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ContactSection;