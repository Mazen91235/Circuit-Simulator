let analyzed = false;
let analyze_errors = [];
let main_nodes;

function ValidateCircuit(){
    analyze_errors = [];
    for(let i=0;i<components.length;i++){
        if(components[i]["from"] == null || components[i]["to"] == null){
            analyze_errors.push(`${components[i]["label"]} is not properly connected`);
        }else if(components[i]["from"] == components[i]["to"]){
            analyze_errors.push(`${components[i]["label"]} cannot be enclosed between same node`);
        }
        if(components[i]["value"] == 0 && components[i]["type"] == "r"){
            analyze_errors.push(`${components[i]["label"]} cannot be zero`);
        }
    }
    if(components.length == 0){
        analyze_errors.push("There are no elements to deal with. Add some first");
    }
    if(nodes.length == 0){
        analyze_errors.push("There are no nodes to deal with. Add some first");
    }
    for(let i=0;i<nodes.length;i++){
        if(nodes[i]["comps"].length == 0){
            analyze_errors.push(`Node ${nodes[i]["node"]} is not connected to any component. Connect it first`);
        }
    }
    if(!nodes[ground_node]){
        analyze_errors.push(`There's no ground node. Add a 0 node or assign a ground node`);
    }
    
    if(analyze_errors.length > 0){
        ChooseSubMenu("errors");
        return false;
    }
    return true;
}
function G(node1,node2){
    let g=0;
    if(node1 == node2){
        for(let i=0;i<nodes[node1]["comps"].length;i++){
            let comp = components[nodes[node1]["comps"][i]];
            if(comp["type"] == "r"){
                g += 1 / (GetValue(comp["value"],comp["unit"]));
            }
        }
    }else{
        let comps1 = nodes[node1]["comps"];
        let comps2 = nodes[node2]["comps"];
        let comps = [];
        for(let i = 0;i<comps1.length;i++){
            if(comps2.includes(comps1[i]) && !comps.includes(components[comps1[i]])) comps.push(components[comps1[i]]);
        }
        for(let i = 0;i<comps2.length;i++){
            if(comps1.includes(comps2[i]) && !comps.includes(components[comps2[i]])) comps.push(components[comps2[i]]);
        }
        for(let i=0;i<comps.length;i++){
            let comp = comps[i];
            if(comp["type"] == 'r'){
                g -= 1 / (GetValue(comp["value"],comp["unit"]));
            }
        }
    }
    return g;
}
function GetConnectedVoltage(node,source){
    if(source["to"] == node) return 1;
    else if(source["from"] == node) return -1;
    else return 0;
}
function GetSumSources(node_id,type){
    let node = nodes[node_id];
    let comps = [];
    let sum = 0;
    for(let i=0;i<node["comps"].length;i++){
        if(components[node["comps"][i]]["type"] == type) comps.push(components[node["comps"][i]]);
    }
    for(let i=0;i<comps.length;i++){
        if(comps[i]["to"] == node_id) sum += GetValue(comps[i]["value"],comps[i]["unit"]);
        else sum -= GetValue(comps[i]["value"],comps[i]["unit"]);
    }
    return sum;
}
function GetNodeIndex(node){
    for(let i=0;i<nodes.length;i++){
        if(nodes[i]["node"] == node) return i;
    }
}
function GetNodeFromIndex(node_id){
    return nodes[node_id]["node"];
}
function GetMainNodes(){
    main_nodes = JSON.parse(JSON.stringify(nodes));
    main_nodes.splice(ground_node,1);
    for(let i=0;i<main_nodes.length;i++){
        main_nodes[i]["id"] = GetNodeIndex(main_nodes[i]["node"]);
    }
}
function AnalyzeCircuit(){
    if(!ValidateCircuit()) return;
    let sources = GetComponents("v");
    GetMainNodes();
    let n = main_nodes.length;
    let m = sources.length;
    let matrix = math.matrix();
    matrix.resize([m+n,m+n]); 
    let matrix_IV = math.matrix();  
    matrix_IV.resize([n+m]);
    let matrix_values;
    for(let i=1;i<=m+n;i++){
        if(i <= n){
            for(j=1;j<=m+n;j++){
                if(j <= n){
                    matrix.subset(math.index(i-1, j-1), G(main_nodes[i-1]["id"],main_nodes[j-1]["id"])); 
                }else{
                    matrix.subset(math.index(i-1, j-1), GetConnectedVoltage(main_nodes[i-1]["id"],sources[j-n-1])); 
                }
            }
        }else{
            for(j=1;j<=m+n;j++){
                if(j <= n){
                    matrix.subset(math.index(i-1, j-1), GetConnectedVoltage(main_nodes[j-1]["id"],sources[i-n-1])); 
                }else{
                    matrix.subset(math.index(i-1, j-1), 0); 
                }
            }
        }
    }
    for(let i=1;i<=m+n;i++){
        if(i <= n){
            matrix_IV.subset(math.index(i-1), GetSumSources(main_nodes[i-1]["id"],"I")); 
        }else{
            matrix_IV.subset(math.index(i-1), GetValue(sources[i-n-1]["value"],sources[i-n-1]["unit"])); 
        }
    }

    try{
        matrix_values = math.lusolve(matrix,matrix_IV);
        AssignCalculatedValues(matrix_values,sources,n,m);
        analyzed = true;
        ChooseSubMenu("outputs");
        return true;
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        ChooseSubMenu("errors");
        return false;
    }
}
function AssignCalculatedValues(matrix,sources,n,m){
    for(let i=1;i<=n+m;i++){
        if(i <= n){
            nodes[main_nodes[i-1]["id"]]["V"] = matrix.subset(math.index(i-1,0)); 
        }else{
            sources[i-n-1]["I"] = matrix.subset(math.index(i-1,0)) * -1; 
        }
    }
}
function GetV(from,to){
    let v = nodes[from]["V"] - nodes[to]["V"];
    return AssignUnit(v);
}
function GetPower(from,to,value,type){
    let v = nodes[from]["V"] - nodes[to]["V"];
    let power;
    if(type == "i"){
        power = v * value;
    }else{
        power = v * v / value;
    }
    return AssignUnit(power);
}
function GetI(from,to,r){
    let v = nodes[from]["V"] - nodes[to]["V"];
    let i = v / r;
    return AssignUnit(i);
}