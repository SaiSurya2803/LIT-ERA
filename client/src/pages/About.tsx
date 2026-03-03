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
          className="mt-32"
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
              className="bg-white border border-ink/5 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Faculty Image */}
                <div className="md:col-span-1 flex items-center justify-center py-4 px-8 bg-ink/5">
                  <div className="w-64 h-64 rounded-sm overflow-hidden border-4 border-gold shadow-lg">
                    <img
                      src="/images/faculty.jpeg"
                      alt="Faculty Coordinator"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Faculty Details */}
                <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="font-display text-3xl text-ink font-bold mb-2">Dr. [Faculty Name]</h3>
                  <p className="font-accent text-gold text-sm tracking-widest uppercase mb-4">Faculty Coordinator</p>
                  <p className="font-accent text-ink/70 text-sm tracking-widest uppercase mb-6">Department of English</p>
                  
                  <div className="space-y-4 font-body text-ink/80 leading-relaxed">
                    <p>
                      With over [X] years of experience in academia and literature, our faculty coordinator brings invaluable expertise and guidance to LIT'ERA Club. Their passion for literature and commitment to student development has been instrumental in shaping our literary community.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-cream/50 p-4 rounded-sm border border-gold/20">
                        <h4 className="font-accent text-ink text-sm tracking-widest uppercase mb-2">Expertise</h4>
                        <ul className="font-body text-ink/70 text-sm space-y-1">
                          <li>• Contemporary Literature</li>
                          <li>• Creative Writing</li>
                          <li>• Literary Criticism</li>
                          <li>• Academic Research</li>
                        </ul>
                      </div>
                      
                      <div className="bg-cream/50 p-4 rounded-sm border border-gold/20">
                        <h4 className="font-accent text-ink text-sm tracking-widest uppercase mb-2">Contributions</h4>
                        <ul className="font-body text-ink/70 text-sm space-y-1">
                          <li>• Mentorship Programs</li>
                          <li>• Literary Workshops</li>
                          <li>• Research Guidance</li>
                          <li>• Curriculum Development</li>
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
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Leadership</span>
            <h2 className="font-display text-4xl md:text-5xl text-ink font-bold mb-6">
              Our <span className="italic font-light text-gold">Team</span>
            </h2>
            <div className="w-24 h-px bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Team Member 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/jaahnavi.jpeg"
                    alt="Jaahnavi Yeturi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Jaahnavi Yeturi</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">President</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Leading our literary community with vision and passion for fostering creative expression.
              </p>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/lakshya.jpeg"
                    alt="Lakhshya"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Lakshaya Agnihotri</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Vice President</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Supporting our mission through innovative programs and community engagement initiatives.
              </p>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/neha.jpeg"
                    alt="Neha"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Gunda Neha</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Secretary</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Managing our resources with precision to support our literary endeavors and events.
              </p>
            </motion.div>
          </div>

          {/* Additional Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {/* Team Member 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/manaswitha.jpeg"
                    alt="Manaswitha"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Manaswitha</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Treasurer</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Bringing our literary vision to life through stunning visual design and creative direction.
              </p>
            </motion.div>

            {/* Team Member 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/aashitha.jpeg"
                    alt="Aashitha Koganti"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Aashitha Koganti</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Docs Lead</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Building bridges with our community and fostering meaningful connections through outreach.
              </p>
            </motion.div>

            {/* Team Member 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/keerthana.jpeg"
                    alt="Keerthana"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Keerthana</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Social and PR</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Amplifying our voice across digital platforms and engaging our community online.
              </p>
            </motion.div>
          </div>

          {/* Additional Team Members Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mt-16">
            {/* Team Member 7 - Lahari */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/lahari.jpeg"
                    alt="Lahari Meshram"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Lahari Meshram</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Social and PR</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Building community relationships and managing public outreach initiatives for the club.
              </p>
            </motion.div>

            {/* Team Member 8 - Gnaneshwari */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/gnaneshwari.jpeg"
                    alt="Gnaneshwari"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Gnaneshwari</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Event Management</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Coordinating and executing club events with precision and creative vision.
              </p>
            </motion.div>

            {/* Team Member 9 - Sneha Satapathy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/sneha.jpeg"
                    alt="Sneha Satapathy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Sneha Satapathy</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Event Management</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Orchestrating memorable literary events and ensuring seamless execution.
              </p>
            </motion.div>

            {/* Team Member 10 - Azra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/azra.jpeg"
                    alt="Azra"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Shaik Azra Anisha</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Content Head</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Crafting compelling narratives and overseeing all written content for the club.
              </p>
            </motion.div>

            {/* Team Member 11 - Deepika */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <div className="relative mb-6 overflow-hidden rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/images/deepika.jpeg"
                    alt="Deepika"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mb-2">Deepika</h3>
              <p className="font-accent text-gold text-sm tracking-widest uppercase mb-3">Content Head</p>
              <p className="font-body text-ink/70 text-sm leading-relaxed">
                Curating engaging literary content and managing editorial initiatives.
              </p>
            </motion.div>
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
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                { name: "Shalini", img: "shalini.jpeg" },
                { name: "Sudhiksha Chiluvuri", img: "sudhiksha.jpeg" },
                { name: "Akshaya Thummala", img: "akshaya.jpeg" },
                { name: "T. Akshitha Reddy", img: "akshitha.jpeg" },
                { name: "Nirrali Chowdary", img: "nirrali.jpeg" },
                { name: "Yashwanth Rishindra Varma", img: "yashwanth.jpeg" },
                { name: "S. Sai Sushrutha", img: "sushrutha.jpeg" },
                { name: "Afiya Sulthana", img: "afiya.jpeg" },
                { name: "K. Sree Satya Sahithi", img: "sahithi.jpeg" },
                { name: "Shashank Seera", img: "shashank.jpeg" },
                { name: "Kalyanam Surya Vadan", img: "surya.jpeg" },
                { name: "Siri Anusha", img: "siri.jpeg" },
                { name: "Sathwika", img: "sathwika.jpeg" },
                { name: "A.S.V Kailash Keerthan", img: "kailash.jpg" },
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
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
        </motion.div>

      </div>
    </div>
  );
}
