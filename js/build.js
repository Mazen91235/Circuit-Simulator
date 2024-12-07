let binding_wire_html = '<div class="binding_wire"><div class="v_binder"><div class="v_wire"></div></div><div class="h_binder"><div class="h_wire"></div></div></div>';
let binding_wire_elm;
let grid = document.querySelector(".simulator_bg");
let grid_size = 60;
let max_row = 0;
let max_col = 0;
let grid_expanded = false; // Prevent redundant expansions
let last_x,last_y,final_x=grid_size,final_y=grid_size;
let is_expanding = false;
let rows = 50,cols = 50;
let min_rows = 50,min_cols = 50;
let expandend_cols=0,expandend_rows=0,diff_x=0,diff_y=0,temp_x,temp_y;
CreateBindingWire();
function CreateBindingWire(){
    try{
        binding_wire_elm = document.createElement("div");
        binding_wire_elm.classList.add("binding_wire");
        let v_binder = document.createElement("div");
        v_binder.classList.add("v_binder");
        let v_wire = document.createElement("div");
        v_wire.classList.add("v_wire");
        let h_binder = document.createElement("div");
        h_binder.classList.add("h_binder");
        let h_wire = document.createElement("div");
        h_wire.classList.add("h_wire");
        v_binder.appendChild(v_wire);
        h_binder.appendChild(h_wire);
        binding_wire_elm.appendChild(v_binder);
        binding_wire_elm.appendChild(h_binder);
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
function ResetCircuit(){
    try{
        components = [];
        nodes = [];
        ground_node = null;
        analyzed = false;
        analyze_errors = [];
        frequency = 0;
        ChooseSubMenu("inputs");
        CloseContextMenu();
        CloseSideBar();
        window.scrollTo(0,0);
        ResetEventListeners();
        simulator.innerHTML = '';
        CloseContextMenu();
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
function HandleElement(){
    try{
        if(!draggable_item) return;
        if(draggable_item.classList.contains("node")) return;
        let comp;
        let row = Number(draggable_item.getAttribute("row"));
        let column = Number(draggable_item.getAttribute("column"));
        let type = draggable_item.getAttribute("type");
        let id = draggable_item.getAttribute("comp_id");
        if(!id){
            id = components.length;
            comp = {"id":components.length,"value":0,"unit":'',"measuring_unit":GetMeasuringUnit(type), "type":type, "orientation":draggable_item.getAttribute("orientation"), "heading":draggable_item.getAttribute("heading"),"row": row,"column": column};
            if(type == 'v' || type == 'i' || type == "v_d" || type == "i_d"){
                comp["source_type"] = "dc";
                comp["phase"] = "";
            }
            if(type == 'c' || type == 'l'){
                comp["value_type"] = type;
            }
            draggable_item.setAttribute("comp_id",id);
            draggable_item.classList.add(`item-id-${id}`);
            draggable_item.classList.remove("temp");
            components.push(comp);
            if(!sidebar_opened){
                ChooseSubMenu("inputs");
                CloseSideBar();
                PutInputs();
            }else{
                ChooseSubMenu("inputs");
                EditComponent(id);
            }
        }else{
            comp = components[Number(id)];
            if(!comp) return;
            comp["row"] = row;
            comp["column"] = column;
        }
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        PrepareContextMenu();
    }

}
function GetPosition(x,y){
    try{
        let row = Math.floor((y + window.scrollY) / gridSize) + 1;
        let column = Math.floor((x + window.scrollX) / gridSize) - 1;
        return [row,column];
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
function updateStyleTag(selector, property, value) {
    try{
        let styleTag = document.getElementById('global-styles');
    
        // Create a <style> tag if it doesn't exist
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'global-styles';
            document.head.appendChild(styleTag);
        }
    
        // Append the rule instead of replacing it
        let newRule = `.simulator_bg ${selector} { ${property}: ${value}px !important; }`;
    
        if (!styleTag.textContent.includes(newRule)) {
            styleTag.textContent += newRule;
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
}
function CreateGrid(width, height) {
    try{
        if (!width) width = (cols*grid_size);
        if (!height) height = (rows*grid_size);
    
        // Avoid unnecessary re-renders
        if (grid_expanded) return;
    
        // Clear current grid lines
        // grid.innerHTML = "";
    
        width = Math.ceil(width/grid_size) * grid_size;
        height = Math.ceil(height/grid_size) * grid_size;
        grid.style.width = width + "px";
        grid.style.height = height + "px";
        simulator.style.width = width + "px";
        simulator.style.height = height + "px";
        let x,y;
        // Add vertical lines
        // for (x = final_x; x < width; x += grid_size) {
        //     let vLine = document.createElement("div");
        //     vLine.className = "v-wire";
        //     vLine.style.left = `${x}px`;
        //     vLine.style.height = `${height}px`;
        //     grid.appendChild(vLine);
        // }
        // final_x = x;
        // // Add horizontal lines
        // for (y = final_y; y < height; y += grid_size) {
        //     let hLine = document.createElement("div");
        //     hLine.className = "h-wire";
        //     hLine.style.top = `${y}px`;
        //     hLine.style.width = `${width}px`;
        //     grid.appendChild(hLine);
        // }
        final_y = y;
        grid_expanded = true; // Prevent redundant updates
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        updateStyleTag(".v-wire","height",height);
        updateStyleTag(".h-wire","width",width);
    }
}


function UpdateMaxPosition(row, column) {
    try{
        max_row = Math.max(max_row, row);
        max_col = Math.max(max_col, column);
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
function StartExpanding(){
    try{
        if (!event.target.classList.contains("simulator_container") && 
        !event.target.classList.contains("simulator_bg")) return;
        if (["component", "node", "wire", "connector_node", "nav"].some(cls => event.target.classList.contains(cls))) return;
        is_expanding = true;
        last_x = event.clientX;
        last_y = event.clientY;
        temp_x = event.clientX;
        temp_y = event.clientY;
        diff_x=0;
        diff_y=0;
        expandend_cols=0;
        expandend_rows=0;
        // console.log(window.scrollX,window.scrollY);
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
function CheckExpansion(){
    try{
        if(!is_expanding) return;
        if(Math.abs(last_x - event.clientX) > Math.abs(diff_x)) diff_x = last_x - event.clientX;
        if(Math.abs(last_y - event.clientY) > Math.abs(diff_y)) diff_y = last_y - event.clientY;
        //Scrolling
        window.scrollBy(temp_x - event.clientX,temp_y - event.clientY);
        temp_x = event.clientX;
        temp_y = event.clientY;
        let diff_col,diff_row;
        //Increasing Width
        if(diff_x > 0){
            diff_col = Math.floor(diff_x / grid_size);
            expandend_cols = diff_col;
            grid_expanded = false;
        }
        // else{
        //     diff_col = Math.floor(diff_x / grid_size);
        //     cols += diff_col;
        //     if(cols < min_cols) cols = min_cols;
        //     if(max_col > (cols - 6)) cols = (max_col + 6);
        //     if(final_x > (max_col*grid_size)) final_x = (max_col * grid_size);
        //     grid_expanded = false;
        // }
        if(diff_y > 0){
            diff_row = Math.floor(diff_y / grid_size);
            expandend_rows = diff_row;
            grid_expanded = false;
        }
        // else{
        //     diff_row = Math.floor(diff_y / grid_size);
        //     rows += diff_row;
        //     if(rows < min_rows) rows = min_rows;
        //     if(max_row > (rows - 6)) rows = (max_row + 6);
        //     if(final_y > (max_row*grid_size)) final_y = (max_row * grid_size);
        //     grid_expanded = false;
        // }
    
        if(event.clientX > (window.innerWidth - 40) || event.clientX < 40 || event.clientY > (window.innerHeight - 40) || event.clientY < 100 || !event.target.classList.contains("simulator_container")) StopExpanding();
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
function StopExpanding(){
    try{
        // if(!(event.target.classList.contains("simulator_container") || event.target.classList.contains("simulator_bg"))) return;
        if(!is_expanding) return;
        is_expanding = false;
        grid_expanded = false;
        cols += expandend_cols;
        rows += expandend_rows;
        grid.style.width = (cols * grid_size) + "px";
        grid.style.height = (rows * grid_size) + "px";
        simulator.style.width = (cols * grid_size) + "px";
        simulator.style.height = (rows * grid_size) + "px";
        CreateGrid();
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }finally{
        ResetEventListeners();
    }
}