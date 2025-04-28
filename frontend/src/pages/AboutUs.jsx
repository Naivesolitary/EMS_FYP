import { useRef } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaClock, FaBolt, FaChevronRight, FaGlobeAmericas } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-300/20 to-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-500 mb-6">
            Welcome to Evenera
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            Your trusted partner in <span className="font-semibold text-indigo-500">effortless event booking</span> and management!
          </p>
        </motion.div>

        <div className="mt-16 md:mt-20 relative h-24 md:h-32 overflow-hidden">
          <div className="absolute w-full h-full bg-gradient-to-r from-indigo-200/40 to-sky-200/40 transform -skew-y-3" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-20">
            {/* Section 1 */}
            <ContentSection icon={<FaCalendarAlt className="w-7 h-7 text-indigo-500" />} delay={0.1}>
              <p className="text-lg text-slate-600 leading-relaxed">
                At Evenera, we believe that attending or organizing events should be exciting, not stressful. Our
                platform makes it simple for users to discover upcoming events, register with ease, and purchase tickets
                online — all in just a few clicks. For event organizers, we provide{" "}
                <span className="font-semibold text-sky-500">powerful tools</span> to create, manage, and track events
                with <span className="font-semibold text-emerald-500">real-time updates</span> and automated notifications.
              </p>
            </ContentSection>

            {/* Section 2 */}
            <ContentSection icon={<FaClock className="w-7 h-7 text-sky-500" />} delay={0.2}>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our goal is to save your time and streamline your event experience. Whether you're planning a small
                meetup or a large conference, Evenera brings everything you need into one convenient place, ensuring
                smooth communication and easy access for both organizers and attendees.
              </p>
            </ContentSection>

            {/* Section 3 */}
            <ContentSection icon={<FaBolt className="w-7 h-7 text-amber-500" />} delay={0.3}>
              <p className="text-lg text-slate-600 leading-relaxed">
                Built with reliability, innovation, and user satisfaction in mind, we are dedicated to offering an
                intuitive, modern solution that grows with your needs. Your success is our success — and we're here to
                support you every step of the way.
              </p>
            </ContentSection>

            {/* Section 4 */}
            <ContentSection icon={<FaGlobeAmericas className="w-7 h-7 text-emerald-500" />} delay={0.4}>
              <p className="text-lg text-slate-600 leading-relaxed">
                Join us in shaping the <span className="font-semibold text-amber-500">future of event experiences</span>{" "}
                with Evenera!
              </p>
            </ContentSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-200/90 to-white" />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-300/20 to-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-300/20 to-cyan-300/20 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 mb-8">
              Ready to transform your event experience?
            </h2>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                to="#"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-600 p-0.5 font-medium text-white hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <motion.span
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(99,102,241,0.2)",
                      "0 0 0 10px rgba(99,102,241,0)",
                      "0 0 0 0 rgba(99,102,241,0)",
                    ],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                  }}
                  className="relative rounded-md bg-gradient-to-br from-indigo-500 to-emerald-600 px-6 py-3.5 transition-all duration-75 ease-in group-hover:bg-opacity-0"
                >
                  <span className="flex items-center">
                    Create Your First Event Today
                    <FaChevronRight className="ml-2 h-4 w-4" />
                  </span>
                </motion.span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block mt-4 ml-4">
              <Link
                to="#"
                className="text-blue-500 font-medium hover:text-blue-400 transition-colors flex items-center"
              >
                Explore Events
                <FaChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section Hint */}
      <section className="py-12 md:py-16 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-white to-slate-100 p-8 rounded-2xl shadow-xl border border-slate-200 max-w-3xl mx-auto"
          >
            <FaUsers className="w-8 h-8 text-indigo-500 mx-auto mb-4" />
            <p className="text-slate-600">
              Powered by a passionate team dedicated to revolutionizing event management
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Content Section Component
function ContentSection({ children, icon, delay = 0 }) {
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="flex gap-6"
    >
      <div className="hidden sm:block pt-1">
        <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border border-slate-200">
          {icon}
        </div>
      </div>
      <div className="flex-1 p-6 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg border border-slate-200">
        {children}
      </div>
    </motion.div>
  );
}
