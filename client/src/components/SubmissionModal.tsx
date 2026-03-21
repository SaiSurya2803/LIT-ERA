import { motion } from "framer-motion";
import { X, Upload, FileText, Mail, Send, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    category: 'article',
    description: '',
    file: null as File | null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    { value: 'article', label: 'Article' },
    { value: 'poetry', label: 'Poetry' },
    { value: 'short-story', label: 'Short Story' },
    { value: 'research', label: 'Research Paper' },
    { value: 'review', label: 'Book Review' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      console.log('File selected:', file);
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.type)) {
        console.log('File type is allowed, setting form data...');
        setFormData(prev => {
          console.log('Previous formData:', prev);
          const newData = { ...prev, file };
          console.log('New formData:', newData);
          return newData;
        });
      } else {
        console.log('File type not allowed:', file.type);
        alert('Please upload a PDF, Word document, or text file');
      }
    } else {
      console.log('No files selected');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== SUBMISSION DEBUG ===');
    console.log('Current formData:', formData);
    console.log('formData.file:', formData.file);
    console.log('formData.file name:', formData.file?.name);
    console.log('formData.file size:', formData.file?.size);
    console.log('formData.file type:', formData.file?.type);
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      
      if (formData.file) {
        submitData.append('file', formData.file);
        console.log('File added to FormData:', formData.file.name);
      }
      
      console.log('=== SENDING DATA ===');
      console.log('FormData entries:', Array.from(submitData.entries()));
      
      // Send to backend API with FormData
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: submitData, // Don't set Content-Type header for FormData
        credentials: 'include'
      });

      console.log('=== RESPONSE ===');
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            title: '',
            category: 'article',
            description: '',
            file: null
          });
          setSubmitStatus('idle');
          onClose();
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Submission failed:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-cream rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-ink text-cream p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6" />
            <h2 className="font-display text-2xl font-bold">Submit Your Work</h2>
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
          {submitStatus === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-ink mb-2">Submission Successful!</h3>
              <p className="font-body text-ink/70 mb-4">
                Your work has been submitted successfully. We'll review it and get back to you soon.
              </p>
              <p className="font-body text-ink/60 text-sm">
                A confirmation email has been sent to {formData.email}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-accent text-sm text-ink mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-white text-ink focus:outline-none focus:border-gold transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block font-accent text-sm text-ink mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-white text-ink focus:outline-none focus:border-gold transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Submission Details */}
              <div>
                <label className="block font-accent text-sm text-ink mb-2">Submission Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-white text-ink focus:outline-none focus:border-gold transition-colors"
                  placeholder="Enter your work title"
                />
              </div>

              <div>
                <label className="block font-accent text-sm text-ink mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-white text-ink focus:outline-none focus:border-gold transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-accent text-sm text-ink mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-white text-ink focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Brief description of your work (max 500 words)"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block font-accent text-sm text-ink mb-2">Upload File *</label>
                <div className="border-2 border-dashed border-ink/30 rounded-sm p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileInputChange}
                    className="w-full text-ink text-sm"
                  />
                  
                  {formData.file ? (
                    <div className="mt-4 text-ink">
                      <FileText className="w-8 h-8 text-gold mx-auto mb-2" />
                      <p className="font-accent text-sm">{formData.file.name}</p>
                      <p className="text-xs text-ink/60 mt-1">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-ink/60">
                      <p className="font-accent text-sm mb-2">
                        Click to browse and select a file
                      </p>
                      <p className="text-xs">
                        Accepted formats: PDF, Word (.doc/.docx), Text (.txt)
                      </p>
                      <p className="text-xs">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guidelines Notice */}
              <div className="bg-ink/5 border border-ink/10 rounded-sm p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div className="text-ink/70 text-sm">
                    <h4 className="font-accent font-semibold mb-1">Submission Guidelines:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• All submissions must be original work</li>
                      <li>• Content should be appropriate for a literary publication</li>
                      <li>• Include proper citations for referenced material</li>
                      <li>• You will receive a confirmation email upon submission</li>
                      <li>• Our editorial team will review your submission within 7 days</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-ink/5 border border-ink/20 rounded-sm p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-gold" />
                    <p className="text-ink text-sm">
                      There was an error submitting your work. Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-ink text-ink font-accent text-sm uppercase tracking-widest hover:bg-ink hover:text-cream transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-ink text-cream font-accent text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Work
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
