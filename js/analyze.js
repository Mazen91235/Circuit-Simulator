let analyzed = false;
let analyze_errors = [];
let main_nodes;
let dependent_types = ["v_d","i_d"];
let dependent_sub_types = ["vcvs","vccs","ccvs","cccs"];
let setting_related = false;
let LARGE_NUMBER = 1e12; // Represents "infinity" in numerical terms
let SMALL_NUMBER = 1e-12; // Represents "zero" to avoid singularities
let frequency = 0;
let matrix_values,sources,n,m;
let analyzing = false;
let backup_current_components;
let backup_current_nodes;
let using_z = false;
function ValidateCircuit(){
    analyze_errors = [];
    for(let i=0;i<components.length;i++){
        if(components[i]["from"] == null || components[i]["to"] == null){
            analyze_errors.push(`${components[i]["label"]} is not properly connected`);
        }else if(components[i]["from"] == components[i]["to"]){
            analyze_errors.push(`${components[i]["label"]} cannot be enclosed between same node`);
        }
        // if(components[i]["value"] == 0 && components[i]["type"] == "r"){
        //     analyze_errors.push(`${components[i]["label"]} cannot be zero`);
        // }
        if(dependent_types.includes(components[i]["type"])){
            if(components[i]["sub_type"] == null || components[i]["sub_type"] == "" || components[i]["dependent_component"] == null){
                analyze_errors.push(`Please make sure ${components[i]["label"]} has a valid Type and Dependent Component`);
            }
            if(components[i]["factor"] == null || components[i]["factor"] == "" || components[i]["dependent_label"] == null || components[i]["dependent_label"] == ""){
                analyze_errors.push(`Please make sure ${components[i]["label"]} has a valid Factor and Dependent Label`);
            }
        }
        if(components[i]["source_type"] == "ac" && frequency == 0 && FrequencyDependentExist()){
            analyze_errors.push(`Error! Can't solve a phasor circuit with zero frequency except if passive elements are entered as impedances.`);
        }
        if(['c','l'].includes(components[i]["type"]) && components[i]["value_type"] == null){
            analyze_errors.push(`Error! Make Sure ${components[i]["label"]} has a valid Value Type.`);
        }
        if(['c','l'].includes(components[i]["type"]) && components[i]["value_type"] == 'z' && !CheckZ(components[i]["value"])){
            analyze_errors.push(`Error! Make Sure ${components[i]["label"]} has a valid Impedance.`);
        }
    }
    if(components.length == 0){
        analyze_errors.push("There are no elements to deal with. Add some first");
    }
    if(nodes.length == 0){
        analyze_errors.push("There are no nodes to deal with. Add some first");
    }
    for(let i=0;i<nodes.length;i++){
        if(nodes[i]["comps"].length == 0 && nodes[i]["node"] != null){
            analyze_errors.push(`Node ${nodes[i]["node"]} is not connected to any component. Connect it first`);
        }else if(nodes[i]["node"] == null || !simulator.querySelector(`.node-id-${i}`)){
            DeleteNode(i);
            ValidateCircuit();
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
function FrequencyDependentExist(){
    let comps = GetComponents('c').concat(GetComponents('l'));
    for(let i=0;i<comps.length;i++){
        if(comps[i]["value_type"] != 'z'){
            return true;
        }
    }
    return false;
}
function CheckZ(s){
    try{
        let test = math.complex(s.replace('j','i'));
        return !(math.isNaN(test.re) || math.isNaN(test.im)) && math.isComplex(test);
    }catch(err){
        return null;
    }
}
function GetZValue(id){
    let comp = components[id];
    if(!comp) return;
    let value = math.complex(comp["value"].replace('j','i'));
    let unit = comp["unit"];
    let new_value = math.complex(GetValue(value.re,unit) , GetValue(value.im,unit));
    return new_value;
}
function Y(node1,node2){
    let y=math.complex(0,0);
    if(node1 == node2){
        for(let i=0;i<nodes[node1]["comps"].length;i++){
            let comp = components[nodes[node1]["comps"][i]];
            if(comp["type"] == "r"){
                if(comp["value"] == 0){
                    y = math.add(y,math.complex(LARGE_NUMBER,0));
                }else{
                    y = math.add(y,math.complex(1 / (GetValue(comp["value"],comp["unit"])),0));
                }
            }else{
                if(comp["type"] == "c" || comp["type"] == "l"){
                    if(comp["value_type"] == 'z'){
                        if(comp["value"] == 0){
                                y = math.add(y,math.complex(LARGE_NUMBER,0));
                        }else{
                                y = math.add(y,(GetZValue(components.indexOf(comp))).inverse());
                            }
                        }else{
                        if(comp["value"] == 0){
                            if(comp["type"] == "c"){
                                y = math.add(y,math.complex(0,0));
                            }else{
                                y = math.add(y,math.complex(LARGE_NUMBER,0));
                            }
                        }else{
                            if(frequency == 0){
                                if(comp["type"] == "c"){
                                    y = math.add(y,math.complex(0,0));
                                }else{
                                    y = math.add(y,math.complex(LARGE_NUMBER,0));
                                }
                            }else{
                                if(comp["type"] == "c"){
                                    y = math.add(y,math.complex(0,frequency*GetValue(comp["value"],comp["unit"])));
                                }else{
                                    y = math.add(y,math.inv(math.complex(0,frequency*GetValue(comp["value"],comp["unit"]))));
                                }
                            }
                        }

                    }
                }
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
            if(comp["type"] == "r"){
                if(comp["value"] == 0){
                    y = math.subtract(y,math.complex(LARGE_NUMBER,0));
                }else{
                    y = math.subtract(y,math.complex(1 / (GetValue(comp["value"],comp["unit"])),0));
                }
            }else{
                if(comp["type"] == "c" || comp["type"] == "l"){
                    if(comp["value_type"] == 'z'){
                        if(comp["value"] == 0){
                            y = math.subtract(y,math.complex(LARGE_NUMBER,0));
                        }else{
                            y = math.subtract(y,(GetZValue(components.indexOf(comp))).inverse());
                        }
                    }else{
                    if(comp["value"] == 0){
                        if(comp["type"] == "c"){
                            y = math.subtract(y,math.complex(0,0));
                        }else{
                            y = math.subtract(y,math.complex(LARGE_NUMBER,0));
                        }
                    }else{
                        if(frequency == 0){
                            if(comp["type"] == "c"){
                                y = math.subtract(y,math.complex(0,0));
                            }else{
                                y = math.subtract(y,math.complex(LARGE_NUMBER,0));
                            }
                        }else{
                            if(comp["type"] == "c"){
                                y = math.subtract(y,math.complex(0,frequency*GetValue(comp["value"],comp["unit"])));
                            }else{
                                y = math.subtract(y,math.complex(0,frequency*GetValue(comp["value"],comp["unit"])).inverse());
                            }
                        }
                    }
                }
                }
            }
        }
    }
    return y;
}
function GetConnectedVoltage(node,source){
    if(source["to"] == node) return 1;
    else if(source["from"] == node) return -1;
    else return 0;
}
function GetSumSources(node_id,type){
    let node = nodes[node_id];
    let comps = [];
    let sum = math.complex(0,0);
    for(let i=0;i<node["comps"].length;i++){
        if(components[node["comps"][i]]["type"] == type) comps.push(components[node["comps"][i]]);
    }
    for(let i=0;i<comps.length;i++){
        if(comps[i]["to"] == node_id){
            if(comps[i]["source_type"] == "dc"){
                sum = math.add(sum,math.complex(GetValue(comps[i]["value"],comps[i]["unit"]),0));
            }else{
                sum = math.add(sum,GetComplexValue(comps[i]["value"],comps[i]["phase"],comps[i]["unit"]));
            }
        }
        else{
            if(comps[i]["source_type"] == "dc"){
                sum = math.subtract(sum,math.complex(GetValue(comps[i]["value"],comps[i]["unit"]),0));
            }else{
                sum = math.subtract(sum,GetComplexValue(comps[i]["value"],comps[i]["phase"],comps[i]["unit"]));
            }
        } 
    }
    return sum;
}
function GetNodeIndex(node){
    for(let i=0;i<nodes.length;i++){
        if(nodes[i]["node"] == node) return i;
    }
    return -1;
}
function GetNodeFromIndex(node_id){
    if(!nodes[node_id] || !backup_current_nodes.some(node => {return (node.node == nodes[node_id]["node"])})){
        console.log(nodes[node_id]);
        console.log(node_id);
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please Reset Circuit and Try again1.1.");
        // console.log(array_values);
        analyzed = false;
        ChooseSubMenu("errors");
        return;
    };
    return nodes[node_id]["node"];
}
function GetMainNodes(){
    main_nodes = JSON.parse(JSON.stringify(nodes));
    main_nodes.splice(ground_node,1);
    for(let i=0;i<main_nodes.length;i++){
        main_nodes[i]["id"] = GetNodeIndex(main_nodes[i]["node"]);
    }
}
function GetDependentCurrent(n,nc){
    let dependent_currents = GetComponents("i_d");
    let sum = 0;
    for(let i=0;i<dependent_currents.length;i++){
        let dependent_current = dependent_currents[i];
        if(dependent_current["sub_type"] != "vccs") continue;
        if(dependent_current["to"] == n){
            let nc_pos = components[dependent_current["dependent_component"]]["from"];
            let nc_neg = components[dependent_current["dependent_component"]]["to"];
            if(nc == nc_pos){
                sum -= dependent_current["factor"];
            }else if(nc == nc_neg){
                sum += dependent_current["factor"];
            }
        }else if(dependent_current["from"] == n){
            let nc_pos = components[dependent_current["dependent_component"]]["from"];
            let nc_neg = components[dependent_current["dependent_component"]]["to"];
            if(nc == nc_pos){
                sum += dependent_current["factor"];
            }else if(nc == nc_neg){
                sum -= dependent_current["factor"];
            }
        }
    }
    return sum;
}
function GetDependentVoltage(nc,source){
    if(source["type"] != "v_d" || source["sub_type"] != "vcvs") return 0;
    let nc_pos = components[source["dependent_component"]]["from"];
    let nc_neg = components[source["dependent_component"]]["to"];
    if(nc == nc_pos) return -1 * source["factor"];
    else if(nc == nc_neg) return source["factor"];
    else return 0;
}
function AddSources(){
    let comps = GetComponents("v_d");
    for(let i=0;i<comps.length;i++){
        if(comps[i]["sub_type"] == "ccvs"){
            let dependent_component = components[comps[i]["dependent_component"]];
            let node_num = GetLastNode();
            let node = {"node":node_num,"comps":[comps[i]["dependent_component"],components.indexOf(comps[i])],"positions":[(5,5)]};
            let from = dependent_component["from"];
            nodes[from]["comps"][nodes[from]["comps"].indexOf(dependent_component["id"])] = components.length;
            dependent_component["from"] = nodes.length; 
            let source = {"id": components.length,"value": 0,"unit": "","measuring_unit": "V","type": "v","orientation": "vertical","heading": "top","row": 5,"column": 5,"label": "","to":from,"from":nodes.length,"controlling_voltage":components.indexOf(comps[i]),"source_type":"dc"};
            comps[i]["controlling_source"] = components.length;
            nodes.push(node);
            components.push(source);
        }
    }
    comps = GetComponents("i_d");
    for(let i=0;i<comps.length;i++){
        if(comps[i]["sub_type"] == "cccs"){
            let dependent_component = components[comps[i]["dependent_component"]];
            let node_num = GetLastNode();
            let node = {"node":node_num,"comps":[comps[i]["dependent_component"],components.indexOf(comps[i])],"positions":[(5,5)]};
            let from = dependent_component["from"];
            nodes[from]["comps"][nodes[from]["comps"].indexOf(dependent_component["id"])] = components.length;
            dependent_component["from"] = nodes.length; 
            let source = {"id": components.length,"value": 0,"unit": "","measuring_unit": "V","type": "v","orientation": "vertical","heading": "top","row": 5,"column": 5,"label": "","to":from,"from":nodes.length,"controlling_voltage":components.indexOf(comps[i]),"source_type":"dc"};
            comps[i]["controlling_source"] = components.length;
            nodes.push(node);
            components.push(source);
        }
    }
}
function GetDependentCurrentVoltage(n,source){
    let current_source = components[source["controlling_voltage"]];
    let sum = 0;
    if(!current_source) return 0;
    if(current_source["sub_type"] != "cccs") return 0;
    if(current_source["to"] == n){
        sum -= current_source["factor"];
    }else if(current_source["from"] == n){
        sum += current_source["factor"];
    }
    return sum;
}
function SetAnalyzing(){
    analyzing = true;
}
function AddCurrentCalculatingSources(){
    let comps = GetComponents("r").concat(GetComponents("c"),GetComponents("l"));
    for(let k=0;k<comps.length;k++){
        let comp = comps[k];
        // setting_related = true;
        let from = comp["from"];  
        let to = comp["to"];
        let id = comp["id"];
        // let current_components = JSON.parse(JSON.stringify(components));
        // let current_nodes = JSON.parse(JSON.stringify(nodes));
        let i;
        let temp_id = components.length;
        comp["current_source_id"] = temp_id;
        let node_num = GetLastNode();
        let node = {"node":node_num,"comps":[id,temp_id],"positions":[(5,5)]};
        if(!nodes[from]){
            analyze_errors = [];
            analyze_errors.push("Unexpected Error Occurred! Please try again later1.2.");
            // console.log(array_values);
            analyzed = false;
            setting_related = false;
            ChooseSubMenu("errors");
            return;
        };
        nodes[from]["comps"][nodes[from]["comps"].indexOf(id)] = temp_id;
        comp["from"] = nodes.length; 
        let source = {"id": temp_id,"value": 0,"unit": "","measuring_unit": "V","type": "v","orientation": "vertical","heading": "top","row": 5,"column": 5,"label": "","to":from,"from":nodes.length,"source_type":"dc","element_i_id":id};
        nodes.push(node);
        components.push(source);
        // components = JSON.parse(JSON.stringify(current_components));
        // nodes = JSON.parse(JSON.stringify(current_nodes));
        
        //Content of Setting Req
        // setting_related = false;
    }
    // AnalyzeCircuit();
}
function RevertChanges(){
    for(let i=0;i<backup_current_components.length;i++){
        let comp_backup = backup_current_components[i];
        let comp = components[comp_backup["id"]];
        comp["from"] = comp_backup["from"];
        comp["to"] = comp_backup["to"];
    }
}
function AnalyzeCircuit(){
    if(!ValidateCircuit()) return;
    let current_components = JSON.parse(JSON.stringify(components));
    let current_nodes = JSON.parse(JSON.stringify(nodes));
    backup_current_components = JSON.parse(JSON.stringify(components));
    backup_current_nodes = JSON.parse(JSON.stringify(nodes));
    try{
    AddSources();
    AddCurrentCalculatingSources();
    sources = GetComponents("v");
    GetMainNodes();
    n = main_nodes.length;
    m = sources.length;
    let matrix = math.matrix();
    matrix.resize([m+n,m+n]); 
    let matrix_IV = math.matrix();  
    matrix_IV.resize([n+m]);
    for(let i=1;i<=m+n;i++){
        if(i <= n){
            for(j=1;j<=m+n;j++){
                if(j <= n){
                    matrix.subset(math.index(i-1, j-1), math.add(math.complex(GetDependentCurrent(main_nodes[i-1]["id"],main_nodes[j-1]["id"]),0),Y(main_nodes[i-1]["id"],main_nodes[j-1]["id"]))); 
                }else{
                    matrix.subset(math.index(i-1, j-1), math.add(math.complex(GetDependentCurrentVoltage(main_nodes[i-1]["id"],sources[j-n-1]),0),math.complex(GetConnectedVoltage(main_nodes[i-1]["id"],sources[j-n-1]),0))); 
                }
            }
        }else{
            for(j=1;j<=m+n;j++){
                if(j <= n){
                    // console.log(GetDependentVoltage(main_nodes[j-1]["id"],sources[i-n-1]));
                    matrix.subset(math.index(i-1, j-1), math.add(math.complex(GetDependentVoltage(main_nodes[j-1]["id"],sources[i-n-1]),0),math.complex(GetConnectedVoltage(main_nodes[j-1]["id"],sources[i-n-1]),0))); 
                }else{
                    if(sources[i-n-1]["type"] == "v_d" && sources[i-n-1]["sub_type"] == "ccvs" && sources[i-n-1]["controlling_source"] != null && sources[i-n-1]["controlling_source"] == components.indexOf(sources[j-n-1])){
                        matrix.subset(math.index(i-1, j-1), math.complex(-1*sources[i-n-1]["factor"],0)); 
                    }else{
                        matrix.subset(math.index(i-1, j-1), math.complex(0,0)); 
                    }
                }
            }
        }
    }
    for(let i=1;i<=m+n;i++){
        if(i <= n){
            matrix_IV.subset(math.index(i-1), GetSumSources(main_nodes[i-1]["id"],"i")); 
        }else{
            if(sources[i-n-1]["source_type"] == "dc"){
                matrix_IV.subset(math.index(i-1), math.complex(GetValue(sources[i-n-1]["value"],sources[i-n-1]["unit"]),0)); 
            }else{
                let source_value = GetValue(sources[i-n-1]["value"],sources[i-n-1]["unit"]);
                matrix_IV.subset(math.index(i-1), GetComplexValue(sources[i-n-1]["value"],sources[i-n-1]["phase"],sources[i-n-1]["unit"])); 
            }
        }
    }


    console.log(components);
    console.log(nodes);
        matrix_values = math.lusolve(matrix,matrix_IV);
        console.log(matrix);
        console.log(matrix_IV);
        console.log(matrix_values);
        // Convert matrix_values to a flat array for easy processing
        let array_values = matrix_values.toArray().flat();

        // Check for NaN in real or imaginary parts
        let hasError = array_values.some(v => {
            if (math.isComplex(v)) {
                return isNaN(v.re) || isNaN(v.im); // Check complex number
            }
            else{
                return isNaN(v); // Check real number
            }
        });

        // Handle errors
        if (hasError) {
            analyze_errors = [];
            analyze_errors.push("Unexpected Error Occurred! Please try again2.");
            console.log(array_values);
            analyzed = false;
            ChooseSubMenu("errors");
        }
        // components = JSON.parse(JSON.stringify(current_components));
        // nodes = JSON.parse(JSON.stringify(current_nodes));
        AssignCalculatedValues();
        RevertChanges();
        analyzed = true;
        if(analyzing){
            analyzing = false;
            ChooseSubMenu("outputs");
        }      
        return true;
    }catch(err){
        console.log(err);
        analyze_errors = [];
        analyze_errors.push("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        ChooseSubMenu("errors");
        if(setting_related){
            throw("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        }else{
            return false;
        }
    }finally{
        if(!setting_related){
            components = JSON.parse(JSON.stringify(current_components));
            nodes = JSON.parse(JSON.stringify(current_nodes));
            PutSettings();
        }
    }
}
function AssignCalculatedValues(){
    try{
        let matrix = matrix_values;
        for(let i=1;i<=n+m;i++){
            if(i <= n){
                if(!nodes[main_nodes[i-1]["id"]]) continue;
                nodes[main_nodes[i-1]["id"]]["V"] = matrix.subset(math.index(i-1,0)); 
            }else{
                if(!components[sources[i-n-1]["id"]]) continue;
                if(sources[i-n-1]["element_i_id"] != null){
                    let element_id = sources[i-n-1]["element_i_id"];
                    if(components[element_id]){
                        components[element_id]["element_i"] = math.complex(matrix.subset(math.index(i-1,0))); 
                    }
                }
                components[sources[i-n-1]["id"]]["I"] = math.complex(matrix.subset(math.index(i-1,0))).neg();
            }
        }
        nodes[ground_node]["V"] = math.complex(0,0);
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.3.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetV(from,to){
    try{
        if(!nodes[from] || !nodes[to]) return;
        let v = math.subtract(math.complex(nodes[from]["V"]),math.complex(nodes[to]["V"]));
        return AssignUnit(v);
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.4.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetPower(from,to,value,type,id){
    try{
        if(!nodes[from] || !nodes[to] || !components[id]) return;
        let v = math.subtract(math.complex(nodes[from]["V"]),math.complex(nodes[to]["V"]));
        // if(v <= 1e-13){
        //     v = math.complex(0,0);
        // }
        let power;
        let comp = components[id];
        if(type == "i"){
            if(comp["source_type" != "ac"]) power = math.multiply(v,value);
            else power = math.multiply(math.complex(0.5,0),v,value.conjugate());
        }else{
            if(math.abs(v.re) == 0 && math.abs(v.im) == 0){
                power = math.complex(0,0);
            }else{
                // let i = GetIWire(id);
                let i = components[id]["element_i"];
                if(math.abs(value.re) == 0 && math.abs(value.im) == 0){
                    // analyze_errors = [];
                    // analyze_errors.push("Unsolvable Circuit");
                    // analyzed = false;
                    // ChooseSubMenu("errors");
                    // return;
                    // z = math.complex(SMALL_NUMBER,SMALL_NUMBER);
                    // power = math.multiply(v,i);
                }else{
                    // power = math.divide(math.multiply(v,v),value);
                }
                if((!math.isComplex(v) && !math.isComplex(i)) || (v.im == 0 && i.im == 0)) power = math.multiply(v,i);
                else power = math.multiply(math.complex(0.5,0),v,i.conjugate());
            }
    
        }
        if(math.isComplex(power)){
            return AssignUnit(power,"complex");
        }else{
            return AssignUnit(power);
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.5.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetRealPower(from,to,value,type,id){
    try{
        if(!nodes[from] || !nodes[to] || !components[id]) return;
        let v = math.subtract(math.complex(nodes[from]["V"]),math.complex(nodes[to]["V"]));
        // if(v <= 1e-13){
        //     v = math.complex(0,0);
        // }
        let power;
        let comp = components[id];
        if(type == "i"){
            if(comp["source_type" != "ac"]) power = math.multiply(v,value);
            else power = math.multiply(math.complex(0.5,0),v,value.conjugate());
        }else{
            if(math.abs(v.re) == 0 && math.abs(v.im) == 0){
                power = math.complex(0,0);
            }else{
                // let i = GetIWire(id);
                let i = components[id]["element_i"];
                if(math.abs(value.re) == 0 && math.abs(value.im) == 0){
                    // analyze_errors = [];
                    // analyze_errors.push("Unsolvable Circuit");
                    // analyzed = false;
                    // ChooseSubMenu("errors");
                    // return;
                    // z = math.complex(SMALL_NUMBER,SMALL_NUMBER);
                    // power = math.multiply(v,i);
                }else{
                    // power = math.divide(math.multiply(v,v),value);
                }
                if((!math.isComplex(v) && !math.isComplex(i)) || (v.im == 0 && i.im == 0)) power = math.multiply(v,i);
                else power = math.multiply(math.complex(0.5,0),v,i.conjugate());
            }
    
        }
        if(math.isComplex(power)){
            return AssignUnit(math.complex(power.re,0));
        }else{
            return AssignUnit(power);
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.6.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetZ(id){
    try{
        let comp = components[id];
        let z;
        if(!comp) return;
        if(comp["type"] == "r"){
            z = math.complex(GetValue(comp["value"],comp["unit"]),0);
        }else if(comp["type"] == "c"){
            if(frequency == 0){
                z = math.complex(LARGE_NUMBER,LARGE_NUMBER);
            }else{
                z = math.inv(math.complex(0,frequency*GetValue(comp["value"],comp["unit"])));
            }
        }else{
            if(frequency == 0){
                z = math.complex(0,0);
            }else{
                z = math.complex(0,frequency*GetValue(comp["value"],comp["unit"]));
            }
        }
        return z;
        }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.7.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetI(from,to,z,id){
    try{
        if(!nodes[from] || !nodes[to] || !components[id]) return;
        let v = math.subtract(math.complex(nodes[from]["V"]),math.complex(nodes[to]["V"]));
        // if(v <= 1e-13){
        //     v = math.complex(0,0);
        // }
        let i;
        if(math.abs(v.re) == 0 && math.abs(v.im) == 0){
            i = math.complex(0,0);
        }else{
            // i = GetIWire(id);
            i = components[id]["element_i"];
            if(math.abs(z.re) == 0 && math.abs(z.im) == 0){
                // z = math.complex(SMALL_NUMBER,SMALL_NUMBER);
                // i = GetIWire(id);
            }else{
                // i = math.divide(v,z);
            }
        }
        return AssignUnit(i);

    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.8.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetDependentI(comp_id){
    try{
        let comp = components[comp_id];
        if(!comp) return;
        let dependent_component = components[comp["dependent_component"]];
        let dependent_value;
        if(comp["sub_type"] == "vccs"){
            dependent_value = math.subtract(math.complex(nodes[dependent_component["from"]]["V"]),math.complex(nodes[dependent_component["to"]]["V"]));
        }else if(comp["sub_type"] == "cccs"){
            // dependent_value = GetIWire(comp["dependent_component"]);
            dependent_value = components[comp["dependent_component"]]["element_i"];
        }
        let current = math.multiply(math.complex(comp["factor"],0),dependent_value);
        return AssignUnit(current);
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later1.9.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetDependentPower(comp_id){
    try{
        let comp = components[comp_id];
        if(!comp) return;
        let dependent_component = components[comp["dependent_component"]];
        let dependent_value,power;
        let dependent_v = math.subtract(math.complex(nodes[dependent_component["from"]]["V"]),math.complex(nodes[dependent_component["to"]]["V"]));
        let source_v = math.subtract(math.complex(nodes[comp["from"]]["V"]),math.complex(nodes[comp["to"]]["V"]));
        let factor = math.complex(comp["factor"],0);
        if(comp["sub_type"] == "vcvs"){
            dependent_value = dependent_v;
            power = math.multiply(factor.neg(),dependent_value,comp["I"]);
        }else if(comp["sub_type"] == "ccvs"){
            // dependent_value = GetIWire(comp["dependent_component"]);
            dependent_value = components[comp["dependent_component"]]["element_i"];
            power = math.multiply(factor.neg(),dependent_value,comp["I"]);
        }else if(comp["sub_type"] == "vccs"){
            dependent_value = dependent_v;
            power = math.multiply(factor,dependent_value,source_v);
        }else if(comp["sub_type"] == "cccs"){
            dependent_value = components[comp["dependent_component"]]["element_i"];
            power = math.multiply(factor,dependent_value,source_v);
        }
        return AssignUnit(power);
        }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later2.0.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function GetSpecificUnit(v){
    try{
        let units_arr = ['p','n','μ','m','','k','M','G'];
        let powers = [-12,-9,-6,-3,0,3,6,9];
        let unit = 4;
        v = math.complex(v);
        if(math.isComplex(v)){
            if(isNaN(v.re) || isNaN(v.im)){
                analyze_errors = [];
                analyze_errors.push("Unexpected Error Occurred! Please try again.");
                analyzed = false;
                ChooseSubMenu("errors");
                return;
            }
        }else{
            if(isNaN(v)){
                analyze_errors = [];
                analyze_errors.push("Unexpected Error Occurred! Please try again3.");
                analyzed = false;
                ChooseSubMenu("errors");
                return;
            }
        }
        let value = Math.sqrt((math.re(v) * math.re(v)) + (math.im(v) * math.im(v)));
        let phase = GetDegree(Math.abs(Math.atan(math.im(v) / math.re(v))));
        if(phase == 0) value = math.re(v);
        else phase = ShiftPhase(v);
        if(((Math.abs(value) * Math.pow(10,12)).toFixed(1) <= 0 && value != 0) || Math.abs(value) * Math.pow(10,-9) >= 1000){
            if((Math.abs(value) * Math.pow(10,12)).toFixed(1) <= 0 && value != 0){
                value = 0;
            }else{
                value = LARGE_NUMBER;
            }
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
        value = Number(Number(value).toFixed(3));
        phase = Number(Number(phase).toFixed(3));
        return math.complex((v.re * math.pow(10,-1*powers[unit])),(v.im * math.pow(10,-1*powers[unit])));
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later2.1.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function HasDependent(){
    for(let i=0;i<components.length;i++){
        if(["v_d","i_d"].includes(components[i]["type"])) return true;
    }
    return false;
}
function GetZeq(from,to){
    let current_components = JSON.parse(JSON.stringify(components));
    let current_nodes = JSON.parse(JSON.stringify(nodes));
    backup_current_components = JSON.parse(JSON.stringify(components));
    backup_current_nodes = JSON.parse(JSON.stringify(nodes));
    try{
    if((from == null || to == null || from == "" || to == "") && content.querySelector(".settings-Z.active")){
        if(content.querySelector(".settings-Z .from")) from = content.querySelector(".settings-Z .from").value;
        if(content.querySelector(".settings-Z .to")) to = content.querySelector(".settings-Z .to").value;
    }
    if((from == "" || to == "" || from == null || to == null) && content.querySelector(".settings-Z.active")){
        analyze_errors = [];
        analyze_errors.push("Make sure Nodes are specified correctly to Get Zeq");
        ChooseSubMenu("errors");
        return;
    }
    from = Number(from);
    to = Number(to);
    if(from == to){
        content.querySelector(".settings-Z .data").innerHTML = `<h6>Data:</h6>
        <ul>
        <li>Z<sub>eq</sub> = 0 Ω</li>
        <li>Y<sub>eq</sub> = 0 Ω<sup>-1</sup></li>
        </ul>`;
        return 0;
    }
    setting_related = true;
    let Z;
    for(let i=0;i<components.length;i++){
        if(components[i]["type"] == "v" || components[i]["type"] == "i"){
            components[i]["value"] = 0;
        }
    }
    let temp_id = components.length;
    let temp_current = {"id": temp_id,"value": 1,"unit": "","measuring_unit": "A","type": "i","orientation": "vertical","heading": "top","row": 7,"column": 11,"to": to,"from": from,"source_type":"dc"};
    components.push(temp_current);
    nodes[to]["comps"].push(temp_id);
    nodes[from]["comps"].push(temp_id);
    AnalyzeCircuit();
    Z = math.subtract(math.complex(nodes[from]["V"]),math.complex(nodes[to]["V"])).neg();
    console.log(Z);
    if(!HasDependent() && Z.re < 0) Z = Z.neg();
    let Y;
    try{
        Y = math.divide(math.complex(1,0),Z);
    }catch(err_y){
        Y = math.complex(LARGE_NUMBER,LARGE_NUMBER);
    }
    if(!sidebar.querySelector(".errors").classList.contains("active")) ChooseSubMenu("settings");
    ToggleSettingsComponent('Z');
    //Content of Setting Req
    if(content.querySelector(".settings-Z .data")){
        $(content.querySelector(".settings-Z .from")).val(from.toString()).trigger("change");
        $(content.querySelector(".settings-Z .to")).val(to.toString()).trigger("change");
        content.querySelector(".settings-Z .data").innerHTML = `<h6>Data:</h6>
        <ul>
            <li>Z<sub>eq</sub> = ${AssignUnit(Z,"complex")}Ω</li>
            <li>Y<sub>eq</sub> = ${AssignUnit(Y,"complex")}Ω<sup>-1</sup></li>
            </ul>`;
    }
    return Z;
}catch(err){
    analyze_errors = [];
    if(err == "Please make sure your inputs are valid for circuit to be solvable and then try again."){
        analyze_errors.push("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        if(using_z){
            throw("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        }
    }else{
        analyze_errors.push("Unexpected Error Occurred! Please try again later2.2.");
    }
    // console.log(array_values);
    analyzed = false;
    ChooseSubMenu("errors");
    return;
}finally{
    setting_related = false;
    components = JSON.parse(JSON.stringify(current_components));
    nodes = JSON.parse(JSON.stringify(current_nodes));
    PutSettings();
}
}
function GetIWire(id){
    let current_components = JSON.parse(JSON.stringify(components));
    let current_nodes = JSON.parse(JSON.stringify(nodes));
    try{
    let comp = components[id];
    if(!comp) return 0;
    let from = comp["from"].toString();
    let to = comp["to"].toString();
    if(from == "" || to == "" || from == null || to == null){
        analyze_errors = [];
        analyze_errors.push("UnSolvable Circuit");
        ChooseSubMenu("errors");
        return 0;
    }
    from = Number(from);
    to = Number(to);
    if(from == to){
        return 0;
    }
    // let from_index = GetNodeIndex(from);  
    // let to_index = GetNodeIndex(to);
    setting_related = true;
    let i;
    let temp_id = components.length;
    let node_num = GetLastNode();
    let node = {"node":node_num,"comps":[id,temp_id],"positions":[(5,5)]};
    nodes[from]["comps"][nodes[from]["comps"].indexOf(id)] = temp_id;
    comp["from"] = nodes.length; 
    nodes.push(node);
    let source = {"id": temp_id,"value": 0,"unit": "","measuring_unit": "V","type": "v","orientation": "vertical","heading": "top","row": 5,"column": 5,"label": "","to":from,"from":nodes.length,"source_type":"dc"};
    components.push(source);
    AnalyzeCircuit();
    if(!components[temp_id]["I"]){
        throw("Please make sure your inputs are valid for circuit to be solvable and then try again.");
    }
        i = components[temp_id]["I"].neg();
        
        //Content of Setting Req
        return i;
    }catch(err){
        analyze_errors = [];
        if(err == "Please make sure your inputs are valid for circuit to be solvable and then try again."){
            analyze_errors.push("Please make sure your inputs are valid for circuit to be solvable and then try again.");
            if(using_z){
                throw("Please make sure your inputs are valid for circuit to be solvable and then try again.");
            }
        }else{
            console.log(err);
            analyze_errors.push("Unexpected Error Occurred! Please try again later2.3.");
        }
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        setting_related = false;
        components = JSON.parse(JSON.stringify(current_components));
        nodes = JSON.parse(JSON.stringify(current_nodes));
        PutSettings();
    }
}

function GetTHeq(from=null,to=null){
    let current_components = JSON.parse(JSON.stringify(components));
    let current_nodes = JSON.parse(JSON.stringify(nodes));
    backup_current_components = JSON.parse(JSON.stringify(components));
    backup_current_nodes = JSON.parse(JSON.stringify(nodes));
    try{
    if(from == null || to == null){
        if(content.querySelector(".settings-TH .from")) from = content.querySelector(".settings-TH .from").value;
        if(content.querySelector(".settings-TH .to")) to = content.querySelector(".settings-TH .to").value;
    }
    if(from == "" || to == "" || from == null || to == null){
        analyze_errors = [];
        analyze_errors.push("Make sure Nodes are specified correctly to Get THeq");
        ChooseSubMenu("errors");
        return;
    }
    from = Number(from);
    to = Number(to);
    if(from == to){
        content.querySelector(".settings-TH .data").innerHTML = `<h6>Data:</h6>
            <ul>
                <li>V<sub>th</sub> = 0 V</li>
                <li>Z<sub>th</sub> = 0 Ω</li>
            </ul>`;
        return 0;
    }
    using_z = true;
    let Z = GetZeq(from,to);
    setting_related = true;
    AnalyzeCircuit();
    using_z = false;
    if(!sidebar.querySelector(".errors").classList.contains("active")) ChooseSubMenu("settings");
    ToggleSettingsComponent('TH');
    let V = math.subtract(math.complex(nodes[from]["V"]),math.complex(nodes[to]["V"]));
        if(content.querySelector(".settings-TH .data")){
            $(content.querySelector(".settings-TH .from")).val(from.toString()).trigger("change");
            $(content.querySelector(".settings-TH .to")).val(to.toString()).trigger("change");
            content.querySelector(".settings-TH .data").innerHTML = `<h6>Data:</h6>
            <ul>
            <li>V<sub>th</sub> = ${AssignUnit(V)}V</li>
            <li>Z<sub>th</sub> = ${AssignUnit(Z,"complex")}Ω</li>
            </ul>`;
        }
    return V;
    }catch(err){
        analyze_errors = [];
        if(err == "Please make sure your inputs are valid for circuit to be solvable and then try again."){
            analyze_errors.push("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        }else{
            analyze_errors.push("Unexpected Error Occurred! Please try again later2.4.");
        }
        // console.log(array_values);
        ChooseSubMenu("errors");
        return;
    }finally{
        analyzed = false;
        setting_related = false;
        components = JSON.parse(JSON.stringify(current_components));
        nodes = JSON.parse(JSON.stringify(current_nodes));
        PutSettings();
    }
}
function GetNeq(){
    let current_components = JSON.parse(JSON.stringify(components));
    let current_nodes = JSON.parse(JSON.stringify(nodes));
    backup_current_components = JSON.parse(JSON.stringify(components));
    backup_current_nodes = JSON.parse(JSON.stringify(nodes));
    try{
        if(content.querySelector(".settings-N .from")) from = content.querySelector(".settings-N .from").value;
        if(content.querySelector(".settings-N .to")) to = content.querySelector(".settings-N .to").value;
        if(from == "" || to == "" || from == null || to == null){
            analyze_errors = [];
            analyze_errors.push("Make sure Nodes are specified correctly to Get Neq");
            ChooseSubMenu("errors");
            return;
        }
        from = Number(from);
        to = Number(to);
        if(from == to){
            content.querySelector(".settings-N .data").innerHTML = `<h6>Data:</h6>
            <ul>
            <li>I<sub>N</sub> = 0 A</li>
            <li>Z<sub>N</sub> = 0 Ω</li>
            </ul>`;
            return 0;
        }
    using_z = true;
    let temp_id = JSON.parse(JSON.stringify(components.length));
    let Z = GetZeq(from,to);
    setting_related = true;
    AnalyzeCircuit();
    let V = math.subtract(nodes[from]["V"],nodes[to]["V"]);
    let I;
    if(V.re == 0 && V.im == 0){
        I = math.complex(0,0);
    }else{
        if((Z.re == 0 && Z.im == 0)){
            I = math.complex(LARGE_NUMBER,LARGE_NUMBER);
        }else{
            try{
                I = math.divide(V,Z);
            }catch(err){
                // I = math.complex(Infinity,Infinity);
                throw("Please make sure your inputs are valid for circuit to be solvable and then try again.");
            }
        }
    }
    using_z = false;
    if(!sidebar.querySelector(".errors").classList.contains("active")) ChooseSubMenu("settings");
    ToggleSettingsComponent('N');
    // let V = nodes[from]["V"] - nodes[to]["V"];
    if(content.querySelector(".settings-N .data")){
        $(content.querySelector(".settings-N .from")).val(from.toString()).trigger("change");
        $(content.querySelector(".settings-N .to")).val(to.toString()).trigger("change");
        //     content.querySelector(".settings-N .data").innerHTML = `<h6>Data:</h6>
        //     <ul>
        //         <li>I<sub>N</sub> = ${AssignUnit(V / R)}A</li>
        //         <li>R<sub>N</sub> = ${AssignUnit(R)}Ω</li>
        //     </ul>`;
        // }
        content.querySelector(".settings-N .data").innerHTML = `<h6>Data:</h6>
        <ul>
            <li>I<sub>N</sub> = ${AssignUnit(I)}A</li>
            <li>Z<sub>N</sub> = ${AssignUnit(Z,"complex")}Ω</li>
            </ul>`;
        }
    }catch(err){
        analyze_errors = [];
        if(err == "Please make sure your inputs are valid for circuit to be solvable and then try again."){
            analyze_errors.push("Please make sure your inputs are valid for circuit to be solvable and then try again.");
        }else{
            analyze_errors.push("Unexpected Error Occurred! Please try again later2.5.");
        }
        console.log(err);
        console.log(components);
        console.log(nodes);
        ChooseSubMenu("errors");
        return;
    }finally{
        analyzed = false;
        setting_related = false;
        components = JSON.parse(JSON.stringify(current_components));
        nodes = JSON.parse(JSON.stringify(current_nodes));
        PutSettings();
    }
    }
    function CancelUpdateFrequency(){
        content.querySelector(".frequency_component .frequency").value = frequency;
    }
    function ApplyUpdateFrequency(){
        let new_frequency = content.querySelector(".frequency_component .frequency").value;
        analyze_errors = [];
        if(new_frequency == null || new_frequency == ""){
            analyze_errors.push("You Can't set the frequency as empty. leave it zero for DC f that's what you want.");
        }
        new_frequency = Number(new_frequency);
        if(new_frequency < 0){
            analyze_errors.push("You Can't set the frequency to a negative value.");
        }
        if(analyze_errors.length > 0){
        ChooseSubMenu("errors");
        return;
    }
    content.querySelector(".frequency_heading").textContent = `ω = ${new_frequency}`;
    frequency = new_frequency;
}