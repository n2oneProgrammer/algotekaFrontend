import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import config from "../config";
import Typography from "@material-ui/core/Typography";

export default function LoginDialog(props) {
    const [errorMessage, setErrorMessage] = React.useState("")
    const {onClose, open, onLogin} = props;
    const [usernameInput, setUsernameInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");
    const handleLogin = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");

        let formdata = new FormData();
        formdata.append("username", usernameInput);
        formdata.append("password", passwordInput);
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(config.src + "/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                    let access_token = result['access_token'];
                    if (access_token === undefined) {
                        console.log(result['detail']);
                        setErrorMessage("Incorrect username or password");
                        return;
                    }
                    onLogin(access_token)
                    onClose();
                }
            ).catch(error => console.error(error))
    }
    return (
        <Dialog onClose={onClose} aria-labelledby="title" open={open}>
            <DialogTitle id="title">Login</DialogTitle>
            <DialogContent>
                {errorMessage !== "" ? (
                    <Typography
                        component="p" color="error" noWrap
                    >{errorMessage}</Typography>
                ) : (<p/>)}
                <TextField
                    autoFocus
                    margin="dense"
                    id="login"
                    label="Login"
                    type="text"
                    fullWidth
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleLogin} color="primary">
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    )
}