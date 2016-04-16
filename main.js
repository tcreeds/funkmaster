FM.init = function()
{

    var automata = new FM.Automata(8, 24);
    FM.boxes.push(new FM.Box(0, 0, automata, "c4", {
        background: 0x000099,
        marker: 0x111111
    }));
    
    var automata2 = new FM.Automata(8, 24);
    FM.boxes.push(new FM.Box(160, 0, automata2, "c5", {
        background: 0x009900,
        marker: 0x111111
    }));
    
    var automata3 = new FM.Automata(4, 8);
    FM.boxes.push(new FM.Box(0, FM.CELL_HEIGHT * 24, automata3, "c5", {
        background: 0x990000,
        marker: 0x111111
    }));
       
}