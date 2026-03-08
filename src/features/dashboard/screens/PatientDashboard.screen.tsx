"use client";

import { motion, Variants } from "framer-motion";
import { StatsCards } from "@/features/dashboard/components/patient/StatsCards";
import { UpcomingAppointments } from "@/features/dashboard/components/patient/UpcomingAppointments";
import { RecentCases } from "@/features/dashboard/components/patient/RecentCases";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function PatientDashboardScreen() {
  return (
    <motion.div
      className="p-6 space-y-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <StatsCards />
      </motion.div>

      <motion.div variants={itemVariants}>
        <UpcomingAppointments />
      </motion.div>

      <motion.div variants={itemVariants}>
        <RecentCases />
      </motion.div>
    </motion.div>
  );
}
