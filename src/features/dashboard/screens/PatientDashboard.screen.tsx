"use client";

import { motion, Variants } from "framer-motion";
import { StatsCards } from "@/features/dashboard/components/patient/StatsCards";
import { UpcomingAppointments } from "@/features/dashboard/components/patient/UpcomingAppointments";
import { RecentCases } from "@/features/dashboard/components/patient/RecentCases";
import { containerVariants, itemVariants } from "@/lib/animations";

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
