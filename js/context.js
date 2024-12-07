// Hide the context menu when clicking outside
document.onclick = function(event) {
    try{
        // Check if the menu is open and if the click is outside of it
        if (context_menu.style.display === "flex" && !context_menu.contains(event.target)) {
            context_menu.style.display = "none"; // Hide the context menu
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
};

function PrepareContextMenu(){
    try{
        simulator.querySelectorAll(".component").forEach(comp => {
            if(!comp.hasAttribute("comp_id")) return;
            let comp_id = Number(comp.getAttribute("comp_id"));
            comp.oncontextmenu = function(event){
                event.preventDefault();
                context_menu.style.display = "flex";
                // let top = (GetPosition(event.clientX,event.clientY)[0] - 1)*gridSize - window.scrollY;
                // let left = (GetPosition(event.clientX,event.clientY)[1] + 2)*gridSize - window.scrollX;
                let top = comp.offsetTop;
                let left = comp.offsetLeft + gridSize;
                context_menu.style.top = top + "px"; // Set top position
                context_menu.style.left = left + "px"; // Set left position
                context_menu.innerHTML = '';
                context_menu.innerHTML += `<a href="#!" onclick="EditComponent(${comp_id})">Edit Component <i class="fa-solid fa-pen"></i></a><a href="#!" onclick="DeleteComponent(${comp_id})">Delete Component <i class="fa-solid fa-trash"></i></a><a href="#!" onclick="RotateRight(${comp_id})">Rotate Right <i class="fa-solid fa-rotate-right"></i></a><a href="#!" onclick="RotateLeft(${comp_id})">Rotate Left <i class="fa-solid fa-rotate-left"></i></a>`;
                if(components[comp_id]["from"] != null){
                    let node = nodes[components[comp_id]["from"]];
                    context_menu.innerHTML += `<a href="#!" onclick="DisconnectCompFromNode(${comp_id},${nodes.indexOf(node)})">Disconnect Node ${node["node"]} </a>`;
                }
                if(components[comp_id]["to"] != null){
                    let node = nodes[components[comp_id]["to"]];
                    context_menu.innerHTML += `<a href="#!" onclick="DisconnectCompFromNode(${comp_id},${nodes.indexOf(node)})">Disconnect Node ${node["node"]} </a>`;
                }
                // Stop event propagation for clicks inside the menu
                context_menu.onclick = function(e) {
                    e.stopPropagation();
                };
            };
        });
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function PrepareNodesContextMenu(){
    try{
        simulator.querySelectorAll(".node").forEach(node => {
            node.oncontextmenu = function(event){
                let node_id = Number(node.getAttribute("node"));
                event.preventDefault();
                context_menu.style.display = "flex";
                let top = node.offsetTop;
                let left = node.offsetLeft + gridSize;
                let row = Number(node.getAttribute("row"));
                let column = Number(node.getAttribute("column"));
                context_menu.style.top = top + "px"; // Set top position
                context_menu.style.left = left + "px"; // Set left position
                context_menu.innerHTML = '';
                context_menu.innerHTML += `<a href="#!" onclick="ActivateNode(${node_id})">Edit Node <i class="fa-solid fa-pen"></i></a><a href="#!" onclick="DeleteNode(${node_id})">Delete Node <i class="fa-solid fa-trash"></i></a><a href="#!" onclick="CopyNode(${node_id},${GetIndexOfPosition(node_id,row,column)})">Copy Node</a>`;
                if(ground_node != node_id){
                    context_menu.innerHTML += `<a href="#!" onclick="SetGroundNode(${node_id})">Set as Ground Node</a>`;
                }
                for(let i=0;i<nodes[node_id]["comps"].length;i++){
                    let comp_id = nodes[node_id]["comps"][i];
                    let comp = components[comp_id];
                    context_menu.innerHTML += `<a href="#!" onclick="DisconnectCompFromNode(${comp_id},${node_id})">Disconnect ${comp["label"]} </a>`;
                }
                // Stop event propagation for clicks inside the menu
                context_menu.onclick = function(e) {
                    e.stopPropagation();
                };
            };
        });
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}
function CloseContextMenu(){
    try{
        event.stopPropagation();
        context_menu.style.display = "none";
        context_menu.innerHTML = '';
        return;
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
}

document.querySelector(".nav").oncontextmenu = function(event) {
    event.preventDefault();
    CloseContextMenu();
};
simulator.oncontextmenu = function(event) {
    try{
        event.preventDefault();
        // Check if the click is on a component
        let row = GetPosition(event.clientX,event.clientY)[0];
        let column = GetPosition(event.clientX,event.clientY)[1];
        if (document.querySelector(`.item-${row}-${column}`) || event.target.classList.contains("connector_node")) {
            return; // Let the component handle its own menu
        }
        if (document.querySelector(`.node-${row}-${column}`)) {
            return; // Let the component handle its own menu
        }
        context_menu.style.display = "flex";
        context_menu.style.top = event.clientY + window.scrollY + 5 + "px"; // Set top position
        context_menu.style.left = event.clientX + window.scrollX + 5 + "px"; // Set left position
        context_menu.innerHTML = `<a href="#!" onclick="ResetCircuit()">Reset Circuit <i class="fa-solid fa-rotate-left"></i></a>`;
        // Stop event propagation for clicks inside the menu
        context_menu.onclick = function(e) {
            e.stopPropagation();
        };
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
};