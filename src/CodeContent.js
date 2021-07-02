import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CodeTab from "./CodeTab";


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

    const parseLanguages = listCodes => {
        if(listCodes === undefined){
            return {}
        }
        let resultList = {}
        listCodes.forEach(item => {
            if (item['language']['name'] in resultList) {
                resultList[item['language']['name']]["codes"].push(item["code"]);
            } else {
                resultList[item['language']['name']] = {
                    "codes": [item["code"]],
                    "syntax_code": item['language']['syntax_code']
                }
            }
        });
        return resultList;
    }


    useEffect(() => {
        fetch("http://127.0.0.1:8000/algorithm/" + props['idAlgorithm'])
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    setCodes(parseLanguages(result['codes']));
                },
                error => {
                    console.log(error)
                }
            )
    }, [])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log(codes);
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
                <CodeTab codes={codes[key]["codes"]}/>
            </TabPanel>
        )
    })
    return (
        <React.Fragment>
            <div>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    {tabs}
                </Tabs>
                {contentTabs}

            </div>
        </React.Fragment>
    );
}
