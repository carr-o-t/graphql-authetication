import { Navbar } from "@/components/Navbar";
import Dashboard from "@/components/dashboard";
import type { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = { title: "Dashboard" };

interface DashboardPageProps {}

const DashboardPage: FC<DashboardPageProps> = ({}) => {
  return (
    <div className="dashboard">
      <Navbar />
      <section
        style={{
          padding: "3rem 1rem",
          maxWidth: "80rem",
          margin: "auto",
        }}
      >
        <Dashboard />
      </section>
    </div>
  );
};

export default DashboardPage;
