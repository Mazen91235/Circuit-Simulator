let flips = ["top","right","bottom","left"];
function RotateRight(id){
    if(!document.querySelector(`.item-id-${id}`)) return;
    let item = document.querySelector(`.item-id-${id}`);
    let heading = item.getAttribute("heading");
    let new_heading = flips.indexOf(heading) + 1;
    if(new_heading >= flips.length){
        new_heading -= flips.length;
    }
    new_heading = flips[new_heading];
    item.setAttribute("heading",new_heading);
    item.classList.remove(`flip-${heading}`);
    item.classList.add(`flip-${new_heading}`);
    let orientation;
    if(new_heading == flips[0] || new_heading == flips[2]){
        orientation = "vertical";
    }else{
        orientation = "horizontal";
    }
    components[id]["orientation"] = orientation;
    components[id]["heading"] = new_heading;
    analyzed = false;
    if(components[id]["from"] != null){
        let node = nodes[components[id]["from"]];
        DisconnectCompFromNode(id,nodes.indexOf(node));
    }
    if(components[id]["to"] != null){
        let node = nodes[components[id]["to"]];
        DisconnectCompFromNode(id,nodes.indexOf(node));
    }
    CloseContextMenu();
}
function RotateLeft(id){
    if(!document.querySelector(`.item-id-${id}`)) return;
    let item = document.querySelector(`.item-id-${id}`);
    let heading = item.getAttribute("heading");
    let new_heading = flips.indexOf(heading) - 1;
    if(new_heading < 0){
        new_heading += flips.length;
    }
    new_heading = flips[new_heading];
    item.setAttribute("heading",new_heading);
    item.classList.remove(`flip-${heading}`);
    item.classList.add(`flip-${new_heading}`);
    let orientation;
    if(new_heading == flips[0] || new_heading == flips[2]){
        orientation = "vertical";
    }else{
        orientation = "horizontal";
    }
    components[id]["orientation"] = orientation;
    components[id]["heading"] = new_heading;
    analyzed = false;
    if(components[id]["from"] != null){
        let node = nodes[components[id]["from"]];
        DisconnectCompFromNode(id,nodes.indexOf(node));
    }
    if(components[id]["to"] != null){
        let node = nodes[components[id]["to"]];
        DisconnectCompFromNode(id,nodes.indexOf(node));
    }
    CloseContextMenu();
}
function EditComponent(id){
    ShowSideBar();
    ToggleEditComponent(id);
    ShowInputComponent(id);
    setTimeout(() => {
        let sidebarOffset = $(sidebar).offset().top;
        let targetOffset = $(sidebar.querySelector(`.data-comp-id-${id}`)).offset().top;
        let scrollValue = targetOffset - sidebarOffset + $(sidebar).scrollTop();
        $(sidebar).animate({ scrollTop: scrollValue }, 500);    
        // sidebar.scrollTo(0,document.querySelector(`.sidebar .data-comp-id-${id}`).scrollHeight + document.querySelector(`.sidebar .data-comp-id-${id}`).clientHeight);
    }, 100);
}
function SetUnits(id){
    let type = components[id]["type"];
    let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
    unit = elm.querySelector('.unit');
    if(type == 'r'){
        unit.innerHTML = '<option value="">Ω</option><option value="k">kΩ</option><option value="M">MΩ</option><option value="G">GΩ</option>';
        unit.disabled = false;
    }else if(type == 'v'){
        unit.innerHTML = '<option value="μ">μV</option><option value="m">mV</option><option value="">V</option><option value="k">kV</option>';
        unit.disabled = false;
    }else{
        unit.innerHTML = '<option value="μ">μA</option><option value="m">mA</option><option value="">A</option>';
        unit.disabled = false;
    }
    $(elm.querySelector(".type")).val('').trigger('change');
}
function PutValues(id){
    let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
    if(!elm) return;
    SetUnits(id);
    setTimeout(() => {
        $(elm.querySelector(".unit")).val(components[id]["unit"]).trigger("change");
    }, 100);
    elm.querySelector(".value").value = components[id]["value"];
}
function CancelEditComponent(id){
    PutValues(id);
}
function ApplyEditComponent(id){
    let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
    if(!elm) return;
    let comp = components[id];
    if(!comp) return;
    AssignLabel(id,comp,elm.querySelector(".value").value,elm.querySelector(".unit").value);
    comp["value"] = Number(elm.querySelector(".value").value);
    comp["unit"] = elm.querySelector(".unit").value;
    analyzed = false;
}
function AssignLabel(id,comp,new_value,new_unit){
    let old_value = comp["value"];
    let old_unit = comp["unit"];
    new_value = Number(new_value).toString();
    let text = simulator.querySelector(`.item-id-${id} .label`).textContent.split('=')[1].replace(`${old_value} ${old_unit}`,`${new_value} ${new_unit}`);
    let new_text = simulator.querySelector(`.item-id-${id} .label`).textContent.split('=')[0] + '=' + text;
    simulator.querySelector(`.item-id-${id} .label`).textContent = new_text;
    CheckDuplicateLabels();
}
function CheckDuplicateLabels(){
    simulator.querySelectorAll(".component").forEach(elm => {
        let labels = elm.querySelectorAll(".label");
        for(let i=1;i<labels.length;i++){
            labels[i].remove();
        }
    });
}
function DeleteComponent(comp_id){
    let comp = components[comp_id];
    if(!comp) return;
    if(comp["from"] != null){
        let node = nodes[comp["from"]];
        DisconnectCompFromNode(comp_id,nodes.indexOf(node));
    }
    if(comp["to"] != null){
        let node = nodes[comp["to"]];
        DisconnectCompFromNode(comp_id,nodes.indexOf(node));
    }
    simulator.querySelector(`.item-id-${comp_id}`).remove();
    components.splice(comp_id,1);
    analyzed = false;
    ChooseSubMenu("inputs");
    CloseContextMenu();
}