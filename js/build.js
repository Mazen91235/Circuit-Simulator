let binding_wire_html = '<div class="binding_wire"><div class="v_binder"><div class="v_wire"></div></div><div class="h_binder"><div class="h_wire"></div></div></div>';
let binding_wire_elm;
CreateBindingWire();
function CreateBindingWire(){
    binding_wire_elm = document.createElement("div");
    binding_wire_elm.classList.add("binding_wire");
    let v_binder = document.createElement("div");
    v_binder.classList.add("v_binder");
    let v_wire = document.createElement("div");
    v_wire.classList.add("v_wire");
    let h_binder = document.createElement("div");
    h_binder.classList.add("h_binder");
    let h_wire = document.createElement("div");
    h_wire.classList.add("h_wire");
    v_binder.appendChild(v_wire);
    h_binder.appendChild(h_wire);
    binding_wire_elm.appendChild(v_binder);
    binding_wire_elm.appendChild(h_binder);
}
function ResetCircuit(){
    components = [];
    nodes = [];
    simulator.innerHTML = '';
    CloseContextMenu();
}
function HandleElement(){
    if(!draggable_item) return;
    if(draggable_item.classList.contains("node")) return;
    let comp;
    let row = Number(draggable_item.getAttribute("row"));
    let column = Number(draggable_item.getAttribute("column"));
    let type = draggable_item.getAttribute("type");
    let id = draggable_item.getAttribute("comp_id");
    if(!id){
        id = components.length;
        comp = {"id":components.length,"value":0,"unit":'',"measuring_unit":GetMeasuringUnit(type), "type":type, "orientation":draggable_item.getAttribute("orientation"), "heading":draggable_item.getAttribute("heading"),"row": row,"column": column};
        draggable_item.setAttribute("comp_id",id);
        draggable_item.classList.add(`item-id-${id}`);
        draggable_item.classList.remove("temp");
        components.push(comp);
        ChooseSubMenu("inputs");
        EditComponent(id);
    }else{
        comp = components[Number(id)];
        if(!comp) return;
        comp["row"] = row;
        comp["column"] = column;
    }

    PrepareContextMenu();
}
function CreateGrid(){
    let grid = document.querySelector(".simulator_bg");
    grid.innerHTML = '';
    let x=60,y=60;
    while(x < window.innerWidth){
        grid.innerHTML += `<div class="v-wire" style="left:${x}px;"></div>`;
        x +=60;
    }
    while(y <= window.innerHeight){
        grid.innerHTML += `<div class="h-wire" style="top:${y}px;"></div>`;
        y += 60;
    }
}
function GetPosition(x,y){
    let row = Math.floor((y + window.scrollY) / gridSize) + 1;
    let column = Math.floor((x + window.scrollX) / gridSize) - 1;
    return [row,column];
}