import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface inputProps extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  control: any;
  label?: string;
  type: string;
  placeholder: string;
  disabled: boolean;
}

export const Input = ({ name, control, label, ...props }: inputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        // formState,
      }) => (
        <TextField
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          type={props.type}
          placeholder={props.placeholder}
          disabled={props.disabled}
          id={"mui-input"}
        />
      )}
    />
  );
};
