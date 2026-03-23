import { CaseStatus, PatientCase, ToothStatus } from "../types/CaseDetails.types";

export function formatTimestamp(ts: string) {
    const d = new Date(ts);
    return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
}

export function getPatientStatusConfig(status: CaseStatus) {
    switch (status) {
        case 'unassigned':
            return {
                label: 'Unassigned',
                bg: 'bg-gray-100',
                text: 'text-gray-600',
                dot: 'bg-gray-400',
                border: 'border-gray-200',
                gradient: 'from-gray-400 to-gray-500',
            };
        case 'diagnosis':
            return {
                label: 'Diagnosis',
                bg: 'bg-blue-50',
                text: 'text-blue-600',
                dot: 'bg-blue-400',
                border: 'border-blue-200',
                gradient: 'from-blue-400 to-blue-600',
            };
        case 'in-progress':
            return {
                label: 'In Progress',
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                dot: 'bg-amber-400',
                border: 'border-amber-200',
                gradient: 'from-amber-400 to-orange-500',
            };
        case 'completed':
            return {
                label: 'Completed',
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                dot: 'bg-emerald-400',
                border: 'border-emerald-200',
                gradient: 'from-emerald-400 to-emerald-600',
            };
    }
}

export function getToothStatusColor(status: ToothStatus) {
    switch (status) {
        case 'healthy': return { fill: '#e2e8f0', stroke: '#94a3b8', label: 'Healthy' };
        case 'needs-treatment': return { fill: '#fecaca', stroke: '#ef4444', label: 'Needs Treatment' };
        case 'in-progress': return { fill: '#fef08a', stroke: '#eab308', label: 'In Progress' };
        case 'treated': return { fill: '#bbf7d0', stroke: '#22c55e', label: 'Treated' };
    }
}

export function getUrgencyConfig(tag: string) {
    switch (tag) {
        case 'pain': return { label: 'Pain', icon: 'zap', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
        case 'emergency': return { label: 'Emergency', icon: 'alert-triangle', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
        case 'cosmetic': return { label: 'Cosmetic', icon: 'sparkles', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
        case 'routine': return { label: 'Routine', icon: 'clipboard-list', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
        default: return { label: tag, icon: 'info', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
    }
}

export function getMockPatientCase(status: CaseStatus): PatientCase {
    const base: PatientCase = {
        id: 'case-001',
        patientName: 'Sarah Johnson',
        patientAge: 28,
        patientPhone: '+20 123 456 7890',
        patientCity: 'Cairo',
        patientNotes: 'Patient reports intermittent sharp pain in the lower right quadrant when biting down on hard foods. Pain has been persistent for approximately two weeks.',
        status,
        caseType: 'Restorative',
        urgencyTag: 'pain',
        imageUrls: [
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
            'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80',
        ],
        teeth: [
            { number: 14, status: 'needs-treatment', treatmentType: 'Filling' },
            { number: 16, status: 'in-progress', treatmentType: 'Root Canal' },
            { number: 21, status: 'treated', treatmentType: 'Crown' },
            { number: 36, status: 'needs-treatment', treatmentType: 'Extraction' },
            { number: 46, status: 'treated', treatmentType: 'Filling' },
        ],
        timeline: [
            { id: '1', timestamp: '2026-03-20T10:00:00', description: 'Case created and submitted for review', type: 'info' },
            { id: '2', timestamp: '2026-03-20T14:30:00', description: 'Initial dental images uploaded', type: 'info' },
        ],
        sessions: [],
        progressStep: 0,
        createdAt: '2026-03-20T10:00:00',
    };

    if (status === 'diagnosis') {
        base.student = {
            id: 'student-001',
            name: 'Ahmed Hassan',
            phone: '+20 111 222 3333',
            email: 'ahmed.hassan@university.edu',
            university: 'Cairo University',
            level: 4,
        };
        base.progressStep = 1;
        base.timeline.push(
            { id: '3', timestamp: '2026-03-21T09:00:00', description: 'Case assigned to Ahmed Hassan', type: 'info' },
        );
    }

    if (status === 'in-progress') {
        base.student = {
            id: 'student-001',
            name: 'Ahmed Hassan',
            phone: '+20 111 222 3333',
            email: 'ahmed.hassan@university.edu',
            university: 'Cairo University',
            level: 4,
        };
        base.progressStep = 2;
        base.sessions = [
            { date: '2026-03-25', time: '10:00 AM', description: 'Tooth filling — Lower right molar', isNext: true },
            { date: '2026-03-28', time: '02:00 PM', description: 'Follow-up check' },
        ];
        base.timeline = [
            ...base.timeline,
            { id: '3', timestamp: '2026-03-21T09:00:00', description: 'Case assigned to Ahmed Hassan', type: 'info' },
            { id: '4', timestamp: '2026-03-21T11:00:00', description: 'Diagnosis started — Initial examination', type: 'diagnosis' },
            { id: '5', timestamp: '2026-03-22T10:30:00', description: 'Tooth #16 root canal treatment initiated', type: 'treatment' },
            { id: '6', timestamp: '2026-03-22T15:00:00', description: 'Tooth filling in progress — Lower right molar', type: 'treatment' },
        ];
    }

    if (status === 'completed') {
        base.student = {
            id: 'student-001',
            name: 'Ahmed Hassan',
            phone: '+20 111 222 3333',
            email: 'ahmed.hassan@university.edu',
            university: 'Cairo University',
            level: 4,
        };
        base.progressStep = 3;
        base.completedAt = '2026-03-30T16:00:00';
        base.treatmentSummary = 'Successfully completed restorative treatment including root canal therapy on tooth #16, composite filling on tooth #14, and ceramic crown placement on tooth #21. All treated areas showing healthy healing with no complications.';
        base.feedbackNotes = 'Patient is satisfied with the treatment outcomes. Recommended regular check-ups every 6 months.';
        base.beforeImageUrls = [
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
        ];
        base.afterImageUrls = [
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
        ];
        base.teeth = base.teeth.map(t => ({ ...t, status: 'treated' as const }));
        base.timeline = [
            ...base.timeline,
            { id: '3', timestamp: '2026-03-21T09:00:00', description: 'Case assigned to Ahmed Hassan', type: 'info' },
            { id: '4', timestamp: '2026-03-21T11:00:00', description: 'Diagnosis completed', type: 'diagnosis' },
            { id: '5', timestamp: '2026-03-23T10:00:00', description: 'Root canal therapy completed on tooth #16', type: 'treatment' },
            { id: '6', timestamp: '2026-03-25T14:00:00', description: 'Composite filling placed on tooth #14', type: 'treatment' },
            { id: '7', timestamp: '2026-03-28T10:00:00', description: 'Crown placement on tooth #21', type: 'treatment' },
            { id: '8', timestamp: '2026-03-30T16:00:00', description: 'Treatment completed — All procedures successful', type: 'info' },
        ];
    }

    return base;
}
