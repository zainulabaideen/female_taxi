import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    }, 1500);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-black text-[#402763] mb-2">Message Sent!</h3>
        <p className="text-[#402763]/60 mb-6">We'll be in touch within 24 hours.</p>
        <button
          onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
          className="px-6 py-2.5 bg-[#402763] text-white rounded-xl font-semibold hover:bg-[#402763]/90 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#e1cfe6]/60 p-8 md:p-10 shadow-lg shadow-[#402763]/5" data-aos="fade-up" data-aos-delay="100">
      <h2 className="text-2xl font-black text-[#402763] mb-2">Send Us a Message</h2>
      <p className="text-[#402763]/60 text-sm mb-8">We read every message and respond within 24 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/40 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/40 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#402763] mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            placeholder="How can we help?"
            className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/40 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#402763] mb-2">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell us more..."
            className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/40 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-[#402763]/20 hover:shadow-[#402763]/40"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
