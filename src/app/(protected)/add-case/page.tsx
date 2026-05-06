import AddCaseScreen from "@/features/add-case/screens/AddScreen";
import { Suspense } from "react";

export default function AddCasePage() {
    return (
        <Suspense>
            <AddCaseScreen />
        </Suspense>
    );
}
