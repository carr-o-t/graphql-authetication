const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="authLayout h-full min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-body-bg to-white">
      {children}
    </div>
  );
};

export default AuthLayout;
