import { Navbar } from "@/components/Navbar";
import Dashboard from "@/components/dashboard";
import { FC } from "react";

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
