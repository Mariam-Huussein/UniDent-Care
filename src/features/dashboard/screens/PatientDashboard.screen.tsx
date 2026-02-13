import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function PatientDashboardScreen() {
  const auth = useSelector((state: RootState) => state.auth.user?.fullName);
  return (
    <>
      <div>
        <h1>Hello {auth}</h1>
      </div>
    </>
  );
}
