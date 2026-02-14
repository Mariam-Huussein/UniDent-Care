"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  GraduationCap,
  UserRound,
  ArrowRight,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";
import { FaTooth } from "react-icons/fa";

export default function Home() {
  const roles = [
    {
      title: "Doctor",
      desc: "Manage clinical cases, supervise students, and provide expert dental care.",
      icon: <Stethoscope size={32} />,
      href: "/signup/doctor",
      color: "blue",
      stats: "Verified Professionals",
    },
    {
      title: "Student",
      desc: "Document clinical cases, learn from experts, and build your medical portfolio.",
      icon: <GraduationCap size={32} />,
      href: "/signup/student",
      color: "indigo",
      stats: "Future Experts",
    },
    {
      title: "Patient",
      desc: "Access top-tier dental services, track your history, and book appointments.",
      icon: <UserRound size={32} />,
      href: "/signup/patient",
      color: "teal",
      stats: "Quality Care",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <FaTooth size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              UniDent<span className="text-blue-600">Care</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8"
          >
            <ShieldCheck size={14} />
            <span>THE NEXT GENERATION OF DENTAL CARE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8"
          >
            Bridging the gap in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Dental Excellence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            UniDent Care is a unified ecosystem where Doctors mentor, Students
            excel, and Patients receive the highest quality of digital
            healthcare.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup/patient"
              className="group h-14 px-10 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
            >
              Get Started Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/about"
              className="h-14 px-10 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold flex items-center hover:bg-slate-50 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-slate-500 font-medium">
              Select your role to explore specialized features designed for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={role.href} className="group block h-full">
                  <div className="h-full bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                    <div
                      className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-500 text-blue-600`}
                    >
                      {role.icon}
                    </div>

                    <div
                      className={`w-14 h-14 rounded-2xl bg-${role.color}-50 text-${role.color}-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300`}
                    >
                      {role.icon}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center justify-between">
                      {role.title}
                      <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </h3>

                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                      {role.desc}
                    </p>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">
                        {role.stats}
                      </span>
                      <Activity size={16} className="text-slate-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto py-12 border-t border-slate-50 bg-slate-50/50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <FaTooth size={20} />
            <span className="font-bold">UniDent Care</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} UniDent Care. Crafted for Dental
            Excellence.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm font-medium">
            <Link href="#" className="hover:text-blue-600">
              Privacy
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Terms
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
