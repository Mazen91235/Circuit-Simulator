function ShowNetlist(){
    // Hide Circuit Simulator
    document.querySelector(".circuit_container").classList.add("d-none");
    document.querySelector(".initialize_circuit").classList.add("d-none");
    document.querySelector(".main_options_menu").classList.add("d-none");
    document.querySelector("#heading_title").classList.add("d-none");

    // Show Netlist
    document.querySelector(".netlist_container").classList.remove("d-none");
    document.querySelector(".netlist_container").classList.add("d-flex");
}
function CloseNetlist(){
    // Hide Netlist
    document.querySelector(".netlist_container").classList.remove("d-flex");
    document.querySelector(".netlist_container").classList.add("d-none");

    // Show Circuit Simulator
    document.querySelector(".circuit_container").classList.remove("d-none");
    document.querySelector(".initialize_circuit").classList.remove("d-none");
    document.querySelector(".main_options_menu").classList.remove("d-none");
    document.querySelector("#heading_title").classList.remove("d-none");
}
function CreateNetlist(){
    let netlist = document.querySelector(".netlist");
    let nodes_container = netlist.querySelector(".nodes_container");
    let sources_container = netlist.querySelector(".sources_container");
    let elements_container = netlist.querySelector(".elements_container");
    let sources = GetElements("V");
    let current_sources = GetElements("I");
    let elements = GetElements("R");
    for(let i=0;i<current_sources.length;i++){
        sources.push(current_sources[i]);
    }
    nodes_container.innerHTML = '';
    sources_container.innerHTML = '';
    elements_container.innerHTML = '';
    for(let i=0;i<nodes.length;i++){
        nodes_container.innerHTML += '<div><h4>'+ i +'</h4><h4>V <sub>node</sub> = '+ AssignUnit(nodes[i]["V"]) +'V</h4></div>';
    }

    let delete_comp = '';
    let edit_elm;
    for(let i=0;i<sources.length;i++){
        let source = sources[i];
        if(source != components[0]){
            delete_comp = '<button class="btn btn-danger" onclick="DeleteComponent('+ GetIndex(source) +')"><i class="fa-solid fa-trash"></i></button>';
        }
        if(source["type"] == "V"){
            sources_container.innerHTML += '<div><div class="voltage component flip-'+ source["heading"] +'"><span>+</span><h4>V</h4><span>-</span></div><h4>V = '+ source["value"] +' '+ source["unit"] +'V</h4><h4>I = '+ AssignUnit(source["I"]) +'A</h4><h4>P = '+ GetPower(source)[1] +'W</h4><h4>From '+ source["from"] +' To '+ source["to"] +'</h4><div class="options"><button class="btn btn-warning" onclick="ShowEdit('+ GetIndex(source) +')"><i class="fa-solid fa-pen"></i></button>'+ delete_comp +'</div></div>';
        }else{
            sources_container.innerHTML += '<div><div class="current component flip-'+ source["heading"] +'"><i class="fa-solid fa-arrow-up"></i></div><h4>I = '+ source["value"] +' '+ source["unit"] +'A</h4><h4>V = '+ GetV(source["from"],source["to"])[1] +'V</h4><h4>P = '+ GetPower(source)[1] +'W</h4><h4>From '+ source["from"] +' To '+ source["to"] +'</h4><div class="options"><button class="btn btn-warning" onclick="ShowEdit('+ GetIndex(source) +')"><i class="fa-solid fa-pen"></i></button>'+ delete_comp +'</div></div></div>';
        }
    }
    for(let i=0;i<elements.length;i++){
        let element = elements[i];
        if(element != components[1]){
            delete_comp = '<button class="btn btn-danger" onclick="DeleteComponent('+ GetIndex(element) +')"><i class="fa-solid fa-trash"></i></button>';
        }
        elements_container.innerHTML += '<div><div class="resistance component flip-'+ element["heading"] +'"><h4>+</h4><h4>/\\/\\/\\/\\</h4><h4>-</h4></div><h4>R = '+ element["value"] + ' ' + element["unit"] +'Ω</h4><h4>V = '+ GetV(element["from"],element["to"])[1] +'V</h4><h4>I = '+ GetI(element["from"],element["to"],element["value"],element["unit"])[1] +'A</h4><h4>P = '+ GetPower(element)[1] +'W</h4><h4>From '+ element["from"] +' To '+ element["to"] +'</h4><div class="options"><button class="btn btn-warning" onclick="ShowEdit('+ GetIndex(element) +')"><i class="fa-solid fa-pen"></i></button>'+ delete_comp +'</div></div>';
    }
}