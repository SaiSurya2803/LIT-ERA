import { motion } from "framer-motion";
import { X } from "lucide-react";

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidelinesModal({ isOpen, onClose }: GuidelinesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-cream rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-ink text-cream p-6 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold">LIT'ERA Club Guidelines</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream/20 hover:bg-cream/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-cream" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Mission Statement */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-gold"></span>
                Our Mission
                <span className="w-8 h-px bg-gold"></span>
              </h3>
              <p className="font-body text-ink/70 leading-relaxed">
                To foster a community that celebrates the written word, nurtures creative expression, and encourages intellectual growth through engaging discourse, interactive activities, and collaborative events.
              </p>
            </section>

            {/* Core Values */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Literary Excellence", desc: "Promoting high standards in literary appreciation and creation" },
                  { title: "Creative Expression", desc: "Encouraging innovative thinking and artistic expression" },
                  { title: "Community Building", desc: "Creating an inclusive space for literary enthusiasts" },
                  { title: "Intellectual Growth", desc: "Fostering critical thinking and meaningful discussions" }
                ].map((value, index) => (
                  <div key={index} className="bg-white p-4 border border-ink/10 rounded-sm">
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">{value.title}</h4>
                    <p className="font-body text-ink/70 text-sm">{value.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Membership Guidelines */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Membership Guidelines</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Eligibility</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>All students with a passion for literature and creative arts</li>
                    <li>Commitment to active participation in club activities</li>
                    <li>Respect for diverse opinions and creative expressions</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Responsibilities</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Attend regular meetings and events</li>
                    <li>Contribute to club discussions and activities</li>
                    <li>Support fellow members in their literary journey</li>
                    <li>Uphold the values and reputation of LIT'ERA Club</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Event Guidelines */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Event Guidelines</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Participation</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Register in advance for all events</li>
                    <li>Arrive on time and stay for the duration</li>
                    <li>Dress appropriately for the event type</li>
                    <li>Follow event-specific rules and guidelines</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Conduct</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Maintain respectful behavior at all times</li>
                    <li>Follow social media etiquette when posting about events</li>
                    <li>Respect guest speakers and visiting authors</li>
                    <li>Represent LIT'ERA Club positively</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Contact & Support</h3>
              <div className="bg-ink/5 p-6 border border-ink/10 rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Leadership Team</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li><strong>President:</strong> Sudeepthi Kalisapudi</li>
                      <li><strong>Vice President:</strong> Supritha Akula</li>
                      <li><strong>Secretary:</strong> J Sai Neelima</li>
                      <li><strong>Treasurer:</strong> Namrata Mokshgundam</li>
                      <li><strong>Docs Lead:</strong> P Sanjana</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Get in Touch</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li><strong>Email:</strong> litera@gmail.com</li>
                      <li><strong>Phone:</strong> +91 7013842994</li>
                      <li><strong>Instagram:</strong> @litera.official_glec</li>
                      <li><strong>Location:</strong> GRIET Campus, Hyderabad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
