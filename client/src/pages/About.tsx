import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-8 bg-cream">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Our Story</span>
          <h1 className="font-display text-5xl md:text-6xl text-ink font-bold mb-6">
            The Genesis of <span className="italic font-light text-gold">LIT'ERA</span>
          </h1>
          <div className="w-24 h-px bg-gold mx-auto"></div>
        </motion.div>

        {/* Content Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          
          {/* Left: Image / Decorative */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 relative"
          >
            <div className="aspect-[3/4] bg-ink relative rounded-sm overflow-hidden p-8 flex flex-col justify-between border-l-4 border-gold group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
              
              <div className="relative z-10 text-gold opacity-50 font-display text-6xl">"</div>
              
              <div className="relative z-10 font-display text-2xl text-cream italic leading-relaxed">
                We read to know we are not alone. Literature is the most agreeable way of ignoring life.
              </div>
              
              <div className="relative z-10 font-accent text-gold text-xs tracking-widest uppercase">
                — Core Philosophy
              </div>
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-7 flex flex-col justify-center space-y-8 font-body text-lg text-ink/80 leading-relaxed"
          >
            <p className="first-letter:text-7xl first-letter:font-display first-letter:font-bold first-letter:text-gold first-letter:mr-3 first-letter:float-left">
              Founded on the belief that words possess an inherent magic, LIT'ERA began as a small gathering of passionate readers. What started as hushed conversations in dimly lit coffee shops has blossomed into a thriving sanctuary for literary enthusiasts.
            </p>
            
            <p>
              Our club is more than just a place to discuss books; it's a vibrant ecosystem where creativity intersects with intellect. We recognize that true appreciation of literature extends beyond the pages—it bleeds into art, conversation, and action.
            </p>

            <div className="bg-white p-8 border border-ink/5 relative mt-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
              <h3 className="font-display text-2xl text-ink font-bold mb-3">Our Mission</h3>
              <p className="text-base text-ink/70">
                To foster a community that celebrates the written word, nurtures creative expression, and encourages intellectual growth through engaging discourse and collaborative events.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Faculty Coordinator Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-32 mb-24"
        >
          <div className="text-center mb-16">
            <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Guidance</span>
            <h2 className="font-display text-4xl md:text-5xl text-ink font-bold mb-6">
              Faculty <span className="italic font-light text-gold">Coordinator</span>
            </h2>
            <div className="w-24 h-px bg-gold mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-ink/5 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-sm overflow-hidden p-10"
            >
              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Faculty Image */}
                <div className="w-full md:w-[320px] flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-64 h-64 rounded-sm overflow-hidden border-4 border-gold shadow-lg">
                    <img
                      src="/images/faculty.jpeg"
                      alt="Faculty Coordinator"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Faculty Details */}
                <div className="flex-1">
                  <h3 className="font-display text-3xl text-ink font-bold mb-2">Dr. Hepsiba Nirmala V</h3>
                  <p className="font-accent text-gold text-sm tracking-widest uppercase mb-4">Faculty Coordinator</p>
                  <p className="font-accent text-ink/70 text-sm tracking-widest uppercase mb-6">Department of English</p>
                  
                  <div className="space-y-4 font-body text-ink/80 leading-relaxed">
                    <p>
                      With over 8+ years of experience in teaching and academic mentoring, Dr. Hepsiba Nirmala V brings dynamic expertise in English Literature, innovative pedagogy, and student-centered learning methodologies to LIT'ERA Club. Her dedication to experiential, inquiry-based, and skill-based education, combined with strong classroom management and technology-integrated teaching practices, has significantly contributed to nurturing creativity, critical thinking, and holistic student development.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div className="bg-cream/50 p-4 rounded-sm border border-gold/20 h-full">
                        <h4 className="font-accent text-ink text-sm tracking-widest uppercase mb-2">Expertise</h4>
                        <ul className="font-body text-ink/70 text-sm space-y-1">
                          <li>• Contemporary Literature</li>
                          <li>• Creative Writing</li>
                          <li>• Literary Criticism</li>
                          <li>• Academic Research</li>
                          <li>• Women's Writing</li>
                          <li>• American Literature</li>
                          <li>• Children's Literature</li>
                          <li>• African Literature</li>
                        </ul>
                      </div>
                      
                      <div className="bg-cream/50 p-4 rounded-sm border border-gold/20 h-full">
                        <h4 className="font-accent text-ink text-sm tracking-widest uppercase mb-2">Contributions</h4>
                        <ul className="font-body text-ink/70 text-sm space-y-1">
                          <li>• Mentorship and Student Development Programs</li>
                          <li>• Literary Workshops and Language Training</li>
                          <li>• Research and Curriculum Development</li>
                          <li>• Implementation of NEP 2020 & Competency-Based Education</li>
                          <li>• Integration of Digital Assessment Tools (Google Forms, Padlet, Online Quizzes)</li>
                          <li>• Promotion of Experiential and Self-Learning Practices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Our Team Section */}
        <div className="text-center mb-16">
  <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">
    Leadership
  </span>
  <h2 className="font-display text-4xl md:text-5xl text-ink font-bold mb-6">
    Our <span className="italic font-light text-gold">Team</span>
  </h2>
  <div className="w-24 h-px bg-gold mx-auto"></div>
</div>

{/* Team Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
  {[
    {
      name: "Jaahnavi",
      role: "President",
      img: "jaahnavi.jpeg",
      desc: "Leading our literary community with vision and passion for fostering creative expression."
    },
    {
      name: "Lakshaya Agnihotri",
      role: "Vice President",
      img: "lakshya.jpeg",
      desc: "Supporting our mission through innovative programs and community engagement initiatives."
    },
    {
      name: "Gunda Neha",
      role: "Secretary",
      img: "neha.jpeg",
      desc: "Managing our resources with precision to support our literary endeavors and events."
    },
    {
      name: "Manaswitha Gajji",
      role: "Treasurer",
      img: "manaswitha.jpeg",
      desc: "Bringing our literary vision to life through stunning visual design and creative direction."
    },
    {
      name: "Aashitha Koganti",
      role: "Docs Lead",
      img: "aashitha.jpeg",
      desc: "Building bridges with our community and fostering meaningful connections through outreach."
    },
    {
      name: "K.Sai Keerthana",
      role: "Social and PR",
      img: "keerthana.jpeg",
      desc: "Amplifying our voice across digital platforms and engaging our community online."
    },
    {
      name: "Lahari Meshram",
      role: "Social and PR",
      img: "lahari.jpeg",
      desc: "Building community relationships and managing public outreach initiatives for the club."
    },
    {
      name: "Gnaneshwari",
      role: "Event Management",
      img: "gnaneshwari.jpeg",
      desc: "Coordinating and executing club events with precision and creative vision."
    },
    {
      name: "Sneha Satapathy",
      role: "Event Management",
      img: "sneha.jpeg",
      desc: "Orchestrating memorable literary events and ensuring seamless execution."
    },
    {
      name: "Shaik Azra Anisha",
      role: "Content Head",
      img: "azra.jpeg",
      desc: "Crafting compelling narratives and overseeing all written content for the club."
    },
    {
      name: "Deepika",
      role: "Content Head",
      img: "deepika.jpeg",
      desc: "Curating engaging literary content and managing editorial initiatives."
    }
  ].map((member, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.05 }}
      whileHover={{ y: -10 }}
      className="text-center group"
    >
      <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={`/images/${member.img}`}
            alt={member.name}
            className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <h3 className="font-display text-2xl text-ink font-bold mb-2">
        {member.name}
      </h3>

      <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">
        {member.role}
      </p>

      <p className="font-body text-ink/70 text-sm leading-relaxed">
        {member.desc}
      </p>
    </motion.div>
  ))}
</div>

          {/* Core Team Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Foundation</span>
              <h3 className="font-display text-3xl text-ink font-bold mb-4">
                Core <span className="italic font-light text-gold">Team</span>
              </h3>
              <div className="w-16 h-px bg-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { name: "Varnika Mishra", img: "varnika.jpeg" },
                { name: "Nandipati Charitha Reddy", img: "charitha.jpeg" },
                { name: "Yerrozu Navodith Charan", img: "navodith.jpeg" },
                { name: "B. Ravi Teja", img: "ravi.jpeg" },
                { name: "Bhanu Teja", img: "bhanu.jpeg" }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="relative mb-3 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`/images/${member.img}`}
                        alt={member.name}
                        className="w-full h-full object-cover object-[center_20%] group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="font-body text-sm text-ink font-medium group-hover:text-gold transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="font-accent text-xs text-gold/70 tracking-widest uppercase">
                    Core
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Litera Members Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Community</span>
              <h3 className="font-display text-3xl text-ink font-bold mb-4">
                Litera <span className="italic font-light text-gold">Members</span>
              </h3>
              <div className="w-16 h-px bg-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {/* Litera Members */}
              {[
                { name: "Bheema Sai Surya", img: "saisurya.jpeg" },
                { name: "Polaki Navya Sri", img: "navya.jpeg" },
                { name: "Shalini Medam", img: "shalini.jpeg" },
                { name: "Sudhiksha Chiluvuri", img: "sudhiksha.jpeg" },
                { name: "Akshaya Thummala", img: "akshaya.jpeg" },
                { name: "T. Akshitha Reddy", img: "akshitha.jpeg" },
                { name: "Nirrali Chowdary", img: "nirrali.jpeg" },
                { name: "Yashwanth Rishindra Varma", img: "rishi.jpeg" },
                { name: "S. Sai Sushrutha", img: "sushrutha.jpeg" },
                { name: "Afiya Sulthana", img: "afiya.jpeg" },
                { name: "K. Sree Satya Sahithi", img: "sahithi.jpeg" },
                { name: "Shashank Seera", img: "shashank.jpeg" },
                { name: "Kalyanam Surya Vadan", img: "surya.jpeg" },
                { name: "Siri Anusha", img: "siri.jpeg" },
                { name: "Sathwika", img: "sathwika.jpeg" },
                { name: "A.S.V Kailash Keerthan", img: "kailash.jpeg" },
                { name: "Hemtej", img: "hemtej.jpeg" }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="relative mb-3 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`/images/${member.img}`}
                        alt={member.name}
                        className="w-full h-full object-cover object-[center_20%] group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="font-body text-sm text-ink font-medium group-hover:text-gold transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="font-accent text-xs text-gold/70 tracking-widest uppercase">
                    Member
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
      </div>
    </div>
  );
}
