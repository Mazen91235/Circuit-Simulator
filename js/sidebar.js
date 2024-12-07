let sidebar = document.querySelector(".sidebar");
let content = sidebar.querySelector(".content");
let sidebar_opened = false;
function ShowSideBar(){
    sidebar.style.left = "0px";
    sidebar_opened = true;
}
function CloseSideBar(){
    sidebar.style.left = "-500px";
    if(document.querySelector(".sidebar .content .active")){
        document.querySelector(".sidebar .content .active").classList.remove("active");
    }
    sidebar_opened = false;
}
function ToggleEditComponent(id){
    try{
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
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
    
}
function ToggleSettingsComponent(c){
    try{
        let settings_data = document.querySelector(`.sidebar .content .settings-${c}`);
        if(!settings_data) return;    
        if(document.querySelector(".sidebar .content .active")){
            if(document.querySelector(".sidebar .content .active") != settings_data){
                document.querySelector(".sidebar .content .active").classList.remove("active");
                settings_data.classList.add("active");
                PutSettings();
            }else{
                document.querySelector(".sidebar .content .active").classList.remove("active");
            }
        }else{
            settings_data.classList.add("active");
            PutSettings();
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function ShowInputComponent(id){
    let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
    if(!elm) return;
    elm.classList.add("active");
}
function PutInputs(){
    try{
        let types = ['v','i','r','c','l'];
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
                if(comp["factor"] && comp["dependent_label"]){
                    label += ` = ${comp["factor"]}${comp["dependent_label"]}`;
                }
                if(comp["type"] == "v_d"){
                    content.innerHTML += `<div class="input_component data-comp-id-${components.indexOf(comp)}">
                        <div class="title" onclick="ToggleEditComponent(${components.indexOf(comp)})">
                            <h5>${label}</h5>
                            <i class="fa-solid fa-angle-down"></i> 
                        </div>
                        <div class="input_data">
                            <label>Type</label>    
                            <select name="Type" class="type">
                                <option value="">Type</option>
                                <option value="vcvs">Voltage Controlled Voltage Source (VCVS)</option>
                                <option value="ccvs">Current Controlled Voltage Source (CCVS)</option>
                            </select>
                            <label>Dependent On</label>    
                            <select name="Dependent_Component" class="dependent_component">
                                <option value="">Dependent On</option>
                            </select>
                        <div>
                                <div>
                                    <label>Factor</label>
                                    <input type="text" name="Factor" class="factor" placeholder="Factor">
                                </div>
                                <div>
                                    <label>Dependent Label</label>
                                    <input type="text" name="Dependent_Label" class="dependent_label" placeholder="Dependent Label (like Ix or Vx)">
                                </div>
                            </div>
                            <div>
                                <a href="#!" class="btn btn-secondary" onclick="CancelEditComponent(${components.indexOf(comp)})">Cancel</a>
                                <a href="#!" class="btn btn-primary" onclick="ApplyEditComponent(${components.indexOf(comp)})">Apply</a>
                            </div>
                            <a href="#!" class="btn btn-danger" onclick="DeleteComponent(${components.indexOf(comp)})">Delete Component</a>
                        </div>
                    </div>`;
                }else if(comp["type"] == "i_d"){
                    content.innerHTML += `<div class="input_component data-comp-id-${components.indexOf(comp)}">
                        <div class="title" onclick="ToggleEditComponent(${components.indexOf(comp)})">
                            <h5>${label}</h5>
                            <i class="fa-solid fa-angle-down"></i> 
                        </div>
                        <div class="input_data">
                            <label>Type</label>    
                            <select name="Type" class="type">
                                <option value="">Type</option>
                                <option value="vccs">Voltage Controlled Current Source (VCCS)</option>
                                <option value="cccs">Current Controlled Current Source (CCCS)</option>
                            </select>
                            <label>Dependent On</label>    
                            <select name="Dependent_Component" class="dependent_component">
                                <option value="">Dependent On</option>
                            </select>
                        <div>
                                <div>
                                    <label>Factor</label>
                                    <input type="text" name="Factor" class="factor" placeholder="Factor">
                                </div>
                                <div>
                                    <label>Dependent Label</label>
                                    <input type="text" name="Dependent_Label" class="dependent_label" placeholder="Dependent Label (like Ix or Vx)">
                                </div>
                            </div>
                            <div>
                                <a href="#!" class="btn btn-secondary" onclick="CancelEditComponent(${components.indexOf(comp)})">Cancel</a>
                                <a href="#!" class="btn btn-primary" onclick="ApplyEditComponent(${components.indexOf(comp)})">Apply</a>
                            </div>
                            <a href="#!" class="btn btn-danger" onclick="DeleteComponent(${components.indexOf(comp)})">Delete Component</a>
                        </div>
                    </div>`;
                }else if(comp["type"] == 'v' || comp["type"] == 'i'){
                    content.innerHTML += `<div class="input_component data-comp-id-${components.indexOf(comp)}">
                        <div class="title" onclick="ToggleEditComponent(${components.indexOf(comp)})">
                            <h5>${label}</h5>
                            <i class="fa-solid fa-angle-down"></i> 
                        </div>
                        <div class="input_data">
                        <div>
                            <div>
                            <label>Type</label>
                                <select name="Type" class="type" onchange="SetSourceType(${components.indexOf(comp)})">
                                    <option value="dc">DC</option>
                                    <option value="ac">AC</option>
                                </select>
                            </div>
                            <div>
                                <label>Phase</label>
                                <input type="text" name="Phase" class="phase" placeholder="Phase" value="${comp["phase"]}" disabled>
                            </div>
                        </div>
    
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
                    
                }else if(comp["type"] == 'r'){
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
                }else{
                    let text;
                    if(comp["type"] == 'c'){
                        text = "Capacitance (C)";
                    }else{
                        text = "Inductance (L)";
                    }
                    content.innerHTML += `<div class="input_component data-comp-id-${components.indexOf(comp)}">
                    <div class="title" onclick="ToggleEditComponent(${components.indexOf(comp)})">
                        <h5>${label}</h5>
                        <i class="fa-solid fa-angle-down"></i> 
                    </div>
                    <div class="input_data">
                    <label>Value Type</label>    
                    <select name="Value_Type" class="value_type" onchange="SetValueType(${components.indexOf(comp)},this)">
                        <option value="">Type</option>
                        <option value="${comp["type"]}">${text}</option>
                        <option value="z">Impedance (Z)</option>
                    </select>
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
                }
                label = `${types[i].toUpperCase()}${k+1}`;
                comp["label"] = label;
                setTimeout(() => {
                    PutValues(components.indexOf(comp));
                }, 100);
    
                let elm = simulator.querySelector(`.item-id-${components.indexOf(comp)}`);
                if(elm){
                    if(comp["type"] == "v_d"){
                        if(comp["factor"] && comp["dependent_label"]){
                            elm.innerHTML += `<div class="label">${comp["label"]} = ${comp["factor"]}${comp["dependent_label"]}</div>`;
                        }else{
                            elm.innerHTML += `<div class="label">${label}</div>`;
                        }
                    }else if(comp["type"] == "i_d"){
                        if(comp["factor"] && comp["dependent_label"]){
                            elm.innerHTML += `<div class="label">${comp["label"]} = ${comp["factor"]}${comp["dependent_label"]}</div>`;
                        }else{
                            elm.innerHTML += `<div class="label">${label}</div>`;
                        }
                    }else{
                        elm.innerHTML += `<div class="label">${label} = ${comp["value"]} ${comp["unit"]}${comp["measuring_unit"]}</div>`;
                    }
                    if(elm.querySelectorAll(".label").length > 1){
                        for(let i=0;i<elm.querySelectorAll(".label").length - 1;i++){
                            elm.querySelectorAll(".label")[i].remove();
                        }
                    }
                    AssignLabel(components.indexOf(comp),comp,comp["value"],comp["unit"]);
                }
            }
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function ShowOutputs(){
    try{   
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
    let sorted_nodes = GetSortedNodes();
    for(let i=0;i<sorted_nodes.length;i++){
        if(!content.querySelector(".nodes_container")) return;
        if(!backup_current_nodes.some(node => {return node.node == sorted_nodes[i].node})) continue;
        content.querySelector(".nodes_container").innerHTML += `<div class="output_component"><h5>Node ${sorted_nodes[i]["node"]} (${AssignUnit(sorted_nodes[i]["V"])}V)</h5></div>`;
    }
    let sources = GetComponents("v");
    for(let i=0;i<sources.length;i++){
        let source = sources[i];
        if(components.indexOf(source) == -1 || source["element_i_id"] != null || source["label"] == null || source["label"] == "") continue;
        let I = AssignUnit(source["I"]);
        console.log(source);
        if(!content.querySelector(".sources_container")) return;
        if(source["sub_type"] == null){
            if(source["source_type"] == "dc"){
                content.querySelector(".sources_container").innerHTML += `<div class="output_component">
                                <h5>${source["label"]} = ${source["value"]} ${source["unit"]}V</h5>
                                <ul>
                                    <li>I = ${I}A</li>
                                    <li>P = ${AssignUnit(math.multiply(source["I"].neg(),math.complex(GetValue(source["value"],source["unit"]),0)))}W</li>
                                    <li>Nodes: ${GetNodeFromIndex(source["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(source["to"])}</li>
                                </ul>
                            </div>`;
            }else{
                content.querySelector(".sources_container").innerHTML += `<div class="output_component">
                                <h5>${source["label"]} = ${source["value"]}∠${source["phase"]}° ${source["unit"]}V</h5>
                                <ul>
                                    <li>I = ${I}A</li>
                                    <li>P = ${AssignUnit(math.multiply(math.complex(0.5,0),(source["I"].neg()).conjugate(),GetComplexValue(source["value"],source["phase"],source["unit"])),"complex")}W</li>
                                    <li>Nodes: ${GetNodeFromIndex(source["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(source["to"])}</li>
                                </ul>
                            </div>`;
            }
        }else{
            content.querySelector(".sources_container").innerHTML += `<div class="output_component">
            <h5>${source["label"]} = ${GetV(source["to"],source["from"])}V</h5>
            <ul>
                <li>I = ${I}A</li>
                <li>P = ${GetDependentPower(components.indexOf(source))}W</li>
                <li>Nodes: ${GetNodeFromIndex(source["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(source["to"])}</li>
            </ul>
        </div>`;
        }
    }
    sources = GetComponents("i");
    for(let i=0;i<sources.length;i++){
        let source = JSON.parse(JSON.stringify(sources[i]));
        let id = Number(source["id"]);
        if(id == -1) continue;
        let v = GetV(source["from"],source["to"]);
        if(!content.querySelector(".sources_container")) return;
        if(source["sub_type"] == null){
        if(source["source_type"] == "dc"){
            content.querySelector(".sources_container").innerHTML += `<div class="output_component">
                            <h5>${source["label"]} = ${source["value"]} ${source["unit"]}A</h5>
                            <ul>
                                <li>V = ${v}V</li>
                                <li>P = ${GetPower(source["from"],source["to"],GetComplexValue(source["value"],0,source["unit"]),"i",id)}W</li>
                                <li>Nodes: ${GetNodeFromIndex(source["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(source["to"])}</li>
                            </ul>
                        </div>`;
        }else{
            content.querySelector(".sources_container").innerHTML += `<div class="output_component">
                            <h5>${source["label"]} = ${source["value"]}∠${source["phase"]}° ${source["unit"]}A</h5>
                            <ul>
                                <li>V = ${v}V</li>
                                <li>P = ${GetPower(source["from"],source["to"],GetComplexValue(source["value"],source["phase"],source["unit"]),"i",id)}W</li>
                                <li>Nodes: ${GetNodeFromIndex(source["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(source["to"])}</li>
                            </ul>
                        </div>`;
        }
        }else{
            content.querySelector(".sources_container").innerHTML += `<div class="output_component">
            <h5>${source["label"]} = ${GetDependentI(id)}A</h5>
            <ul>
                <li>V = ${v}V</li>
                <li>P = ${GetDependentPower(id)}W</li>
                <li>Nodes: ${GetNodeFromIndex(source["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(source["to"])}</li>
            </ul>
        </div>`;
        }
    }
    let elements = GetComponents("r").concat(GetComponents("c"),GetComponents("l"));
    for(let i=0;i<elements.length;i++){
        let element = JSON.parse(JSON.stringify(elements[i]));
        let id = Number(element["id"]);
        if(id == -1) continue;
        let v = GetV(element["from"],element["to"]);
        let I = GetI(element["from"],element["to"],GetZ(id),id);
        let power = GetPower(element["from"],element["to"],GetZ(id),"r",id);
        let power_real = GetRealPower(element["from"],element["to"],GetZ(id),"r",id);
        if(!content.querySelector(".elements_container")) return;
        content.querySelector(".elements_container").innerHTML += `<div class="output_component">
                        <h5>${element["label"]} = ${element["value"]} ${element["unit"]}${element["measuring_unit"]}</h5>
                        <ul>
                            <li>V = ${v}V</li>
                            <li>I = ${I}A</li>
                            <li>P = ${power}W</li>
                            <li>Nodes: ${GetNodeFromIndex(element["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(element["to"])}</li>
                        </ul>
                    </div>`;
    }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }

}
function ShowErrors(){
    try{
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
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function ShowSettings(){
    try{
        content.innerHTML = `<h4 class="frequency_heading">ω = ${frequency}</h4>
                <hr>
                <div class="frequency_component">
                    <label>Frequency</label>
                    <input type="text" class="frequency" placeholder="Frequency" value=${frequency}>
                    <div>
                        <a href="#!" class="btn btn-secondary" onclick="CancelUpdateFrequency()">Cancel</a>
                        <a href="#!" class="btn btn-primary" onclick="ApplyUpdateFrequency()">Apply</a>
                    </div>
                </div>
        <h4>Additional Analysis</h4>
        <hr>
        <div class="settings_component settings-Z">
            <div class="title" onclick="ToggleSettingsComponent('Z')">Equivalent Impedance <i class="fa-solid fa-angle-down"></i></div>
            <div class="data">
            </div>
            <div class="input_data">
                <div>
                    <label>From</label>
                    <select name="From_Node" class="from">
                        <option value="">From</option>
                    </select>
                </div>
                <div>
                    <label>To</label>
                    <select name="To_Node" class="to">
                        <option value="">To</option>
                    </select>
                </div>
            </div>
            <a href="#!" onclick="GetZeq()">Get Z<sub>eq</sub></a>
        </div>
        <div class="settings_component settings-TH">
            <div class="title" onclick="ToggleSettingsComponent('TH')">Thevenin Equivalent <i class="fa-solid fa-angle-down"></i></div>
            <div class="data">
            </div>
            <div class="input_data">
                <div>
                    <label>From</label>
                    <select name="From_Node" class="from">
                        <option value="">From</option>
                    </select>
                </div>
                <div>
                    <label>To</label>
                    <select name="To_Node" class="to">
                        <option value="">To</option>
                    </select>
                </div>
            </div>
            <a href="#!" onclick="GetTHeq()">Get Th<sub>eq</sub></a>
        </div>
        <div class="settings_component settings-N">
            <div class="title" onclick="ToggleSettingsComponent('N')">Norton Equivalent <i class="fa-solid fa-angle-down"></i></div>
            <div class="data">
            </div>
            <div class="input_data">
                <div>
                    <label>From</label>
                    <select name="From_Node" class="from">
                        <option value="">From</option>
                    </select>
                </div>
                <div>
                    <label>To</label>
                    <select name="To_Node" class="to">
                        <option value="">To</option>
                    </select>
                </div>
            </div>
            <a href="#!" onclick="GetNeq()">Get N<sub>eq</sub></a>
        </div>
        `;
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function PutSettings(){
    try{
        let nodes_sorted = [];
        for(let i=0;i<nodes.length;i++){
            nodes_sorted.push(Number(nodes[i]["node"]));
        }
        nodes_sorted.sort();
        if(!content.querySelector(`.settings-Z .from`) || !content.querySelector(`.settings-Z .to`) || !content.querySelector(`.settings-TH .from`) || !content.querySelector(`.settings-TH .to`)  || !content.querySelector(`.settings-N .from`) || !content.querySelector(`.settings-N .to`) ) return;
        content.querySelector(`.settings-Z .from`).innerHTML = '<option value="">From</option>';
        content.querySelector(`.settings-Z .to`).innerHTML = '<option value="">To</option>';
        content.querySelector(`.settings-TH .from`).innerHTML = '<option value="">From</option>';
        content.querySelector(`.settings-TH .to`).innerHTML = '<option value="">To</option>';
        content.querySelector(`.settings-N .from`).innerHTML = '<option value="">From</option>';
        content.querySelector(`.settings-N .to`).innerHTML = '<option value="">To</option>';
        for(let i=0;i<nodes_sorted.length;i++){
            content.querySelector(`.settings-Z .from`).innerHTML += `<option value="${GetNodeIndex(nodes_sorted[i])}">${nodes_sorted[i]}</option>`;
            content.querySelector(`.settings-Z .to`).innerHTML += `<option value="${GetNodeIndex(nodes_sorted[i])}">${nodes_sorted[i]}</option>`;
            content.querySelector(`.settings-TH .from`).innerHTML += `<option value="${GetNodeIndex(nodes_sorted[i])}">${nodes_sorted[i]}</option>`;
            content.querySelector(`.settings-TH .to`).innerHTML += `<option value="${GetNodeIndex(nodes_sorted[i])}">${nodes_sorted[i]}</option>`;
            content.querySelector(`.settings-N .from`).innerHTML += `<option value="${GetNodeIndex(nodes_sorted[i])}">${nodes_sorted[i]}</option>`;
            content.querySelector(`.settings-N .to`).innerHTML += `<option value="${GetNodeIndex(nodes_sorted[i])}">${nodes_sorted[i]}</option>`;
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function ChooseSubMenu(submenu_class){
    try{
        ShowSideBar();
        sidebar.querySelectorAll('.submenu li').forEach(li => {
            li.classList.remove("active");
        });
        sidebar.querySelector(`.submenu .${submenu_class}`).classList.add("active");
        ShowSidebarContent();
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function ShowSidebarContent(){
    try{
        sidebar.querySelectorAll('.submenu li').forEach(li => {
            if(li.classList.contains("active")){
                if(li.classList.contains("inputs")){
                    PutInputs();
                    analyzed = false;
                };
                if(li.classList.contains("outputs")) ShowOutputs();
                if(li.classList.contains("settings")){
                    ShowSettings();
                    analyzed = false;
                };
                if(li.classList.contains("errors")){
                    ShowErrors();
                    analyzed = false;
                };
            }
        });
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}

function SetSourceType(id){
    try{
        let source = components[id];
        if(!source) return;
        let types = ["dc","ac"];
        let type_elm = content.querySelector(`.data-comp-id-${id} .type`);
        if(!type_elm) return;
        if(!types.includes(type_elm.value)) return;
        if(type_elm.value == "ac"){
            content.querySelector(`.data-comp-id-${id} .phase`).value = source["phase"];
            content.querySelector(`.data-comp-id-${id} .phase`).disabled = false;
        }else{
            content.querySelector(`.data-comp-id-${id} .phase`).value = "";
            content.querySelector(`.data-comp-id-${id} .phase`).disabled = true;
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}