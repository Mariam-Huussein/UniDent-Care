"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Stethoscope,
    IdCard,
    Calendar,
    Users,
    Clock,
    CheckCircle,
    ShieldCheck,
} from "lucide-react";
import { RootState } from "@/store";
import { doctorService } from "@/features/settings/services/doctorService";
import { DoctorUser } from "@/features/auth/types";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, role } = useSelector((state: RootState) => state.auth);
    const [profileData, setProfileData] = useState<DoctorUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role === "Doctor" && user?.publicId) {
            const fetchProfile = async () => {
                try {
                    const res = await doctorService.getDoctorProfile(user.publicId);
                    if (res.success) {
                        setProfileData(res.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch doctor profile:", err);
                    toast.error("Failed to load profile data");
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [role, user?.publicId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (role !== "Doctor") {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Your Profile</h1>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                            <User className="text-blue-600" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Full Name</p>
                                <p className="text-slate-900 font-semibold">{user?.fullName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                            <Mail className="text-blue-600" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
                                <p className="text-slate-900 font-semibold">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const stats = [
        { label: "Total Students", value: profileData?.totalStudents || 0, icon: Users, color: "blue" },
        { label: "Pending Requests", value: profileData?.pendingRequests || 0, icon: Clock, color: "amber" },
        { label: "Approved Requests", value: profileData?.approvedRequests || 0, icon: CheckCircle, color: "emerald" },
    ];

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white"
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />

                <div className="relative pt-16 pb-8 px-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl">
                                <div className="w-full h-full rounded-[1.25rem] bg-slate-100 flex items-center justify-center text-blue-600">
                                    <User size={64} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                                <ShieldCheck size={20} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left pb-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <h1 className="text-3xl font-black text-slate-900 leading-tight">
                                    {profileData?.fullName}
                                </h1>
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-black rounded-full uppercase tracking-widest border border-blue-100 inline-block w-fit mx-auto md:mx-0">
                                    Doctor Account
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Stethoscope size={18} className="text-blue-500" />
                                    {profileData?.specialty}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Mail size={18} className="text-slate-400" />
                                    {profileData?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (idx + 1) }}
                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-2xl bg-slate-50 text-blue-600 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Details Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Details */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8"
                >
                    <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <User size={24} className="text-blue-600" />
                        Professional Identity
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <IdCard size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">University ID</p>
                                <p className="text-slate-900 font-bold text-lg">{profileData?.universityId}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Calendar size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">Member Since</p>
                                <p className="text-slate-900 font-bold text-lg">
                                    {profileData?.createAt ? new Date(profileData.createAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <CheckCircle size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">Verification Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-emerald-700 font-black text-sm uppercase tracking-wider">Verified Professional</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Account Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-950 rounded-[2.5rem] shadow-2xl p-8 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <h2 className="text-xl font-black mb-8 relative z-10">Quick Actions</h2>

                    <div className="space-y-4 relative z-10">
                        <button
                            onClick={() => window.location.href = '/settings'}
                            className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="font-bold">Edit Security Settings</span>
                            </div>
                        </button>

                        <button
                            onClick={() => window.location.href = '/pending-cases'}
                            className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                                    <Clock size={20} />
                                </div>
                                <span className="font-bold">Managed Requests</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-12 p-6 bg-blue-600 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-black/10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10">
                            <h4 className="font-black text-lg mb-1">UniDent Premium</h4>
                            <p className="text-white/80 text-sm font-medium">Access advanced analytics and student performance metrics.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}