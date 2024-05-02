import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface FormErrorProps {
  message?: any;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive"
      style={{
        marginTop: "1rem",
        backgroundColor: "hsl(0 84.2% 60.2%)", // Assuming Tailwind uses custom color variables
        padding: "0.75rem 1.5rem", // Adjust padding as needed
        borderRadius: ".375rem", // Adjust rounding as needed
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Adjust gap placement (optional)
        gap: "0.5rem", // Optional gap between items
        color: "white", // Assuming Tailwind uses custom color variables
        fontSize: "0.875rem",
      }}
    >
      <ErrorOutlineIcon className="h-4 w-4" />
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
};
