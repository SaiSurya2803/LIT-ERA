import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Globe, Users, FileText, Trophy, Calendar, MapPin, Star, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import MUNGuidelinesModal from "@/components/MUNGuidelinesModal";
import MUNRegistrationModal from "@/components/MUNRegistrationModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MUN() {
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState<any>(null);

  const committees = [
    {
      name: "AIPPM",
      topic: "All India Political Parties Meet",
      description: "A committee where delegates represent Indian political leaders and debate key national political issues and policies.",
      difficulty: "Intermediate",
      delegates: 30,
      fullDescription: "The All India Political Parties Meet (AIPPM) is a dynamic platform simulating the functioning of a non-technical yet powerful committee where delegates step into the shoes of Indian politicians. Expect fiery debates, complex policy negotiations, and strategic alliances.",
      rules: [
        "Debate format follows standard parliamentary procedures with provisions for unmoderated caucuses.",
        "Delegates must represent the ideology and past actions of their assigned political figures or parties.",
        "Use of unparliamentary language will result in immediate penalization.",
        "Position papers are mandatory and must be submitted before the first session."
      ],
      agenda: "Reviewing the current socio-economic frameworks and addressing systemic political reforms."
    },
    {
      name: "UNGA-DISEC",
      topic: "Disarmament and International Security",
      description: "Discusses global security challenges including arms control, disarmament, and international peace.",
      difficulty: "Advanced",
      delegates: 30,
      fullDescription: "The First Committee of the United Nations General Assembly deals with disarmament, global challenges, and threats to peace that affect the international community. Delegates will focus on reducing global arsenals and regulating emerging military technologies.",
      rules: [
        "Standard UNGA rules of procedure apply.",
        "Resolutions require a two-thirds majority to pass.",
        "Working papers can be introduced at any time during formal debate.",
        "Lobbying and bloc formations are encouraged but must remain diplomatic."
      ],
      agenda: "Mitigating the proliferation of autonomous weapons systems in modern warfare."
    },
    {
      name: "UNHRC",
      topic: "United Nations Human Rights Council",
      description: "Focuses on protecting human rights and addressing global human rights violations.",
      difficulty: "Intermediate",
      delegates: 30,
      fullDescription: "The UN Human Rights Council is the principal intergovernmental body within the UN system responsible for strengthening the promotion and protection of human rights around the globe and addressing situations of human rights violations.",
      rules: [
        "Debate must strictly adhere to the Universal Declaration of Human Rights.",
        "Direct accusations against member states must be substantiated with verified reports.",
        "Observers and NGOs may be invited to speak at the discretion of the Executive Board.",
        "Draft resolutions must address actionable humanitarian measures."
      ],
      agenda: "Protecting the rights of climate refugees and populations displaced by environmental disasters."
    },
    {
      name: "UNODC",
      topic: "United Nations Office on Drugs and Crime",
      description: "Works on global issues related to drugs, crime prevention, corruption, and terrorism.",
      difficulty: "Advanced",
      delegates: 30,
      fullDescription: "The UN Office on Drugs and Crime operates globally to combat illicit drugs and international crime. Delegates will tackle complex webs of transnational organized crime, formulate policies for drug control, and establish protocols against terrorism.",
      rules: [
        "Crisis updates may be introduced by the Executive Board at any time.",
        "Directives may be issued by delegates if pertinent to their national powers.",
        "Extensive research into international law and extradition treaties is highly recommended.",
        "Alliances must not violate existing UN sanctions."
      ],
      agenda: "Combatting the rise of narco-terrorism and illicit trafficking in conflict zones."
    },
  ];

  const events = [
    {
      title: "Inauguration",
      date: "Day 1 - 9:00 AM",
      description: "Kickoff and opening addresses",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Debate Sessions",
      date: "Day 1 & Day 2",
      description: "Intense diplomatic discourse and resolution drafting",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Wrap Up",
      date: "Day 2 - 1:30 PM",
      description: "Finalization of reports and concluding statements",
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "Awards & Disperse",
      date: "Day 2 - 3:30 PM",
      description: "Recognition of excellence and closing ceremony",
      icon: <Trophy className="w-5 h-5" />,
    },
  ];

  const awards = [
    "Best Delegate",
    "Honorable Mention",
    "Special Mention",
    "Best Photographer",
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold"></div>
            <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase">MUN-GLEC 2026</span>
            <div className="w-12 h-px bg-gold"></div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.1] mb-6">
            Model United <br />
            <span className="italic text-gold font-light">Nations</span>
          </h1>

          <p className="font-body text-xl text-ink/70 leading-relaxed mb-10 max-w-3xl mx-auto whitespace-pre-line">
            MUN-GLEC 2026 invites students from GLEC and institutions across the country to participate in an engaging conference focused on diplomacy, debate, and global engagement.
            {"\n\n"}
            Experience dynamic committees, intellectual debate, and an immersive diplomatic environment.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScxhUnlVX5AEo_SBsRIM4U5N7u_QXN3mmppTN4YDBrDD_EGJw/viewform?usp=publish-editor', '_blank')}
              className="bg-ink text-cream font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold hover:text-ink transition-all"
            >
              Register Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="border-gold text-gold font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold hover:text-ink transition-all"
              onClick={() => setGuidelinesOpen(true)}
            >
              View Guidelines
            </Button>
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <div className="w-16 h-16 bg-gold text-ink flex items-center justify-center rounded-full mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">April 10-11, 2026</h3>
            <p className="font-body text-ink/60">Two days of intense debate and diplomacy</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="text-center">
            <div className="w-16 h-16 bg-ink text-cream flex items-center justify-center rounded-full mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">GLEC Campus</h3>
            <p className="font-body text-ink/60">Gokaraju Lailavathi Engineering College</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="text-center">
            <div className="w-16 h-16 bg-gold text-ink flex items-center justify-center rounded-full mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">200+ Delegates</h3>
            <p className="font-body text-ink/60">From universities worldwide</p>
          </motion.div>
        </div>

        {/* Committees Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-ink mb-4">Committees & Topics</h2>
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Four dynamic committees addressing contemporary global challenges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {committees.map((committee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border-2 border-ink/5 p-8 rounded-sm shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-accent uppercase tracking-wider rounded-full ${committee.difficulty === 'Advanced' ? 'bg-rust/10 text-rust' :
                    committee.difficulty === 'Intermediate' ? 'bg-gold/10 text-gold' :
                      'bg-ink/10 text-ink'
                    }`}>
                    {committee.difficulty}
                  </span>
                </div>

                <Globe className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-display text-2xl font-bold text-ink mb-3">{committee.name}</h3>
                <h4 className="font-body text-lg font-semibold text-gold mb-3">{committee.topic}</h4>
                <p className="font-body text-ink/70 mb-6">{committee.description}</p>

                <div className="flex items-center justify-between text-sm font-body text-ink/60">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {committee.delegates} Delegates
                  </span>
                  <Button
                    variant="ghost"
                    className="text-gold hover:text-ink p-0 h-auto font-accent"
                    onClick={() => setSelectedCommittee(committee)}
                  >
                    Learn More →
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-ink mb-4">Event Schedule</h2>
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Three days of diplomatic engagement and intellectual challenge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-ink text-cream p-6 rounded-sm shadow-sm"
              >
                <div className="w-12 h-12 bg-gold text-ink flex items-center justify-center rounded-sm mb-4">
                  {event.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{event.title}</h3>
                <p className="font-accent text-sm text-gold/80 mb-3">{event.date}</p>
                <p className="font-body text-cream/70 text-sm">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <Award className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-display text-4xl font-bold text-ink mb-4">Awards & Recognition</h2>
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Excellence in diplomacy, research, and public speaking
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-cream border-2 border-gold flex items-center justify-center rounded-full mx-auto mb-4">
                  <Star className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-body font-semibold text-ink">{award}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Registration CTA */}
        <div className="text-center bg-ink text-cream p-12 rounded-sm border-2 border-gold/20">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="font-body text-lg text-cream/80 mb-8 max-w-2xl mx-auto">
            Join us for an unforgettable experience of diplomacy, debate, and global citizenship.
          </p>

          <div className="flex flex-wrap items-center justify-center">
            <Button
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScxhUnlVX5AEo_SBsRIM4U5N7u_QXN3mmppTN4YDBrDD_EGJw/viewform?usp=publish-editor', '_blank')}
              className="bg-gold text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:bg-cream hover:text-ink transition-all"
            >
              Register as Delegate <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* MUN Guidelines Modal */}
      <MUNGuidelinesModal isOpen={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />

      {/* MUN Registration Modal */}
      <MUNRegistrationModal isOpen={registrationOpen} onClose={() => setRegistrationOpen(false)} />

      {/* Committee Details Modal */}
      <Dialog open={!!selectedCommittee} onOpenChange={(open) => !open && setSelectedCommittee(null)}>
        <DialogContent className="max-w-2xl bg-cream border-gold/20">
          {selectedCommittee && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-gold" />
                  <DialogTitle className="font-display text-2xl font-bold text-ink">
                    {selectedCommittee.name}
                  </DialogTitle>
                </div>
                <DialogDescription className="font-body text-lg font-semibold text-gold">
                  {selectedCommittee.topic}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4 mt-6">
                <div className="space-y-8">
                  <section>
                    <h4 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gold" /> About the Committee
                    </h4>
                    <p className="font-body text-ink/80 leading-relaxed">
                      {selectedCommittee.fullDescription}
                    </p>
                  </section>

                  <section>
                    <h4 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-gold" /> Agenda
                    </h4>
                    <p className="font-body text-ink/80 leading-relaxed font-medium bg-gold/10 p-4 rounded-sm border-l-4 border-gold">
                      {selectedCommittee.agenda}
                    </p>
                  </section>

                  <section>
                    <h4 className="font-display text-xl font-bold text-ink mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-gold" /> Rules & Regulations
                    </h4>
                    <ul className="space-y-3 font-body text-ink/80">
                      {selectedCommittee.rules.map((rule: string, i: number) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-gold mt-1">•</span>
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </ScrollArea>

              <div className="mt-6 flex justify-end gap-4 pt-4 border-t border-ink/10">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCommittee(null)}
                  className="font-accent border-ink/20 text-ink hover:bg-ink/5"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedCommittee(null);
                    window.open('https://docs.google.com/forms/d/e/1FAIpQLScxhUnlVX5AEo_SBsRIM4U5N7u_QXN3mmppTN4YDBrDD_EGJw/viewform?usp=publish-editor', '_blank');
                  }}
                  className="font-accent bg-gold text-ink hover:bg-ink hover:text-cream transition-colors"
                >
                  Register Now
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
