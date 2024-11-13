function ShowEdit(elm_index){
    ShowForm("edit_element_form");
    document.querySelector(".edit_element_form").style.display = "flex";
    let form = document.querySelector(".edit_element_form > form");
    let comp = components[elm_index];
    Type = form.querySelector("#edit_type");
    Value = form.querySelector("#edit_value");
    From = form.querySelector("#edit_from");
    To = form.querySelector("#edit_to");
    $(From).val(comp["from"]).trigger("change");
    $(To).val(comp["to"]).trigger("change");
    Row_column = form.querySelector("#row_column");
    Row_column.value = comp["row"] + ' ' + comp["column"];

    let nodes = [comp["from"],comp["to"]];
    if([0,1].includes(components.indexOf(comp))){
        form.querySelector("#delete_comp_btn").style.display = "none";
    }else{
        document.getElementById("delete_comp_btn").setAttribute("onclick","DeleteComponent("+ elm_index +")");
    }
    $(".edit_element_form #edit_type").val(comp["type"].toLowerCase()).trigger('change');
    $(".edit_element_form #edit_unit").val(comp["unit"]).trigger('change');
    Value.value = comp["value"];
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
    temp_components.splice(temp_components.indexOf(comp),1);
    if(!ValidateCircuit(temp_components,nodes)){
        return;
    }
    comp["value"] = Value;
    comp["type"] = Type.toUpperCase();
    comp["unit"] = Unit;
    comp["orientation"] = GetOrientation_Heading(Type,From,To,comp)[0];
    comp["heading"] = GetOrientation_Heading(Type,From,To,comp)[1];
    if(From == comp["to"] && To == comp["from"]){
        let temp = comp["from"];
        comp["from"] = comp["to"];
        comp["to"] = temp;
    }else if(comp["from"] != From || comp["to"] != To){
        if(comp == components[0]){
            form.querySelector(".error").textContent = "Cannot Change Nodes of this primary element to keep the shape of the circuit.";
            return;
        }
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