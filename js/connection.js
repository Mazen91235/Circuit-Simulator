let ground_node;
let global_node_id = null;
function CreateWire(){
    try{
        if(!wire_comp || !wire_type) return;
        let comp = components[Number(wire_comp.getAttribute("comp_id"))];
        simulator.querySelectorAll(".temp_wire").forEach(wire => {
            wire.remove();
        });
        let row = GetPosition(event.clientX,event.clientY)[0];
        let column = GetPosition(event.clientX,event.clientY)[1];
        let comp_row = comp["row"];
        let comp_column = comp["column"];
        let diff_row = comp_row - row;
        let diff_column = comp_column - column;
        let rows = [row,comp_row];
        let columns = [column,comp_column];
        //
        window.scrollTo(scrolledX,scrolledY);
        //
        if(comp_column < column){
            diff_column *= -1;
            columns = columns.reverse();
        }
        if(comp_row < row){
            diff_row *= -1;
            rows = rows.reverse();
        }
        if(comp["orientation"] == "vertical"){
            if(!IsValidWire(comp,row,column)){
                CancelCreateWire();
                return;
            }
            for(let i=rows[0]+1;i<rows[1];i++){
                if(i == row) continue;
                if(simulator.querySelector(`.item-${i}-${column}`) || simulator.querySelector(`.wire-${i}-${column}`) || simulator.querySelector(`.node-${i}-${column}`)){
                    simulator.querySelectorAll(".temp_wire").forEach(wire => {wire.remove()});
                    break;
                }
                if(row <= 2 || i <= 2){
                    CancelCreateWire();
                    return;
                }
                simulator.innerHTML += `<div class="v_wire temp_wire" style="grid-area:${i} / ${column} / ${i} / ${column}" row="${i}" column="${column}"></div>`;
            }
            simulator.innerHTML += `<div class="node node_placeholder temp_wire" style="grid-area:${row} / ${column} / ${row} / ${column}">+</div>`;
        }else{
            if(!IsValidWire(comp,row,column)){
                CancelCreateWire();
                return;
            }
            for(let i=columns[0]+1;i<columns[1];i++){
                if(i == column) continue;
                if(simulator.querySelector(`.item-${row}-${i}`) || simulator.querySelector(`.wire-${row}-${i}`) || simulator.querySelector(`.node-${row}-${i}`)){
                    simulator.querySelectorAll(".temp_wire").forEach(wire => {wire.remove()});
                    break;
                }
                simulator.innerHTML += `<div class="h_wire temp_wire" style="grid-area:${row} / ${i} / ${row} / ${i}" row="${row}" column="${i}"></div>`;
            }
            simulator.innerHTML += `<div class="node node_placeholder temp_wire" style="grid-area:${row} / ${column} / ${row} / ${column}">+</div>`;
        }
        if(GetExistingElement(row,column) != null){
            simulator.querySelectorAll(".temp_wire").forEach(wire => {wire.remove()});
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log("2");
        // console.log(err);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function IsValidWire(comp,row,column){
    try{
        if(comp["orientation"] == "vertical"){
            if(comp["heading"] == "top" && wire_type == "from"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(row <= comp["row"]){
                        return false;
                    }
                }else{
                    if(row >= comp["row"]){
                        return false;
                    }
                }
            }else if(comp["heading"] == "top" && wire_type == "to"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(row >= comp["row"]){
                        return false;
                    }
                }else{
                    if(row <= comp["row"]){
                        return false;
                    }
                }
            }else if(comp["heading"] == "bottom" && wire_type == "from"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(row >= comp["row"]){
                        return false;
                    }
                }else{
                    if(row <= comp["row"]){
                        return false;
                    }
                }
            }else if(comp["heading"] == "bottom" && wire_type == "to"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(row <= comp["row"]){
                        return false;
                    }
                }else{
                    if(row >= comp["row"]){
                        return false;
                    }
                }
            }
            if(Math.abs(column - comp["column"]) > 0){
                return false;
            }
        }else{
            if(comp["heading"] == "right" && wire_type == "from"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(column >= comp["column"]){
                        return false;
                    }
                }else{
                    if(column <= comp["column"]){
                        return false;
                    }
                }
            }else if(comp["heading"] == "right" && wire_type == "to"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(column <= comp["column"]){
                        return false;
                    }
                }else{
                    if(column >= comp["column"]){
                        return false;
                    }
                }
            }else if(comp["heading"] == "left" && wire_type == "from"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(column <= comp["column"]){
                        return false;
                    }
                }else{
                    if(column >= comp["column"]){
                        return false;
                    }
                }
            }else if(comp["heading"] == "left" && wire_type == "to"){
                if(comp["type"] != "r" && comp["type"] != "c" && comp["type"] != "l"){
                    if(column >= comp["column"]){
                        return false;
                    }
                }else{
                    if(column <= comp["column"]){
                        return false;
                    }
                }
            }
            if(Math.abs(row - comp["row"]) > 0){
                return false;
            }
        }
        return true;
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log("1");
        // console.log(err);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function CancelCreateWire(){
    document.removeEventListener('mousemove', CreateWire);
    ResetEventListeners();
    simulator.querySelectorAll(".temp_wire").forEach(wire => {
        wire.remove();
    });
    wire_comp = null;
    wire_type = null;
}
function GetExistingElement(row,column){
    if(simulator.querySelector(`.item-${row}-${column}`) && !simulator.querySelector(`.node-${row}-${column}`)) return simulator.querySelector(`.item-${row}-${column}`);
    else if(simulator.querySelector(`.wire-${row}-${column}`)) return simulator.querySelector(`.wire-${row}-${column}`);
    else return null;
}
function HandleWire(){
    try{
        let id = Number(wire_comp.getAttribute("comp_id"));
        let comp = components[id];
        if(!simulator.querySelector(".temp_wire.node_placeholder")){
            CancelCreateWire();
            return;
        }
        let row = simulator.querySelector(".temp_wire.node_placeholder").style.gridArea.split(' / ')[0];
        let column = simulator.querySelector(".temp_wire.node_placeholder").style.gridArea.split(' / ')[1];
        if(comp["orientation"] == "vertical" && Math.abs(row - comp["row"]) < 2){
            CancelCreateWire();
            return;
        }else if(comp["orientation"] == "horizontal" && Math.abs(column - comp["column"]) < 2){
            CancelCreateWire();
            return;
        }
        let node = GetNode(row,column);
        let exist = true;
        if(!node){
            exist = false;
            node = CreateNode(row,column);
        }
        let node_id = nodes.indexOf(node);
        comp[wire_type.toString()] = node_id;
        simulator.querySelectorAll(".temp_wire").forEach(wire => {
            let wire_row = Number(wire.getAttribute("row"));
            let wire_column = Number(wire.getAttribute("column"));
            if(simulator.querySelector(`.item-${wire_row}-${wire_column}`) || simulator.querySelector(`.wire-${wire_row}-${wire_column}`) || simulator.querySelectorAll(`.node-${wire_row}-${wire_column}`).length > 1 || simulator.querySelectorAll(".temp_wire").length <= 1){
                CancelCreateWire();
                return;
            }
        });
        if(GetExistingElement(row,column) != null){
            CancelCreateWire();
            return;
        }
        simulator.querySelectorAll(".temp_wire").forEach(wire => {
            wire.classList.remove("temp_wire");
            if(wire.classList.contains("node")){
                if(!exist){
                    wire.classList.remove("node_placeholder");
                    wire.classList.add(`node-${row}-${column}`);
                    wire.classList.add(`node-id-${node_id}`);
                    wire.setAttribute("node",node_id);
                    wire.setAttribute("row",row);
                    wire.setAttribute("column",column);
                    ActivateNode(node_id);
                }else{
                    node["comps"].push(components.indexOf(comp));
                    wire.remove();
                }
                ResetEventListeners();
            }else{
                wire.classList.add(`wire-comp-${wire_type}-id-${comp["id"]}`);
                wire.classList.add(`wire-comp-id-${comp["id"]}`);
                wire.classList.add(`wire-node-id-${node_id}`);
                wire.classList.add(`wire-node-position-id-0`);
                wire.classList.add(`wire-${wire.getAttribute("row")}-${wire.getAttribute("column")}`);
                wire.setAttribute(wire_type.toString(),id);
                wire.setAttribute("node",node_id);
            }
        });
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(err);
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        analyzed = false;
        CancelCreateWire();
        PutSettings();
    }
}
function GetNode(row,column){
    try{
        let node = null;
        let id = Number(wire_comp.getAttribute("comp_id"));
        row = Number(row);
        column = Number(column);
        for(let i=0;i<nodes.length;i++){
            if(nodes[i]["positions"].some(position => position.row == row && position.column == column)) node = nodes[i];
        }
        if(node != null && node){
            if(node["node"].toString() == null || node["node"].toString() == "" || !simulator.querySelector(`.node-id-${nodes.indexOf(node)}`)){
                DeleteNode(nodes.indexOf(node));
                node = null;
            }
        };
        return node;
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
function CreateNode(row,column){
    try{
        row = Number(row);
        column = Number(column);
        let id = Number(wire_comp.getAttribute("comp_id"));
        let node = {"node":null,"comps":[id],"positions":[{row,column}]};
        nodes.push(node);
        analyzed = false;
        return node;
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
function DeactivateListener(elm,node_id){
    // if(!event.target.classList.contains("node")){
    //     DeactivateNode(global_node_id);
    // }
    if(elm && document.body.contains(elm)) DeactivateNode(node_id);
}
function ActivateNode(node_id){
    try{
        let node = simulator.querySelector(`.node-id-${node_id}`);
        if(!node) return;
        let value = nodes[Number(node.getAttribute("node"))]["node"];
        if(value == null){
            value = '';
        }
        node.innerHTML = `<input type="text" class="node_input" onfocusout="DeactivateListener(this,${node_id})">`;
        node.querySelector("input").addEventListener('keyup',() => {
            if(event.keyCode == 13){
                DeactivateNode(node_id);
            }
        });
        node.querySelector("input").focus();
        node.querySelector("input").value = value;
        global_node_id = node_id;
        // document.addEventListener('click',DeactivateListener);
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
function DeactivateNode(node_id){
    try{
        let node = simulator.querySelector(`.node-id-${node_id}`);
        if(!node || !node.querySelector("input")) return;
        node.querySelector("input").setAttribute("onfocusout",null);
        let value = node.querySelector("input").value;
        let node_value = JSON.parse(JSON.stringify(nodes[node_id]["node"]));
        if(value == null || value == "" || isNaN(Number(value))){
            value = nodes[node_id]["node"];
        }
        if(value == null || value == "") value = GetLastNode();
        value = Number(value);
        if (NodeExist(value) && value != node_value) {
            analyze_errors = [];
            analyze_errors.push(`Node ${value} already exists, copy it instead or use a new node`);
            ChooseSubMenu("errors");
            if(node_value != null){
                value = node_value; // Retain the original value
            }else{
                value = GetLastNode();
            }
        }

        node.innerHTML = `<h5>${value}</h5>`;
        nodes[node_id]["node"] = value;
        simulator.querySelectorAll(`.node-id-${node_id}`).forEach(node_elm => {
            node_elm.innerHTML = `<h5>${value}</h5>`;
        });
        analyzed = false;
    
        if(value == 0 && ground_node == null){
            SetGroundNode(node_id);
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        console.log(err);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        // document.removeEventListener('click',DeactivateListener);
        global_node_id = null;
        PutSettings();
    }
}
function SetNodesDraggable(){
    try{
        simulator.querySelectorAll(".node").forEach(node => {
            if(!node.classList.contains("copied_node")) SetDraggable(node);
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
function SetGroundNode(node_id){
    try{
        if(nodes[ground_node]){
            nodes[ground_node]["ground"] = false;
        }
        ground_node = node_id;
        let node = nodes[node_id];
        node["ground"] = true;
        node["V"] = 0;
        simulator.querySelectorAll(`.ground_node`).forEach(node_elm => {
            node_elm.classList.remove("ground_node");
        });
        simulator.querySelectorAll(`.node-id-${node_id}`).forEach(node_elm => {
            node_elm.classList.add("ground_node");
        });
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
    CloseContextMenu();
    }
}
function DisconnectCompFromNode(comp_id,node_id,type){
    try{
        let comp = components[comp_id];
        let node = nodes[node_id];
        if((comp_id != null && !comp) || !node) return;
        simulator.querySelectorAll(`.wire-comp-id-${comp_id}.wire-node-id-${node_id}`).forEach(wire => {
            if(!wire.classList.contains("wire-node-to-node")) wire.remove();
        });
        if(type == "node"){
            node["positions"] = node["positions"].slice(0,1);
            simulator.querySelectorAll(`.node-id-${node_id}.copied_node`).forEach(node => {node.remove();});
            simulator.querySelectorAll(`.wire-node-id-${node_id}`).forEach(wire => {
                wire.remove();
            });
        }
        if(comp){
            for(let i=0;i<node["comps"].length;i++) if(node["comps"][i] == comp_id) node["comps"].splice(i,1);
            if(comp["from"] == node_id) comp["from"] = null;
            else if(comp["to"] == node_id) comp["to"] = null;
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
    }finally{
        CloseContextMenu();
    }
}
function GetIndexOfPosition(node_id,row,column){
    try{
        let node = nodes[node_id];
        for(let i=0;i<node["positions"].length;i++){
            let position = node["positions"][i];
            if(position.row == row && position.column == column) return i;
        }
        return -1;
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
function CopyNode(node_id=NodeID,position_id=PositionID){
    try{ 
        CloseContextMenu();
        if(isNaN(node_id)){
            node_id = NodeID;
            position_id = PositionID;
        }
        let node = nodes[node_id];
        if(!node){
            // console.log(node,node_id);
            analyze_errors = [];
            analyze_errors.push("An Error Occurred, Error Code CN");
            ChooseSubMenu("errors");
            CancelCopyNode();
            return;
        }
        if(simulator.querySelector(`.node-id-${node_id}`) && simulator.querySelector(`.node-id-${node_id}`).querySelector("input")) DeactivateNode(node_id);
        let node_elm = simulator.querySelector(`.node-id-${node_id}`);
        let row = GetPosition(event.clientX,event.clientY)[0];
        let column = GetPosition(event.clientX,event.clientY)[1];
        let node_row = node["positions"][position_id].row;
        let node_column = node["positions"][position_id].column;
        let diff_row = node_row - row;
        let diff_column = node_column - column;
        let rows = [row,node_row];
        let columns = [column,node_column];
        if(node_column < column){
            diff_column *= -1;
            columns = columns.reverse();
        }
        if(node_row < row){
            diff_row *= -1;
            rows = rows.reverse();
        }
        NodeID = node_id;
        PositionID = position_id;
        document.addEventListener("mousemove",CopyNode);
        if(diff_column == 0 && diff_row > 0){
            simulator.querySelectorAll(".temp_wire_copy_node").forEach(wire => {wire.remove();});
            if(!(simulator.querySelector(`.item-${row}-${column}`) || simulator.querySelector(`.node-${row}-${column}`) || simulator.querySelector(`.wire-${row}-${column}`))){
                for(let i=rows[0]+1;i<rows[1];i++){
                    if(simulator.querySelector(`.item-${i}-${column}`) || simulator.querySelector(`.node-${i}-${column}`) || simulator.querySelector(`.wire-${i}-${column}`)){
                        simulator.querySelectorAll(".temp_wire_copy_node").forEach(wire => {wire.remove();});
                        break;
                    };
                    simulator.innerHTML += `<div class="v_wire temp_wire_copy_node" style="grid-area:${i} / ${column} / ${i} / ${column}" row="${i}" column="${column}"></div>`;
                }
            }
            simulator.innerHTML += `<div class="node node_placeholder temp_wire_copy_node" style="grid-area:${row} / ${column} / ${row} / ${column}" row="${row}" column="${column}">+</div>`;
        }else if(diff_column > 0){
            simulator.querySelectorAll(".temp_wire_copy_node").forEach(wire => {wire.remove();});
            if(!(simulator.querySelector(`.item-${node_row}-${column}`) || simulator.querySelector(`.node-${node_row}-${column}`) || simulator.querySelector(`.wire-${node_row}-${column}`))){
                for(let i=columns[0]+1;i<columns[1];i++){
                    if(simulator.querySelector(`.item-${node_row}-${i}`) || simulator.querySelector(`.node-${node_row}-${i}`) || simulator.querySelector(`.wire-${node_row}-${i}`)){
                        simulator.querySelectorAll(".temp_wire_copy_node").forEach(wire => {wire.remove();});
                        break;
                    };
                    simulator.innerHTML += `<div class="h_wire temp_wire_copy_node" style="grid-area:${node_row} / ${i} / ${node_row} / ${i}" row="${node_row}" column="${i}"></div>`;
                }  
            };
            simulator.innerHTML += `<div class="node node_placeholder temp_wire_copy_node" style="grid-area:${node_row} / ${column} / ${node_row} / ${column}" row="${node_row}" column="${column}">+</div>`;
        }
        document.addEventListener("click",HandleCopyNode);
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
function CancelCopyNode(){
    try{
        NodeID = null;
        PositionID = null;
        simulator.querySelectorAll(".temp_wire_copy_node").forEach(wire => {wire.remove()});
        document.removeEventListener("mousemove",CopyNode);
        document.removeEventListener("click",HandleCopyNode);
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        ResetEventListeners();
    }
}
function HandleCopyNode(){
    try{
        let node = nodes[NodeID];
        let row = Number(simulator.querySelector(".temp_wire_copy_node.node").getAttribute("row"));
        let column = Number(simulator.querySelector(".temp_wire_copy_node.node").getAttribute("column"));
        if(simulator.querySelector(`.item-${row}-${column}`) || simulator.querySelector(`.wire-${row}-${column}`) || simulator.querySelectorAll(`.node-${row}-${column}`).length > 1 || simulator.querySelectorAll(".temp_wire_copy_node").length <= 1){
            CancelCopyNode();
            return;
        }
        simulator.querySelectorAll(".temp_wire_copy_node").forEach(wire => {
            wire.classList.remove("temp_wire_copy_node");
    
            if(wire.classList.contains("node")){
                wire.classList.remove("node_placeholder");
                wire.classList.add(`node-${row}-${column}`);
                wire.classList.add(`node-id-${NodeID}`);
                wire.classList.add(`copied_node`);
                wire.setAttribute("node",NodeID);
                wire.setAttribute("row",row);
                wire.setAttribute("column",column);
                wire.innerHTML = `<h5>${node["node"]}</h5>`;
                if(NodeID == ground_node) wire.classList.add("ground_node");
                node["positions"].push({row,column});
            }else{
                wire.classList.add(`wire-node-id-${NodeID}`);
                wire.classList.add(`wire-node-to-node`);
                wire.classList.add(`wire-node-position-id-${node["positions"].length - 1}`);
                wire.classList.add(`wire-${wire.getAttribute("row")}-${wire.getAttribute("column")}`);
                wire.setAttribute("node",NodeID);  
            }
        });
        analyzed = false;
        document.removeEventListener("click",HandleCopyNode);
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        CancelCopyNode();
    }
}
function DeleteNode(node_id){
    try{
        node_id = Number(node_id);
        let node = nodes[node_id];
        for(let i=node["comps"].length - 1;i>=0;i--){
            let comp = components[node["comps"][i]];
            DisconnectCompFromNode(node["comps"][i],node_id,"node");
            if(comp["from"] != null && comp["from"] > node_id) comp["from"] -= 1;
            if(comp["to"] != null && comp["to"] > node_id) comp["to"] -= 1;
        }
        if(node["comps"].length == 0){
            DisconnectCompFromNode(null,node_id,"node");
        }
        simulator.querySelectorAll(`.node-id-${node_id}`).forEach(node => {node.remove()});
        analyzed = false;
        for(let i=node_id+1;i<nodes.length;i++){
                simulator.querySelectorAll(`.node-id-${i}`).forEach(node_elm => {
                    node_elm.classList.remove(`node-id-${i}`);
                    node_elm.classList.add(`node-id-${i-1}`);
                    if(node_elm.getAttribute("node")){
                        node_elm.setAttribute("node",Number(node_elm.getAttribute("node")) - 1);
                    }
                });
                simulator.querySelectorAll(`.wire-node-id-${i}`).forEach(wire => {
                    wire.classList.remove(`wire-node-id-${i}`);
                    wire.classList.add(`wire-node-id-${i-1}`);
                    if(wire.getAttribute("node")){
                        wire.setAttribute("node",Number(wire.getAttribute("node")) - 1);
                    }
                });
        }
        nodes.splice(node_id,1);
        if(ground_node == node_id) ground_node = null;
        else if(ground_node > node_id) ground_node -= 1;
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        CancelCopyNode();
        CloseContextMenu();
        ResetEventListeners();
        PutSettings();
    }
}
function NodeExist(node_number){
    try{
        for(let i=0;i<nodes.length;i++){
            let node = nodes[i];
            if(node["node"] == node_number) return true;
        }
        return false;
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
function GetLastNode(){
    try{
        if(nodes.length == 0 || (nodes.length == 1 && nodes[0]["node"] == null)) return 0;
        let max_node = 0;
        for(let i=0;i<nodes.length;i++){
            let node = nodes[i];
            if(node["node"] > max_node) max_node = node["node"];
        }
        return ++max_node;
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
function GetSortedNodes(){
    try{
        let all_nodes = JSON.parse(JSON.stringify(nodes));
        let sorted_nodes = [];
        let sorted_nums = [];
        for(let i=0;i<all_nodes.length;i++){
            if(!nodes[i] || !backup_current_nodes.some(node => {return (node.node == all_nodes[i]["node"])})) continue;
            sorted_nums.push(all_nodes[i]["node"]);
        }
        sorted_nums.sort();
        for(let i=0;i<sorted_nums.length;i++){
            sorted_nodes.push(all_nodes[GetNodeIndex(sorted_nums[i])]);
        }
        return sorted_nodes;
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