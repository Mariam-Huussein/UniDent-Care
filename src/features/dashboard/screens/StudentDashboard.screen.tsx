import { motion, Variants } from "framer-motion";
import StatsCards from "@/features/dashboard/components/student/StatsCards";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function StudentDashboardScreen() {
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
