import React, { useState, useEffect } from 'react'
import { Drawer, IconButton } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { invoke } from '@tauri-apps/api';
import Tabla from './Tabla';
import { fs } from '@tauri-apps/api';
import Grafico from './grafico';
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const RigthDrawer = ({ open, handler, seleccionado, blockManager }) => {

    const [drawerWidth, setDrawerWidth] = useState(window.innerWidth * 0.33);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setDrawerWidth(window.innerWidth * 0.33);
        });
        return () => {
            window.removeEventListener("resize", () => {
                setDrawerWidth(window.innerWidth * 0.33);
            })
        }
    }, []);

    const DrawerHeader = styled('div')(({ }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }));

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography component="div">{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    const [estado, setEstado] = useState(0);
    const [dataFile, setDataFile] = useState([])

    function renderTabla(value) {
        switch (value) {
            case 0:
                return (
                    <Box sx={{ maxHeight: window.innerHeight * 0.65 }} overflow={"auto"}>
                        <Grid item container border={1} borderColor={"lightgray"} borderRadius={2} xs={8}>
                            {[...Array(20).keys()].map((key) => (
                                <Grid item container xs={12} marginBottom={1} marginTop={1} wrap="nowrap" sx={{ overflow: "auto" }} spacing={1} key={key}>
                                    <Grid item xs={3} marginLeft={2}> <Skeleton variant="rounded" animation="wave" /> </Grid>
                                    <Grid item xs={4}> <Skeleton variant="rounded" animation="wave" /> </Grid>
                                    <Grid item xs={4} marginRight={2}> <Skeleton variant="rounded" animation="wave" /> </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                );
            case 1:
                return (<CircularProgress sx={{ color: "#007a33", overflow: "hidden" }} size={drawerWidth * 0.8} />);
            case 2:
                return <Tabla rows={dataFile} limiter={false} />
        }
    };

    function renderGraph(value) {
        switch (value) {
            case 0:
                return (
                    <Box sx={{ maxHeight: window.innerHeight * 0.65 }} overflow={"auto"}>
                        <Grid item container border={1} borderColor={"lightgray"} borderRadius={2} xs={8}>
                            <Grid item xs={12}> <Skeleton variant="rectangular" animation="wave" height={window.innerHeight * 0.3} /> </Grid>
                            <Grid item xs={12} paddingTop={3}> <Skeleton variant="rectangular" animation="wave" height={window.innerHeight * 0.3} /> </Grid>
                        </Grid>
                    </Box>
                );
            case 1:
                return (<CircularProgress sx={{ color: "#007a33", overflow: "hidden" }} size={drawerWidth * 0.8} />);
            case 2:
                return <Grafico rows={dataFile} />
        }
    };

    const changeState = () => {
        if (estado == 0 || estado == 2) {
            setEstado(1);
            blockManager(true);
            invoke("create_full_file", { name: seleccionado })
                .then(() => {
                    fs.readTextFile("Pantanos\\data.json", { dir: fs.BaseDirectory.Temp })
                        .then((message) => {
                            setEstado(2);
                            blockManager(false);
                            let data = JSON.parse(message);

                            let rows = [];
                            for (let i = 0; i < data["prediction"].length; i++) {
                                rows.push({ "expected": data["original"][i], "predicted": data["prediction"][i], "date": String(data["dates"][i]).substring(0, 10) })
                            }
                            setDataFile(rows);
                        });
                })
        }
    };

    const [minDate, setMinDate] = useState(dayjs("2012-01-01"))
    const [maxDate, setMaxDate] = useState(dayjs("2022-12-30"))

    const [estadoP, setEstadoP] = useState(0);
    const [dataFileP, setDataFileP] = useState([])

    const changeStateP = () => {
        if (estado == 0 || estado == 2) {
            setEstadoP(1);
            invoke("create_prediction", { name: seleccionado, date: minDate.format("YYYY-MM-DD").toString(), number: (maxDate.diff(minDate, "d")).toString() })
                .then(() => {
                    fs.readTextFile("Pantanos\\prediction.json", { dir: fs.BaseDirectory.Temp })
                        .then((message) => {
                            let data = JSON.parse(message);
                            let rows = [];
                            for (let i = 0; i < data["prediction"].length; i++) {
                                rows.push({ "predicted": data["prediction"][i], "date": String(data["dates"][i]), "expected": String(data["originals"][i]) })
                            }
                            setDataFileP(rows);
                            setEstadoP(2);
                        });
                })
        }
    };

    function renderTablaP(value) {
        switch (value) {
            case 0:
                return <div />
            case 1:
                return (<CircularProgress sx={{ color: "#007a33", overflow: "hidden" }} size={drawerWidth * 0.8} />);
            case 2:
                return <Tabla rows={dataFileP} limiter={true} />
        }
    };

    function renderGraphP(value) {
        switch (value) {
            case 0:
                return <div />
            case 1:
                return <div />
            case 2:
                return <Grafico rows={dataFileP} />
        }
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    overflowX: "hidden"
                },

            }}
            variant="persistent"
            anchor="right"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handler}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <Typography variant="h4" component="div" color="inherit" margin={3}>
                {seleccionado}
            </Typography>
            <Divider />


            <Box sx={{ width: '100%', paddingLeft: 2 }} marginTop={1}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} variant={"scrollable"}>
                        <Tab label="Tabla" {...a11yProps(0)} />
                        <Tab label="Gráfica" {...a11yProps(1)} />
                        <Tab label="Predecir" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <Grid item xs={12} xl={10}>
                    <TabPanel value={tabValue} index={0} >
                        {renderTabla(estado)}
                        <Grid item container direction={"row-reverse"} justifyContent={"flex-start"} alignItems={"center"} paddingRight={4} paddingTop={2}>
                            <Grid item>
                                <Button variant='contained' sx={{ backgroundColor: "#007a33" }} onClick={changeState} >Generar</Button>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        {renderGraph(estado)}
                        <Grid item container direction={"row-reverse"} justifyContent={"flex-start"} alignItems={"center"} paddingRight={4} paddingTop={2}>
                            <Grid item>
                                <Button variant='contained' sx={{ backgroundColor: "#007a33" }} onClick={changeState} >Generar</Button>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} >
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container alignItems={"center"} justifyContent={"center"} spacing={0} direction={"row"}>
                                    <Grid item xs={6} xl={3} md={4}><DatePicker disableHighlightToday minDate={dayjs("2012-01-01")} maxDate={maxDate} format='YYYY/MM/DD' label="Desde" value={minDate} onChange={(newValue) => setMinDate(newValue)} /></Grid>
                                    <Grid item ><Typography variant="h6" component="div" color="inherit" margin={3}>
                                        -
                                    </Typography></Grid>
                                    <Grid item xs={6} xl={3} md={4}><DatePicker disableHighlightToday minDate={minDate} maxDate={dayjs("2022-12-30")} format='YYYY/MM/DD' label="Hasta" value={maxDate} onChange={(newValue) => setMaxDate(newValue)} /></Grid>

                                </Grid>
                            </LocalizationProvider>
                            {renderTablaP(estadoP)}
                            {renderGraphP(estadoP)}
                            <Grid item container direction={"row-reverse"} justifyContent={"flex-start"} alignItems={"center"} paddingRight={4} paddingTop={2}>
                                <Grid item>
                                    <Button variant='contained' sx={{ backgroundColor: "#007a33" }} onClick={() => changeStateP()}>Generar</Button>
                                </Grid>
                            </Grid>
                        </div>
                    </TabPanel>
                </Grid>
            </Box>



        </Drawer >
    )
}

export default RigthDrawer
