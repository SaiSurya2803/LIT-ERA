import { motion } from "framer-motion";
import { X } from "lucide-react";

interface MUNGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MUNGuidelinesModal({ isOpen, onClose }: MUNGuidelinesModalProps) {
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
          <h2 className="font-display text-2xl font-bold">MUN Conference Guidelines</h2>
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
            {/* Conference Overview */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-gold"></span>
                Conference Overview
                <span className="w-8 h-px bg-gold"></span>
              </h3>
              <p className="font-body text-ink/70 leading-relaxed">
                MUN-GLEC 2026 is a Model United Nations conference designed to simulate United Nations committees.
                Participants will engage in diplomatic discourse, debate international issues, and develop solutions
                to global challenges while following UN procedures and protocols.
              </p>
            </section>

            {/* Dress Code */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Dress Code & Professional Conduct</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Formal Attire Required</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Western formal wear: Suits, blazers, dress shirts, ties for gentlemen</li>
                    <li>Formal dresses, skirts, blouses, or business suits for ladies</li>
                    <li>Formal footwear (no sneakers, sandals, or casual shoes)</li>
                    <li>National dress is permitted if it's formal and respectful</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Prohibited Items</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Casual wear (jeans, t-shirts, shorts, etc.)</li>
                    <li>Excessive jewelry or accessories</li>
                    <li>Hats or caps (unless for religious reasons)</li>
                    <li>Visible tattoos with inappropriate content</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Parliamentary Procedure */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Parliamentary Procedure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Speaking Time", desc: "3 minutes per speech, 1 minute for points of information" },
                  { title: "Motions", desc: "All motions must be in writing and seconded before discussion" },
                  { title: "Points", desc: "Points of Order, Personal Privilege, and Information take precedence" },
                  { title: "Voting", desc: "Simple majority for most decisions, 2/3 for important matters" }
                ].map((procedure, index) => (
                  <div key={index} className="bg-white p-4 border border-ink/10 rounded-sm">
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">{procedure.title}</h4>
                    <p className="font-body text-ink/70 text-sm">{procedure.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Delegate Conduct */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Delegate Conduct & Ethics</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Required Behavior</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Maintain diplomatic decorum at all times</li>
                    <li>Address all speakers as "Honorable Delegate" or "Distinguished Delegate"</li>
                    <li>Respect the authority of the Chair and committee rules</li>
                    <li>Stay in character as your assigned country's representative</li>
                    <li>Participate actively in all committee sessions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Prohibited Actions</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Personal attacks or disrespectful language</li>
                    <li>Using electronic devices during sessions (except for research)</li>
                    <li>Leaving the committee room without permission</li>
                    <li>Plagiarism in position papers or speeches</li>
                    <li>Sharing confidential committee information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Position Papers */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Position Paper Guidelines</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Format Requirements</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Maximum 2 pages, double-spaced, Times New Roman, 12pt font</li>
                    <li>Include country name, committee name, and delegate name</li>
                    <li>Headers: Country's Position, International Actions, Proposed Solutions</li>
                    <li>Submit via email to litera.glec2026@gmail.com by April 4, 2026</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Content Guidelines</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Clearly state your country's official position on the topic</li>
                    <li>Reference actual UN resolutions and international law</li>
                    <li>Propose realistic and actionable solutions</li>
                    <li>Avoid personal opinions - represent your country's official stance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Registration Fees */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Registration Fees</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cream/50 p-4 border border-gold/20 rounded-sm text-center">
                    <h4 className="font-display text-lg font-bold text-ink mb-1">Individual Delegate</h4>
                    <p className="font-accent text-gold text-xl font-bold">₹1,000</p>
                    <p className="font-body text-ink/60 text-sm mt-1">per delegate</p>
                  </div>
                  <div className="bg-cream/50 p-4 border border-gold/20 rounded-sm text-center">
                    <h4 className="font-display text-lg font-bold text-ink mb-1">Group Registration</h4>
                    <p className="font-accent text-gold text-xl font-bold">₹1,200</p>
                    <p className="font-body text-ink/60 text-sm mt-1">per delegate</p>
                    <p className="font-body text-ink/50 text-xs mt-2 italic">(Must include multiple delegates registering together)</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Registration Includes:</h4>
                  <ul className="grid grid-cols-2 gap-2 font-body text-ink/70 text-sm list-disc list-inside">
                    <li>Delegate Kit</li>
                    <li>Lunch</li>
                    <li>Conference Materials</li>
                    <li>Access to Committee Sessions</li>
                    <li>Participation Certificate</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Awards & Recognition */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Awards & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    award: "Best Delegate",
                    criteria: "Outstanding diplomacy, research, and debate skills"
                  },
                  {
                    award: "Honorable Mention",
                    criteria: "Notable performance in specific aspects of debate"
                  },
                  {
                    award: "Special Mention",
                    criteria: "Excellent participation and contribution to committee"
                  },
                  {
                    award: "Best Photographer",
                    criteria: "Exceptional capture of the conference's defining moments"
                  }
                ].map((awardData, index) => (
                  <div key={index} className="bg-cream/50 p-4 border border-gold/20 rounded-sm">
                    <h4 className="font-accent text-ink text-sm tracking-widest uppercase mb-2">{awardData.award}</h4>
                    <p className="font-body text-ink/70 text-sm">{awardData.criteria}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule & Timeline */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Conference Schedule</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">April 10, 2026</h4>
                    <ul className="font-body text-ink/70 text-sm space-y-1">
                      <li>9:00 AM - 10:00 AM - Inauguration</li>
                      <li>10:00 AM - 1:00 PM - Debate</li>
                      <li>1:00 PM - 1:45 PM - Lunch</li>
                      <li>2:00 PM - 5:00 PM - Debate</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">April 11, 2026</h4>
                    <ul className="font-body text-ink/70 text-sm space-y-1">
                      <li>9:30 AM - 12:30 PM - Debate Session</li>
                      <li>12:30 PM - 1:15 PM - Lunch</li>
                      <li>1:30 PM - 3:30 PM - Wrap Up</li>
                      <li>3:30 PM - 5:00 PM - Awards</li>
                      <li>5:00 PM - 5:30 PM - Disperse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">MUN Secretariat Contact</h3>
              <div className="bg-ink/5 p-6 border border-ink/10 rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Leadership Team</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li><strong>Secretary-General:</strong> Manju Bodi (+91 79813 67371)</li>
                      <li><strong>Deputy Secretary-General:</strong> Jaahnavi Yeturi (+91 70138 42994)</li>
                      <li><strong>Director-General:</strong> Lakshaya Agnihotri (+91 80084 06331)</li>
                      <li><strong>Head of Operations:</strong> Gnaneshwari Thippareddy (+91 62811 30205)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Get in Touch</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li><strong>Email:</strong> litera.glec2026@gmail.com</li>
                      <li><strong>Phone:</strong> +91 7013842994</li>
                      <li><strong>Instagram:</strong> @litera.official_glec</li>
                      <li><strong>Location:</strong> GLEC Campus, Hyderabad</li>
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
