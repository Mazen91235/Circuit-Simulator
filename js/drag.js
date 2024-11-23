let gridSize = 60;
function SetDraggable(comp) {
    if(comp.classList.contains("copied_node")) return;
    comp.addEventListener('mousedown', (event) => {
        if (event.button === 2) return; // Ignore right-click

        // Reset global state before new interaction
        wire_comp = null;
        wire_type = null;

        // Check if clicked on a connector node
        if (event.target.classList.contains("connector_node")) {
            document.addEventListener('mousemove', CreateWire);
            wire_comp = comp;
            wire_type = event.target.getAttribute("type");
        } else {
            draggable_item = comp;
            document.addEventListener('mousemove', onDrag);
        }
    });

    document.addEventListener('mouseup', () => {
        // Check if in wire creation mode
        if (wire_comp) {
            HandleWire(); // Clean up wire creation state
        } else if (draggable_item) {
            // Clean up drag state
            document.removeEventListener('mousemove', onDrag);
            HandleElement();
    
            if (!isDragging && draggable_item) {
                if(draggable_item.classList.contains("node"))
                CompClicked(draggable_item);
            }
    
            setTimeout(() => {
                CheckInDeletionArea();
            }, 500);
    
            isDragging = false;
            draggable_item = null;
        }
    });
}

function onDrag(){
    if(!draggable_item) return;
    analyzed = false;
    if(temp_element){
        document.querySelector(".temp").style.display = "flex";
        temp_element = null;
    }
    isDragging = true;
    PositionComp();
    HandleElement();
}
function PositionComp(){
        // Calculate row and column based on mouse position
        let row = GetPosition(event.clientX,event.clientY)[0];
        let column = GetPosition(event.clientX,event.clientY)[1];
        let old_row,old_column;
        //
        if(draggable_item.getAttribute("row") && draggable_item.getAttribute("column")){
            old_row = Number(draggable_item.getAttribute("row"));
            old_column = Number(draggable_item.getAttribute("column"));
            if(draggable_item.classList.contains(`item-${old_row}-${old_column}`)){
                draggable_item.classList.remove(`item-${old_row}-${old_column}`);
                draggable_item.classList.add(`item-${row}-${column}`);
            }else{
                draggable_item.classList.add(`item-${row}-${column}`);
            }
        }

        // Move component to the new position if it has changed
        draggable_item.style.setProperty('grid-area',`${row} / ${column} / ${row} / ${column}`);
        draggable_item.setAttribute("row",row);
        draggable_item.setAttribute("column",column);

        if(draggable_item.classList.contains("node")){
            let id = Number(draggable_item.getAttribute("node"));
            let node = nodes[id];
            for(let i=0;i<node["comps"].length;i++){
                DisconnectCompFromNode(node["comps"][i],id,"node");
            }
            if(node["comps"].length == 0){
                DisconnectCompFromNode(null,id,"node");
            }
            if(draggable_item.classList.contains(`node-${old_row}-${old_column}`)){
                draggable_item.classList.remove(`node-${old_row}-${old_column}`);
                draggable_item.classList.add(`node-${row}-${column}`);
            }else{
                draggable_item.classList.add(`node-${row}-${column}`);
            }
            for(let i=0;i<node["positions"].length;i++){
                let position = node["positions"][i];
                if(position["row"] == old_row && position["column"] == old_column){
                    position["row"] = row;
                    position["column"] = column;
                };
            }
        }else if(draggable_item.getAttribute("comp_id")){
            let id = Number(draggable_item.getAttribute("comp_id"));
            if(components[id]["from"] != null){
                let node = nodes[components[id]["from"]];
                DisconnectCompFromNode(id,nodes.indexOf(node));
            }
            if(components[id]["to"] != null){
                let node = nodes[components[id]["to"]];
                DisconnectCompFromNode(id,nodes.indexOf(node));
            }
        }
}
