import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import {Hidden, Icon, Link} from "@material-ui/core";
import DrawerContent from "./DrawerContent";
import CodeContent from "./CodeContent";
import MainContent from "./MainContent";
import LoginDialog from "./dialogs/LoginDialog";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        width: drawerWidth,
        paddingTop: 45
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        marginLeft: drawerWidth,
        width: "80%",
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
        },
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));


function App() {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [idOpenAlgorithm, setIdOpenAlgorithm] = React.useState(0);
    const [openLoginDialog, setOpenLoginDialog] = React.useState(false);
    const [accessToken, setAccessToken] = React.useState(null)
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const container = window !== undefined ? () => window.document.body : undefined;
    const login = (access_token) => {
        localStorage.setItem("token", access_token)
        setAccessToken(access_token)
    }
    const logout = () => {
        localStorage.removeItem("token")
        setAccessToken(null)
    }
    useEffect(() => {
        let access_token = localStorage.getItem("token");
        setAccessToken(access_token)
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Hidden smUp>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={clsx(classes.menuButton, mobileOpen && classes.menuButtonHidden)}
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Hidden>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        <Link href="#" onClick={() => setIdOpenAlgorithm(0)} color="inherit">
                            Algoteka
                        </Link>
                    </Typography>
                    {accessToken != null ? (
                        <IconButton
                            color="inherit"
                            aria-label="login"
                            edge="end"
                            onClick={() => logout()}
                        >
                            <Icon>logout</Icon>
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            aria-label="login"
                            edge="end"
                            onClick={() => setOpenLoginDialog(true)}
                        >
                            <Icon>person</Icon>
                        </IconButton>
                    )}

                </Toolbar>
            </AppBar>
            <nav>
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor='left'
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <Divider/>
                        <List><DrawerContent changePage={setIdOpenAlgorithm} accessToken={accessToken}/></List>
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        variant="permanent"
                        open
                    >
                        <Divider/>
                        <List><DrawerContent changePage={setIdOpenAlgorithm} accessToken={accessToken}/></List>
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="xl" className={classes.container}>
                    {idOpenAlgorithm === 0 ? (
                        <MainContent/>
                    ) : (
                        <CodeContent idAlgorithm={idOpenAlgorithm} accessToken={accessToken}/>
                    )}
                </Container>


            </main>
            <LoginDialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} onLogin={login}/>
        </div>
    );
}

export default App;
