let simulator = document.querySelector(".simulator_container");
let draggable_item = null;
let wire_comp = null;
let wire_type = null;
let scrolling = false,scrolling_interval = null;
let temp_element = null;
let components = [];
let nodes = [];
let context_menu = document.querySelector(".context-menu");
let isDragging = null;
let NodeID = null;
let PositionID = null;

$(window).bind('load',function(){
    try{
        CreateGrid();
        window.addEventListener('resize',() => {
            CreateGrid();
        });
        ResetEventListeners();
        setTimeout(() => {
            window.scrollTo(0,0);
        }, 1);
        window.onscroll = () => {
            event.preventDefault();
        };
        // PutInputs();
    }catch(err){
        analyze_errors = [];
        analyze_errors.push("Unexpected Error Occurred! Please try again later.");
        // console.log(array_values);
        analyzed = false;
        setting_related = false;
        ChooseSubMenu("errors");
        return;
    }
});
function ShiftPhase(v){
    try{
        let phase = GetDegree(Math.abs(Math.atan(math.im(v) / math.re(v))));
        if(v.re == 0 && v.im == 0) return phase;
        if(v.re >= 0 && v.im <= 0) phase *= -1;
        if(v.re <=0 && v.im <= 0) phase = 180 + phase;
        else if(v.re <=0 && v.im >= 0) phase = 180 - phase;
        return phase;
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
function AssignUnit(v,type="phase"){
    try{
        let units_arr = ['p','n','μ','m','','k','M','G'];
        let powers = [-12,-9,-6,-3,0,3,6,9];
        let unit = 4;
        v = math.complex(v);
        if(math.isComplex(v)){
            if(isNaN(v.re) || isNaN(v.im)){
                analyze_errors = [];
                analyze_errors.push("Unexpected Error Occurred! Please try again.");
                analyzed = false;
                ChooseSubMenu("errors");
                return;
            }
        }else{
            if(isNaN(v)){
                analyze_errors = [];
                analyze_errors.push("Unexpected Error Occurred! Please try again3.");
                analyzed = false;
                ChooseSubMenu("errors");
                return;
            }
        }
        let value = Math.sqrt((math.re(v) * math.re(v)) + (math.im(v) * math.im(v)));
        let phase = GetDegree(Math.abs(Math.atan(math.im(v) / math.re(v))));
        if(phase == 0) value = math.re(v);
        else phase = ShiftPhase(v);
        if(((Math.abs(value) * Math.pow(10,12)).toFixed(1) <= 0 && value != 0) || Math.abs(value) * Math.pow(10,-9) >= 1000){
            if((Math.abs(value) * Math.pow(10,12)).toFixed(1) <= 0 && value != 0){
                // value *= Math.pow(10,12);
                // unit = 0;
                value = 0;
                return value.toString() + ' ' + units_arr[unit];
            }else{
                // value *= Math.pow(10,-9);
                // unit = units_arr.length - 1;
                value = "Infinity";
                return value.toString() + ' ' + units_arr[unit];
            }
        }
        if(value == 0){
            return value.toString() + ' ' + units_arr[unit];
        }
        while(Math.abs(value).toFixed(1) <= 0 || Math.abs(value) >= 1000){
            if(Math.abs(value).toFixed(1) <= 0){
                if(unit > 0){
                    value *= 1000;
                    unit -= 1;
                }
            }else{
                if(unit < units_arr.length - 1){
                    value /= 1000;
                    unit += 1;
                }
            }
        }
        value = Number(Number(value).toFixed(3));
        phase = Number(Number(phase).toFixed(3));
        if(phase == 0){
            return value.toString() + ' ' + units_arr[unit];
        }else{
            if(type == "phase"){
                return value.toString() + '∠' + phase.toString() + '° ' + units_arr[unit];
            }else{
                if(math.abs((v.re * math.pow(10,-1*powers[unit])).toFixed(3)) == 0){
                    return ((v.im * math.pow(10,-1*powers[unit])).toFixed(3)) + 'j ' + units_arr[unit];
                }else if(math.abs((v.im * math.pow(10,-1*powers[unit])).toFixed(3)) == 0){
                    return (v.re * math.pow(10,-1*powers[unit])).toFixed(3) + ' ' + units_arr[unit];
                }else{
                    if(v.im > 0){
                        return (v.re * math.pow(10,-1*powers[unit])).toFixed(3) + ' + ' + (v.im * math.pow(10,-1*powers[unit])).toFixed(3) + 'j ' + units_arr[unit];
                    }else{
                        return (v.re * math.pow(10,-1*powers[unit])).toFixed(3) + ' - ' + (v.im * -1 * math.pow(10,-1*powers[unit])).toFixed(3) + 'j ' + units_arr[unit];
                    }
                }
            }
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
function GetValue(value,unit){
    try{
        let units_arr = ['p','n','μ','m','','k','M','G'];
        let powers = [-12,-9,-6,-3,0,3,6,9];
        let total = value * Math.pow(10,powers[units_arr.indexOf(unit)]);
        return total;
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
function GetRadian(angle){
    try{
        return (angle/180)*Math.PI;
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
function GetDegree(radian){
    try{
        return (radian / Math.PI) * 180;
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
function GetComplexValue(value,phase,unit){
    try{
        let units_arr = ['p','n','μ','m','','k','M','G'];
        let powers = [-12,-9,-6,-3,0,3,6,9];
        let total_value = math.complex(value*Math.cos(GetRadian(phase)),value*Math.sin(GetRadian(phase)));
        let total = math.multiply(total_value,math.complex(Math.pow(10,powers[units_arr.indexOf(unit)]),0));
        return total;
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
function GetMeasuringUnit(type){
    try{
        let types = ['v','i','r','i_d','v_d',"l",'c'];
        let units = ['V','A','Ω','A','V','H','F'];
        if(!types.includes(type)){
            analyze_errors = [];
            analyze_errors.push("Undefined Type");
            ChooseSubMenu("errors");
            return;
        }
        return units[types.indexOf(type.toLowerCase())];
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

function GetComponents(type){
    try{
        let comps = [];
        for(let i = 0;i<components.length;i++){
            if(components[i]["type"] == type) comps.push(components[i]);
            else if(components[i]["type"] == "v_d" && type == "v") comps.push(components[i]);
            else if(components[i]["type"] == "i_d" && type == "i") comps.push(components[i]);
        }
        return comps;
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
function ResetIDS(){
    try{
        for(i=0;i<components.length;i++){
            let comp = components[i];
            let elm = simulator.querySelector(`.item-id-${comp["id"]}`);
            if(!comp || !elm) continue;
            elm.classList.remove(`item-id-${comp["id"]}`);
            elm.classList.add(`item-id-${i}`);
            elm.setAttribute("comp_id",i);
            comp["id"] = i;
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
function ResetEventListeners(){
    try{
        document.addEventListener("mousedown",StartExpanding);
        document.addEventListener("mousemove",CheckExpansion);
        document.addEventListener("mouseup",StopExpanding);
        simulator.querySelectorAll(".component").forEach(comp => {
            SetDraggable(comp);
        });
        PrepareContextMenu();
        PrepareNodesContextMenu();
        SetNodesDraggable();
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