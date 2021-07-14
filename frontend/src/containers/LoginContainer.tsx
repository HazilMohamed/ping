import { useContext, useState } from "react";
import axios from "axios";
import config from "../config";
import AuthContext from "../utils/Context";
import {
  Paper,
  createStyles,
  Theme,
  makeStyles,
  TextField,
  Button,
  FormLabel,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(2),
        width: "25ch",
      },
      textAlign: "center",
      padding: theme.spacing(3),
    },
    paper: {
      width: "500px",
      height: "800px",
      backgroundColor: "#a3ccf5",
    },
    header: {
      fontSize: 40,
    },
    text: {
      width: "90%",
    },
  })
);

const LoginContainer = () => {
  const api = config.api;
  const styles = useStyles();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const changeUsername = (value: string) => {
    setUsername(value);
  };

  const changePassword = (value: string) => {
    setPassword(value);
  };

  const handleLogin = () => {
    if (username && password) {
      axios
        .post(api + "/login", { name: username, password: password })
        .then((res) => {
          if (res.data) {
            if (res.data.success) {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("userId", res.data.userId);
              login();
            } else {
              console.log(res.data.message);
            }
          }
        });
    }
  };

  return (
    <Paper className={styles.paper} elevation={5}>
      <form className={styles.root}>
        <FormLabel>
          <Typography className={styles.header}>Login</Typography>
        </FormLabel>
        <TextField
          fullWidth
          className={styles.text}
          label={"Usernmae"}
          value={username}
          name={"username"}
          onChange={(ev) => changeUsername(ev.target.value)}
        />
        <TextField
          type={"password"}
          fullWidth
          className={styles.text}
          label={"Password"}
          value={password}
          name={"password"}
          onChange={(ev) => changePassword(ev.target.value)}
        />
        <Button variant={"contained"} color={"secondary"} onClick={handleLogin}>
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default LoginContainer;
