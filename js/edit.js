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
    try{
        // if(sidebar.querySelector(".errors.active")) return;
        ShowSideBar();
        ChooseSubMenu("inputs");
        SetDependent();
        ToggleEditComponent(id);
        ShowInputComponent(id);
        let sidebarOffset = $(sidebar).offset().top;
        let targetOffset = $(sidebar.querySelector(`.data-comp-id-${id}`)).offset().top;
        let scrollValue = targetOffset - sidebarOffset + $(sidebar).scrollTop();
        $(sidebar).animate({ scrollTop: scrollValue }, 500);    
        // sidebar.scrollTo(0,document.querySelector(`.sidebar .data-comp-id-${id}`).scrollHeight + document.querySelector(`.sidebar .data-comp-id-${id}`).clientHeight);
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
function SetUnits(id){
    try{
        let type = components[id]["type"];
        let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
        let comp = components[id];
        if(!comp) return;
        unit = elm.querySelector('.unit');
        if(!unit || !elm) return;
        if(type == 'r'){
            unit.innerHTML = `<option value="">Ω</option><option value="k">kΩ</option><option value="M">MΩ</option><option value="G">GΩ</option>`;
            unit.disabled = false;
        }else if(type == 'v'){
            unit.innerHTML = `<option value="μ">μV</option><option value="m">mV</option><option value="">V</option><option value="k">kV</option>`;
            unit.disabled = false;
        }else if(type == "i"){
            unit.innerHTML = `<option value="μ">μA</option><option value="m">mA</option><option value="">A</option>`;
            unit.disabled = false;
        }else{
            if(comp["value_type"] != "z"){
                unit.innerHTML = `<option value="p">p${comp["measuring_unit"]}</option><option value="n">n${comp["measuring_unit"]}</option><option value="μ">μ${comp["measuring_unit"]}</option><option value="m">m${comp["measuring_unit"]}</option><option value="">${comp["measuring_unit"]}</option>`;
            }else{
                unit.innerHTML = `<option value="m">mΩ</option><option value="">Ω</option><option value="k">kΩ</option><option value="M">MΩ</option><option value="G">GΩ</option>`;
            }
            unit.disabled = false;
            $(unit).val(comp["unit"]).trigger('change');
        }
        $(elm.querySelector(".type")).val('').trigger('change');
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
function SetValueType(id,elm=null){
    try{
        let units_arr_types = {"c": 'F','l': 'H','z': 'Ω'};
        let comp = components[id];
        if(!comp) return;
        if(elm && (elm.value == "" || elm.value == null)){
            if(content.querySelector(`.data-comp-id-${id} .unit`)){
                content.querySelector(`.data-comp-id-${id} .unit`).innerHTML = '';
                content.querySelector(`.data-comp-id-${id} .unit`).disabled = true;
                content.querySelector(`.data-comp-id-${id} .value`).value = "0";
                content.querySelector(`.data-comp-id-${id} .value`).disabled = true;
            }
            comp["value_type"] = null;
            comp["value"] = 0;
            comp["unit"] = '';
            AssignLabel(id,comp,comp["value"],comp["unit"]);
            return;
        }
        if(elm){
            let value = elm.value;
            if(value == comp["value_type"]) return;
            comp["value_type"] = value;
            comp["value"] = 0;
            comp["unit"] = '';
            comp["measuring_unit"] = units_arr_types[comp["value_type"]];
            if(!content.querySelector(`.data-comp-id-${id} .unit`)) return;
            content.querySelector(`.data-comp-id-${id} .unit`).disabled = false;
            content.querySelector(`.data-comp-id-${id} .value`).disabled = false;
            content.querySelector(`.data-comp-id-${id} .value`).value = "0";
            SetUnits(id);
            AssignLabel(id,comp,comp["value"],comp["unit"]);
        }else{
            if(!content.querySelector(`.data-comp-id-${id} .unit`)) return;
            content.querySelector(`.data-comp-id-${id} .unit`).disabled = false;
            content.querySelector(`.data-comp-id-${id} .value`).disabled = false;
            if(content.querySelector(`.data-comp-id-${id} .value_type`)){
                $(content.querySelector(`.data-comp-id-${id} .value_type`)).val(comp["value_type"]).trigger("change");
            }
            if(comp["value_type"] != null) SetUnits(id);
            AssignLabel(id,comp,comp["value"],comp["unit"]);
    
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
function PutValues(id){
    try{
        let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
        let comp = components[id];
        if(!elm) return;
        if(comp["type"] != "v_d" & comp["type"] != "i_d"){
            if(['c','l'].includes(comp["type"])){
                SetValueType(id);
            }else{
                SetUnits(id);
                $(elm.querySelector(".unit")).val(components[id]["unit"]).trigger("change");
            }
            if(elm.querySelector(".type")){
                $(elm.querySelector(".type")).val(components[id]["source_type"]).trigger("change");
            }
            elm.querySelector(".value").value = components[id]["value"];
        }else{
            SetDependent(id);
            if(comp["factor"]) elm.querySelector(".factor").value = comp["factor"];
            if(comp["dependent_label"]) elm.querySelector(".dependent_label").value = comp["dependent_label"];
            $(elm.querySelector(".type")).val(components[id]["sub_type"]).trigger("change");
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
function SetDependent(id){
    try{
        if(!id){
            let v_comps = GetComponents("v_d");
            let i_comps = GetComponents("i_d");
            let total_comps = v_comps.concat(i_comps);
            for(let k=0;k<total_comps.length;k++){
                let comp = total_comps[k];
                let elm = sidebar.querySelector(`.content .data-comp-id-${components.indexOf(comp)}`);
                if(!comp || (comp["type"] != "v_d" && comp["type"] != "i_d") || !elm || !elm.querySelector(".dependent_component")) return;
                let dependent_component_selector = elm.querySelector(".dependent_component");
                dependent_component_selector.innerHTML = `<option value="">Dependent On</option>`;
                let comps = GetComponents("r").concat(GetComponents("c")).concat(GetComponents("l"));
                for(let i=0;i<comps.length;i++){
                    dependent_component_selector.innerHTML += `<option value="${components.indexOf(comps[i])}">${comps[i]["label"]}</option>`;
                }
                if(comp["dependent_component"] != null){
                    $(dependent_component_selector).val(comp["dependent_component"].toString()).trigger("change");
                }
            }
        }else{
            let comp = components[id];
            let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
            if(!comp || (comp["type"] != "v_d" && comp["type"] != "i_d") || !elm.querySelector(".dependent_component")) return;
            let dependent_component_selector = elm.querySelector(".dependent_component");
            dependent_component_selector.innerHTML = `<option value="">Dependent On</option>`;
            let comps = GetComponents("r").concat(GetComponents("c")).concat(GetComponents("l"));
            for(let i=0;i<comps.length;i++){
                dependent_component_selector.innerHTML += `<option value="${components.indexOf(comps[i])}">${comps[i]["label"]}</option>`;
            }
            if(comp["dependent_component"] != null){
                $(dependent_component_selector).val(comp["dependent_component"].toString()).trigger("change");
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
function SetDependentComponent(id){
    try{
        let elm = sidebar.querySelector(`.data-comp-id-${id} .dependent_component`);
        let dependent_component = Number(elm.value);
        let comp = components[id];
        if(!components[dependent_component] || !comp) return
        if(comp["dependent_component"] != null && comp["dependent_component"] != dependent_component){
            if(components[comp["dependent_component"]]){
                let old_dependent_component = components[comp["dependent_component"]];
                old_dependent_component["dependent_on"] = null;
                old_dependent_component["dependent_on_type"] = null;
                if(simulator.querySelector(`.item-id-${components.indexOf(old_dependent_component)} .dependent_label`)) simulator.querySelector(`.item-id-${components.indexOf(old_dependent_component)} .dependent_label`).remove();
            }
        }
        comp["dependent_component"] = dependent_component; 
        components[dependent_component]["dependent_on"] = id;
        components[dependent_component]["dependent_on_type"] = comp["sub_type"];
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
function CancelEditComponent(id){
    PutValues(id);
}
function ApplyEditComponent(id){
    try{
        let elm = sidebar.querySelector(`.content .data-comp-id-${id}`);
        if(!elm) return;
        let comp = components[id];
        if(!comp) return;
        if(comp["type"] != "v_d" && comp["type"] != "i_d"){
            if(elm.querySelector(".type")){
                if(elm.querySelector(".type").value == "dc"){
                    comp["source_type"] = "dc";
                    comp["phase"] = "";
                }else{
                    if(elm.querySelector(".phase").value == null || elm.querySelector(".phase").value == ""){
                        analyze_errors = [];
                        analyze_errors.push("You can't set Phase for an AC component to empty");
                        ChooseSubMenu("errors");
                        CancelEditComponent(id);
                        return;
                    }
                    comp["source_type"] = "ac";
                    comp["phase"] = Number(elm.querySelector(".phase").value);
                }
            }
            if(!elm.querySelector(".value")){
                comp["value"] = 0;
                comp["unit"] = '';
                AssignLabel(id,comp,comp["value"],comp["unit"]);
                return;
            }
            if(['c','l'].includes(comp["type"]) && comp["value_type"] == 'z'){
                if(!CheckZ(elm.querySelector(".value").value)){
                    console.log(comp);
                    analyze_errors = [];
                    analyze_errors.push(`You can't set The Value for ${comp["label"]} to this value. it's causing a NaN.`);
                    ChooseSubMenu("errors");
                    CancelEditComponent(id);
                    return;
                }
                comp["value"] = elm.querySelector(".value").value;
            }else{
                if(math.isNaN(Number(elm.querySelector(".value").value))){
                    analyze_errors = [];
                    analyze_errors.push(`You can't set The Value for ${comp["label"]} to this value. it's causing a NaN.`);
                    ChooseSubMenu("errors");
                    CancelEditComponent(id);
                    return;
                }
                comp["value"] = Number(elm.querySelector(".value").value);
            }
            comp["unit"] = elm.querySelector(".unit").value;
            AssignLabel(id,comp,elm.querySelector(".value").value,elm.querySelector(".unit").value);
        }else{
            SetDependentComponent(id);
            SetDependent(id);
            comp["sub_type"] = elm.querySelector(".type").value;
            let old_factor = comp["factor"];
            if(!old_factor) old_factor = null;
            let old_dependent_component = comp["dependent_label"];
            if(!old_dependent_component) old_dependent_component = null;
            if(comp["dependent_component"] == null || comp["sub_type"] == null || comp["sub_type"] == "" || comp["dependent_source"] == ""){
                elm.querySelector(".factor").value = old_factor;
                elm.querySelector(".dependent_label").value = old_dependent_component;
                analyze_errors = [];
                analyze_errors.push("You must specify the type of dependent source and its dependent component");
                ChooseSubMenu("errors");
                return;
            };
            if(!(elm.querySelector(".factor").value != null && elm.querySelector(".factor").value != "" && Number(elm.querySelector(".factor").value != 0) && elm.querySelector(".dependent_label").value != null && elm.querySelector(".dependent_label").value != "")){
                elm.querySelector(".factor").value = old_factor;
                elm.querySelector(".dependent_label").value = old_dependent_component;
                analyze_errors = [];
                analyze_errors.push("You must specify the factor and dependent label to be able to show all data efficiently");
                ChooseSubMenu("errors");
                return;
            }
            comp["factor"] = Number(elm.querySelector(".factor").value);
            comp["dependent_label"] = elm.querySelector(".dependent_label").value;
            AssignLabel(id,comp,null,null);
    
        }
        analyzed = false;
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
function AssignLabel(id,comp,new_value,new_unit){
    try{
        if(!comp) return;
        if(comp["type"] != "v_d" && comp["type"] != "i_d"){
            let old_value = comp["value"];
            let old_unit = comp["unit"];
            new_value = Number(new_value).toString();
            let text = simulator.querySelector(`.item-id-${id} .label`).textContent.split('=')[0] + '= ';
            // let text = simulator.querySelector(`.item-id-${id} .label`).textContent.split('=')[1].replace(`${old_value} ${old_unit}`,`${new_value} ${new_unit}`);
            let new_text;
            if(['c','l'].includes(comp["type"]) && comp["value_type"] == null){
                simulator.querySelector(`.item-id-${id} .label`).textContent = `${comp["label"]}`;
                CheckDuplicateLabels();
                return;
            }
            if(comp["source_type"] != "ac"){
                let text2 = `${comp["value"]} ${comp["unit"]}`;
                new_text = text + text2;
            }else{
                let text2 = `${comp["value"]}∠${comp["phase"]}° ${comp["unit"]}`;
                new_text = text + text2;
            }
            simulator.querySelector(`.item-id-${id} .label`).textContent = new_text + `${comp["measuring_unit"]}`;
            CheckDuplicateLabels();
        }else{
            let comp = components[id];
            if(!comp) return;
            let label = `${comp["label"]}`;
            if(comp["factor"] != null && comp["dependent_label"] != null){
                label += ` = ${comp["factor"]}${comp["dependent_label"]}`
            }
            simulator.querySelector(`.item-id-${id} .label`).textContent = label;
            CheckDuplicateLabels();
            UpdateDependentLabel(id);
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
function UpdateDependentLabel(id){
    try{
        let comp = components[id];
        if(!comp || !(comp["factor"] != null && comp["dependent_component"] != null && comp["dependent_label"] != null && comp["sub_type"] != null)) return;
        let dependent_component = comp["dependent_component"];
        if(dependent_component == null) return;
        let dependent_component_elm = simulator.querySelector(`.item-id-${dependent_component}`);
        if(dependent_component_elm.querySelector(".dependent_label")){
            dependent_component_elm.querySelector(".dependent_label").remove();
        }
        if(comp["sub_type"][0] == 'v'){
            dependent_component_elm.innerHTML += `<div class="dependent_label">
                <span>+</span>
                <span>${comp["dependent_label"]}</span>
                <span>-</span>
        </div>`;
    }else{
            dependent_component_elm.innerHTML += `<div class="dependent_label">
            <div>
                <i class="fa-solid fa-down-long"></i>
                <span>${comp["dependent_label"]}</span>
            </div>
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
function CheckDuplicateLabels(id=null){
    try{
        if(id == null){
            simulator.querySelectorAll(".component").forEach(elm => {
                let labels = elm.querySelectorAll(".label");
                for(let i=1;i<labels.length;i++){
                    labels[i].remove();
                }
            });
        }else{
            let elm = simulator.querySelector(`.item-id-${id}`);
            if(!elm) return;
            let labels = elm.querySelectorAll(".label");
            for(let i=1;i<labels.length;i++){
                labels[i].remove();
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
function DeleteComponent(comp_id){
    try{
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
        for(let i=comp_id+1;i<components.length;i++){
            let elm = simulator.querySelector(`.item-id-${i}`);
            if(elm){
                elm.classList.remove(`item-id-${i}`);
                elm.classList.add(`item-id-${i-1}`);
                elm.setAttribute("comp_id",i-1);
                components[i]["id"] -= 1;
            }
            simulator.querySelectorAll(`.wire-comp-id-${i}`).forEach(wire => {
                wire.classList.remove(`wire-comp-id-${i}`);
                wire.classList.add(`wire-comp-id-${i-1}`);
                if(wire.getAttribute("from")){
                    wire.setAttribute("from",Number(wire.getAttribute("from")) - 1);
                    if(wire.classList.contains(`wire-comp-from-id-${i}`)){
                        wire.classList.remove(`wire-comp-from-id-${i}`);
                        wire.classList.add(`wire-comp-from-id-${i-1}`);
                    }
                }else if(wire.getAttribute("to")){
                    wire.setAttribute("to",Number(wire.getAttribute("to")) - 1);
                    if(wire.classList.contains(`wire-comp-to-id-${i}`)){
                        wire.classList.remove(`wire-comp-to-id-${i}`);
                        wire.classList.add(`wire-comp-to-id-${i-1}`);
                    }
                }
            });
            for(let j=0;j<nodes.length;j++){
                for(let k=0;k<nodes[j]["comps"].length;k++){
                    if(nodes[j]["comps"][k] == i) nodes[j]["comps"][k] -= 1;
                }
            }
        }
    
    
        if(comp["dependent_component"] != null){
            let dependent_component = components[comp["dependent_component"]];
            if(dependent_component){
                dependent_component["dependent_on"] = null;
                dependent_component["dependent_on_type"] = null;
                if(components.indexOf(dependent_component) > comp_id){
                    if(simulator.querySelector(`.item-id-${components.indexOf(dependent_component) - 1} .dependent_label`)) simulator.querySelector(`.item-id-${components.indexOf(dependent_component) - 1} .dependent_label`).remove();
                }else{
                    if(simulator.querySelector(`.item-id-${components.indexOf(dependent_component)} .dependent_label`)) simulator.querySelector(`.item-id-${components.indexOf(dependent_component)} .dependent_label`).remove();
                }
            }
        }else if(comp["dependent_on"] != null){
            let dependent_source = components[comp["dependent_on"]];
            if(dependent_source){
                dependent_source["dependent_component"] = null;
                dependent_source["dependent_label"] = null;
                dependent_source["factor"] = null;
                AssignLabel(components.indexOf(dependent_source),dependent_source);
            } 
        }
    
    
        components.splice(comp_id,1);
        analyzed = false;
        PutInputs();
        // ChooseSubMenu("inputs");
        CloseContextMenu();
        ResetEventListeners();
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