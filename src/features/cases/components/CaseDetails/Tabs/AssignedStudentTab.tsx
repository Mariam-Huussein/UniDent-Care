import { StudentAssignment } from "@/features/cases/types/CaseDetails.types";
import DetailCard from "../Shared/DetailCard";

interface AssignedStudentTabProps {
    student: StudentAssignment;
}

export default function AssignedStudentTab({ student }: AssignedStudentTabProps) {
    return (
        <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Assigned Student</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailCard label="Name" value={student.name} />
                <DetailCard label="University" value={student.university} />
                <DetailCard label="Level" value={`Level ${student.level}`} />
                <DetailCard label="Phone" value={student.phone} />
                <DetailCard label="Email" value={student.email} />
            </div>
        </div>
    );
}
