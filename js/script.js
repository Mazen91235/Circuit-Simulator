let simulator = document.querySelector(".simulator_container");
let draggable_item = null;
let wire_comp = null;
let wire_type = null;
let scrolling = false,scrolling_interval = null;
let temp_element = null;
let components = [];
let nodes = [];
let context_menu = document.querySelector(".context-menu");
let isDragging = null;
let NodeID = null;
let PositionID = null;

$(window).bind('load',function(){
    CreateGrid();
    window.addEventListener('resize',() => {
        CreateGrid();
    });
});

function AssignUnit(v){
    let units_arr = ['p','n','μ','m','','k','M','G'];
    let unit = 4;
    let value = Number(v);
    if(((Math.abs(value) * Math.pow(10,12)).toFixed(1) <= 0 && value != 0) || Math.abs(value) * Math.pow(10,-9) >= 1000){
        if((Math.abs(value) * Math.pow(10,12)).toFixed(1) <= 0 && value != 0){
            value *= Math.pow(10,12);
            unit = 0;
            return value.toString() + ' ' + units_arr[unit];
        }else{
            value *= Math.pow(10,-9);
            unit = units_arr.length - 1;
            return value.toString() + ' ' + units_arr[unit];
        }
    }
    if(value == 0){
        return value.toString() + ' ' + units_arr[unit];
    }
    while(Math.abs(value).toFixed(1) <= 0 || Math.abs(value) >= 1000){
        if(Math.abs(value).toFixed(1) <= 0){
            if(unit > 0){
                value *= 1000;
                unit -= 1;
            }
        }else{
            if(unit < units_arr.length - 1){
                value /= 1000;
                unit += 1;
            }
        }
    }
    value = Number(Number(value).toFixed(3));
    return value.toString() + ' ' + units_arr[unit];
}
function GetValue(value,unit){
    let units_arr = ['p','n','μ','m','','k','M','G'];
    let powers = [-12,-9,-6,-3,0,3,6,9];
    let total = value * Math.pow(10,powers[units_arr.indexOf(unit)]);
    return total;
}
function GetMeasuringUnit(type){
    let types = ['v','i','r','i_d','v_d',"i_l",'c'];
    let units = ['V','A','Ω','A','V','H','F'];
    if(!types.includes(type)){
        console.log("Undefined Type");
        return;
    }
    return units[types.indexOf(type.toLowerCase())];
}

function GetComponents(type){
    let comps = [];
    for(let i = 0;i<components.length;i++){
        if(components[i]["type"] == type) comps.push(components[i]);
    }
    return comps;
}
function ResetIDS(){
    for(i=0;i<components.length;i++){
        let comp = components[i];
        let elm = simulator.querySelector(`.item-id-${comp["id"]}`);
        if(!comp || !elm) continue;
        elm.classList.remove(`item-id-${comp["id"]}`);
        elm.classList.add(`item-id-${i}`);
        elm.setAttribute("comp_id",i);
        comp["id"] = i;
    }
}
function ResetEventListeners(){
    simulator.querySelectorAll(".component").forEach(comp => {
        SetDraggable(comp);
    });
    PrepareContextMenu();
    PrepareNodesContextMenu();
    SetNodesDraggable();
}