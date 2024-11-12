function BuildCircuit(){
    // Analyze Circuit
    AnalyzeCircuit();
    
    //Center Elements
    CenterElements();

    // Clear Circuit HTML
    circuit.innerHTML = '';

    // Put Nodes on grid
    PutNodes();

    // Put Components on grid
    PutComponents();

        for(i=0;i<components.length;i++){
        comp = components[i];
        node_from = nodes[comp["from"]];
        node_to = nodes[comp["to"]];

        ConnectNodesComponents(comp,node_from);
        ConnectNodesComponents(comp,node_to);
    }
    ConnectNodes();

    // Create Netlist
    CreateNetlist();

}
function CenterElements(){
    for(let i=1;i<components.length;i++){
        let comp = components[i];
        let start = GetLastNode(comp["from"],comp["to"])[0];
        let end = GetLastNode(comp["from"],comp["to"])[1];
        comp["column"] = (start+end) / 2;
    }
}
function G(n1,n2){
    sum = 0;
    if(n1==n2){
        for(i=1;i<components.length;i++){
            comp = components[i];
            if(comp["type"] != "R"){
                continue;
            }
            if(comp["from"] == n1 || comp["to"] == n1){
                sum += 1 / GetValue(comp["value"],comp["unit"]);
            }
        }
    }else{
        for(i=1;i<components.length;i++){
            comp = components[i];
            if(comp["type"] != "R"){
                continue;
            }
            if(comp["from"] == n1 && comp["to"] == n2 || comp["to"] == n1 && comp["from"] == n2){
                sum += 1 / GetValue(comp["value"],comp["unit"]);
            }
        }
        if(sum != 0){
            sum *= -1;
        }
    }
    return sum;

}
function GetV(n1,n2){
    return [nodes[n1]["V"] - nodes[n2]["V"],AssignUnit(nodes[n1]["V"] - nodes[n2]["V"])];
}
function GetI(n1,n2,R,u){
    return [((nodes[n1]["V"] - nodes[n2]["V"]) / GetValue(R,u)),AssignUnit(((nodes[n1]["V"] - nodes[n2]["V"]) / GetValue(R,u)))];
}
function GetElements(x){
    elements = [];
    for(i=0;i<components.length;i++){
        comp = components[i];
        if(comp["type"] == x){
            elements.push(comp);
        }
    }

    return elements;
}
function GetSumSources(x,n){
    sum = 0;
    for(i=0;i<components.length;i++){
        comp = components[i];
        if(comp["type"] != x){
            continue;
        }
        comp["value"] = Number(comp["value"]);
        if(comp["to"] == n){
            sum += GetValue(comp["value"],comp["unit"]);
        }else if(comp["from"] == n){
            sum -= GetValue(comp["value"],comp["unit"]);
        }
    }

    return sum;
}
function GetConnectedVoltage(n,m){
    if(m["to"] == n){
        return 1;
    }else if(m["from"] == n){
        return -1;
    }else{
        return 0;
    }
}
function AnalyzeCircuit(){
    // for V => comp["I"] = ...;
    // for I => comp["V"] = ...;
    // for R => comp["V"] = ... , comp["I"] = ...;
    sources = GetElements('V');
    n_nodes = nodes.slice(1);
    n = n_nodes.length;
    m = sources.length;
    // matrix = Array.from({ length: n + m }, () => Array(n + m).fill(0));
    // matrix_IV = Array(n + m).fill(0);  // Ensure matrix_IV has n + m elements
    matrix = math.matrix();
    matrix.resize([n+m,n+m]);
    matrix_IV = math.matrix();  // Ensure matrix_IV has n + m elements
    matrix_IV.resize([n+m]);
    for(let i=1;i<=n+m;i++){
        if(i <= n){
            for(let j=1;j<=n+m;j++){
                if(j<=n){
                   matrix.subset(math.index(i-1, j-1), G(i,j)); 
                }else{
                    matrix.subset(math.index(i-1, j-1), GetConnectedVoltage(i,sources[j-nodes.length])); 
                    ;
                }
            }
        }else{
            for(let j=1;j<=n+m;j++){
                if(j<=n){
                   matrix.subset(math.index(i-1, j-1), GetConnectedVoltage(j,sources[i-nodes.length])); 
                }else{
                   matrix.subset(math.index(i-1, j-1), 0); 
                }
            } 
        }
    }
    for(let i=1;i<=n+m;i++){
        if(i<=n){
            matrix_IV.subset(math.index(i-1), GetSumSources("I",i)); 
        }else{
            matrix_IV.subset(math.index(i-1), GetValue(sources[i - nodes.length]["value"],sources[i - nodes.length]["unit"])); 
        }
    }
    try{
        matrix_values = math.lusolve(matrix,matrix_IV);
        AssignCalculatedCircuit(matrix_values,n,m);
        return 1;
    }catch(err){
        console.log(err);
        return 0;
    }
    // console.log(matrix[0][0]);
    // console.log(matrix[0][1]);
    // console.log(matrix[1][0]);
    // console.log(matrix[1][1]);


}
function GetPower(comp){
    let V,I,P;
    V = nodes[comp["from"]]['V'] - nodes[comp["to"]]['V'];
    if(comp["type"] == 'R'){
        I = V / GetValue(comp["value"],comp["unit"]);
        P = V * I;
    }else if(comp["type"] == 'V'){
        P = GetValue(comp["value"],comp["unit"]) * comp['I'];
    }else{
        P = GetValue(comp["value"],comp["unit"]) * V; 
    }
        return [P,AssignUnit(P)];
}
function AssignCalculatedCircuit(matrix,n,m){
    for(let i=1;i<=n+m;i++){
        if(i<=n){
            nodes[i]["V"] = matrix.subset(math.index(i-1,0));
        }else{
            for(let j=0;j<components.length;j++){
                if(components[j]["type"] == 'V'){
                    components[j]["I"] = matrix.subset(math.index(i-1,0))*-1;
                    i++;
                }
            }
        }
    }
}
function rnd(x){
    x = Number(x);
    return Number(x.toFixed(3));
}

function ValidateCircuit(comps,n){
    let current_components = components;
    let current_nodes = nodes;
    let valid = true;
    components = comps;
    nodes = n;
    if(AnalyzeCircuit() == 0){
        if(document.querySelector(".add_element_form").style.display == "flex"){
            let form = document.querySelector(".add_element_form");
            form.querySelector(".error").textContent = "Please enter valid data for the circuit to be solvable";
        }else if(document.querySelector(".edit_element_form").style.display == "flex"){
            let form = document.querySelector(".edit_element_form");
            form.querySelector(".error").textContent = "Please enter valid data for the circuit to be solvable";
        }else{
            console.log("Please enter valid data for the circuit to be solvable");
        }
        valid = false;
    }
    components = current_components;
    nodes = current_nodes;
    if(valid){
        return true;
    }else{
        return false;
    }
}

//Build Functions
function PutNodes(){
    for(i=0;i<nodes.length;i++){
        node = nodes[i];
        for(j=0;j<node["rows"].length;j++){
            circuit.innerHTML += '<div class="node node-'+ i +'" style="grid-area: '+ node["rows"][j] +' / '+ node["columns"][j] +' / '+ node["rows"][j] +' / '+ node["columns"][j] +';"><h4>'+ i +'</h4></div>';    
        }
    }
}
function PutComponents(){
    for(i=0;i<components.length;i++){
        comp = components[i];
        if(comp["type"] == "R"){
            circuit.innerHTML += '<div class="resistance component flip-'+ comp["heading"] +' r-'+ comp["from"] +'-'+ comp["to"] +'-'+ comp["row"] +'-'+ comp["column"] +'" style="grid-area: '+ comp["row"] +' / '+ comp["column"] +' / '+ comp["row"] +' / '+ comp["column"] +';" nodes="'+ comp["from"] +' '+ comp["to"] +'" type="'+ comp["type"] +'" value="'+ comp["value"] +'" onclick="ShowEdit('+ GetIndex(comp) +');"> <h4>+</h4> <h4>/\\/\\/\\/\\</h4> <h4>-</h4> <div class="data"> <h4>R = <span class="inner_r">'+ rnd(comp["value"]) +' '+ comp["unit"] +'</span>Ω</h4> <h4>I = <span class="inner_current">'+ GetI(comp["from"],comp["to"],comp["value"],comp["unit"])[1] +'</span>A</h4> <h4>V = <span class="inner_voltage">'+ GetV(comp["from"],comp["to"])[1] +'</span>V</h4><h4>P = <span class="inner_power">'+ GetPower(comp)[1] +'</span>W</h4> <h4>From <span class="from_node">'+ comp["from"] +'</span> To <span class="to_node">'+ comp["to"] +'</span></h4> </div> </div>';
        }else if(comp["type"] == "V"){
            circuit.innerHTML += '<div class="voltage component flip-'+ comp["heading"] +' v-'+ comp["from"] +'-'+ comp["to"] +'-'+ comp["row"] +'-'+ comp["column"] +'" style="grid-area: '+ comp["row"] +' / '+ comp["column"] +' / '+ comp["row"] +' / '+ comp["column"] +';" nodes="'+ comp["from"] +' '+ comp["to"] +'" type="'+ comp["type"] +'" value="'+ comp["value"] +'" onclick="ShowEdit('+ GetIndex(comp) +');"> <span>+</span> <h4>V</h4> <span>-</span> <div class="data"> <h4>V = <span>'+ rnd(comp["value"]) +' '+ comp["unit"] +'</span>V</h4><h4>I = <span>'+ AssignUnit(comp["I"]) +'</span>A</h4><h4>P = <span>'+ GetPower(comp)[1] +'</span>W</h4><h4>From <span class="from_node">'+ comp["from"] +'</span> To <span class="to_node">'+ comp["to"] +'</span></h4> </div> </div>';
        }else{
            circuit.innerHTML += '<div class="current component flip-'+ comp["heading"] +' i-'+ comp["from"] +'-'+ comp["to"] +'-'+ comp["row"] +'-'+ comp["column"] +'" style="grid-area: '+ comp["row"] +' / '+ comp["column"] +' / '+ comp["row"] +' / '+ comp["column"] +';" nodes="'+ comp["from"] +' '+ comp["to"] +'" type="'+ comp["type"] +'" value="'+ comp["value"] +'" onclick="ShowEdit('+ GetIndex(comp) +');"> <i class="fa-solid fa-arrow-up"></i> <div class="data"> <h4>I = <span>'+ rnd(comp["value"]) +' '+ comp["unit"] +'</span>A</h4><h4>V = <span>'+ GetV(comp["from"],comp["to"])[1] +'</span>V</h4><h4>P = <span>'+ GetPower(comp)[1] +'</span>W</h4><h4>From <span class="from_node">'+ comp["from"] +'</span> To <span class="to_node">'+ comp["to"] +'</span></h4> </div> </div>';
        }
    }
}
function ConnectNodesComponents(comp,node){
    for(k=0;k<node["rows"].length;k++){
            if(comp["row"] - node["rows"][k] == 0){
                column = (comp["column"] + node["columns"][k]) / 2;
                if(node["columns"][k] < comp["column"]){
                    for(w=node["columns"][k]+1;w<comp["column"];w++){
                        circuit.innerHTML += '<div class="hr-100" style="grid-area: '+ comp["row"] +' / '+ w +' / '+ comp["row"] +' / '+ w +';"></div>';
                    }
                }else{
                    for(w=comp["column"]+1;w<node["columns"][k];w++){
                        circuit.innerHTML += '<div class="hr-100" style="grid-area: '+ comp["row"] +' / '+ w +' / '+ comp["row"] +' / '+ w +';"></div>';
                    }
                }

            }else if(comp["column"] - node["columns"][k] == 0){
                row = (comp["row"] + node["rows"][k]) / 2;
                circuit.innerHTML += '<div class="vr-100" style="grid-area: '+ row +' / '+ comp["column"] +' / '+ row +' / '+ comp["column"] +';"></div>';

            }
    }
}
function ConnectNodes(){
    for(i=0;i<nodes.length;i++){
        node = nodes[i];
        for(j=0;j<node["rows"].length - 1;j++){
            for(k=j+1;k<node["rows"].length;k++){
                if(node["rows"][j] - node["rows"][k] == 0){
                    if(node["columns"][j] < node["columns"][k]){
                        for(w=node["columns"][j] + 1;w<node["columns"][k];w++){
                    circuit.innerHTML += '<div class="hr-100" style="grid-area: '+ node["rows"][j] +' / '+ w +' / '+ node["rows"][j] +' / '+ w +';"></div>';
                        }
                    }else{
                        for(w=node["columns"][k] + 1;w<node["columns"][j];w++){
                            circuit.innerHTML += '<div class="hr-100" style="grid-area: '+ node["rows"][j] +' / '+ w +' / '+ node["rows"][j] +' / '+ w +';"></div>';
                                }
                    }
                }else if(node["columns"][j] - node["columns"][k] == 0){
                    if(node["rows"][j] < node["rows"][k]){
                        for(w=node["rows"][j] + 1;w<node["rows"][k];w++){
                            if(node["rows"].includes(w)){ //Make sure it doesn't pass on a same node but added later
                                continue;
                            }
                            circuit.innerHTML += '<div class="vr-100" style="grid-area: '+ w +' / '+ node["columns"][j] +' / '+ w +' / '+ node["columns"][j] +';"></div>';
                                }
                    }else{
                        for(w=node["rows"][k] + 1;w<node["rows"][j];w++){
                            if(node["rows"].includes(w)){ //Make sure it doesn't pass on a same node but added later
                                continue;
                            }
                            circuit.innerHTML += '<div class="vr-100" style="grid-area: '+ w +' / '+ node["columns"][j] +' / '+ w +' / '+ node["columns"][j] +';"></div>';
                                }
                    }
                }
            }
        }
    }
}