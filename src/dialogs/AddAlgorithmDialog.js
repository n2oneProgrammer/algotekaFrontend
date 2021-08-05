import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import config from "../config";
import Typography from "@material-ui/core/Typography";

export default function AddAlgorithmDialog(props) {
    const [errorMessage, setErrorMessage] = React.useState("")
    const {onClose, open, onAdd, token} = props;
    const [nameInput, setNameInput] = React.useState("");
    const handleAddAlgorithm = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "name": nameInput
            }),
            redirect: 'follow'
        };

        fetch(config.src + "/algorithm", requestOptions)
            .then(response => response.json())
            .then(result => {
                    let name = result['name'];
                    if (name === undefined) {
                        setErrorMessage("algorithm with this name exist");
                        return;
                    }
                    onAdd(result)
                    onClose();
                }
            ).catch(error => console.error(error))
    }
    return (
        <Dialog onClose={onClose} aria-labelledby="title" open={open}>
            <DialogTitle id="title">Add Algorithm</DialogTitle>
            <DialogContent>
                {errorMessage !== "" ? (
                    <Typography
                        component="p" color="error" noWrap
                    >{errorMessage}</Typography>
                ) : (<p/>)}
                <TextField
                    autoFocus
                    margin="dense"
                    id="nameAlgorithm"
                    label="name"
                    type="text"
                    fullWidth
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddAlgorithm} color="primary">
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    )
}