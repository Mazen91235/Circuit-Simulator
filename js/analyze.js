function AnalyzeCircuit(){
    sources = GetElements('V');
    n_nodes = nodes.slice(1);
    n = n_nodes.length;
    m = sources.length;
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
        return 0;
    }


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