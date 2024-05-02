import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div
      className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500"
      style={{
        marginTop: "1rem",
        backgroundColor: "rgb(16 185 129 / 0.15)", // Assuming Tailwind uses custom color variables
        padding: "0.75rem 1.5rem", // Adjust padding as needed
        borderRadius: ".375rem", // Adjust rounding as needed
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Adjust gap placement (optional)
        gap: "0.5rem", // Optional gap between items
        fontSize: "0.875rem",
        color: "rgb(16 185 129",
      }}
    >
      <CheckCircleOutlineIcon className="h-4 w-4" />
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
};
