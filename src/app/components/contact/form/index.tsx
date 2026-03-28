"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImgPath } from "@/utils/pathUtils";
import { apiPost } from "@/utils/api";

interface FormErrors {
  name?: string;
  mobile?: string;
  message?: string;
  general?: string;
}

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loader, setLoader] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Helper to count words
  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Validate individual fields
  const validateFields = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Mobile validation
    if (!formData.mobile || formData.mobile.trim() === "") {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid phone number";
    }

    // Message validation
    if (!formData.message || formData.message.trim() === "") {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }

    return newErrors;
  };

  // Auto-focus on first error field
  const focusFirstErrorField = (fieldErrors: FormErrors) => {
    if (fieldErrors.name) {
      nameInputRef.current?.focus();
    } else if (fieldErrors.mobile) {
      mobileInputRef.current?.focus();
    } else if (fieldErrors.message) {
      messageInputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Enforce 300 words limit for the message field
    if (name === "message") {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 300) {
        const trimmed = words.slice(0, 300).join(" ");
        setFormData((prevData) => ({
          ...prevData,
          [name]: trimmed
        }));
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const reset = () => {
    setFormData({
      name: "",
      mobile: "",
      message: ""
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    // Frontend validation
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstErrorField(validationErrors);
      return;
    }

    setLoader(true);
    setErrors({});

    try {
      const response = await apiPost("/api/v1/contact", {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        message: formData.message.trim()
      });

      // Handle success response
      if (response.success) {
        setSuccessMessage("Message sent successfully!");
        setSubmitted(true);
        reset();
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        // Handle error response
        const fieldErrors: FormErrors = {};
        
        // Parse field-specific errors from the response
        if (response.data?.errors && Array.isArray(response.data.errors)) {
          response.data.errors.forEach((error: { field: string; message: string }) => {
            fieldErrors[error.field as keyof FormErrors] = error.message;
          });
        } else if (response.data?.message) {
          fieldErrors.general = response.data.message;
        } else if (response.error) {
          // Handle specific error codes
          if (response.error.includes("429") || response.error.includes("rate limit")) {
            fieldErrors.general = "Too many requests. Please try again later.";
          } else if (response.error.includes("500") || response.error.includes("server")) {
            fieldErrors.general = "Failed to send message. Please try again.";
          } else {
            fieldErrors.general = response.error || "An error occurred. Please try again.";
          }
        } else {
          fieldErrors.general = "An error occurred. Please try again.";
        }
        
        setErrors(fieldErrors);
        focusFirstErrorField(fieldErrors);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setErrors({
        general: "Network error. Please check your connection and try again."
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <section className="dark:bg-darkmode lg:pb-24 pb-16 px-4">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-8 items-center">
            <div className="col-span-6">
              <h2 className="max-w-72 text-[40px] leading-[1.2] font-bold mb-9">Get In Touch</h2>
              
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 text-sm font-medium">{successMessage}</p>
                </div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 text-sm font-medium">{errors.general}</p>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap w-full m-auto justify-between">
                {/* Name Field */}
                <div className="mx-0 my-2.5 w-full">
                  <label htmlFor="name" className="pb-3 inline-block text-17">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id='name'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full text-17 px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0 ${
                      errors.name ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Mobile Field */}
                <div className="mx-0 my-2.5 w-full">
                  <label htmlFor="mobile" className="pb-3 inline-block text-17">
                    Mobile Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={mobileInputRef}
                    id='mobile'
                    type='tel'
                    name='mobile'
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full text-17 px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0 ${
                      errors.mobile ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="mx-0 my-2.5 w-full">
                  <label htmlFor="message" className="pb-3 inline-block text-17">
                    Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    ref={messageInputRef}
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full text-17 px-4 rounded-lg py-3 border-border outline-none dark:text-white dark:bg-darkmode border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0 resize-vertical ${
                      errors.message ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-slate-300">
                      Max 300 words
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-300">
                      {countWords(formData.message)}/300
                    </span>
                  </div>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mx-0 my-2.5 w-full">
                  <button 
                    type="submit" 
                    disabled={loader}
                    className={`bg-primary rounded-lg text-white py-4 px-8 mt-4 inline-flex items-center gap-2 transition-all duration-200 ${
                      loader 
                        ? 'opacity-75 cursor-not-allowed' 
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {loader ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="col-span-6 h-[600px]">
              <Image
                src={getImgPath("/images/contact-page/contact.jpg")}
                alt="Contact"
                width={1300}
                height={0}
                quality={100}
                className="w-full h-full object-cover bg-no-repeat bg-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;
