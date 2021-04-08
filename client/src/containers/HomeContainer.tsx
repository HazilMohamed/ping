/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import {
  Paper,
  makeStyles,
  Theme,
  createStyles,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";

import { getUserId } from "../utils/Auth";

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
    result: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    output: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "60%",
      padding: theme.spacing(6),
    },
    history: {
      textAlign: "center",
      padding: theme.spacing(6),
    },
    header: {
      padding: theme.spacing(2),
      fontSize: 20,
      fontWeight: 800,
    },
    row: {
      display: "flex",
      padding: theme.spacing(1),
    },
    element: {
      width: "25%",
    },
    log: {
      textAlign: "left",
      padding: theme.spacing(0, 6),
    },
    logElement: {
      padding: theme.spacing(1, 0),
    },
  })
);

const HomeContainer = () => {
  const api = config.api;
  const styles = useStyles();
  const userId = getUserId();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [timeOut, setTimeOut] = useState<string>("");
  const [userSiteId, setUserSiteId] = useState<string>("");
  const [sites, setSites] = useState<Array<any>>([]);
  const [result, setResult] = useState<any>();

  const changeUrl = (value: string) => {
    setUrl(value);
  };

  const changeTimeOut = (value: string) => {
    setTimeOut(value);
  };

  const fetchSite = () => {
    if (url && timeOut) {
      axios.post(api + "/ping", { url, timeOut }).then((res) => {
        if (res.data && res.data.success) {
          setResult(res.data);
          axios
            .post(api + "/url/add", {
              userId: userId,
              url: url,
              timeOut: timeOut,
              ping: res.data.avg || res.data.message,
            })
            .then((res) => {
              if (res.data && res.data.success) {
                let array = sites;
                setSites([...array, res.data.data[0]]);
              }
            });
        }
      });
      resetAll();
    }
  };

  const updateSite = () => {
    if (url && timeOut && userSiteId) {
      axios.post(api + "/ping", { url, timeOut }).then((res) => {
        if (res.data && res.data.status) {
          setResult(res.data);
          axios
            .post(api + "/url/update", {
              userSiteId,
              timeOut,
              url,
              ping: res.data.avg || res.data.message,
            })
            .then((res) => {
              if (res.data && res.data.success) {
                let array = sites;
                array = array.filter((el) => el.usersite_id !== userSiteId);
                setSites([...array, res.data.data[0]]);
              }
            });
        }
      });
    }
  };

  const fetchAllSites = () => {
    axios.post(api + "/url/all", { userId: userId }).then((res) => {
      if (res.data && res.data.success) {
        setSites(res.data.data);
      }
    });
  };

  const handleEdit = (site: any) => {
    setIsUpdate(true);
    setUrl(site.url);
    setTimeOut(site.url_timeout);
    setUserSiteId(site.usersite_id);
  };

  const handleDelete = (id: any) => {
    axios.post(api + "/url/delete", { userSiteId: id }).then((res) => {
      if (res.data && res.data.success) {
        let array = sites;
        array = array?.filter((el) => el.usersite_id !== id);
        setSites(array);
      }
    });
  };

  const resetAll = () => {
    setIsUpdate(false);
    setUrl("");
    setTimeOut("");
  };

  useEffect(() => {
    if (userId) {
      fetchAllSites();
    }
  }, []);

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
        <Button
          variant={"contained"}
          color={"secondary"}
          onClick={isUpdate ? updateSite : fetchSite}
        >
          {isUpdate ? "Update" : "Add"}
        </Button>
        <Button variant={"contained"} onClick={resetAll}>
          Reset
        </Button>
      </form>
      {result && (
        <div className={styles.result}>
          <Paper className={styles.output}>
            Response: {result.message}
            <br />
            {result.avg && (
              <>
                IP: {result.numeric_host}
                <br />
                Average Ping: {result.avg}
              </>
            )}
          </Paper>
        </div>
      )}
      {sites && sites?.length > 0 && (
        <div className={styles.history}>
          <Paper>
            <Typography className={styles.header}>User History</Typography>
            <div
              style={{
                maxHeight: "350px",
                overflow: "auto",
              }}
            >
              <div className={styles.row}>
                <div className={styles.element}>
                  <Typography style={{ fontWeight: 600 }}>URL</Typography>
                </div>
                <div className={styles.element}>
                  <Typography style={{ fontWeight: 600 }}>Timeout</Typography>
                </div>
              </div>
              {sites.map((site) => (
                <div key={site.usersite_id}>
                  <div className={styles.row}>
                    <div className={styles.element}>{site.url}</div>
                    <div className={styles.element}>{site.url_timeout}</div>
                    <div className={styles.element}>
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => handleEdit(site)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className={styles.element}>
                      <Button
                        variant={"contained"}
                        color={"secondary"}
                        onClick={() => handleDelete(site.usersite_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {site.pingData && (
                    <div className={styles.log}>
                      {site.pingData &&
                        site.pingData.map((ping: any) => (
                          <div key={ping.pingdata_id}>
                            <div
                              className={styles.logElement}
                            >{`${ping.updated_at} -> ${ping.ping}`}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Paper>
        </div>
      )}
    </Paper>
  );
};

export default HomeContainer;
