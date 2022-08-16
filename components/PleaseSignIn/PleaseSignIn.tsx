import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

const PleaseSignIn = () => {
  return <Button fullWidth onClick={() => signIn()} variant="outlined">Please sign in.</Button>
}

export default PleaseSignIn;