import React, {useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import config from "../config";
import Typography from "@material-ui/core/Typography";
import AddLanguageDialog from "./AddLanguageDialog";
export default function AddCodeDialog(props) {
    const [errorMessage, setErrorMessage] = React.useState("")
    const {onClose, open, onAdd, token, language_id, algorithm_id} = props;
    const [codeInput, setCodeInput] = React.useState("");
    const [languageInput, setLanguageInput] = React.useState(0);
    const [languageList, setLanguageList] = React.useState([])
    const [openAddLanguageDialog, setOpenAddLanguageDialog] = React.useState(false)
    const handleAddCode = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "code": codeInput,
                "language_id": languageInput,
                "algorithm_id": algorithm_id
            }),
            redirect: 'follow'
        };

        fetch(config.src + "/code", requestOptions)
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

    useEffect(() => {
        setLanguageInput(language_id)
        fetch(config.src + "/languages")
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    setLanguageList(result.map(language => {
                        return (<MenuItem key={language['id']} value={language['id']}>{language['name']}</MenuItem>);
                    }));
                },
                error => {
                    console.error(error)
                }
            )
    }, [language_id]);
    let addLanguage = (language) => {
        let tempList = languageList;
        tempList.push(
            (
                <MenuItem key={language['id']} value={language['id']}>{language['name']}</MenuItem>
            )
        )
        setLanguageList(tempList)
    };
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
                    id="nameAlgorithm"
                    label="code"
                    type="text"
                    fullWidth
                    multiline

                    rows={8}
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value)}
                />
                <Select
                    fullWidth
                    autoFocus
                    value={languageInput}
                    inputProps={{
                        name: 'max-width',
                        id: 'max-width',
                    }}
                    onChange={(e) => {
                        if(e.target.value === "add"){
                            setOpenAddLanguageDialog(true)
                            return;
                        }
                        setLanguageInput(e.target.value)
                    }}
                >
                    {languageList}
                    <MenuItem key={"add"} value={"add"}>ADD</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddCode} color="primary">
                    Login
                </Button>
            </DialogActions>
            <AddLanguageDialog open={openAddLanguageDialog} onClose={() => setOpenAddLanguageDialog(false)}
                               onAdd={addLanguage} token={props['token']}/>
        </Dialog>

    )
}