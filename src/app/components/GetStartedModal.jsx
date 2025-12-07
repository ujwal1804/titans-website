"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Loader2, Upload, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function GetStartedModal({ isOpen, onClose, onSuccess }) {
  const cryptoAddress = "TH5S2BNoWudkKzw1SVwj1MTx3gvECb7UdN";
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData({ name: "", email: "", phone: "" });
      setSelectedFile(null);
      setPreview(null);
      setErrors({});
      setSuccessMessage("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      if (errors.screenshot) {
        setErrors((prev) => ({ ...prev, screenshot: "" }));
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Validate
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!selectedFile) newErrors.screenshot = "Payment screenshot is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("paymentScreenshot", selectedFile);

      // Submit
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Success! Redirecting...");
        localStorage.setItem("getStartedFormSubmitted", "true");
        
        setTimeout(() => {
          onSuccess();
          onClose();
          window.open("https://my.dooprime.com/register/?lid=54744&pid=704210", "_blank");
        }, 2000);
      } else {
        setErrors({ submit: result.message || "Submission failed. Please try again." });
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-2xl border border-cyan-500/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-2xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-auto custom-scrollbar">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
              
              <div className="p-3 sm:p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 pb-2 sm:pb-3 md:pb-4 border-b border-white/10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    Get Started
                  </h2>
                  <button onClick={onClose} className="text-white/60 hover:text-white transition-all p-1.5 sm:p-2 rounded-lg hover:bg-white/10">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {/* Left: Personal Info */}
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 md:mb-4">Personal Information</h3>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white/5 border rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                            errors.name ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-cyan-400/50"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white/5 border rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                            errors.email ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-cyan-400/50"
                          }`}
                          placeholder="Enter your email"
                        />
                        {errors.email && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white/5 border rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                            errors.phone ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-cyan-400/50"
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Right: Payment */}
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 md:mb-4">Payment Details</h3>
                      
                      {/* QR Code */}
                      <div className="bg-white/10 border border-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                        <p className="text-xs sm:text-sm text-white/70 mb-2 sm:mb-3 text-center">Scan to pay via USDT (TRX Network)</p>
                        <div className="flex justify-center mb-2 sm:mb-3">
                          <div className="bg-white p-2 sm:p-3 rounded-lg">
                            <div className="scale-75 sm:scale-90 md:scale-100 origin-center">
                              <QRCodeSVG 
                                value={cryptoAddress} 
                                size={120} 
                                level="H" 
                                includeMargin={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-2 sm:p-3">
                          <p className="text-[10px] sm:text-xs text-cyan-300/80 mb-1 sm:mb-2 font-medium">Wallet Address:</p>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <p className="text-[10px] sm:text-xs text-white font-mono break-all flex-1">{cryptoAddress}</p>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(cryptoAddress)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded text-[10px] sm:text-xs text-cyan-300 whitespace-nowrap"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2">Payment Screenshot *</label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        
                        {preview ? (
                          <div className="relative border-2 border-green-400/50 rounded-lg overflow-hidden">
                            <img src={preview} alt="Preview" className="w-full h-32 sm:h-40 md:h-48 object-cover" />
                            <button
                              type="button"
                              onClick={removeFile}
                              className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 sm:p-2"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-green-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm text-white font-medium flex items-center gap-1.5 sm:gap-2">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              Uploaded
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition ${
                              errors.screenshot ? "border-red-400/50 bg-red-500/10" : "border-cyan-400/30 hover:border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/5"
                            }`}
                          >
                            <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-300 mx-auto mb-2 sm:mb-3" />
                            <p className="text-white font-medium mb-1 text-sm sm:text-base">Click to upload screenshot</p>
                            <p className="text-white/50 text-xs sm:text-sm">PNG, JPG, GIF up to 5MB</p>
                          </button>
                        )}
                        {errors.screenshot && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.screenshot}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  {successMessage && (
                    <div className="p-2 sm:p-3 md:p-4 bg-green-500/20 border border-green-400/50 rounded-lg flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                      <p className="text-green-300 font-medium text-xs sm:text-sm md:text-base">{successMessage}</p>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="p-2 sm:p-3 md:p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-center gap-2 sm:gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-300 font-medium text-xs sm:text-sm md:text-base">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !!successMessage}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-bold text-sm sm:text-base md:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : successMessage ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Success!</span>
                      </>
                    ) : (
                      "Continue to Registration"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
