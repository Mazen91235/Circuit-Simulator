function DeleteComponent(elm_index){
    let comp = components[elm_index];
    if(comp["row"] > last_row){
        DeleteRowNode(comp["from"],comp["row"]);
        DeleteRowNode(comp["to"],comp["row"]);
        components.splice(elm_index,1);
        let comps_after = GetComponentsAfter(comp["row"]);
        ShiftDown(comps_after,-2);
        for(let i=0;i<comps_after.length;i++){
            GetElementsAround(comps_after[i]);
        }
    }else{
        components.splice(elm_index,1);
        let comps_between = GetComponentsBetweenNodes(comp["from"],comp["to"]);
        if(comps_between.length > 0){
            ShiftCompsToSeries(comps_between);
        }else{
            ShiftZeroes(-4);
            if(comp["from"] == 0){
                ShiftComps(comp["to"],comp["to"]-1);
            }else if(comp["to"] == 0){
                ShiftComps(comp["from"],comp["from"]-1);
        }else{
            if(comp["to"] > comp["from"]){
                ShiftComps(comp["to"],comp["to"]-1);
            }else{
                ShiftComps(comp["from"],comp["from"]-1);   
            }
        }


        }
}

    CheckAfterComps();

    // Close Circuit
    CloseForm('edit_element_form');
    BuildCircuit();
}
function GetComponentsAfter(row){
    let comps = [];
    for(let i = 1;i<components.length;i++){
        if(components[i]["row"] > row){
            comps.push(components[i]);
        }
    }
    return comps;
}
function DeleteRowNode(node_index,row){
    for(let i=0;i<nodes[node_index]["rows"].length;i++){
        if(nodes[node_index]["rows"][i] == row){
            nodes[node_index]["rows"].splice(i,1);
            nodes[node_index]["columns"].splice(i,1);
            nodes[node_index]["types"].splice(i,1);
            return;
        }
    }
}
function ShiftComps(node,To){
    let comps = GetComponentsConnectedToNode(node);
    for(let i=0;i<comps.length;i++){
        let comp = comps[i];
        // if(comp["column"] < nodes[node]["columns"][nodes[node]["columns"].length - 1]){
        //     continue;
        // }
        if(comp["from"] == node){
            if(comp["to"] == To){
                comp["from"] = 0;
            }else{
                comp["from"] = To;
            }
        }else{
            if(comp["from"] == To){
                comp["to"] = 0;
            }else{
                comp["to"] = To;
            }
        }
        if(To == 1){
            To = 0;
        }
        for(let i=0;i<nodes[node]["rows"].length;i++){
            let row = nodes[node]["rows"][i];
            if(row > last_row){
                nodes[To]["rows"].push(row);
                nodes[To]["columns"].push(nodes[To]["columns"][nodes[To]["columns"].length - 1]);
                nodes[To]["types"].push(nodes[node]["types"][i]);
                DeleteRowNode(node,row);
            }
        }
        let start = GetLastNode(comp["from"],comp["to"])[0];
        let end = GetLastNode(comp["from"],comp["to"])[1];
        comp["column"] = (start+end) / 2;
        let row = comp["row"];
        GetElementsAround(comp);
    }
    nodes.splice(node,1);

}
function ShiftCompsToSeries(comps){
    let row = comps[0]["row"];
    let column = comps[0]["column"];
    for(let i=1;i<comps.length;i++){
        if(comps[i]["row"] < row){
            row = comps[i]["row"];
        }
    }
    let comp = GetCompByPosition(row,column);
    DeleteRowNode(comp["from"],comp["row"]);
    DeleteRowNode(comp["to"],comp["row"]);
    comp["row"] -= 2;
}

function CheckAfterComps(row=last_row){
    let comps_after = GetComponentsAfter(row);
    ShiftDown(comps_after,-2);
    for(let i=0;i<comps_after.length;i++){
        GetElementsAround(comps_after[i]);
    }
}