import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Button from "@mui/joy/Button";

const ModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    document.getElementById("root").style.backgroundColor =
      mode === "dark" ? "black" : "white";
  }, [mode]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Button
      variant="outlined"
      color="neutral"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? "Turn light" : "Turn dark"}
    </Button>
  );
};
export default ModeSwitcher;
