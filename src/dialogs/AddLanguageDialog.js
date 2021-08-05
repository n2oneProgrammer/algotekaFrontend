import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@material-ui/core";
import config from "../config";
import Typography from "@material-ui/core/Typography";

export default function AddLanguageDialog(props) {
    const [errorMessage, setErrorMessage] = React.useState("")
    const {onClose, open, onAdd, token} = props;
    const [nameInput, setNameInput] = React.useState("");
    const [syntaxInput, setSyntaxInput] = React.useState("");
    const handleAddLanguage = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "name": nameInput,
                "syntax_code": syntaxInput
            }),
            redirect: 'follow'
        };

        fetch(config.src + "/languages", requestOptions)
            .then(response => response.json())
            .then(result => {
                    let name = result['detail'];
                    if (name !== undefined) {
                        console.log(result)
                        setErrorMessage(result['detail']);
                        return;
                    }
                    onAdd(result)
                    onClose();
                }
            ).catch(error => console.error(error))
    }


    return (
        <Dialog
            fullWidth={true}
            maxWidth="lg"
            onClose={onClose}
            aria-labelledby="title"
            open={open}>
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
                    id="nameLanguage"
                    label="name"
                    type="text"
                    fullWidth
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="syntax_code"
                    label="syntax code"
                    type="text"
                    fullWidth
                    value={syntaxInput}
                    onChange={e => setSyntaxInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddLanguage} color="primary">
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    )
}