import { DiagnosisStage } from "@/features/cases/types/CaseDetails.types";

export enum CaseStatus {
  Draft = 0,
  Pending = 1,
  Active = 2,
  InTreatment = 3,
  Review = 4,
  Completed = 5,
}

// ---------------------------------------------------------
// 1. Raw API Models (Matching Swagger)
// ---------------------------------------------------------
export interface PatientCaseDto {
  id: string;
  patientId: string;
  patientName?: string | null;
  status?: CaseStatus | string;
  processStatus?: string | null;
  createAt: string;
  totalSessions: number;
  hasEvaluatedSession: boolean;
  pendingRequests: number;
  assignedStudentId?: string | null;
  assignedDoctorId?: string | null;
  diagnosisdto?: DiagnosisDto[] | null;
  imageUrls?: string[] | null;
}

export interface SessionDto {
  id: string;
  caseId: string;
  treatmentType?: string | null;
  patientId: string;
  patientName?: string | null;
  studentId?: string | null;
  studentName?: string | null;
  assignedDoctorId?: string | null;
  assignedDoctorName?: string | null;
  scheduledAt: string;
  endAt?: string | null;
  status?: string | null; // e.g. "Completed", "Pending", "Scheduled"
  totalNotes: number;
  totalMedia: number;
  createAt: string;
}

export interface DiagnosisDto {
  id: string;
  patientCaseId: string;
  stage?: number | DiagnosisStage;
  caseTypeId?: string;
  caseTypeName?: string | null;
  caseType?: string;
  notes?: string | null;
  createdById?: string | null;
  role?: string | null;
  isAccepted?: boolean | null;
  teethNumbers?: number[] | null;
  createAt?: string; // Fallback or injected
}

// ---------------------------------------------------------
// 2. Output Dashboard Models
// ---------------------------------------------------------

export interface DashboardKpis {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  activeCasesPercentage: number;
  completedCasesPercentage: number;
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
}

export interface DashboardProgress {
  progressPercentage: number;
  completedSessions: number;
  totalSessions: number;
}

export interface UpcomingSessionWidget {
  date: string;
  caseId: string;
  doctorName: string;
  status: string;
}

export interface RecentActivityWidget {
  type: 'session' | 'diagnosis' | 'case';
  date: string;
  description: string;
}

export interface DashboardCharts {
  casesDistribution: {
    active: number;
    completed: number;
  };
  sessionsStatus: {
    completed: number;
    pending: number;
  };
}

export interface DashboardData {
  kpis: DashboardKpis;
  progress: DashboardProgress;
  upcomingSessions: UpcomingSessionWidget[];
  recentActivity: RecentActivityWidget[];
  diagnosesCount: number;
  charts: DashboardCharts;
}

// ---------------------------------------------------------
// 3. Transformation Service
// ---------------------------------------------------------

/**
 * Generates the full Patient Dashboard payload by aggregating raw API data.
 */
export function generatePatientDashboardData(
  cases: PatientCaseDto[],
  sessions: SessionDto[],
  upcomingSessions: SessionDto[],
  diagnoses: DiagnosisDto[],
  userNamesMap: Record<string, string> = {}
): DashboardData {
  // --- 1. Cases KPIs ---
  const totalCases = cases.length;
  // Handle both numeric and string status from API
  const completedCases = cases.filter(c => 
    c.status === CaseStatus.Completed || c.status === 'Completed'
  ).length;
  const activeCases = totalCases - completedCases;
  
  const activeCasesPercentage = totalCases ? Math.round((activeCases / totalCases) * 100) : 0;
  const completedCasesPercentage = totalCases ? Math.round((completedCases / totalCases) * 100) : 0;

  // --- 2. Sessions KPIs & Progress ---
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => 
    s.status && s.status.toLowerCase() === 'completed'
  ).length;
  const pendingSessions = totalSessions - completedSessions;

  const progressPercentage = totalSessions 
    ? Math.round((completedSessions / totalSessions) * 100) 
    : 0;

  // --- 3. Upcoming Sessions ---
  const upcomingSessionsWidget: UpcomingSessionWidget[] = upcomingSessions.map(s => ({
    date: s.scheduledAt,
    caseId: s.caseId,
    // Provide studentName as a primary source for the doctor/student handling the case, since studentId is available.
    doctorName: s.studentName || 'Not Assigned', 
    status: s.status || 'Scheduled'
  }));

  // --- 4. Recent Activity ---
  // Combine all activities, sort them descending by date, and pick top 10
  const activities: RecentActivityWidget[] = [];

  sessions.forEach(s => {
    // API returns 'Done' for completed sessions
    const isCompleted = s.status && (s.status.toLowerCase() === 'completed' || s.status.toLowerCase() === 'done');
    const doctorDisplay = s.studentName ? `with ${s.studentName}` : (s.assignedDoctorName ? `with Dr. ${s.assignedDoctorName}` : '');
    
    // Use createAt for completed sessions to avoid future scheduled dates in history
    const activityDate = isCompleted ? (s.createAt || s.scheduledAt) : (s.scheduledAt || s.createAt);
    
    activities.push({
      type: 'session',
      date: activityDate,
      description: isCompleted 
        ? `Session completed ${doctorDisplay}: ${s.treatmentType && s.treatmentType !== "" ? s.treatmentType : 'Dental Treatment'}` 
        : `Session scheduled ${doctorDisplay}: ${s.treatmentType && s.treatmentType !== "" ? s.treatmentType : 'Dental Treatment'}`
    });
  });

  diagnoses.forEach(d => {
    const relatedCase = cases.find(c => c.id === d.patientCaseId);
    const stageDisplay = (d.stage !== undefined && d.stage !== null) ? `Stage ${d.stage}` : 'Initial';
    
    // Get assigned names from the related case
    let assignedInfo = '';
    if (relatedCase) {
      if (relatedCase.assignedStudentId && userNamesMap[relatedCase.assignedStudentId]) {
        assignedInfo = ` (Student: ${userNamesMap[relatedCase.assignedStudentId]})`;
      } else if (relatedCase.assignedDoctorId && userNamesMap[relatedCase.assignedDoctorId]) {
        assignedInfo = ` (Doctor: ${userNamesMap[relatedCase.assignedDoctorId]})`;
      }
    }

    activities.push({
      type: 'diagnosis',
      date: d.createAt || relatedCase?.createAt || new Date().toISOString(), 
      description: `New Diagnosis: ${d.caseTypeName || 'General Diagnosis'} ${assignedInfo} - ${stageDisplay}`
    });
  });

  cases.forEach(c => {
    let assignedName = '';
    if (c.assignedStudentId && userNamesMap[c.assignedStudentId]) {
      assignedName = ` (Assigned to: ${userNamesMap[c.assignedStudentId]})`;
    } else if (c.assignedDoctorId && userNamesMap[c.assignedDoctorId]) {
      assignedName = ` (Assigned to: Dr. ${userNamesMap[c.assignedDoctorId]})`;
    }

    activities.push({
      type: 'case',
      date: c.createAt,
      description: `Case Opened: New file created for patient${assignedName}`
    });
  });

  // Sort descending: Newest to Oldest
  activities.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    // Handle potential invalid dates
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  });
  
  const recentActivity = activities.slice(0, 10);

  // --- 5. Diagnoses Count ---
  const diagnosesCount = diagnoses.length;

  return {
    kpis: {
      totalCases,
      activeCases,
      completedCases,
      activeCasesPercentage,
      completedCasesPercentage,
      totalSessions,
      completedSessions,
      pendingSessions
    },
    progress: {
      progressPercentage,
      completedSessions,
      totalSessions
    },
    upcomingSessions: upcomingSessionsWidget,
    recentActivity,
    diagnosesCount,
    charts: {
      casesDistribution: {
        active: activeCases,
        completed: completedCases
      },
      sessionsStatus: {
        completed: completedSessions,
        pending: pendingSessions
      }
    }
  };
}
