import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface MUNRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MUNRegistrationModal({ isOpen, onClose }: MUNRegistrationModalProps) {
  const { toast } = useToast();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    committee: "",
    experience: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for MUN",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mun/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      toast({
        title: "Registration Successful!",
        description: "You've been registered for LIT'ERA MUN 2026",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        institution: "",
        committee: "",
        experience: "",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for MUN",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-ink">
            MUN Registration - LIT'ERA 2026
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-body text-ink">
                Full Name <span className="text-rust">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-body text-ink">
                Email Address <span className="text-rust">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="font-body text-ink">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="institution" className="font-body text-ink">
                Institution/University
              </Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Your school or university"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="committee" className="font-body text-ink">
                Preferred Committee
              </Label>
              <Input
                id="committee"
                value={formData.committee}
                onChange={(e) => setFormData({ ...formData, committee: e.target.value })}
                placeholder="e.g., UN Security Council, UNGA"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="experience" className="font-body text-ink">
                MUN Experience
              </Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Describe your previous MUN experience (if any)"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-ink text-cream hover:bg-gold hover:text-ink"
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gold text-gold hover:bg-gold hover:text-ink"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
