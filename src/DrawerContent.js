import React, {useCallback, useEffect} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {TextField} from "@material-ui/core";
import config from './config.js';


export default function DrawerContent(props) {
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
    },[props]);
    const [dataList, setDataList] = React.useState();
    const [list, setList] = React.useState("");


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
            </div>
        </React.Fragment>
    );
}
