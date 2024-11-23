let node = `<div class="node">0</div>`
let node_placeholder = `<div class="node node_placeholder">+</div>`;
$(window).bind('load',function(){
    document.querySelectorAll(".component_selector .component").forEach(comp => {
        SetDraggable(comp);
        comp.addEventListener('mousedown', () => {
            temp_element = comp.cloneNode(true);
            PositionComp();
            temp_element.style.display = "none";
            temp_element.classList.add("temp");
            temp_element.setAttribute("heading","top");
            temp_element.innerHTML += `<div class="connector_node from" type="from"></div><div class="connector_node to" type="to"></div>`;  
            analyzed = false;            
            simulator.appendChild(temp_element);
            SetDraggable(temp_element);
            draggable_item = temp_element;
            document.addEventListener('mousemove', onDrag);
        });
        CheckDuplicateLabels();
    });
    document.querySelectorAll(".node").forEach(node => {
        SetDraggable(node);
    });
});
function CompClicked(comp){
    if(comp.classList.contains("node")){
        ActivateNode(Number(comp.getAttribute("node")));
        return;
    }else{
        let id = Number(comp.getAttribute("comp_id"));
        EditComponent(id);
    }
}
function CheckInDeletionArea(){
    let deleted = false
    simulator.querySelectorAll(".component").forEach(comp => {
        if(comp){
            if(!comp.style.gridArea || comp.style.gridArea.split(' / ')[0] <= 2){
                components.splice(Number(comp.getAttribute("comp_id")),1);
                comp.remove();
                deleted = true;
            }
        }
    });
    setTimeout(() => {
        ResetIDS();
    }, 100);
    setTimeout(() => {
        if(deleted){
            analyzed = false;
            ChooseSubMenu("inputs");
        };
    }, 100);
}