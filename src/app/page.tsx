import Link from "next/link";
import { FaUserMd, FaUserGraduate, FaUserInjured } from "react-icons/fa";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col">
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Welcome to <span className="text-sky-600">UniDent Care</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          A modern dental healthcare platform connecting Doctors, Students, and
          Patients in one seamless experience.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-sky-600 text-white rounded-xl font-semibold shadow-md hover:bg-sky-700 transition"
          >
            Login
          </Link>

          <Link
            href="/signup/patient"
            className="px-8 py-3 border border-sky-600 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="px-6 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Create an Account As
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link
            href="/signup/doctor"
            className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border hover:border-sky-500"
          >
            <div className="flex flex-col items-center text-center">
              <FaUserMd className="text-5xl text-sky-600 mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-semibold mb-3">Doctor</h3>
              <p className="text-gray-600">
                Manage cases, supervise students, and review patient treatments.
              </p>
            </div>
          </Link>

          <Link
            href="/signup/student"
            className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border hover:border-sky-500"
          >
            <div className="flex flex-col items-center text-center">
              <FaUserGraduate className="text-5xl text-sky-600 mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-semibold mb-3">Student</h3>
              <p className="text-gray-600">
                Submit cases, learn from doctors, and track your progress.
              </p>
            </div>
          </Link>

          <Link
            href="/signup/patient"
            className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border hover:border-sky-500"
          >
            <div className="flex flex-col items-center text-center">
              <FaUserInjured className="text-5xl text-sky-600 mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-semibold mb-3">Patient</h3>
              <p className="text-gray-600">
                Book appointments, follow your cases, and connect with doctors.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} UniDent Care. All rights reserved.
      </footer>
    </div>
  );
}
