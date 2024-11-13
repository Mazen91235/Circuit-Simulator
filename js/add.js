function SetUnits(elm,id){
    form = document.getElementById(id);
    let unit_id;
    if(form.querySelector("#unit")){
        unit_id = "#unit";
    }else{
        unit_id = "#edit_unit";
    }
    unit = form.querySelector(unit_id);
    if(elm.value == "type"){
        unit.innerHTML = "";
        unit.disabled = true;
        return;
    }
    if(elm.value == 'r'){
        unit.innerHTML = '<option value="">Ω</option><option value="k">kΩ</option><option value="M">MΩ</option><option value="G">GΩ</option>';
        unit.disabled = false;
    }else if(elm.value == 'v'){
        unit.innerHTML = '<option value="μ">μV</option><option value="m">mV</option><option value="">V</option><option value="k">kV</option>';
        unit.disabled = false;
    }else{
        unit.innerHTML = '<option value="μ">μA</option><option value="m">mA</option><option value="">A</option>';
        unit.disabled = false;
    }
    $("#"+id+" "+ unit_id).val('').trigger('change');
}
function ClearUnits(id){
    let form = document.getElementById(id);
    let unit = form.querySelector("#unit");
    if(unit){
        unit.innerHTML = '';
    }
}
function GetComponentsBetweenNodes(From,To){
    comps = [];
    for(i=1;i<components.length;i++){
        comp = components[i];
        if(comp["from"] == From && comp["to"] == To || comp["from"] == To && comp["to"] == From){
            comps.push(comp);
        }
    }
    return comps;
}

function GetComponentsConnectedToNode(num){
    comps = [];
    for(i=1;i<components.length;i++){
        comp = components[i];
        if(comp["from"] == num || comp["to"] == num){
            comps.push(comp);
        }
    }
    return comps;
}

function GetLastComp(From,To){
    comps = GetComponentsBetweenNodes(From,To);
    last_comp = {};
    row = last_row;
    for(i=0;i<comps.length;i++){
            comp = comps[i];
            if(comp["row"] >= row){
                row = comp["row"];
                last_comp = comp;
            }
    }
    return comp;
}

function ShiftElms(From,To,Target,num){
   comps = GetComponentsBetweenNodes(From,To);
   if(From < nodes.length && From != 0){
       for(k=0;k<nodes[To]["rows"].length;k++){ // To Move all 0 nodes to the end
           if(nodes[To]["rows"][k] > last_row){
               nodes[To]["columns"][k] = GetLastColumn();
           }
       }
        for(i=0;i<comps.length;i++){
            comp = comps[i];
            if(comp == components[0]){
                continue;
            }
            if(comp["row"] == last_row){
                if(comp["from"] == From){
                    comp["from"] = Target;
                }else{
                    comp["to"] = Target;
                }
                comp["column"] += num;
                continue;
            }
            start = GetLastNode(comp["from"],comp["to"])[0];
            end = GetLastNode(comp["from"],comp["to"])[1];
            comp["column"] = (start + end) / 2;
        }
   }else{
        if(From == 0){
            comps = GetComponentsConnectedToNode(0);
            for(i=0;i<comps.length;i++){
                comp = comps[i];
                if(comp == components[0]){ //Neglect First Element
                    continue;
                }
                if(comp["from"] == From){
                    comp["from"] = Target;
                    From_Zero = Target;
                    To_Zero = comp["to"];
                }else{
                    comp["to"] = Target;
                    To_Zero = Target;
                    From_Zero = comp["from"];
                }
                for(z=0;z<nodes[0]["rows"].length;z++){
                    if(nodes[0]["rows"][z] > last_row){
                        nodes[Target]["rows"].push(nodes[0]["rows"][z]);
                        nodes[Target]["columns"].push(nodes[0]["columns"][z]);
                        nodes[Target]["types"].push(nodes[0]["types"][z]);
                        nodes[0]["rows"].splice(z,1);
                        nodes[0]["columns"].splice(z,1);
                        nodes[0]["types"].splice(z,1);
                    }
                }
                start = GetLastNode(From_Zero,To_Zero)[0];
                end = GetLastNode(From_Zero,To_Zero)[1];
                comp["column"] = (start + end) / 2;            
            }
        }else{
            comps = GetComponentsConnectedToNode(0);
            for(i=0;i<comps.length;i++){
                comp = comps[i];
                if(comp == components[0]){ //Neglect First Element
                    continue;
                }
                if(comp["from"] == To){
                    comp["from"] = Target;
                    From_Zero = Target;
                    To_Zero = comp["to"];

                }else{
                    comp["to"] = Target;
                    From_Zero = comp["from"];
                    To_Zero = Target;
                }
                for(z=0;z<nodes[0]["rows"].length;z++){
                    if(nodes[0]["rows"][z] > last_row){
                        nodes[Target]["rows"].push(nodes[0]["rows"][z]);
                        nodes[Target]["columns"].push(nodes[0]["columns"][z]);
                        nodes[Target]["types"].push(nodes[0]["types"][z]);
                        nodes[0]["rows"].splice(z,1);
                        nodes[0]["columns"].splice(z,1);
                        nodes[0]["types"].splice(z,1);
                    }
                }
                start = GetLastNode(From_Zero,To_Zero)[0];
                end = GetLastNode(From_Zero,To_Zero)[1];
                comp["column"] = (start + end) / 2;
            }
        }
   }


   for(i=1;i<components.length;i++){
    comp = components[i];
    if(comp["row"] > last_row){
        start = GetLastNode(comp["from"],comp["to"])[0];
        end = GetLastNode(comp["from"],comp["to"])[1];
        comp["column"] = (start + end) / 2; 
    }
   }

}
function ShiftLastZeroes(num){
    last_col = GetLastColumn();
    for(i=0;i<nodes[0]["columns"].length;i++){
        if(nodes[0]["columns"][i] == last_col && nodes[0]["rows"][i] <= last_row){
            nodes[0]["columns"][i] += num;
        }
    }
}
function ShiftZeroes(num){
    last_col = GetLastColumn();
    for(i=0;i<nodes[0]["columns"].length;i++){
        if(nodes[0]["columns"][i] == last_col){
            nodes[0]["columns"][i] += num;
        }
    }
}
function GetElementsAround(elm){
    comps = [];
    for(i=1;i<components.length;i++){
        comp = components[i];
        if(comp["row"] == elm["row"] && comp != elm){
            node_from = nodes[comp["from"]];
            node_to = nodes[comp["to"]];
    
            for(k=0;k<node_from["rows"].length;k++){
                if(node_from["rows"][k] == comp["row"]){
                    col_from = node_from["columns"][k];
                }
            }
            for(k=0;k<node_to["rows"].length;k++){
                if(node_to["rows"][k] == comp["row"]){
                    col_to = node_to["columns"][k];
                }
            }
            if(elm["column"] >= col_from && elm["column"] <= col_to || elm["column"] >= col_to && elm["column"] <= col_from){
                if(GetDiffNodes(elm) > GetDiffNodes(comp)){
                    comps = [elm];
                    break;
                }
                comps.push(comp);
            }
        }
    }
    if(comps.length > 0){
        return ShiftDown(comps,2);
    }else{
        return;
    }
}
function ShiftDown(comps,num){
    for(i=0;i<comps.length;i++){
        comp = comps[i];
        node_from = nodes[comp["from"]];
        node_to = nodes[comp["to"]];
        used=[];
        for(k=0;k<node_from["rows"].length;k++){
            if(node_from["rows"][k] == comp["row"] && !used.includes(node_from["rows"][k])){
                used.push(node_from["rows"][k]);
                node_from["rows"][k] += num;
            }
        }
        used=[];
        for(k=0;k<node_to["rows"].length;k++){
            if(node_to["rows"][k] == comp["row"] && !used.includes(node_to["rows"][k])){
                used.push(node_to["rows"][k]);
                node_to["rows"][k] += num;
            }
        }
        comp["row"] += num;
    }
    for(i=0;i<comps.length;i++){
        GetElementsAround(comp);
    }

}

function ValidateAddElement(Type,Value,From,To){
    if(Type == "type"){
        form.querySelector(".error").textContent = "Type cannot be empty";
        return 0;
    }
    if(Value.length == 0){
        form.querySelector(".error").textContent = "Value cannot be empty";
        return 0;
    }
    if(Value == 0 && Type.toUpperCase() == 'R'){
        form.querySelector(".error").textContent = "Can't leave any R = 0";
        return 0;
    }
    if(From.length == 0 || To.length == 0){
        form.querySelector(".error").textContent = "Nodes cannot be empty";
        return 0;
    }
    if(From == To){
        form.querySelector(".error").textContent = "Cannot Make Element Start and End at same node";
        return 0;
    }
    From = parseInt(From);
    To = parseInt(To);
    if(!nodes[From] && !nodes[To]){
        form.querySelector(".error").textContent = "Cannot Create 2 nodes in a single addition";
        return 0;
    }
    if(To > nodes.length || From > nodes.length){
        form.querySelector(".error").textContent = "Error! Add element with only 1 new node";
        return;
    }
    let diff = GetDiffNodes({},From,To)
    if(diff > 1 && (nodes[From] | nodes[To])){
        form.querySelector(".error").textContent = "Error! Add Series Element with only 1 new node";
        return;
    }
    return 1;
}

function GetOrientation_Heading(Type,From,To,comp={}){
    let orientation;
    let heading;
    Type = Type.toUpperCase();
    if(comp == components[0]){
        orientation = "vertical";
        if(To == 0){
            heading = "top";
        }else{
            heading = "bottom";
        }
    }
    else
    {
    if(To > From){
        if(From == 0){
                heading = "left";
        }else{
                heading = "right";
        }
    }else{
        if(To == 0){
                heading = "right";
        }else{
                heading = "left";
        }
    }
}
if(Type == "R"){ //Resistance is directed towards from (opposite to other elements)
    if(heading == "right"){
        heading = "left";
    }else if(heading == "top"){
        heading = "bottom";
    }else if(heading == "bottom"){
        heading = "top";
    }else{
        heading = "right";
    }
} 
    return [orientation,heading];
}

function CreateParallelElement(Type,Value,Unit,From,To){
    let orientation = GetOrientation_Heading(Type,From,To)[0]; //Get Orientation & Heading of Component
    heading = GetOrientation_Heading(Type,From,To)[1]; //Get Orientation & Heading of Component
    start = GetLastNode(From,To)[0];
    end = GetLastNode(From,To)[1];
    let last_comp = GetLastComp(From,To);
    let Row,Column;
    Row = last_comp["row"] + 2;
    Column = (start + end) / 2;

    new_elm = {"type":Type.toUpperCase(),"value":Value,"unit":Unit,"from":From,"to":To,"orientation":orientation,"heading":heading,"row":Row,"column":Column};
    let temp_components = JSON.parse(JSON.stringify(components));
    temp_components.push(new_elm);
    if(!ValidateCircuit(temp_components,nodes)){
        return;
    }
    components.push(new_elm);
    return CreateParallelNodes(orientation,From,To,Row,Column);
}

function CreateParallelNodes(orientation,From,To,Row,Column){
    node_from = nodes[From];
    node_to = nodes[To];
    if(orientation == "vertical"){
        node_from["columns"].push(Column);
        node_to["columns"].push(Column);
        if(From == 0){
            node_from["rows"].push(1);
            node_to["rows"].push(last_row);
        }else{
            node_from["rows"].push(last_row);
            node_to["rows"].push(1);
        }
    }else{
        node_from["rows"].push(Row);
        node_to["rows"].push(Row);
        if(From == 0){
            last_zero_pos = GetLastColumn();
            start = GetLastNode(From,To)[0];
            end = GetLastNode(From,To)[1];
            node_from["columns"].push(last_zero_pos);
            node_to["columns"].push(start);
        }else if(To == 0){
            last_zero_pos = GetLastColumn();
            start = GetLastNode(From,To)[0];
            end = GetLastNode(From,To)[1];
            node_to["columns"].push(last_zero_pos);
            node_from["columns"].push(start);
        }else{
            start = GetLastNode(From,To)[0];
            end = GetLastNode(From,To)[1];
            if(From > To){
                node_from["columns"].push(end);
                node_to["columns"].push(start);
            }else{
                node_from["columns"].push(start);
                node_to["columns"].push(end);
            }
        }
    }
    node_from["types"].push("s");
    node_to["types"].push("s");

    //Checks for larger parallel
    GetElementsAround(new_elm);
}

function CreateSeriesElement(Type,Value,Unit,From,To){
    new_node = {"V":0,"rows":[],"columns":[],"types":["p"]};
    heading = GetOrientation_Heading(Type,From,To)[1];
    let temp_nodes = nodes;
    if(From == 0){
        last_column = GetLastColumn();
        new_node["rows"].push(last_row);
        new_node["columns"].push(last_column);
        column = last_column + 2;
        nodes.push(new_node);
        ShiftElms(0,To-1,To,4);
        ShiftLastZeroes(4);
    }else if(To == 0){
        last_column = GetLastColumn();
        new_node["rows"].push(last_row);
        new_node["columns"].push(last_column);
        column = last_column + 2;
        nodes.push(new_node);
        ShiftElms(0,From-1,From,4);
        ShiftLastZeroes(4);
    }else if(nodes[To]){
        start = GetLastNode(0,To)[0];
        end = GetLastNode(0,To)[1];
        new_node["rows"].push(last_row);
        new_node["columns"].push(end);
        column = end - 2;
        nodes.push(new_node);
        ShiftLastZeroes(4);
        ShiftElms(To,0,From,4);
    }else{
        start = GetLastNode(From,0)[0];
        end = GetLastNode(From,0)[1];
        new_node["rows"].push(last_row);
        new_node["columns"].push(end);
        column = end - 2;
        nodes.push(new_node);
        ShiftLastZeroes(4);
        ShiftElms(From,0,To,4);
    }
    new_elm = {"type":Type.toUpperCase(),"value":Value,"unit":Unit,"from":From,"to":To,"orientation":"horizontal","heading":heading,"row":last_row,"column":column};
    let temp_components = JSON.parse(JSON.stringify(components));
    temp_components.push(new_elm);
    if(!ValidateCircuit(temp_components,nodes)){
        nodes = temp_nodes;
        return;
    }
    components.push(new_elm);
}

function AddElement(form){
    event.preventDefault();
    Type = form.querySelector("#type").value;
    Value = form.querySelector("#value").value;
    Unit = form.querySelector("#unit").value;
    From = form.querySelector("#from").value;
    To = form.querySelector("#to").value;
    //Validate Form
    if(!ValidateAddElement(Type,Value,From,To)){
        return;
    }
    From = parseInt(From);
    To = parseInt(To);

    if(nodes[From] && nodes[To]){
            CreateParallelElement(Type,Value,Unit,From,To);
    }else{
            CreateSeriesElement(Type,Value,Unit,From,To);
    }

    // Update Circuit
    ClearUnits(form.id);
    CloseForm(form.id);
    BuildCircuit();
}