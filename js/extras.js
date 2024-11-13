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


/*
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Circuit Simulator</title>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap-grid.min.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'>
    <link rel="shortcut icon" href="/assets/icon.png">
    <link rel="shortcut favicon" href="/assets/icon.png">
    <link rel="stylesheet" href="/css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.0/math.js"></script>
</head>
<body>
    <div class="main_options_menu">
        <a href="#!" onclick="ShowForm('add_element_form')">Add Element</a>
        <a href="#!" id="show_netlist_btn" onclick="ShowNetlist()">Netlist</a>
    </div>
    <div class="initialize_circuit">
        <form action="#!" id="initialize_circuit" onsubmit="InitializeCircuit(this)">
            <h2>Initialize Circuit</h2>
            <label for="v">Starting Source</label>
            <div>
                <div>
                    <label for="starting_v">Value</label>
                    <input type="text" id="v" name="V" placeholder="Value">
                </div>
                <div>
                    <label for="starting_v_unit">Unit</label>
                    <select name="Starting_V_Unit" id="starting_v_unit">
                        <option value="μ">μV</option>
                        <option value="m">mV</option>
                        <option value="">V</option>
                        <option value="k">kV</option>
                    </select>
                </div>
            </div>
            <label for="r">Starting Resistance</label>
            <div>
                <div>
                    <label for="starting_r">Value</label>
                    <input type="text" id="r" name="R" placeholder="Value">
                </div>
                <div>
                    <label for="starting_r_unit">Unit</label>
                    <select name="Starting_R_Unit" id="starting_r_unit">
                        <option value="">Ω</option>
                        <option value="k">kΩ</option>
                        <option value="M">MΩ</option>
                        <option value="G">GΩ</option>
                    </select>
                </div>
            </div>
            <button type="submit">Initialize</button>
            <span class="error"></span>
        </form>
    </div>
    <div class="add_element_form">
        <form action="#!" id="add_element_form" onsubmit="AddElement(this)">
            <h2>Add Element</h2>
            <label for="type">Type</label>
            <select name="Type" id="type" onchange="SetUnits(this,'add_element_form')">
                <option value="type">Type</option>
                <option value="r">Resistance</option>
                <option value="v">Voltage Source</option>
                <option value="i">Current Source</option>
            </select>
            <div>
                <div>
                    <label for="value">Value</label>
                    <input type="text" id="value" name="Value" placeholder="Value">
                </div>
                <div>
                    <label for="unit">Unit</label>
                    <select name="Unit" id="unit" disabled>
                        <!-- <option value="p">pA</option>
                        <option value="n">nA</option>
                        <option value="μ">μA</option>
                        <option value="m">mA</option>
                        <option value="">A</option>
                        <option value="k">kA</option>
                        <option value="M">MA</option>
                        <option value="G">GA</option> -->
                    </select>
                </div>
            </div>
            <div>
                <div>
                    <label for="from">From Node</label>
                    <select name="From" id="from">
                        <option value="">From</option>
                    </select>
                </div>
                <div>
                    <label for="to">To Node</label>
                    <select name="To" id="to">
                        <option value="">To</option>
                    </select>
                </div>
            </div>
            <div>
                <div>
                    <button onclick="CloseForm('add_element_form')">Cancel</button>
                </div>
                <div>
                    <button type="submit">Add</button>
                </div>
            </div>
            <span class="error"></span>
        </form>
    </div>
    <div class="edit_element_form">
        <form action="#!" id="edit_element_form" onsubmit="EditElement(this)">
            <h2>Edit Element</h2>
            <label for="edit_type">Type</label>
            <select name="Type" id="edit_type" onchange="SetUnits(this,'edit_element_form')">
                <option value="type">Type</option>
                <option value="r">Resistance</option>
                <option value="v">Voltage Source</option>
                <option value="i">Current Source</option>
            </select>
            <div>
                <div>
                    <label for="edit_value">Value</label>
                    <input type="text" id="edit_value" name="Value" placeholder="Value">
                </div>
                <div>
                    <label for="edit_unit">Unit</label>
                    <select name="Unit" id="edit_unit" disabled>
                        <!-- <option value="p">pA</option>
                        <option value="n">nA</option>
                        <option value="μ">μA</option>
                        <option value="m">mA</option>
                        <option value="">A</option>
                        <option value="k">kA</option>
                        <option value="M">MA</option>
                        <option value="G">GA</option> -->
                    </select>
                </div>
            </div>
            <div>
                <div>
                    <label for="edit_from">From Node</label>
                    <select name="From" id="edit_from">
                        <option value="">From</option>
                    </select>
                </div>
                <div>
                    <label for="edit_to">To Node</label>
                    <select name="To" id="edit_to">
                        <option value="">To</option>
                    </select>
                </div>
            </div>
            <input type="hidden" name="Row_Column" id="row_column">
            <div>
                <div>
                    <button type="button" onclick="CloseForm('edit_element_form')">Cancel</button>
                </div>
                <div>
                    <button type="submit">Edit</button>
                </div>
            </div>
            <button type="button" id="delete_comp_btn" onclick="DeleteComponent();">Delete</button>
            <span class="error"></span>
        </form>
    </div>
    <div class="container-fluid netlist_container d-none">
        <div class="netlist">
            <div class="main_options_menu">
                <a href="#!" id="add_element_btn" onclick="ShowForm('add_element_form')">Add Element</a>
                <a href="#!" onclick="CloseNetlist()">Simulator</a>
            </div>
            <h2>NetList</h2>
            <h3>Nodes</h3>
            <hr>
            <div class="nodes_container">
                <!-- <div>
                    <h4>0</h4>
                    <h4>V <sub>node</sub> = 0 V</h4>
                </div>
                <div>
                    <h4>1</h4>
                    <h4>V <sub>node</sub> = 15 V</h4>
                </div> -->
            </div>
            <h3>Sources</h3>
            <hr>
            <div class="sources_container">
                <!-- <div>
                    <div class="voltage component flip-top">
                        <span>+</span>
                        <h4>V</h4>
                        <span>-</span>
                    </div>
                    <h4>V = 15 V</h4>
                    <h4>I = 12 A</h4>
                    <h4>From 0 To 1</h4>
                    <div class="options">
                        <button class="btn btn-warning" onclick="EditElement()"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" onclick="DeleteComponent()"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div>
                    <div class="current component flip-top">
                        <i class="fa-solid fa-arrow-up"></i>
                    </div>
                    <h4>I = 12 A</h4>
                    <h4>V = 15 V</h4>
                    <h4>From 0 To 1</h4>
                    <div class="options">
                        <button class="btn btn-warning" onclick="EditElement()"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" onclick="DeleteComponent()"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div> -->
            </div>
            <h3>Elements</h3>
            <hr>
            <div class="elements_container">
                <!-- <div>
                    <div class="resistance component flip-top">
                        <h4>+</h4>
                        <h4>/\/\/\/\</h4>
                        <h4>-</h4>
                    </div>
                    <h4>R = 12 Ω</h4>
                    <h4>V = 12 V</h4>
                    <h4>I = 15 A</h4>
                    <h4>From 0 To 1</h4>
                    <div class="options">
                        <button class="btn btn-warning" onclick="EditElement()"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" onclick="DeleteComponent()"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div>
                    <div class="resistance component flip-right">
                        <h4>+</h4>
                        <h4>/\/\/\/\</h4>
                        <h4>-</h4>
                    </div>
                    <h4>R = 12 Ω</h4>
                    <h4>V = 12 V</h4>
                    <h4>I = 15 A</h4>
                    <h4>From 0 To 1</h4>
                    <div class="options">
                        <button class="btn btn-warning" onclick="EditElement()"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" onclick="DeleteComponent()"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
    <h1 id="heading_title">Circuit Simulator</h1>
    <!-- <div class="voltage component">
        <span>+</span>
        <h4>V</h4>
        <span>-</span>
        <div class="data">
            <h4>V = <span>10</span> V</h4>
        </div>
    </div>
    <div class="current component">
        <i class="fa-solid fa-arrow-up"></i>
        <div class="data">
            <h4>I = <span>10</span> A</h4>
        </div>
    </div>
    <div class="resistance component">
        <h4>+</h4>
        <h4>/\/\/\/\</h4>
        <h4>-</h4>
        <div class="data">
            <h4>R = <span class="inner_r">10</span> Ω</h4>
            <h4>I = <span class="inner_current">10</span> A</h4>
            <h4>V = <span class="inner_voltage">10</span> V</h4>
            <h4>From <span class="from_node">0</span> To <span class="to_node">1</span></h4>
        </div>
    </div>
    <div class="node">0</div>
    <div class="vr my-2"></div>
    <div class="hr-100 mx-2"></div>
    <div class="hr-200 mx-2"></div>
    <div class="hr-200 mx-2"></div> -->
    
    <!-- <div class="node node-0" style="grid-area: 1 / 1 / 1 / 1;"><h4>0</h4></div>
    <div class="vr-100" style="grid-area: 2 / 1 / 2 / 1;"></div>
    <div class="voltage component flip-bottom" id="v_start" style="grid-area: 3 / 1 / 3 / 1;">
        <span>+</span>
        <h4>V</h4>
        <span>-</span>
        <div class="data">
            <h4>V = <span>10</span> V</h4>
        </div>
    </div>
    <div class="vr-100" style="grid-area: 4 / 1 / 4 / 1;"></div>
    <div class="node node-1" style="grid-area: 5 / 1 / 5 / 1;"><h4>1</h4></div>
    <div class="hr-100" style="grid-area: 5 / 2 / 5 / 2;"></div>
    <div class="resistance component flip-left" id="r_start" style="grid-area: 5 / 3 / 5 / 3;">
        <h4>+</h4>
        <h4>/\/\/\/\</h4>
        <h4>-</h4>
        <div class="data">
            <h4>R = <span class="inner_r">10</span> Ω</h4>
            <h4>I = <span class="inner_current">10</span> A</h4>
            <h4>V = <span class="inner_voltage">10</span> V</h4>
            <h4>From <span class="from_node">0</span> To <span class="to_node">1</span></h4>
        </div>
    </div>
    <div class="hr-100" style="grid-area: 5 / 4 / 5 / 4;"></div>
    <div class="node node-0" id="node-bottom-right" style="grid-area: 5 / 5 / 5 / 5;"><h4>0</h4></div>
    <div class="vr-100 vr-0-1" id="wire-right" style="grid-area: 2 / 5 / span 3 / 5;"></div>
    <div class="node node-0" id="node-up-right" style="grid-area: 1 / 5 / 1 / 5;"><h4>0</h4></div>
    <div class="hr-100 hr-0-0"  style="grid-area: 1 / 2 / 1 / 5;"></div> -->
    
    <div class="container-fluid circuit_container">
    </div>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js'></script>
    <script src='https://cdn.jsdelivr.xyz/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.3/axios.min.js'></script>
    <script src="/js/script.js"></script>
    <script src="/js/add.js"></script>
    <script src="/js/edit.js"></script>
    <script src="/js/delete.js"></script>
    <script src="/js/build.js"></script>
    <script src="/js/analyze.js"></script>
    <script src="/js/netlist.js"></script>
</body>
</html>
*/