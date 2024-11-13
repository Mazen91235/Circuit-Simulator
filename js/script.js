let circuit = document.querySelector(".circuit_container");
let nodes = [{"V":0,"rows":[1,5,1],"columns":[5,5,1],"types":["p","p","p"]},{"V":10,"rows":[5],"columns":[1],"types":["p"]}];
let components = [{"type":"V","value":10,"unit":'',"from":0,"to":1,"orientation":"vertical","heading":"bottom","row":3,"column":1},{"type":"R","value":10,"unit":'',"from":1,"to":0,"orientation":"horizontal","heading":"left","row":5,"column":3}];
let default_components,default_nodes;
let last_row = 5;

function ShowForm(id){
    document.querySelector("."+id).style.display = "flex";

    if(document.querySelector("#"+id+" #from") || document.querySelector("#"+id+" #edit_from")){ // if add element form .. puts options
        form = document.querySelector("."+id);
        if(id == "add_element_form"){
            from_select = form.querySelector("#from");
            to_select = form.querySelector("#to");
        }else{
            from_select = form.querySelector("#edit_from");
            to_select = form.querySelector("#edit_to");
        }
        from_select.innerHTML = '<option value="">From</option>';
        to_select.innerHTML = '<option value="">To</option>';

        AddNodes(id,from_select,to_select);

    }
}
function AddNodes(id,from_select,to_select){
    for(i=0;i<nodes.length;i++){ // Add nodes to options
        from_select.innerHTML += '<option value="'+ i +'">'+ i +'</option>';
        to_select.innerHTML += '<option value="'+ i +'">'+ i +'</option>';
    }
    if(id == "add_element_form"){
        from_select.innerHTML += '<option value="'+ i +'">'+ i +' (New Node) </option>';
        to_select.innerHTML += '<option value="'+ i +'">'+ i +' (New Node) </option>';
    }
}
$(window).bind('load',function(){
    $("#starting_v_unit").val('').trigger("change");
    $("#starting_r_unit").val('').trigger("change");
});
function CloseForm(id){
    event.preventDefault();
    document.getElementById(id).reset();
    if(document.getElementById(id).querySelector("#delete_comp_btn")){
        document.getElementById(id).querySelector("#delete_comp_btn").style.display = "block"; 
    }
    document.getElementById(id).querySelector(".error").textContent = "";
    document.querySelector("."+id).style.display = "none";
}

function InitializeCircuit(form){
    event.preventDefault();
    V = form.querySelector("#v").value;
    V_Unit = form.querySelector("#starting_v_unit").value;
    R = form.querySelector("#r").value;
    R_Unit = form.querySelector("#starting_r_unit").value;
    if(V.length == 0 || R.length == 0){
        form.querySelector(".error").textContent = "Can't leave any empty field.";
        return;
    }
    if(R == 0){
        form.querySelector(".error").textContent = "Can't leave any R = 0";
        return;
    }
        components[0]["value"] = V;
        components[0]["unit"] = V_Unit;
        components[1]["value"] = R;
        components[1]["unit"] = R_Unit;
        CloseForm(form.id);
        BuildCircuit();
        default_components = JSON.parse(JSON.stringify(components));
        default_nodes = JSON.parse(JSON.stringify(nodes));
}

function GetLastColumn(){
    last_col = 0;
    for(i=0;i<nodes[0]["columns"].length;i++){
        if(nodes[0]["columns"][i] > last_col){
            last_col = nodes[0]["columns"][i];
        }
    }
    return last_col;
}

function GetLastNode(From,To){
    if(From == 0 || To == 0){
        if(From == 0){
            start=nodes[To]["columns"][0],end=nodes[From]["columns"][0];
            for(n=0;n<nodes[From]["columns"].length;n++){
                if(nodes[From]["columns"][n] > end){
                    end = nodes[From]["columns"][n];
                }
            }
            for(n=0;n<nodes[To]["columns"].length;n++){
                if(nodes[To]["columns"][n] < start){
                    start = nodes[To]["columns"][n];
                }
            }
        }else{
            start=nodes[From]["columns"][0],end=nodes[To]["columns"][0];
            for(n=0;n<nodes[To]["columns"].length;n++){
                if(nodes[To]["columns"][n] > end){
                    end = nodes[To]["columns"][n];
                }
            }
            for(n=0;n<nodes[From]["columns"].length;n++){
                if(nodes[From]["columns"][n] < start){
                    start = nodes[From]["columns"][n];
                }
            }
        }
    }else{
        if(From > To){
            start=nodes[To]["columns"][0],end=nodes[From]["columns"][0];
            for(n=0;n<nodes[From]["columns"].length;n++){
                if(nodes[From]["columns"][n] > end){
                    end = nodes[From]["columns"][n];
                }
            }
            for(n=0;n<nodes[To]["columns"].length;n++){
                if(nodes[To]["columns"][n] < start){
                    start = nodes[To]["columns"][n];
                }
            }
        }else{
            start=nodes[From]["columns"][0],end=nodes[To]["columns"][0];
            for(n=0;n<nodes[To]["columns"].length;n++){
                if(nodes[To]["columns"][n] > end){
                    end = nodes[To]["columns"][n];
                }
            }
            for(n=0;n<nodes[From]["columns"].length;n++){
                if(nodes[From]["columns"][n] < start){
                    start = nodes[From]["columns"][n];
                }
            }
        }
    }
    return [start,end];
}

function GetLastNodeZero(){
    node = nodes[0];
    last_node = [];
    for(i=0;i<node["rows"].length;i++){
        row = node["rows"][i];
        if(row >= last_row){
            last_node = [last_row , node["columns"][i]];
        }
    }
    return last_node;
}
function GetValue(v,u){
    let units = {'p':-12,'n':-9,'μ':-6,'m':-3,'':0,'k':3,'M':6,'G':9};
    let value = v * Math.pow(10,units[u]);
    return value;
}
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
    value = rnd(value);
    return value.toString() + ' ' + units_arr[unit];
}
function GetIndex(comp){
    for(let i=0;i<components.length;i++){
        if(components[i] == comp){
            return i;
        }
    }
    return -1;
}
function GetComp(row,column){
    let elm;
    for(let i=0;i<components.length;i++){
        if(components[i]["row"] == row && components[i]["column"] == column){
            elm = components[i];
        }
    }
    return elm;
}
function GetDiffNodes(elm,From=0,To=0){
    let elm_diff;
    if(From == 0 && To == 0){
        From = elm["from"];
        To = elm["to"];
    }
    if(From == 0){
        elm_diff = Math.abs(nodes.length - To);
    }else if(To == 0){
        elm_diff = Math.abs(From - nodes.length);
    }else{
        elm_diff = Math.abs(From - To);
    }
    return elm_diff
}
function GetNodes(From,To){
    let node_start,node_end;
    if(From == 0 || To == 0){
        if(From == 0){
            node_start = To;
            node_end = From;
        }else{
            node_start = From;
            node_end = To;
        }
    }else{
        if(From > To){
            node_start = To;
            node_end = From;
        }else{
            node_start = From;
            node_end = To;
        }
    }
    return [node_start,node_end];
}
function GetCompByPosition(row,column){
    let comp;
    for(let i=0;i<components.length;i++){
        if(components[i]["row"] == row && components[i]["column"] == column){
            comp = components[i];
        }
    }
    return comp;
}
function ResetCircuit(){
    components = JSON.parse(JSON.stringify(default_components));
    nodes = JSON.parse(JSON.stringify(default_nodes));
    BuildCircuit();
}