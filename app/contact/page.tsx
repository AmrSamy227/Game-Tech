"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          Contact Us
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          Have questions? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="fade-in">
            <form
              onSubmit={handleSubmit}
              className="bg-[#2a2a2a] p-8 rounded-xl shadow-lg"
            >
              {["name", "email", "subject"].map((field) => (
                <div className="mb-6" key={field}>
                  <label className="block text-white mb-2 font-semibold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                    required
                  />
                </div>
              ))}

              <div className="mb-6">
                <label className="block text-white mb-2 font-semibold">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-1"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="fade-in space-y-8">
            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                  <p className="text-gray-400">amrsamihst@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
                  <p className="text-gray-400">+201149935973</p>
                  <p className="text-gray-400">Mon-Fri 9am-6pm EET</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                  <p className="text-gray-400">Betch American City, Maddi</p>
                  <p className="text-gray-400">Egypt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
