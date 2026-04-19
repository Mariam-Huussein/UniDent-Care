"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ShieldCheck,
  Trash2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  X,
  Palette,
  Monitor,
  Moon,
  Sun,
  Globe,
  UserRound,
  ArrowRight
} from "lucide-react";

import { RootState } from "@/store";
import {
  changePassword,
  deleteAccount,
} from "@/features/settings/services/settingsService";
import { logout } from "@/features/auth/store/authSlice";
import { doctorDashboardService } from "@/features/dashboard/services/doctorDashboardService";
import LogoutButton from "@/components/common/LogoutButton";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { universityService, UniversityLookup } from "@/features/dashboard/services/universityService";
import { Language } from "@/utils/i18n/dictionaries";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password cannot be the same as old password",
    path: ["newPassword"],
  });

const doctorProfileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  universityId: z.string().min(1, "University is required"),
});

type DoctorProfileForm = z.infer<typeof doctorProfileSchema>;
type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [universities, setUniversities] = useState<UniversityLookup[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
    setValue: setProfileValue,
  } = useForm<DoctorProfileForm>({
    resolver: zodResolver(doctorProfileSchema),
  });

  useEffect(() => {
    setMounted(true);

    const fetchUniversities = async () => {
      try {
        const data = await universityService.getUniversitiesLookup();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities", error);
      } finally {
        setIsLoadingUniversities(false);
      }
    };
    fetchUniversities();

    if (role === "Doctor" && user) {
      setProfileValue("fullName", (user as any).fullName || (user as any).name || "");
      setProfileValue("specialty", (user as any).specialty || "");
      setProfileValue("universityId", (user as any).universityId || "");
    }
  }, [role, user, setProfileValue]);

  const onChangePassword = async (values: ChangePasswordForm) => {
    const toastId = toast.loading(t.updating);
    try {
      const res = await changePassword(values);
      if (res.data.success) {
        toast.success("Password updated successfully!", { id: toastId });
        resetPassword();
      } else {
        toast.error(res.data.message || "Failed to update password", {
          id: toastId,
        });
      }
    } catch (err: any) {
      const apiError = err?.response?.data;
      const msg =
        apiError?.error?.errors?.[0] ||
        apiError?.message ||
        "Something went wrong";
      toast.error(msg, { id: toastId });
    }
  };

  const onUpdateProfile = async (values: DoctorProfileForm) => {
    if (!user?.publicId) return;
    const toastId = toast.loading("Updating profile...");
    try {
      const success = await doctorDashboardService.updateDoctorProfile(user.publicId, {
        publicId: user.publicId,
        name: values.fullName,
        specialty: values.specialty,
        universityId: values.universityId,
      });

      if (success) {
        toast.success("Profile updated successfully!", { id: toastId });
        // Optionally update the local user state here if needed
      } else {
        toast.error("Failed to update profile", { id: toastId });
      }
    } catch (err: any) {
      const apiError = err?.response?.data;
      const msg = apiError?.message || "Something went wrong";
      toast.error(msg, { id: toastId });
    }
  };

  const onDeleteAccount = async () => {
    if (!user?.publicId || !role) return;

    setIsDeleting(true);
    const toastId = toast.loading(t.deleting);

    try {
      const apiRole =
        role === "Patient"
          ? "Patients"
          : role === "Doctor"
            ? "Doctors"
            : "Students";
      const res = await deleteAccount(apiRole, user.publicId);

      if (res.data.success) {
        toast.success("Account deleted. We are sorry to see you go.", {
          id: toastId,
        });
        Cookies.remove("token");
        Cookies.remove("user_role");
        dispatch(logout());
        router.replace("/login");
      } else {
        toast.error(res.data.message || "Deletion failed", { id: toastId });
        setIsDeleting(false);
      }
    } catch (err: any) {
      toast.error("Could not delete account. Try again later.", {
        id: toastId,
      });
      setIsDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* APPEARANCE & LANGUAGE PREFERENCES */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Palette className="text-indigo-600 dark:text-indigo-400" /> {t.appearanceTitle} & {t.languageTitle}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.appearanceDesc} {t.languageDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Monitor size={20} className="text-slate-500 dark:text-slate-400" /> {t.appearanceTitle}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 py-2 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${theme === "light" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              <Sun size={20} />
              <span className="text-sm font-semibold">{t.themeLight}</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 py-2 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${theme === "dark" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              <Moon size={20} />
              <span className="text-sm font-semibold">{t.themeDark}</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex-1 py-2 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${theme === "system" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              <Monitor size={20} />
              <span className="text-sm font-semibold">{t.themeSystem}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Globe size={20} className="text-slate-500 dark:text-slate-400" /> {t.languageTitle}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={`flex-1 py-3 px-4 flex items-center justify-between rounded-xl border-2 transition-all ${language === "en" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              <span className="font-semibold">English</span>
              {language === "en" && <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
            </button>
            <button
              onClick={() => setLanguage("ar")}
              className={`flex-1 py-3 px-4 flex items-center justify-between rounded-xl border-2 transition-all ${language === "ar" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              <span className="font-semibold font-arabic">العربية</span>
              {language === "ar" && <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800" />

      {/* ACCOUNT SECURITY */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600 dark:text-indigo-400" /> {t.settingsTitle}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.settingsSubtitle}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <KeyRound size={20} className="text-slate-500 dark:text-slate-400" /> {t.changePassword}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.changePasswordDesc}
          </p>
        </div>

        <form
          onSubmit={handleSubmitPassword(onChangePassword)}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.currentPassword}
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? "text" : "password"}
                  {...registerPassword("oldPassword")}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.oldPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                  {passwordErrors.oldPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.newPassword}
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  {...registerPassword("newPassword")}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmittingPassword ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Lock size={16} />
              )}
              {isSubmittingPassword ? t.updating : t.updatePassword}
            </button>
          </div>
        </form>
      </motion.div>

      {/* DOCTOR PROFILE INFORMATION */}
      {role === "Doctor" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UserRound size={20} className="text-slate-500 dark:text-slate-400" /> Profile Information
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Update your personal and professional details.
            </p>
          </div>

          <form
            onSubmit={handleSubmitProfile(onUpdateProfile)}
            className="p-6 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  {...registerProfile("fullName")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-none transition-all"
                />
                {profileErrors.fullName && (
                  <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.specialtyLabel}
                </label>
                <input
                  type="text"
                  {...registerProfile("specialty")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-none transition-all"
                />
                {profileErrors.specialty && (
                  <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                    {profileErrors.specialty.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.universityIdLabel}
                </label>
                <div className="relative">
                  <select
                    {...registerProfile("universityId")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-none transition-all appearance-none"
                    disabled={isLoadingUniversities}
                  >
                    <option value="" disabled>{isLoadingUniversities ? "Loading..." : "Select University"}</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                  </select>
                  <div className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-slate-400`}>
                    <ArrowRight size={16} className="rotate-90" />
                  </div>
                </div>
                {profileErrors.universityId && (
                  <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                    {profileErrors.universityId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmittingProfile}
                className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isSubmittingProfile ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {isSubmittingProfile ? t.updating : "Update Profile"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <h3 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2">
            <AlertTriangle size={20} /> {t.dangerZone}
          </h3>
          <p className="text-red-600/80 dark:text-red-400/80 text-sm mt-1 max-w-lg">
            {t.dangerZoneDesc}
          </p>
        </div>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="whitespace-nowrap px-5 py-2.5 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white hover:border-red-600 transition-all shadow-sm"
        >
          {t.deleteAccount}
        </button>
      </motion.div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50/30 dark:bg-red-900/10">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {t.deleteAccount}?
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 dark:text-red-400 text-sm">
                      This action is irreversible
                    </h4>
                    <p className="text-red-600/80 dark:text-red-400/80 text-xs mt-1">
                      Your personal data, medical history, and appointments will
                      be permanently removed from our servers.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    To confirm, type{" "}
                    <span className="font-bold text-slate-900 dark:text-slate-200 select-all">
                      DELETE
                    </span>{" "}
                    below:
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={onDeleteAccount}
                  disabled={deleteConfirmationText !== "DELETE" || isDeleting}
                  className="px-5 py-2 bg-red-600 dark:bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-red-200 dark:shadow-none"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {isDeleting ? t.deleting : t.permanentlyDelete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          {t.sessionManagement}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
