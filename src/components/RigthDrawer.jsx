import React, { useState, useEffect } from 'react'
import { Drawer, IconButton } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

const RigthDrawer = ({ open, handler, seleccionado, blockManager }) => {

    const [drawerWidth, setDrawerWidth] = useState(window.innerWidth * 0.33);
    const [desde, setDesde] = useState(2012);
    const [hasta, setHasta] = useState(2022);

    const optionsDesde = [
        { value: 2012, label: "2012", disabled: false },
        { value: 2013, label: "2013", disabled: false },
        { value: 2014, label: "2014", disabled: false },
        { value: 2015, label: "2015", disabled: false },
        { value: 2016, label: "2016", disabled: false },
        { value: 2017, label: "2017", disabled: false },
        { value: 2018, label: "2018", disabled: false },
        { value: 2019, label: "2019", disabled: false },
        { value: 2020, label: "2020", disabled: false },
        { value: 2021, label: "2021", disabled: false },
        { value: 2022, label: "2022", disabled: false },
    ];

    const optionsHasta = [
        { value: 2012, label: "2012", disabled: false },
        { value: 2013, label: "2013", disabled: false },
        { value: 2014, label: "2014", disabled: false },
        { value: 2015, label: "2015", disabled: false },
        { value: 2016, label: "2016", disabled: false },
        { value: 2017, label: "2017", disabled: false },
        { value: 2018, label: "2018", disabled: false },
        { value: 2019, label: "2019", disabled: false },
        { value: 2020, label: "2020", disabled: false },
        { value: 2021, label: "2021", disabled: false },
        { value: 2022, label: "2022", disabled: false },
    ];

    const [arrayDesde, setArrayD] = useState(optionsDesde);
    const [arrayHasta, setArrayH] = useState(optionsHasta);

    const handleDesde = (event) => {
        setDesde(event.target.value);
        let dummyArrayD = optionsDesde;
        dummyArrayD.forEach(element => {
            if (element.value < event.target.value) {
                element.disabled = true;
            } else {
                element.disabled = false;
            }
        });
        setArrayH(dummyArrayD);
    };

    const handleHasta = (event) => {
        setHasta(event.target.value);
        let dummyArrayH = optionsDesde;
        dummyArrayH.forEach(element => {
            if (element.value > event.target.value) {
                element.disabled = true;
            } else {
                element.disabled = false;
            }
        });
        setArrayD(dummyArrayH);
    };

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
                return <Tabla rows={dataFile} />
        }
    };

    function renderGraph(value) {
        switch (value) {
            case 0:
                return (
                    <Box sx={{ maxHeight: window.innerHeight * 0.65 }} overflow={"auto"}>
                        <Grid item container border={1} borderColor={"lightgray"} borderRadius={2} xs={8}>
                            <Grid item xs={12}> <Skeleton variant="rectangular" animation="wave" height={window.innerHeight * 0.3} /> </Grid>
                        </Grid>
                    </Box>
                );
            case 1:
                return (<CircularProgress sx={{ color: "#007a33", overflow: "hidden" }} size={drawerWidth * 0.8} />);
            case 2:
                return <Grafico rows={dataFile}/>
        }
    };

    const changeState = () => {
        if (estado == 0 || estado == 2) {
            setEstado(1);
            blockManager(true);
            invoke("create_file", { name: seleccionado })
                .then(() => {
                    fs.readTextFile("Pantanos\\data.json", { dir: fs.BaseDirectory.Temp })
                        .then((message) => {
                            setEstado(2);
                            blockManager(false);
                            let data = JSON.parse(message);

                            let rows = [];
                            for (let i = 0; i < data["prediction"].length; i++) {
                                rows.push({"expected": data["original"][i], "predicted": data["prediction"][i] })
                            }
                            setDataFile(rows);
                        });
                })
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
            <Typography variant="h6" component="div" color="inherit" margin={4}>
                Rango de predicción:
            </Typography>
            <Grid container spacing={1} marginLeft={5} paddingRight={5}>
                <Grid item>
                    <FormControl variant="outlined" >
                        <InputLabel>Desde:</InputLabel>
                        <Select
                            label="Desde"
                            value={desde}
                            onChange={handleDesde}
                        >
                            {arrayDesde.map(option => (
                                <MenuItem value={option.value} disabled={option.disabled} key={"d" + option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="inherit" component="div" sx={{ margin: "5px" }}>
                        -
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" >
                        <InputLabel>Hasta:</InputLabel>
                        <Select
                            label="Hasta"
                            value={hasta}
                            onChange={handleHasta}
                        >
                            {arrayHasta.map(option => (
                                <MenuItem value={option.value} disabled={option.disabled} key={"h" + option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Box sx={{ width: '100%' }} marginTop={1}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} variant={"scrollable"}>
                            <Tab label="Tabla" {...a11yProps(0)} />
                            <Tab label="Gráfica" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <Grid item xs={12} xl={10}>
                        <TabPanel value={tabValue} index={0} >
                            {renderTabla(estado)}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            {renderGraph(estado)}
                        </TabPanel>
                    </Grid>
                </Box>

                <Grid item container direction={"row-reverse"} justifyContent={"flex-start"} alignItems={"center"} paddingRight={4}>
                    <Grid item>
                        <Button variant='contained' sx={{ backgroundColor: "#007a33" }} onClick={changeState} marginBottom={5}>Generar</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Drawer >
    )
}

export default RigthDrawer
