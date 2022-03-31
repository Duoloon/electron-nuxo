import React, { useState } from 'react'
import {Button, LinearProgress, Box} from '@mui/material';
// import { AppRouter } from 'routers/AppRouter';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const Notify = () => {
  const [notification, setNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  ipcRenderer.on('message', function (event, text) {
    if (text === "Actualización Disponible.") {
      setNotification(true);
      setMessage(text);
    } else if (text === "Actualización Descargada") {
      setNotification(true);
      setMessage(text);
    }
  });

  ipcRenderer.on('progressbar', function (event, text) {
    setMessage("Descargando");
    setProgress(text);
  });

  const restartApp = () => {
    ipcRenderer.send('restart_app');
  }

  setInterval(() => {
    ipcRenderer.send('update_app');
  }, 300000)

  return (
    notification &&
    <Box style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "300px",
      padding: "20px",
      borderRadius: "5px",
      backgroundColor: "white",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
    }}>
      {message}
      <Box style={{ marginTop: "10px" }} />
      <LinearProgress variant="determinate" value={progress} />
      <Box style={{
        display: "flex",
        marginTop: 10,
        flexDirection: "row",
      }}>
        {message === "Descargando" || message === "Actualización Disponible." ?
          null
          :
          <>
            <Button variant="contained" onClick={() => { setNotification(false) }}>Cerrar </Button>
            <Button style={{ marginLeft: "auto" }} variant="contained" color="primary" onClick={restartApp}>Reiniciar App</Button>
          </>
        }
      </Box>
    </Box>
  )
}

export default Notify;
