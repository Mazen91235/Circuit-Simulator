function FinishCircuit(){
    last_node = nodes[nodes.length - 1];
    last_column = last_node["columns"][last_node["columns"].length - 1] + 3;
    last_row = last_node["rows"][last_node["rows"].length - 1];
    last_node_0 = nodes[0]["columns"][nodes[0]["columns"].length - 1];
    upper_hr_column = last_column + 1 - last_node_0;
    console.log(last_column);
    circuit.innerHTML += '<div class="vr-100 vr-0-1" style="grid-area: 2 / '+ (parseInt(last_column) + 1).toString() +' / span 3 / '+ (parseInt(last_column) + 1).toString() +';"></div>';
    // circuit.innerHTML += '<div class="hr-100" style="grid-area: 5 / '+ last_column +' / 5 / '+ last_column +';"></div> <div class="node node-0" style="grid-area: 5 / '+ last_column+1 +' / 5 / '+ last_column+1 +';"><h4>0</h4></div> <div class="vr-100 vr-0-1" style="grid-area: 2 / '+ last_column+1 +' / span 3 / '+ last_column+1 +';"></div> <div class="node node-0" style="grid-area: 1 / '+ last_column+1 +' / 1 / '+ last_column+1 +';"><h4>0</h4></div>';
    for(let i=last_node_0+1;i<upper_hr_column+last_node_0;i++){
        circuit.innerHTML += '<div class="hr-100 hr-0-0" style="grid-area: 1 / '+ i +' / 1 / '+ i +';"></div>';
    }
}
function reset_circuit(){
    circuit.innerHTML = starting_html;
    FinishCircuit();
}
function StartCircuit(){
    V = components[0]["value"];
    R = components[1]["value"];
    circuit.innerHTML = '';
    circuit.innerHTML += '<div class="node node-0" style="grid-area: 1 / 1 / 1 / 1;"><h4>0</h4></div> <div class="vr-100" style="grid-area: 2 / 1 / 2 / 1;"></div> <div class="voltage component flip-bottom v-0-1-3-1" style="grid-area: 3 / 1 / 3 / 1;" nodes="0 1" type="V" value="'+ V +'" onclick="ShowEdit(this);"> <span>+</span> <h4>V</h4> <span>-</span> <div class="data"> <h4>V = <span>'+ V +'</span> V</h4> </div> </div> <div class="vr-100" style="grid-area: 4 / 1 / 4 / 1;"></div> <div class="node node-1" style="grid-area: 5 / 1 / 5 / 1;"><h4>1</h4></div> <div class="hr-100" style="grid-area: 5 / 2 / 5 / 2;"></div> <div class="resistance component flip-left r-1-0-5-3" style="grid-area: 5 / 3 / 5 / 3;" nodes="1 0" type="R" value="'+ R +'" onclick="ShowEdit(this);"> <h4>+</h4> <h4>/\\/\\/\\/\\</h4> <h4>-</h4> <div class="data"> <h4>R = <span class="inner_r">'+ R +'</span> Ω</h4> <h4>I = <span class="inner_current">'+ V/R +'</span> A</h4> <h4>V = <span class="inner_voltage">'+ V +'</span> V</h4> <h4>From <span class="from_node">1</span> To <span class="to_node">0</span></h4> </div> </div>';
    FinishCircuit();
}
// let starting_html = '<div class="node node-0" style="grid-area: 5 / 1 / 5 / 1;"><h4>0</h4></div><div class="vr-100" style="grid-area: 4 / 1 / 4 / 1;"></div><div class="voltage component v-0-1" style="grid-area: 3 / 1 / 3 / 1;"><span>+</span><h4>V</h4><span>-</span><div class="data"><h4>V = <span>10</span> V</h4></div></div><div class="vr-100" style="grid-area: 2 / 1 / 2 / 1;"></div><div class="node node-1" style="grid-area: 1 / 1 / 1 / 1;"><h4>1</h4></div><div class="hr-100" style="grid-area: 1 / 2 / 1 / 2;"></div><div class="resistance component flip-left r-0-1" style="grid-area: 1 / 3 / 1 / 3;"><h4>+</h4><h4>/\\/\\/\\/\\</h4><h4>-</h4><div class="data"><h4>R = <span class="inner_r">10</span> Ω</h4><h4>I = <span class="inner_current">10</span> A</h4><h4>V = <span class="inner_voltage">10</span> V</h4><h4>From <span class="from_node">0</span> To <span class="to_node">1</span></h4></div></div><div class="hr-100" style="grid-area: 1 / 4 / 1 / 4;"></div><div class="node node-0" style="grid-area: 1 / 5 / 1 / 5;"><h4>0</h4></div><div class="vr-100 vr-0-1" style="grid-area: 2 / 5 / span 3 / 5;"></div><div class="node node-0" style="grid-area: 5 / 5 / 5 / 5;"><h4>0</h4></div><div class="hr-100 hr-0-0" style="grid-area: 5 / 2 / 5 / 5;"></div>';
let starting_html = '<div class="node node-0" style="grid-area: 1 / 1 / 1 / 1;"><h4>0</h4></div> <div class="vr-100" style="grid-area: 2 / 1 / 2 / 1;"></div> <div class="voltage component flip-bottom v-0-1" style="grid-area: 3 / 1 / 3 / 1;"> <span>+</span> <h4>V</h4> <span>-</span> <div class="data"> <h4>V = <span>10</span> V</h4> </div> </div> <div class="vr-100" style="grid-area: 4 / 1 / 4 / 1;"></div> <div class="node node-1" style="grid-area: 5 / 1 / 5 / 1;"><h4>1</h4></div> <div class="hr-100" style="grid-area: 5 / 2 / 5 / 2;"></div> <div class="resistance component flip-left r-0-1" style="grid-area: 5 / 3 / 5 / 3;"> <h4>+</h4> <h4>/\\/\\/\\/\\</h4> <h4>-</h4> <div class="data"> <h4>R = <span class="inner_r">10</span> Ω</h4> <h4>I = <span class="inner_current">10</span> A</h4> <h4>V = <span class="inner_voltage">10</span> V</h4> <h4>From <span class="from_node">0</span> To <span class="to_node">1</span></h4> </div> </div>';

// function CheckEnter(id){
//     if(event.KeyCode == 13){
//         document.querySelector("."+id).submitted = false;
//     }
// }
// function PreventEnter(){
//     forms = document.querySelectorAll("form");
//     forms.forEach(form => {
//         inputs = form.querySelectorAll("input");
//         inputs.forEach(input => {
//             input.setAttribute("onkeydown","CheckEnter("+ form.id +");")
//         });
//         selects = form.querySelectorAll("select");
//         selects.forEach(select => {
//             select.setAttribute("onkeydown","CheckEnter("+ form.id +");")
//         });
//     });
// }


    // Put Wires
    // Loop on nodes
    // for(i=0;i<nodes.length;i++){
    //     console.log("Node"+i);
    //     node = nodes[i];
    //     comps = [];
    //     for(k=0;k<components.length;k++){
    //         if(components[k]["from"] == i || components[k]["to"] == i){
    //             comps.push(components[k]);
    //         }
    //     }
    //     console.log(comps);
    //     for(k=0;k<node["rows"].length;k++){
    //         for(j=0;j<comps.length;j++){
    //             comp = comps[i];
    //             if(comp["row"] - node["rows"][k] == 0){
    //                 column = (comp["column"] + node["columns"][k]) / 2;
    //                 circuit.innerHTML += '<div class="hr-100" style="grid-area: '+ comp["row"] +' / '+ column +' / '+ comp["row"] +' / '+ column +';"></div>';
    //                 console.log("Node"+i+"Comp"+comp["type"]+ "Hr" + column);
    //             }else if(comp["column"] - node["columns"][k] == 0){
    //                 row = (comp["row"] + node["rows"][k]) / 2;
    //                 circuit.innerHTML += '<div class="vr-100" style="grid-area: '+ row +' / '+ comp["column"] +' / '+ row +' / '+ comp["column"] +';"></div>';
    //                 console.log("Node"+i+"Comp"+comp["type"]+ "Vr" + row);
    //             }
    //         }
    //     }
    // }

    for(k=0;k<nodes[To]["rows"].length;k++){
        if(nodes[To]["rows"][k] > last_row){
            nodes[To]["columns"][k] = GetLastColumn();
        }
    }

        // if(From == 0 && To != 1 || From != 1 && To == 0){
    //     orientation = "vertical";
    //     if(To == 0){
    //         heading = "up";
    //     }else{
    //         heading = "bottom";
    //     }
    // }
    // else
    // {
        // }

// function GetLastNode(n){
//     node = nodes[n];
//     last_node = [node["rows"][node["rows"].length - 1],node["columns"][node["columns"].length - 1]];
//     return last_node;
// }