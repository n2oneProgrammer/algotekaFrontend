import React, {useCallback, useEffect} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Icon, TextField} from "@material-ui/core";
import config from './config.js';
import AddAlgorithmDialog from "./dialogs/AddAlgorithmDialog";


export default function DrawerContent(props) {
    const [openAddAlgorithmDialog, setOpenAddAlgorithmDialog] = React.useState(false);
    const [dataList, setDataList] = React.useState([]);
    const [list, setList] = React.useState("");
    let generateList = useCallback((list, search_phrase) => {
        return list.map((l) => {
            let name = l.name
            if (!name.includes(search_phrase)) return "";
            return (
                <ListItem onClick={() => props['changePage'](l.id)} key={l.id} button>
                    <ListItemText>
                        {name}
                    </ListItemText>
                </ListItem>
            )
        });
    }, [props]);


    let search = (event) => {
        setList(generateList(dataList, event.target.value))
    }

    useEffect(() => {
        fetch(config.src + "/algorithm")
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    setDataList(result);
                    setList(generateList(result, ""))
                },
                error => {
                    console.error(error)
                }
            )
    }, [generateList]);
    const addAlgorithm = (obj) => {
        let l = dataList;
        l.push(obj)
        setDataList(l);
        setList(generateList(dataList, ""))
    }
    return (
        <React.Fragment>
            <div>
                <ListItem>
                    <ListItemText>
                        <TextField
                            id="searchAlgorithm"
                            label="Search"
                            type="search"
                            onChange={search}
                        />
                    </ListItemText>
                </ListItem>
                {list}
                {props['accessToken'] != null ? (
                    <ListItem button onClick={() => setOpenAddAlgorithmDialog(true)}>
                        <ListItemText>
                            <Icon style={{
                                fontSize: 30, display: "block",
                                margin: "0 auto"
                            }}>add_circle</Icon>
                        </ListItemText>
                    </ListItem>
                ) : (
                    ""
                )}

            </div>
            <AddAlgorithmDialog open={openAddAlgorithmDialog} onClose={() => setOpenAddAlgorithmDialog(false)}
                                onAdd={addAlgorithm} token={props['accessToken']}/>
        </React.Fragment>
    );
}
