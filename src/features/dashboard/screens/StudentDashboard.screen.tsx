import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import StatsCards from "@/features/dashboard/components/student/StatsCards";
import UpcomingAppointments from "@/features/dashboard/components/student/UpcomingAppointments";
import RecentCases from "@/features/dashboard/components/student/RecentCases";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function StudentDashboardScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <>
            <motion.div
                className="p-6 space-y-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <StatsCards />
                </motion.div>
            </motion.div>
        </>
    )
}
