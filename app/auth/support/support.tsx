"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  Headphones,
  User,
  Tag,
  AlertCircle,
  FileText,
  ArrowLeft,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Support() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "general",
    priority: "medium",
    issue: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        issueType: "general",
        priority: "medium",
        issue: "",
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block p-3 bg-linear-to-br from-blue-100 to-green-100 rounded-2xl mb-4"
          >
            <Headphones className="w-10 h-10 text-black" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent flex items-center justify-center gap-3">
            
            Support Center
          </h1>
          <p className="text-gray-600 mt-2">
            We're here to help you with any issues or questions
          </p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <div>
                  <p className="font-medium text-green-800">
                    Ticket Created Successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    Our support team will contact you within 24 hours.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
           

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  placeholder="you@example.com"
                  required
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Issue Type */}
              <div className="space-y-2">
                <label
                  htmlFor="issueType"
                  className="text-sm font-medium text-gray-700"
                >
                  Issue Type
                </label>
                <div className="relative">
                  <select
                    id="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 appearance-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                  <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <ChevronRight className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 transform rotate-90" />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label
                  htmlFor="priority"
                  className="text-sm font-medium text-gray-700"
                >
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <AlertCircle className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <ChevronRight className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 transform rotate-90" />
                </div>
              </div>
            </div>

            {/* Issue Field */}
            <div className="space-y-2">
              <label
                htmlFor="issue"
                className="text-sm font-medium text-gray-700"
              >
                Describe Your Issue
              </label>
              <div className="relative">
                <textarea
                  id="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 resize-none"
                  placeholder="Please provide detailed information about your issue..."
                  rows={5}
                  required
                />
                <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Support Request
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Alternative contact methods
                </span>
              </div>
            </div>

            {/* Contact Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:support@camctax.com"
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
               support@camctax.com
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Our support team typically responds within 4 business hours during
            weekdays.
          </p>
        </div>
      </motion.div>
    </div>
  );
}