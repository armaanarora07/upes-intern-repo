/**
 * Help and Support Page with FAQ
 * 
 * A comprehensive help center with searchable FAQ, contact information,
 * and support options. Features animated interactions and dark mode support.

 */

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../slices/navbarSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

// FAQ Item Component with proper dark mode - Made by Sagar
const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  const itemRef = useRef(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      // Fixed dark mode background - Made by Sagar
      className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden mb-4 border border-gray-200 dark:border-gray-600"
    >
      <button
        className="flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" />
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            ref={itemRef}
          >
            {/* Fixed dark mode background for answer section - Made by Sagar */}
            <div className="px-6 pb-5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Category Filter Button - Made by Sagar
const CategoryButton = ({ name, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive 
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
    }`}
  >
    {name}
  </button>
);

// Support Card Component with fixed dark mode - Made by Sagar
const SupportCard = ({ icon, title, description, actionText, actionLink, color }) => {
  const Icon = icon;
  
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      // Fixed dark mode background - Made by Sagar
      className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 flex flex-col h-full"
    >
      <div className={`${color} p-5`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        <a 
          href={actionLink} 
          className={`inline-block px-4 py-2 rounded-md text-sm font-medium ${
            color.includes('green') 
              ? "text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
              : color.includes('blue')
                ? "text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                : "text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
          } transition-colors duration-200`}
        >
          {actionText}
        </a>
      </div>
    </motion.div>
  );
};

function Help() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFAQs, setOpenFAQs] = useState({});
  
  // Categories for filtering - Made by Sagar
  const categories = ['All', 'General', 'Invoicing', 'Security', 'Features', 'Technical'];
  
  // FAQ Data organized by categories - Made by Sagar
  const faqData = [
    {
      question: "What is Business AI OS?",
      answer: "Business AI OS is an intelligent operating system designed specifically for businesses to streamline operations, automate routine tasks, and provide data-driven insights. It integrates cutting-edge AI technology to help your business operate more efficiently and make better decisions.",
      category: "General"
    },
    {
      question: "How do I generate my first invoice?",
      answer: "To generate your first invoice, navigate to the 'Create Invoice' section from the dashboard. Fill in the required details such as client information, items/services, quantities, and rates. You can preview the invoice before finalizing it, and then click on 'Generate Invoice' to create a professional PDF document ready to be sent to your client.",
      category: "Invoicing"
    },
    {
      question: "Can I customize my invoice templates?",
      answer: "Yes, you can customize your invoice templates. Go to 'Settings' > 'Invoice Templates' to choose from our pre-designed templates or create your own. You can add your company logo, change colors, and customize fields to match your brand identity.",
      category: "Invoicing"
    },
    {
      question: "How secure is my business data on your platform?",
      answer: "We take data security very seriously. All your data is encrypted both in transit and at rest using industry-standard encryption protocols. We implement strict access controls, regular security audits, and comply with relevant data protection regulations to ensure your business information remains secure.",
      category: "Security"
    },
    {
      question: "Does the system support multiple currencies?",
      answer: "Yes, our system supports multiple currencies for international businesses. You can set your preferred currency in your account settings or select different currencies for individual invoices based on your client's location.",
      category: "Features"
    },
    {
      question: "How can I track my business expenses?",
      answer: "You can track your business expenses by navigating to the 'Expenses' section. Here, you can manually add expenses or import them from your bank statements. Our AI system categorizes expenses automatically and generates comprehensive reports to help you understand your spending patterns.",
      category: "Features"
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, we offer mobile apps for both iOS and Android platforms. You can download them from the respective app stores. The mobile apps provide most of the functionality available on the web platform, allowing you to manage your business on the go.",
      category: "Technical"
    },
    {
      question: "How do I get technical support if I encounter issues?",
      answer: "For technical support, you can reach out to us via email at support@sangrahinnovations.com or use the in-app chat support available 24/7. Our technical team is dedicated to resolving your issues promptly to ensure a smooth experience with our platform.",
      category: "Technical"
    },
    {
      question: "Can I integrate with other business tools I already use?",
      answer: "Yes, Business AI OS offers seamless integration with popular business tools including QuickBooks, Xero, Shopify, Slack, and many more. Go to 'Settings' > 'Integrations' to connect your existing tools and create an efficient workflow ecosystem.",
      category: "Features"
    },
    {
      question: "Is my data backed up regularly?",
      answer: "Yes, we perform automatic backups of all your data multiple times daily. We maintain these backups in geographically distributed secure locations to ensure data durability. You can also manually export your data at any time from the 'Settings' > 'Data Management' section.",
      category: "Security"
    },
    {
      question: "How often do you release new features?",
      answer: "We follow a continuous improvement model with major feature releases every quarter. We also push smaller updates and improvements bi-weekly. All updates are automatically available to you without requiring any action on your part.",
      category: "General"
    },
    {
      question: "Can I have multiple users with different access levels?",
      answer: "Yes, you can add team members with customized permission levels. Go to 'Settings' > 'Team Members' to invite users and set their roles such as Admin, Manager, Accountant, or Viewer. Each role comes with predefined permissions that you can further customize.",
      category: "Features"
    }
  ];

  // Handle toggling FAQ open state - Made by Sagar
  const toggleFAQ = (index) => {
    setOpenFAQs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Filter FAQs based on search and category - Made by Sagar
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Set page title on component mount - Made by Sagar
  useEffect(() => {
    dispatch(setTitle('Help and Support'));
  }, [dispatch]);

  return (
    <div className='p-4 md:p-8 min-h-screen dark:bg-gray-800'>
      {/* Hero Section - Made by Sagar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='p-8 mt-5 mb-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl text-white relative overflow-hidden z-0'
      >
        <div className="absolute inset-0 bg-white opacity-5 pattern-dots"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">How can we help you?</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-center mb-8">
            Find answers to common questions or reach out to our support team for assistance.
          </p>
          
          {/* Search Box - Made by Sagar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Made by Sagar */}
          <div className="lg:col-span-2">
            {/* FAQ Section - Fixed dark mode background - Made by Sagar */}
            <div className='bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 p-6'>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <DocumentTextIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                  Frequently Asked Questions
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {filteredFAQs.length} results
                </div>
              </div>

              {/* Category Filters - Made by Sagar */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <CategoryButton 
                    key={category}
                    name={category} 
                    isActive={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  />
                ))}
              </div>
              
              {/* FAQ List - Made by Sagar */}
              <div className="space-y-1">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <FAQItem 
                      key={index} 
                      question={faq.question} 
                      answer={faq.answer}
                      isOpen={openFAQs[index] || false}
                      onClick={() => toggleFAQ(index)}
                      index={index}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <LightBulbIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                      We couldn't find any FAQs matching your criteria. Try adjusting your search or browse all categories.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('All');
                      }}
                      className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      Reset filters
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Made by Sagar */}
          <div className="space-y-6">
            {/* Contact Information Card - Fixed dark mode background - Made by Sagar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className='bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 p-6'
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Contact Us
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                    <a href="mailto:info@sangrahinnovations.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      info@sangrahinnovations.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                    <a href="tel:+911234567890" className="text-blue-600 dark:text-blue-400 hover:underline">
                      +91 123 456 7890
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Chat</p>
                    <p className="text-green-600 dark:text-green-400">
                      Available 24/7
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex justify-center items-center">
                  <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                  Start Live Chat
                </button>
              </div>
            </motion.div>

            {/* Support Resources - Fixed dark mode background - Made by Sagar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 p-6'
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Resources</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    User Manual
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Video Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    API Documentation
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Support Options - Made by Sagar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Support Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SupportCard 
              icon={ChatBubbleLeftIcon}
              title="Live Chat Support"
              description="Get immediate assistance from our support team through live chat available 24/7."
              actionText="Start Chat"
              actionLink="#"
              color="bg-green-500"
            />
            <SupportCard 
              icon={EnvelopeIcon}
              title="Email Support"
              description="Send us a detailed message about your issue and we'll respond within 24 hours."
              actionText="Send Email"
              actionLink="mailto:support@sangrahinnovations.com"
              color="bg-blue-500"
            />
            <SupportCard 
              icon={PhoneIcon}
              title="Phone Support"
              description="Talk directly with our support team during business hours for urgent issues."
              actionText="Call Now"
              actionLink="tel:+911234567890"
              color="bg-purple-500"
            />
          </div>
        </motion.div>

        {/* Feedback Section - Made by Sagar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-md p-8 mt-10 border border-blue-100 dark:border-blue-800"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-3 dark:text-blue-300">Your Feedback Matters</h3>
            <p className="text-blue-600 mb-6 dark:text-blue-200">
              Help us improve our platform by sharing your experience and suggestions.
            </p>
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-6 rounded-md transition-colors duration-300 border border-blue-200 dark:bg-gray-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-gray-700">
              Share Feedback
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Help;