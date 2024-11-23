`
<label>Type</label>
<select name="Type" class="type" id="type-${components.indexOf(comp)}">
    <option value="">Type</option>
    <option value="v">Voltage Source</option>
    <option value="i">Current Source</option>
    <option value="r">Resistance</option>
</select>
`;
SetUnits(id);                    
setTimeout(() => {
    $(elm.querySelector(".type")).val(components[id]["type"].toString()).trigger("change");
}, 100);
                    