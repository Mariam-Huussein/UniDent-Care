import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StudentDashboardScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <>
            <div>
                <h1>StudentDashboardScreen</h1>
                <p>{user?.fullName}</p>
                <p>{user?.email}</p>
                <p>{user?.publicId}</p>
            </div>
        </>
    )
}
