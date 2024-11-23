let sidebar = document.querySelector(".sidebar");
let content = sidebar.querySelector(".content");
function ShowSideBar(){
    sidebar.style.left = "0px";
}
function CloseSideBar(){
    sidebar.style.left = "-500px";
    if(document.querySelector(".sidebar .content .active")){
        document.querySelector(".sidebar .content .active").classList.remove("active");
    }
}
function ToggleEditComponent(id){
    let edit_input_data = document.querySelector(`.sidebar .content .data-comp-id-${id}`);
    if(!edit_input_data) return;    
    if(document.querySelector(".sidebar .content .active")){
        if(document.querySelector(".sidebar .content .active") != edit_input_data){
            document.querySelector(".sidebar .content .active").classList.remove("active");
            edit_input_data.classList.add("active");
        }else{
            document.querySelector(".sidebar .content .active").classList.remove("active");
        }
    }else{
        edit_input_data.classList.add("active");
    }
    
}
function ShowInputComponent(id){
    let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
    if(!elm) return;
    elm.classList.add("active");
}
function PutInputs(){
    let types = ['v','i','r'];
    content.innerHTML = '';
    if(components.length == 0){
        content.innerHTML = `<div class="msg">Add Components to Show Here</div>`;
        return;
    }
    for(let i=0;i<types.length;i++){
        let comps = GetComponents(types[i]);
        for(let k=0;k<comps.length;k++){
            let comp = comps[k];
            let label = `${types[i].toUpperCase()}${k+1}`;
            content.innerHTML += `<div class="input_component data-comp-id-${components.indexOf(comp)}">
                <div class="title" onclick="ToggleEditComponent(${components.indexOf(comp)})">
                    <h5>${label}</h5>
                    <i class="fa-solid fa-angle-down"></i> 
                </div>
                <div class="input_data">
                    <div>
                        <div>
                            <label>Value</label>
                            <input type="text" name="Value" class="value" placeholder="Value">
                        </div>
                        <div>
                            <label>Unit</label>
                            <select name="Unit" class="unit">
                            </select>
                        </div>
                    </div>
                    <div>
                        <a href="#!" class="btn btn-secondary" onclick="CancelEditComponent(${components.indexOf(comp)})">Cancel</a>
                        <a href="#!" class="btn btn-primary" onclick="ApplyEditComponent(${components.indexOf(comp)})">Apply</a>
                    </div>
                    <a href="#!" class="btn btn-danger" onclick="DeleteComponent(${components.indexOf(comp)})">Delete Component</a>
                </div>
            </div>`;
            comp["label"] = label;
            setTimeout(() => {
                PutValues(components.indexOf(comp));
            }, 100);

            let elm = simulator.querySelector(`.item-id-${components.indexOf(comp)}`);
            if(elm){
                elm.innerHTML += `<div class="label">${label} = ${comp["value"]} ${comp["unit"]}${comp["measuring_unit"]}</div>`;
            }
        }
    }
}
function ShowOutputs(){
    if(!analyzed){
        content.innerHTML = `<div class="msg">Analyze Circuit to Show Outputs</div>`;
        return;
    }
    content.innerHTML = `<h4>Nodes</h4>
            <hr>
            <div class="nodes_container">
            </div>
            <h4>Sources</h4>
            <hr>
            <div class="sources_container">
            </div>
            <h4>Elements</h4>
            <hr>
            <div class="elements_container">
            </div>`;
for(let i=0;i<nodes.length;i++){
    content.querySelector(".nodes_container").innerHTML += `<div class="output_component"><h5>Node ${nodes[i]["node"]} (${AssignUnit(nodes[i]["V"])}V)</h5></div>`;
}
let sources = GetComponents("v");
for(let i=0;i<sources.length;i++){
    let source = sources[i];
    content.querySelector(".sources_container").innerHTML += `<div class="output_component">
                    <h5>${source["label"]} = ${source["value"]} ${source["unit"]}V</h5>
                    <ul>
                        <li>I = ${AssignUnit(source["I"])}A</li>
                        <li>P = ${AssignUnit(source["I"] * GetValue(source["value"],source["unit"]) * -1)}W</li>
                        <li>Nodes: ${source["from"]} <i class="fa-solid fa-arrow-right"></i> ${source["to"]}</li>
                    </ul>
                </div>`;
}
sources = GetComponents("i");
for(let i=0;i<sources.length;i++){
    let source = sources[i];
    content.querySelector(".sources_container").innerHTML += `<div class="output_component">
                    <h5>${source["label"]} = ${source["value"]} ${source["unit"]}A</h5>
                    <ul>
                        <li>V = ${GetV(source["from"],source["to"])}V</li>
                        <li>P = ${GetPower(source["from"],source["to"],GetValue(source["value"],source["unit"]),"i")}W</li>
                        <li>Nodes: ${source["from"]} <i class="fa-solid fa-arrow-right"></i> ${source["to"]}</li>
                    </ul>
                </div>`;
}
let elements = GetComponents("r");
for(let i=0;i<elements.length;i++){
    let element = elements[i];
    content.querySelector(".elements_container").innerHTML += `<div class="output_component">
                    <h5>${element["label"]} = ${element["value"]} ${element["unit"]}Ω</h5>
                    <ul>
                        <li>V = ${GetV(element["from"],element["to"])}V</li>
                        <li>I = ${GetI(element["from"],element["to"],GetValue(element["value"],element["unit"]))}A</li>
                        <li>P = ${GetPower(element["from"],element["to"],GetValue(element["value"],element["unit"]),"r")}W</li>
                        <li>Nodes: ${element["from"]} <i class="fa-solid fa-arrow-right"></i> ${element["to"]}</li>
                    </ul>
                </div>`;
}

}
function ShowErrors(){
    if(analyze_errors.length == 0){
        content.innerHTML = `<div class="msg">No Errors Were Found</div>`;
        return;
    }
    content.innerHTML = `<h4>Errors</h4>
             <hr>
             <ul class="errors_container">
             </ul>`;
    for(let i=0;i<analyze_errors.length;i++){
        content.querySelector(".errors_container").innerHTML += `<li>${analyze_errors[i]}</li>`;
    }
}
function ShowSettings(){
    content.innerHTML = `<div class="msg">Settings feature hasn't been enabled yet!</div>`;
    return;
}
function ChooseSubMenu(submenu_class){
    ShowSideBar();
    sidebar.querySelectorAll('.submenu li').forEach(li => {
        li.classList.remove("active");
    });
    sidebar.querySelector(`.submenu .${submenu_class}`).classList.add("active");
    ShowSidebarContent();
}
function ShowSidebarContent(){
    sidebar.querySelectorAll('.submenu li').forEach(li => {
        if(li.classList.contains("active")){
            if(li.classList.contains("inputs")) PutInputs();
            if(li.classList.contains("outputs")) ShowOutputs();
            if(li.classList.contains("settings")) ShowSettings();
            if(li.classList.contains("errors")) ShowErrors();
        }
    });
}