import { motion } from "framer-motion";
import { useSubmitContact } from "@/hooks/use-contacts";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const submitContact = useSubmitContact();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", country: "", reason: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. We will get back to you shortly.",
        });
        setFormData({ name: "", email: "", country: "", reason: "", message: "" });
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-12"
          >
            <div>
              <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Get in Touch</span>
              <h1 className="font-display text-4xl text-ink font-bold mb-6">
                Send a <span className="italic font-light text-gold">Missive</span>
              </h1>
              <p className="font-body text-lg text-ink/70">
                Whether you wish to join our ranks, propose an event, or simply discuss your latest read, our doors (and inbox) are always open.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-ink/10 flex items-center justify-center text-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">Our Sanctuary</h3>
                  <p className="font-body text-ink/70">Gokaraju Lailavathi Engineering College<br/>GRIET Campus, Nizampet Road<br/>Bachupally, Kukatpally<br/>Hyderabad - 500090, Telangana, India.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-ink/10 flex items-center justify-center text-gold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">Contact Number</h3>
                  <p className="font-body text-ink/70">+91 7013842994</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-ink/10 flex items-center justify-center text-gold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">Electronic Post</h3>
                  <p className="font-body text-ink/70">litera.glec2026@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white p-8 md:p-12 border border-ink/10 shadow-xl shadow-ink/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-accent text-xs tracking-widest uppercase text-ink">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-ink/20 py-3 px-0 text-ink font-body text-lg focus:outline-none focus:border-gold transition-colors placeholder:text-ink/30"
                    placeholder="Jane Austen"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-accent text-xs tracking-widest uppercase text-ink">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-ink/20 py-3 px-0 text-ink font-body text-lg focus:outline-none focus:border-gold transition-colors placeholder:text-ink/30"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-accent text-xs tracking-widest uppercase text-ink">Country</label>
                  <input 
                    type="text" 
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-ink/20 py-3 px-0 text-ink font-body text-lg focus:outline-none focus:border-gold transition-colors placeholder:text-ink/30"
                    placeholder="UK"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-accent text-xs tracking-widest uppercase text-ink">Reason for Contact</label>
                  <select 
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-ink/20 py-3 px-0 text-ink font-body text-lg focus:outline-none focus:border-gold transition-colors appearance-none"
                  >
                    <option value="">Select a reason</option>
                    <option value="membership">Membership Inquiry</option>
                    <option value="event">Event Proposal</option>
                    <option value="feedback">General Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-accent text-xs tracking-widest uppercase text-ink">Your Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-ink/20 py-3 px-0 text-ink font-body text-lg focus:outline-none focus:border-gold transition-colors placeholder:text-ink/30 resize-none"
                  placeholder="Write your missive here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitContact.isPending}
                className="w-full py-4 bg-ink text-cream font-accent text-sm tracking-widest uppercase hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50"
              >
                {submitContact.isPending ? "Sending..." : "Dispatch Message"}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
