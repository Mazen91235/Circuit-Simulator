function ShowEdit(elm){
    ShowForm("edit_element_form");
    document.querySelector(".edit_element_form").style.display = "flex";
    let form = document.querySelector(".edit_element_form > form");
    let comp = GetComp(Number(elm.style.getPropertyValue("grid-area").split(' / ')[0]),Number(elm.style.getPropertyValue("grid-area").split(' / ')[1]));
    Type = form.querySelector("#edit_type");
    Value = form.querySelector("#edit_value");
    From = form.querySelector("#edit_from");
    To = form.querySelector("#edit_to");
    $(From).val(comp["from"]).trigger("change");
    $(To).val(comp["to"]).trigger("change");
    Row_column = form.querySelector("#row_column");
    Row_column.value = elm.style.getPropertyValue("grid-area").split(' / ')[0] + ' ' + elm.style.getPropertyValue("grid-area").split(' / ')[1];

    let nodes = elm.getAttribute("nodes").split(' ');
    if(nodes[0] == 0 && nodes[1] == 1 && comp["row"] <= last_row || nodes[0] == 1 && nodes[1] == 0 && comp["row"] <= last_row){
        // From.disabled = true;
        // From.value = nodes[0];
        // To.disabled = true;
        // To.value = nodes[1];
        // Type.disabled = true;
        form.querySelector("#delete_comp_btn").style.display = "none";
    }
    $(".edit_element_form #edit_type").val(elm.getAttribute("type").toLowerCase()).trigger('change');
    document.getElementById("delete_comp_btn").setAttribute("onclick","DeleteComponent("+ GetIndex(comp) +")");
    Value.value = elm.getAttribute("value");
}
function ValidateEdit(Type,Value,From,To){
    if(Type == "type"){
        form.querySelector(".error").textContent = "Type cannot be empty";
        return;
    }
    if(Value.length == 0){
        form.querySelector(".error").textContent = "Value cannot be empty";
        return;
    }
    if(From.length == 0 || To.length == 0){
        form.querySelector(".error").textContent = "Nodes cannot be empty";
        return;
    }
    if(From == To){
        form.querySelector(".error").textContent = "Cannot Make Element Start and End at same node";
        return;
    }
}
function EditElement(form){
    event.preventDefault();
    let Row_Column = form.querySelector("#row_column").value;
    let comp = GetComp(Number(Row_Column.split(' ')[0]),Number(Row_Column.split(' ')[1]));

    Type = form.querySelector("#edit_type").value;
    Value = form.querySelector("#edit_value").value;
    Unit = form.querySelector("#edit_unit").value;
    From = form.querySelector("#edit_from").value;
    To = form.querySelector("#edit_to").value;
    ValidateEdit(Type,Value,From,To);
    if(!ValidateAddElement(Type,Value,From,To)){
        return;
    }
    let new_elm = {"type":Type.toUpperCase(),"value":Value,"unit":Unit,"from":From,"to":To};
    let temp_components = JSON.parse(JSON.stringify(components));
    temp_components.push(new_elm);
    if(!ValidateCircuit(temp_components,nodes)){
        return;
    }
    comp["value"] = Value;
    comp["type"] = Type.toUpperCase();
    comp["unit"] = Unit;
    if(From == comp["to"] && To == comp["from"]){
        let temp = comp["from"];
        comp["from"] = comp["to"];
        comp["to"] = temp;
        comp["orientation"] = GetOrientation_Heading(Type,From,To)[0];
        comp["heading"] = GetOrientation_Heading(Type,From,To)[1];
    }else if(comp["from"] != From || comp["to"] != To){
        DeleteComponent(components.indexOf(comp));
        if(From >= nodes.length){
            From -= 1;
            if(From == To){
                From = 0;
            }
        }
        if(To >= nodes.length){
            To -= 1;
            if(From == To){
                To = 0;
            }
        }
        let add_element_form = document.querySelector("#add_element_form");
        $(add_element_form.querySelector("#type")).val(Type).trigger("change");
        add_element_form.querySelector("#value").value = Value;
        SetUnits(add_element_form.querySelector("#type"),"add_element_form");
        $(add_element_form.querySelector("#unit")).val(Unit).trigger("change");
        AddNodes("#add_element_form",add_element_form.querySelector("#from"),add_element_form.querySelector("#to"));
        $(add_element_form.querySelector("#from")).val(From).trigger("change");
        $(add_element_form.querySelector("#to")).val(To).trigger("change");
        AddElement(add_element_form);
        CloseForm("add_element_form");
    }
    BuildCircuit();
    CloseForm(form.id);
}