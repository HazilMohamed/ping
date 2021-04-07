import { useState } from "react";
import axios from "axios";
import config from "../config";
import {
  Paper,
  makeStyles,
  Theme,
  createStyles,
  TextField,
  Button,
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
      width: "1080px",
      height: "900px",
      backgroundColor: "#a3ccf5",
    },
    text: {
      width: "90%",
    },
    output: {
      padding: theme.spacing(6),
    },
  })
);

const HomeContainer = () => {
  const api = config.api;
  const styles = useStyles();
  const [url, setUrl] = useState<string>();
  const [timeOut, setTimeOut] = useState<number>();
  const [result, setResult] = useState<any>();

  const changeUrl = (value: string) => {
    setUrl(value);
  };

  const changeTimeOut = (value: string) => {
    setTimeOut(Number(value));
  };

  const fetchPing = () => {
    if (url && timeOut) {
      axios.post(api + "/ping", { url: url, timeOut: timeOut }).then((res) => {
        if (res.data && res.data.status) {
          setResult(res.data);
        }
      });
    }
  };

  return (
    <Paper elevation={5} className={styles.paper}>
      <form className={styles.root}>
        <TextField
          fullWidth
          className={styles.text}
          label={"URL"}
          value={url}
          name={"url"}
          onChange={(ev) => changeUrl(ev.target.value)}
        />
        <TextField
          fullWidth
          className={styles.text}
          label={"TimeOut"}
          value={timeOut}
          name={"timeOut"}
          onChange={(ev) => changeTimeOut(ev.target.value)}
        />
        <Button variant={"contained"} color={"secondary"} onClick={fetchPing}>
          Search
        </Button>
      </form>
      {result && (
        <div className={styles.output}>
          Response: {result.message}
          <br />
          {result.success && (
            <>
              IP: {result.numeric_host}
              <br />
              Average Ping: {result.avg}
            </>
          )}
        </div>
      )}
    </Paper>
  );
};

export default HomeContainer;
