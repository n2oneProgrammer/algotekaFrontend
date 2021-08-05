import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CodeTab from "./CodeTab";
import config from './config.js'
import AddCodeDialog from "./dialogs/AddCodeDialog";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


export default function CodeContent(props) {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [codes, setCodes] = React.useState({});
    const [openAddCodeDialog, setOpenAddCodeDialog] = React.useState(false);
    const [languageIdDialog, setLanguageIdDialog] = React.useState(1);

    const parseLanguages = listCodes => {
        if (listCodes === undefined) {
            return {}
        }
        let resultList = {}
        listCodes.forEach(item => {
            if (item['language']['name'] in resultList) {
                resultList[item['language']['name']]["codes"].push(item["code"]);
            } else {
                resultList[item['language']['name']] = {
                    "codes": [item["code"]],
                    "syntax_code": item['language']['syntax_code'],
                    "language_id": item['language']['id']
                }
            }
        });
        return resultList;
    }


    useEffect(() => {
        fetch(config.src + "/algorithm/" + props['idAlgorithm'])
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    setCodes(parseLanguages(result['codes']));
                },
                error => {
                    console.error(error)
                }
            )
    }, [props])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let i = -1;
    let tabs = Object.keys(codes).map((key, _) => {
        i++;
        return (
            <Tab key={i} label={key} {...a11yProps({i})} />
        )
    });
    i = -1;
    let contentTabs = Object.keys(codes).map((key, _) => {
        i++;
        return (
            <TabPanel value={value} key={i} index={i} dir={theme.direction} component="div">
                <CodeTab setOpenAddCodeDialog={setOpenAddCodeDialog} setLanguageIdDialog={setLanguageIdDialog}
                         codes={codes[key]} accessToken={props['accessToken']}/>
            </TabPanel>
        )
    })
    let addCode = (code) => {
        if (code['language']['name'] in codes) {
            codes[code['language']['name']].push(code['code'])
        } else {
            codes[code['language']['name']] = [
                {
                    "language_id": code['language']['id'],
                    "syntax_code": code['language']['syntax_code']
                }
            ]
        }
    };
    return (
        <React.Fragment>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                {tabs}
                {props['accessToken'] != null ? (

                    <Tab label="add" onClick={() => {
                        setLanguageIdDialog(1);
                        setOpenAddCodeDialog(true);
                    }}/>
                ) : (
                    ""
                )}
            </Tabs>
            {contentTabs}
            <AddCodeDialog open={openAddCodeDialog} onClose={() => setOpenAddCodeDialog(false)}
                           onAdd={addCode} token={props['accessToken']} language_id={languageIdDialog}
                           algorithm_id={props['idAlgorithm']}/>
        </React.Fragment>
    );
}
