import { motion } from "framer-motion";
import { X, FileText, BookOpen, Newspaper, PenTool, CheckCircle, AlertCircle, Send, Upload } from "lucide-react";

interface MagazineGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MagazineGuidelinesModal({ isOpen, onClose }: MagazineGuidelinesModalProps) {
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
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h2 className="font-display text-2xl font-bold">Magazine Submission Guidelines</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream/20 hover:bg-cream/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-cream" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Welcome Section */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-gold"></span>
                Welcome to LIT'ERA Magazine
                <span className="w-8 h-px bg-gold"></span>
              </h3>
              <p className="font-body text-ink/70 leading-relaxed">
                Thank you for your interest in contributing to LIT'ERA Magazine! We welcome original literary works 
                from our community members. Whether you're a seasoned writer or just starting your literary journey, 
                we'd love to consider your work for publication.
              </p>
            </section>

            {/* Publication Types */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Publication Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    icon: <Newspaper className="w-5 h-5" />,
                    title: "Litera Times", 
                    desc: "Monthly newspaper featuring club news, events, interviews, and short articles (500-1000 words)"
                  },
                  { 
                    icon: <FileText className="w-5 h-5" />,
                    title: "Literary Voices", 
                    desc: "Creative writing magazine with poetry, short stories, and personal essays (up to 3000 words)"
                  },
                  { 
                    icon: <BookOpen className="w-5 h-5" />,
                    title: "Research Journal", 
                    desc: "Academic journal for literary analysis, research papers, and critical essays (3000-5000 words)"
                  },
                  { 
                    icon: <PenTool className="w-5 h-5" />,
                    title: "Poetry Anthology", 
                    desc: "Annual collection of original poetry from club members and guest poets (3-5 poems per submission)"
                  }
                ].map((pub, index) => (
                  <div key={index} className="bg-white p-4 border border-ink/10 rounded-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gold text-ink rounded-full flex items-center justify-center">
                        {pub.icon}
                      </div>
                      <h4 className="font-accent text-ink font-bold">{pub.title}</h4>
                    </div>
                    <p className="font-body text-ink/70 text-sm">{pub.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Submission Requirements */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Submission Requirements</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Content Guidelines</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>All work must be original and previously unpublished</li>
                    <li>Content should be appropriate for a literary publication</li>
                    <li>Word count must match category requirements</li>
                    <li>Include proper citations for any referenced material</li>
                    <li>Proofread carefully for grammar and spelling errors</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">Formatting Requirements</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Submit as PDF, Word (.doc/.docx), or plain text (.txt) files</li>
                    <li>Use 12-point Times New Roman or similar serif font</li>
                    <li>Double-spaced text with 1-inch margins</li>
                    <li>Include your name, email, and phone number on first page</li>
                    <li>Poetry submissions: one poem per page</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">File Specifications</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>Maximum file size: 10MB</li>
                    <li>File name format: Category_YourName_Title</li>
                    <li>No password-protected files</li>
                    <li>Ensure all images are high resolution (300 DPI minimum)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Editorial Process */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Editorial Review Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    step: "1", 
                    title: "Initial Review", 
                    desc: "Submissions are reviewed for compliance with guidelines and basic quality standards"
                  },
                  { 
                    step: "2", 
                    title: "Editorial Review", 
                    desc: "Our editorial team evaluates content, style, and suitability for publication"
                  },
                  { 
                    step: "3", 
                    title: "Final Decision", 
                    desc: "Acceptance, rejection, or request for revisions is communicated within 14 days"
                  }
                ].map((process, index) => (
                  <div key={index} className="bg-cream/50 p-4 border border-gold/20 rounded-sm text-center">
                    <div className="w-8 h-8 bg-ink text-cream rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                      {process.step}
                    </div>
                    <h4 className="font-accent text-ink text-sm font-bold mb-2">{process.title}</h4>
                    <p className="font-body text-ink/70 text-xs">{process.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Rights & Permissions */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Rights & Permissions</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm space-y-4">
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">What You Keep</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>You retain copyright to your original work</li>
                    <li>You can republish your work elsewhere after our publication</li>
                    <li>You receive full credit as the author</li>
                    <li>You get a complimentary copy of the publication</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-2">What We Request</h4>
                  <ul className="font-body text-ink/70 space-y-2 list-disc list-inside">
                    <li>First publication rights for the magazine issue</li>
                    <li>Right to include your work in digital archives</li>
                    <li>Right to use excerpts for promotional purposes</li>
                    <li>Right to consider the work for future anthologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Submission Tips */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Submission Tips for Success</h3>
              <div className="bg-ink/5 p-6 border border-ink/10 rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Do's</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Read our magazine issues to understand our style
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Follow all formatting guidelines carefully
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Submit your best, most polished work
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Include a brief author bio (50-100 words)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Don'ts</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Submit previously published work
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Send multiple submissions at once
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Ignore word count requirements
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        Submit work with explicit or offensive content
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="font-display text-xl text-ink font-bold mb-4">Contact & Support</h3>
              <div className="bg-white p-6 border border-ink/10 rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Editorial Team</h4>
                    <ul className="font-body text-ink/70 space-y-1 text-sm">
                      <li><strong>Editor-in-Chief:</strong> Sudeepthi Kalisapudi</li>
                      <li><strong>Managing Editor:</strong> Supritha Akula</li>
                      <li><strong>Content Editor:</strong> J Sai Neelima</li>
                      <li><strong>Copy Editor:</strong> Namrata Mokshgundam</li>
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

            {/* Ready to Submit */}
            <section className="text-center">
              <div className="bg-gold/10 p-6 border border-gold/30 rounded-sm">
                <h3 className="font-display text-xl text-ink font-bold mb-3">Ready to Submit?</h3>
                <p className="font-body text-ink/70 mb-4">
                  If you've read these guidelines and have a work ready for submission, we'd love to hear from you!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    // This will trigger the submission modal
                    window.dispatchEvent(new CustomEvent('openSubmissionModal'));
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-cream font-accent text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Your Work
                </button>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
