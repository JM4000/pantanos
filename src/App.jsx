import React, {useEffect} from 'react';
import Menu from './components/Menu';
import RigthDrawer from './components/RigthDrawer';
import Mapa from './components/Mapa';

function App() {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState("None");
    const [block, setBlock] = React.useState(false);

    const handleDrawerOpen = ({name}) => {
        setOpen(true);
        setSelected(name);
    };

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    const handleDrawerClose = () => {
        if(!block){
            setOpen(false);
        }
    };

    function manageBlock(block){
        setBlock(block);
    }

    return( 
        <div className="box">
            <div className="row header">
                <Menu />
                <RigthDrawer open={open} handler={handleDrawerClose} seleccionado={selected} key={selected} blockManager={manageBlock}/>
            </div>
            <div className="row content">
              <Mapa handlerOpen={handleDrawerOpen} block={block}/>
            </div>
        </div>   
    );
}

export default App