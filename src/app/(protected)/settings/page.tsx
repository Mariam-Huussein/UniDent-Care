"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
  Stethoscope,
  IdCard,
  User as UserIcon,
  CheckCircle,
} from "lucide-react";

import { RootState } from "@/store";
import {
  changePassword,
  deleteAccount,
} from "@/features/settings/services/settingsService";
import { logout } from "@/features/auth/store/authSlice";
import LogoutButton from "@/components/common/LogoutButton";
import { doctorService } from "@/features/settings/services/doctorService";
import { useEffect as useProfileEffect } from "react";

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

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const doctorProfileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  universityId: z.string().min(1, "University ID is required"),
});

type DoctorProfileForm = z.infer<typeof doctorProfileSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  useProfileEffect(() => {
    if (role === "Doctor" && user) {
      setProfileValue("fullName", user.fullName);
      if ("specialty" in user) setProfileValue("specialty", (user as any).specialty);
      if ("universityId" in user) setProfileValue("universityId", (user as any).universityId.toString());
    }
  }, [user, role, setProfileValue]);

  const onChangePassword = async (values: ChangePasswordForm) => {
    const toastId = toast.loading("Updating security credentials...");
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
      const msg = err?.response?.data?.error?.errors?.[0];
      toast.error(msg || "Something went wrong", { id: toastId });
    }
  };

  const onUpdateProfile = async (values: DoctorProfileForm) => {
    if (!user?.publicId) return;
    const toastId = toast.loading("Updating professional profile...");
    try {
      const res = await doctorService.updateDoctorProfile(user.publicId, {
        publicId: user.publicId,
        name: values.fullName,
        specialty: values.specialty,
        universityId: parseInt(values.universityId, 10) || 0,
      });
      if (res.success) {
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        toast.error(res.message || "Failed to update profile", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Could not update profile. Please check your data.", { id: toastId });
    }
  };

  const onDeleteAccount = async () => {
    if (!user?.publicId || !role) return;

    setIsDeleting(true);
    const toastId = toast.loading("Processing account deletion...");

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" /> Account Security
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your password and account preferences.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <KeyRound size={20} className="text-slate-500" /> Change Password
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <form
          onSubmit={handleSubmitPassword(onChangePassword)}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? "text" : "password"}
                  {...registerPassword("oldPassword")}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.oldPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {passwordErrors.oldPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  {...registerPassword("newPassword")}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmittingPassword ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Lock size={16} />
              )}
              {isSubmittingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </motion.div>

      {role === "Doctor" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope size={20} className="text-blue-600" /> Professional Profile
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Keep your professional details up to date for students and patients.
            </p>
          </div>

          <form
            onSubmit={handleSubmitProfile(onUpdateProfile)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    {...registerProfile("fullName")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                {profileErrors.fullName && <p className="text-xs text-red-500">{profileErrors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Specialty</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    {...registerProfile("specialty")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                {profileErrors.specialty && <p className="text-xs text-red-500">{profileErrors.specialty.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">University ID</label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    {...registerProfile("universityId")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                {profileErrors.universityId && <p className="text-xs text-red-500">{profileErrors.universityId.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmittingProfile}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmittingProfile ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                {isSubmittingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <h3 className="text-red-700 font-bold flex items-center gap-2">
            <AlertTriangle size={20} /> Danger Zone
          </h3>
          <p className="text-red-600/80 text-sm mt-1 max-w-lg">
            Permanently delete your account and all of your content. This action
            is not reversible, so please continue with caution.
          </p>
        </div>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="whitespace-nowrap px-5 py-2.5 bg-white border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
        >
          Delete Account
        </button>
      </motion.div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
                <h3 className="text-lg font-bold text-slate-800">
                  Delete Account?
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">
                      This action is irreversible
                    </h4>
                    <p className="text-red-600/80 text-xs mt-1">
                      Your personal data, medical history, and appointments will
                      be permanently removed from our servers.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600 font-medium">
                    To confirm, type{" "}
                    <span className="font-bold text-slate-900 select-all">
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-800 placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onDeleteAccount}
                  disabled={deleteConfirmationText !== "DELETE" || isDeleting}
                  className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-red-200"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {isDeleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Session Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
