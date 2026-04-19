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
  status?: CaseStatus;
  caseType?: string | null;
  caseTypeName?: string | null;
  description?: string | null;
  notes?: string | null;
  totalSessions: number;
  hasEvaluatedSession: boolean;
  pendingRequests: number;
  assignedStudentId?: string | null;
  assignedDoctorId?: string | null;
  createAt: string;
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
  stage?: number;
  caseTypeId: string;
  caseTypeName?: string | null;
  notes?: string | null;
  createdById?: string | null;
  role?: string | null;
  isAccepted?: boolean | null;
  teethNumbers?: number[] | null;
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
  diagnoses: DiagnosisDto[]
): DashboardData {
  // --- 1. Cases KPIs ---
  const totalCases = cases.length;
  // Assuming CaseStatus.Completed is 5, adjust if needed based on real backend behavior.
  const completedCases = cases.filter(c => c.status === CaseStatus.Completed).length;
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
    activities.push({
      type: 'session',
      date: s.scheduledAt || s.createAt,
      description: s.status === 'Completed' 
        ? `Session completed for treatment ${s.treatmentType || 'Unknown'}` 
        : `Session scheduled for treatment ${s.treatmentType || 'Unknown'}`
    });
  });

  diagnoses.forEach(d => {
    activities.push({
      type: 'diagnosis',
      // Since diagnosis doesn't have an explicit date in the DTO schema returned natively,
      // mapping it to a current timestamp or default. Usually diagnoses are mapped differently.
      // Assuming we can use Date.now() or maybe the related Case creation date. We'll leave it as ISO string if missing.
      date: new Date().toISOString(), 
      description: `Diagnosis added: ${d.caseTypeName || 'Unknown'} - Stage ${d.stage || 'Initial'}`
    });
  });

  cases.forEach(c => {
    activities.push({
      type: 'case',
      date: c.createAt,
      description: `Case creation: ${c.caseTypeName || 'General'}`
    });
  });

  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
