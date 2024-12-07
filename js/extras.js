// `
// <label>Type</label>
// <select name="Type" class="type" id="type-${components.indexOf(comp)}">
//     <option value="">Type</option>
//     <option value="v">Voltage Source</option>
//     <option value="i">Current Source</option>
//     <option value="r">Resistance</option>
// </select>
// `;
// SetUnits(id);                    
// setTimeout(() => {
//     $(elm.querySelector(".type")).val(components[id]["type"].toString()).trigger("change");
// }, 100);
                    
/*
            <div class="dependent_label">
                <div>
                    <i class="fa-solid fa-down-long"></i>
                    <span>2ix</span>
                </div>
            </div>
*/

// $(window).bind('load', () => {
//     let a1 = math.complex(Infinity,Infinity);
//     let a2 = math.complex(0,Infinity);
//     let a3 = math.complex(Infinity,0);
//     let a4 = math.complex(0,0);
//     let b1 = a4;
//     let b2 = math.complex(0,2);
//     let b3 = math.complex(2,0);
//     let b4 = math.complex(2,2);
//     let matrix1 = math.matrix([[a1]]);
//     let matrix2 = math.matrix([[a2]]);
//     let matrix3 = math.matrix([[a3]]);
//     let matrix4 = math.matrix([[a4]]);
//     let matrix5 = math.matrix([[a1,a4],[a2,a3]]);
//     let matrix6 = math.matrix([[a1,a2],[a3,a4]]);
//     let matrix7 = math.matrix([[a1,a2,a3,a4],[a1,a2,a3,a4],[a1,a2,a3,a4],[a1,a2,a3,a4]]);
//     //
//     let matrix8 = math.matrix([[b1]]);
//     let matrix9 = math.matrix([[b3]]);
//     let matrix10 = math.matrix([[b1],[b3]]);
//     // let matrix11 = math.matrix([[b1],[b2],[b3],[b4]]);
//     let matrix11 = math.matrix([[b2],[b2],[b2],[b2]]);
//     //
//     // let values1 = math.lusolve(matrix1,matrix8);
//     // let values2 = math.lusolve(matrix2,matrix8);
//     // let values3 = math.lusolve(matrix3,matrix8);
//     // let values4 = math.lusolve(matrix4,matrix8);
//     // let values5 = math.lusolve(matrix1,matrix9);
//     // let values6 = math.lusolve(matrix2,matrix9);
//     // let values7 = math.lusolve(matrix3,matrix9);
//     // let values8 = math.lusolve(matrix4,matrix9);
//     // let values9 = math.lusolve(matrix5,matrix10);
//     // let values10 = math.lusolve(matrix6,matrix10);
//     let values11 = math.lusolve(matrix7,matrix11);
//     //
//     // console.log(values1);
//     // console.log(values2);
//     // console.log(values3);
//     // console.log(values4);
//     // console.log(values5);
//     // console.log(values6);
//     // console.log(values7);
//     // console.log(values8);
//     // console.log(values9);
//     // console.log(values10);
//     console.log(values11);
// });
// $(window).bind('load', () => {
//     // Replace Infinity with a large number and 0 with a small number
//     const LARGE_NUMBER = 1e12; // Represents "infinity" in numerical terms
//     const SMALL_NUMBER = 1e-12; // Represents "zero" to avoid singularities

//     // Define adjusted complex numbers
//     let a1 = math.complex(LARGE_NUMBER, LARGE_NUMBER); // Simulates a very large impedance
//     let a2 = math.complex(SMALL_NUMBER, LARGE_NUMBER);
//     let a3 = math.complex(LARGE_NUMBER, SMALL_NUMBER);
//     let a4 = math.complex(SMALL_NUMBER, SMALL_NUMBER);

//     let b2 = math.complex(SMALL_NUMBER, 2);

//     // Construct matrices
//     let matrix7 = math.matrix([
//         [a1, a2, a3, a4],
//         [a1, a2, a3, a4],
//         [a1, a2, a3, a4],
//         [a1, a2, a3, a4]
//     ]);

//     let matrix11 = math.matrix([[b2], [b2], [b2], [b2]]);

//     // Validate matrices (optional but useful for debugging)
//     console.log("Matrix7 (before pseudoinverse):", matrix7);
//     console.log("Matrix11:", matrix11);

//     // Compute pseudoinverse and solution
//     let matrix7_pinv = math.pinv(matrix7); // Compute pseudoinverse
//     let values11 = math.multiply(matrix7_pinv, matrix11); // Compute solution

//     // Log results
//     console.log("Pseudoinverse of matrix7:", matrix7_pinv);
//     console.log("Solution values11:", values11);
// });

/*
function ShowOutputs(){
    if(!analyzed){
        content.innerHTML = `<div class="msg">Analyze Circuit to Show Outputs</div>`;
        return;
    }
    let current_components = JSON.parse(JSON.stringify(components));
    let current_nodes = JSON.parse(JSON.stringify(nodes));
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
for(let i=0;i<nodes.length;i++){
    if(!content.querySelector(".nodes_container")) return;
    content.querySelector(".nodes_container").innerHTML += `<div class="output_component"><h5>Node ${nodes[i]["node"]} (${AssignUnit(nodes[i]["V"])}V)</h5></div>`;
}
let sources = GetComponents("v");
for(let i=0;i<sources.length;i++){
    let source = sources[i];
    if(components.indexOf(source) == -1) continue;
    let I = AssignUnit(source["I"]);
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
                            <h5>${source["label"]} = ${source["value"]}∠${source["phase"]} ${source["unit"]}V</h5>
                            <ul>
                                <li>I = ${I}A</li>
                                <li>P = ${AssignUnit(math.multiply(math.complex(0.5,0),(source["I"].neg()).conjugate(),GetComplexValue(source["value"],source["phase"],source["unit"])),"complex")}W</li>
                                <li>P<sub>avg</sub> = ${AssignUnit(math.complex((math.multiply(math.complex(0.5,0),(source["I"].neg()).conjugate(),GetComplexValue(source["value"],source["phase"],source["unit"]))).re,0))}W</li>
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
    components = JSON.parse(JSON.stringify(current_components));
    nodes = JSON.parse(JSON.stringify(current_nodes));
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
                        <h5>${source["label"]} = ${source["value"]}∠${source["phase"]} ${source["unit"]}A</h5>
                        <ul>
                            <li>V = ${v}V</li>
                            <li>P = ${GetPower(source["from"],source["to"],GetComplexValue(source["value"],source["phase"],source["unit"]),"i",id)}W</li>
                            <li>P<sub>avg</sub> = ${GetRealPower(source["from"],source["to"],GetComplexValue(source["value"],source["phase"],source["unit"]),"i",id)}W</li>
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
    components = JSON.parse(JSON.stringify(current_components));
    nodes = JSON.parse(JSON.stringify(current_nodes));
    let element = JSON.parse(JSON.stringify(elements[i]));
    let id = Number(element["id"]);
    if(id == -1) continue;
    let v = GetV(element["from"],element["to"]);
    let I = GetI(element["from"],element["to"],GetZ(id),id);
    components = JSON.parse(JSON.stringify(current_components));
    nodes = JSON.parse(JSON.stringify(current_nodes));
    element = components[id];
    let power = GetPower(element["from"],element["to"],GetZ(id),"r",id);
    components = JSON.parse(JSON.stringify(current_components));
    nodes = JSON.parse(JSON.stringify(current_nodes));
    element = components[id];
    let power_real = GetRealPower(element["from"],element["to"],GetZ(id),"r",id);
    components = JSON.parse(JSON.stringify(current_components));
    nodes = JSON.parse(JSON.stringify(current_nodes));
    element = components[id];
    if(!content.querySelector(".elements_container")) return;
    if(element["type"] == "r"){
        content.querySelector(".elements_container").innerHTML += `<div class="output_component">
                        <h5>${element["label"]} = ${element["value"]} ${element["unit"]}${element["measuring_unit"]}</h5>
                        <ul>
                            <li>V = ${v}V</li>
                            <li>I = ${I}A</li>
                            <li>P = ${power}W</li>
                            <li>Nodes: ${GetNodeFromIndex(element["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(element["to"])}</li>
                        </ul>
                    </div>`;
    }else{
        content.querySelector(".elements_container").innerHTML += `<div class="output_component">
                        <h5>${element["label"]} = ${element["value"]} ${element["unit"]}${element["measuring_unit"]}</h5>
                        <ul>
                            <li>V = ${v}V</li>
                            <li>I = ${I}A</li>
                            <li>P = ${power}W</li>
                            <li>P<sub>avg</sub> = ${power_real}W</li>
                            <li>Nodes: ${GetNodeFromIndex(element["from"])} <i class="fa-solid fa-arrow-right"></i> ${GetNodeFromIndex(element["to"])}</li>
                        </ul>
                    </div>`;
    }
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
    let Z = GetZeq(from,to);
    let temp_id = components.length;
    let comp = {"id": temp_id,"value": 0,"unit": "","measuring_unit": "Ω","type": "r","orientation": "vertical","heading": "top","row": 5,"column": 5,"label": "","to":to,"from":from};
    components.push(comp);
    nodes[from]["comps"].push(temp_id);
    nodes[to]["comps"].push(temp_id);
    let I = GetIWire(temp_id);
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



*/