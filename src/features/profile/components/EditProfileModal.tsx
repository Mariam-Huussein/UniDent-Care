import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X, AlertTriangle, User, Phone, CreditCard, Calendar, GraduationCap, Stethoscope, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  createPatientProfileSchema, 
  createStudentProfileSchema, 
  createDoctorProfileSchema 
} from "../schemas/profile.schema";
import { 
  updatePatientProfile, 
  updateStudentProfile, 
  updateDoctorProfile 
} from "../server/profile.action";
import { UniversityLookup } from "@/server/getUniversities.action";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  userData: any;
  t: any;
  universities?: UniversityLookup[];
}

export function EditProfileModal({ isOpen, onClose, role, userData, t, universities = [] }: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDirtyWarning, setShowDirtyWarning] = useState(false);
  const queryClient = useQueryClient();

  const schema = role === "Patient" ? createPatientProfileSchema(t) 
               : role === "Student" ? createStudentProfileSchema(t)
               : createDoctorProfileSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: userData?.fullName || userData?.name || "",
      ...(role === "Patient" && {
        phoneNumber: userData?.phone || userData?.phoneNumber || "",
        nationalId: userData?.nationalId || "",
        birthDate: userData?.birthDate?.split('T')[0] || "",
        gender: userData?.gender ?? 0,
      }),
      ...(role === "Student" && {
        level: userData?.level || 1,
      }),
      ...(role === "Doctor" && {
        name: userData?.fullName || userData?.name || "",
        specialty: userData?.specialty || "",
      }),
    }
  });

  const { formState: { isDirty, errors }, reset } = form;
  const formErrors = errors as any;

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: userData?.fullName || userData?.name || "",
        ...(role === "Patient" && {
          phoneNumber: userData?.phone || userData?.phoneNumber || "",
          nationalId: userData?.nationalId || "",
          birthDate: userData?.birthDate?.split('T')[0] || "",
          gender: userData?.gender ?? 0,
        }),
        ...(role === "Student" && {
          level: userData?.level || 1,
        }),
        ...(role === "Doctor" && {
          name: userData?.fullName || userData?.name || "",
          specialty: userData?.specialty || "",
        }),
      });
    }
  }, [isOpen, userData, role, reset]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClose = () => {
    if (isDirty) {
      setShowDirtyWarning(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowDirtyWarning(false);
    reset();
    onClose();
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (role === "Patient") {
        await updatePatientProfile(userData.publicId, {
          publicId: userData.publicId,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          nationalId: data.nationalId,
          birthDate: new Date(data.birthDate).toISOString(),
          gender: Number(data.gender)
        });
      } else if (role === "Student") {
        await updateStudentProfile(userData.publicId, {
          publicId: userData.publicId,
          fullName: data.fullName,
          university: userData?.university || "",
          level: Number(data.level)
        });
      } else if (role === "Doctor") {
        await updateDoctorProfile(userData.publicId, {
          publicId: userData.publicId,
          name: data.name || data.fullName,
          specialty: data.specialty,
          universityId: userData?.universityId ? Number(userData.universityId) : 0
        });
      }
      
      toast.success(t?.success?.profileUpdated || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ['profile', role, userData.publicId] });
      reset(data);
      onClose();
    } catch (error: any) {
      toast.error(error.message || t?.errors?.profileUpdateFailed || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumericInput = (onChange: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onChange(value);
  };

  const getUniversityName = () => {
    const uniId = userData?.universityId || userData?.university;
    if (uniId && universities.length > 0) {
      const match = universities.find(u => u.id === uniId || u.id === String(uniId));
      if (match) return match.name;
    }
    return userData?.university || "N/A";
  };

  const roleColor = role === "Doctor" ? "blue" : role === "Student" ? "indigo" : "teal";

  if (!isOpen && !showDirtyWarning) return null;

  return (
    <>
      {/* Main Edit Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={!isSubmitting ? handleClose : undefined}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className={`relative px-6 pt-6 pb-5 bg-linear-to-r ${
              role === "Doctor" ? "from-blue-600 to-indigo-600" : 
              role === "Student" ? "from-indigo-600 to-blue-600" : 
              "from-teal-600 to-emerald-600"
            }`}>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{t?.profile?.editProfile || "Edit Profile"}</h2>
                  <p className="text-xs text-white/70">{t?.profile?.editProfileDesc || "Update your personal information"}</p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 max-h-[60vh] overflow-y-auto patient-details-scrollbar">
              <div className="space-y-5">

                {/* Read-only: Email */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <Mail size={12} />
                    Email
                  </label>
                  <div className="h-9 px-3 flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-sm text-slate-400 dark:text-slate-500">
                    {userData?.email || "N/A"}
                  </div>
                </div>

                {/* Read-only: University (Student & Doctor) */}
                {(role === "Student" || role === "Doctor") && (
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <GraduationCap size={12} />
                      {t?.profile?.university || "University"}
                    </label>
                    <div className="h-9 px-3 flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-sm text-slate-400 dark:text-slate-500">
                      {getUniversityName()}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

                {/* Full Name (Patient & Student) */}
                {role !== "Doctor" && (
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <User size={12} />
                      {t?.profile?.fullName || "Full Name"}
                    </label>
                    <input
                      id="fullName"
                      {...form.register("fullName" as any)}
                      placeholder="John Doe"
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.fullName.message as string}</p>
                    )}
                  </div>
                )}

                {/* Name (Doctor) */}
                {role === "Doctor" && (
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <User size={12} />
                      {t?.profile?.fullName || "Full Name"}
                    </label>
                    <input
                      id="name"
                      {...form.register("name" as any)}
                      placeholder="Dr. John Doe"
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.name.message as string}</p>
                    )}
                  </div>
                )}

                {/* Patient-only fields */}
                {role === "Patient" && (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="phoneNumber" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        <Phone size={12} />
                        {t?.profile?.phoneNumber || "Phone Number"}
                      </label>
                      <Controller
                        name="phoneNumber"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={(field.value as string) || ""}
                            id="phoneNumber"
                            placeholder="01xxxxxxxxx"
                            maxLength={15}
                            onChange={handleNumericInput(field.onChange)}
                            disabled={isSubmitting}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all disabled:opacity-50"
                          />
                        )}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.phoneNumber.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="nationalId" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        <CreditCard size={12} />
                        {t?.profile?.nationalId || "National ID"}
                      </label>
                      <Controller
                        name="nationalId"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={(field.value as string) || ""}
                            id="nationalId"
                            placeholder="14 digits"
                            maxLength={14}
                            onChange={handleNumericInput(field.onChange)}
                            disabled={isSubmitting}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all disabled:opacity-50"
                          />
                        )}
                      />
                      {formErrors.nationalId && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.nationalId.message as string}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="birthDate" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          <Calendar size={12} />
                          {t?.profile?.birthDate || "Birth Date"}
                        </label>
                        <input
                          id="birthDate"
                          type="date"
                          {...form.register("birthDate" as any)}
                          disabled={isSubmitting}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all disabled:opacity-50"
                        />
                        {formErrors.birthDate && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.birthDate.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="gender" className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          {t?.profile?.gender || "Gender"}
                        </label>
                        <select
                          id="gender"
                          {...form.register("gender" as any)}
                          disabled={isSubmitting}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all disabled:opacity-50"
                        >
                          <option value={0}>{t?.profile?.male || "Male"}</option>
                          <option value={1}>{t?.profile?.female || "Female"}</option>
                        </select>
                        {formErrors.gender && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.gender.message as string}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Student-only fields */}
                {role === "Student" && (
                  <div className="space-y-1.5">
                    <label htmlFor="level" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <GraduationCap size={12} />
                      {t?.profile?.level || "Level"}
                    </label>
                    <input
                      id="level"
                      type="number"
                      {...form.register("level" as any)}
                      min={1}
                      max={10}
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                    />
                    {formErrors.level && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.level.message as string}</p>
                    )}
                  </div>
                )}

                {/* Doctor-only fields */}
                {role === "Doctor" && (
                  <div className="space-y-1.5">
                    <label htmlFor="specialty" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <Stethoscope size={12} />
                      {t?.profile?.specialty || "Specialty"}
                    </label>
                    <input
                      id="specialty"
                      {...form.register("specialty" as any)}
                      placeholder="e.g. Endodontics"
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                    />
                    {formErrors.specialty && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{formErrors.specialty.message as string}</p>
                    )}
                  </div>
                )}

              </div>
            </form>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="my-btn-outline py-2"
              >
                {t?.common?.cancel || "Cancel"}
              </button>
              <button
                type="submit"
                form="edit-profile-form"
                disabled={isSubmitting || !isDirty}
                className={`my-btn py-2 ${(isSubmitting || !isDirty) ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t?.common?.saving || "Saving..."}
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {t?.common?.save || "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dirty State Warning */}
      {showDirtyWarning && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowDirtyWarning(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/20">
                  <AlertTriangle size={24} className="text-red-600 dark:text-red-500" />
                </div>
                <button
                  onClick={() => setShowDirtyWarning(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">
                {t?.profile?.unsavedChanges || "Unsaved Changes"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                {t?.profile?.dirtyWarning || "You have unsaved changes. Are you sure you want to close without saving?"}
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDirtyWarning(false)}
                className="my-btn-outline py-2"
              >
                {t?.common?.continueEditing || "Continue Editing"}
              </button>
              <button
                type="button"
                onClick={confirmClose}
                className="my-btn-danger py-2"
              >
                {t?.common?.discard || "Discard Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
