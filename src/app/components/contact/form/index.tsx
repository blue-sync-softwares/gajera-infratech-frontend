"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImgPath } from "@/utils/pathUtils";

const ContactForm = () => {

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    specialist: "",
    date: "",
    time: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loader, setLoader] = useState(false);

  // helper to count words
  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // enforce 300 words limit for the message field (name === 'time')
    if (name === "time") {
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
  };

  const reset = () => {
    formData.firstname = "";
    formData.lastname = "";
    formData.email = "design & branding";
    formData.specialist = "";
    formData.date = "";
    formData.time = "";
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);

    fetch("https://formsubmit.co/ajax/bhainirav772@gmail.com", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        specialist: formData.specialist,
        date: formData.date,
        time: formData.time
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmitted(data.success);
        reset();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <section className="dark:bg-darkmode lg:pb-24 pb-16 px-4">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-8 items-center">
            <div className="col-span-6">
              <h2 className="max-w-72 text-[40px] leading-[1.2] font-bold mb-9">Get In Touch</h2>
              <form onSubmit={handleSubmit} className="flex flex-wrap w-full m-auto justify-between">
                <div className="sm:flex gap-3 w-full">
                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="first-name" className="pb-3 inline-block text-17">First Name*</label>
                    <input
                      id='firstname'
                      type='text'
                      name='firstname'
                      value={formData.firstname}
                      onChange={handleChange}
                      className="w-full text-17 px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                    />
                  </div>
                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="last-name" className="pb-3 inline-block text-17">Last Name*</label>
                    <input
                      id='lastname'
                      type='text'
                      name='lastname'
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full text-17 px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                    />
                  </div>
                </div>
                <div className="sm:flex gap-3 w-full">
                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="email" className="pb-3 inline-block text-17">Email address*</label>
                    <input
                      id='email'
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-17 px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                    />
                  </div>
                </div>

                <div className="sm:flex gap-3 w-full">
                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="date" className="pb-3 inline-block text-17">Mobile Number*</label>
                    <input
                      id='date'
                      type='number'
                      name='date'
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full text-17 px-4 rounded-lg  py-2.5 outline-none dark:text-white dark:bg-darkmode border-border border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                    />
                  </div>

                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="message" className="pb-3 inline-block text-17">Message*</label>

                    {/* replaced input with textarea and word-limit enforcement */}
                    <textarea
                      id='message'
                      name='time'
                      value={formData.time}
                      onChange={handleChange}
                      rows={6}
                      className="w-full text-17 px-4 rounded-lg py-3 border-border outline-none dark:text-white dark:bg-darkmode border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0 resize-vertical"
                      aria-describedby="message-help"
                    />

                    <div id="message-help" className="mt-2 text-sm text-gray-500 dark:text-slate-300">
                      Max 300 words
                    </div>
                  </div>
                </div>

                <div className="mx-0 my-2.5 w-full">
                  <button type="submit" className="bg-primary rounded-lg text-white py-4 px-8 mt-4 inline-block hover:bg-blue-700">
                    Send Message
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
