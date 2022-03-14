
let savebtnconfig = document.getElementById("saveprojectsettings");

function openprojectsettings(event) {
    document.getElementById("projectsettingswindowcontext").style.display = "flex";
    savebtnconfig.style.display = "none";

    let oldelements = document.getElementsByClassName("automaticallycreated");
    let counter = 0;
    while(oldelements.length){
        oldelements[counter].parentNode.removeChild(oldelements[counter])
    }

    document.getElementById("projectnameconfig").value = config.name;

    //Gruppen
    let lasttr = document.getElementById("grouptable").getElementsByTagName("tr");
    lasttr = lasttr[lasttr.length - 1];
    for (const [key, value] of Object.entries(config.groups)) {
        let tr = document.createElement("tr");
        tr.classList.add("automaticallycreated");
        tr.classList.add("group");

        tr.appendChild(createtdfsettings(key, "text"));
        tr.appendChild(createtdfsettings(config.groups[key][0], "text"));
        tr.appendChild(createtdfsettings(config.groups[key][1], "color"));
        tr.appendChild(createtdfsettings("🗑️", null, "button", deletetr));

        document.getElementById("grouptable").insertBefore(tr, lasttr);
    }

    //Namen
    lasttr = document.getElementById("persontable").getElementsByTagName("tr");
    lasttr = lasttr[lasttr.length - 1];
    for (const [key, value] of Object.entries(config.staff)) {
        let tr = document.createElement("tr");
        tr.classList.add("automaticallycreated");

        tr.appendChild(createtdfsettings(key, "text"));
        tr.appendChild(createtdfsettings(config.staff[key], "text"));
        tr.appendChild(createtdfsettings("🗑️", null, "button", deletetr));

        document.getElementById("persontable").insertBefore(tr, lasttr);
    }

    //Dateien
    lasttr = document.getElementById("monthfiletable").getElementsByTagName("tr");
    lasttr = lasttr[lasttr.length - 1];
    for (const [key, value] of Object.entries(config.files)) {
        let tr = document.createElement("tr");
        tr.classList.add("automaticallycreated");

        tr.appendChild(createtdfsettings(key, "text"));
        tr.appendChild(createtdfsettings(config.files[key], "text"));
        tr.appendChild(createtdfsettings("🗑️", null, "button", deletetr));

        document.getElementById("monthfiletable").insertBefore(tr, lasttr);
    }
}

function deletetr(event) {
    if(event.target.parentElement.parentElement.classList.contains("group")){
        //Prüfen, ob noch Personen der Gruppe zugeordnet sind
        let candelete = true;
        trs = document.getElementById("persontable").getElementsByClassName("automaticallycreated");
        newot = Object;
        for(let i = 0; i < trs.length; i++){
            let inputs = trs[i].getElementsByTagName("input");
            if(inputs[1].value == event.target.parentElement.parentElement.getElementsByTagName("input")[0].value)
                candelete = false;
        }
        if(candelete){
            event.target.parentElement.parentElement.remove();
            savebtnconfig.style.display='inline-block';
        }else{
            if (window.confirm("Es sind noch Personen zu dieser Gruppe zugeordnet. Diese werden mit gelöscht. Wollen Sie fortfahren?")) {
                //Alle Personen löschen, die zu der Gruppe gehören
                trs = document.getElementById("persontable").getElementsByClassName("automaticallycreated");
                newot = Object;
                for(let i = 0; i < trs.length; i++){
                    let inputs = trs[i].getElementsByTagName("input");
                    if(inputs[1].value == event.target.parentElement.parentElement.getElementsByTagName("input")[0].value){
                        trs[i].remove();
                        i --;
                    }
                }
                event.target.parentElement.parentElement.remove();
                savebtnconfig.style.display='inline-block';
            }
              
        }
    }else{
        event.target.parentElement.parentElement.remove();
        savebtnconfig.style.display='inline-block';
    }
}

function createtr(table, element){
    let tocreate = element.getAttribute("create").split(",");
    lasttr = document.getElementById(table).getElementsByTagName("tr");
    lasttr = lasttr[lasttr.length - 1];
    let tr = document.createElement("tr");
    tr.classList.add("automaticallycreated");
    for (let i = 0; i < tocreate.length; i++) {
        if(tocreate[i] == "d")
            tr.appendChild(createtdfsettings("🗑️", null, "button", deletetr));
        else if(tocreate[i] == "c")
            tr.appendChild(createtdfsettings("#92aebc", "color"));
        else
            tr.appendChild(createtdfsettings("", "text"));
    }
    document.getElementById(table).insertBefore(tr, lasttr);
    savebtnconfig.style.display='inline-block';
}

function createtdfsettings(value, type, element = "input", func) {
    let td = document.createElement("td");
    let input = document.createElement(element);
    if (element == "button") {
        input.addEventListener("click", func);
        input.innerHTML = value;
    } else {
        input.value = value;
        input.type = type;
    }
    input.addEventListener("keydown", ()=>{savebtnconfig.style.display='inline-block';});
    input.addEventListener("change", ()=>{savebtnconfig.style.display='inline-block';});
    td.appendChild(input);
    return td;
}

function saveconfig(){
    config.name = document.getElementById("projectnameconfig").value;

    let newot = {};
    let trs = document.getElementById("grouptable").getElementsByClassName("automaticallycreated");
    for(let i = 0; i < trs.length; i++){
        let inputs = trs[i].getElementsByTagName("input")
        newot[inputs[0].value] = [inputs[1].value, inputs[2].value];
    }

    trs = document.getElementById("persontable").getElementsByClassName("automaticallycreated");
    newot = {};
    for(let i = 0; i < trs.length; i++){
        let inputs = trs[i].getElementsByTagName("input");
        newot[inputs[0].value] = inputs[1].value;
    }
    config.staff = newot;

    trs = document.getElementById("monthfiletable").getElementsByClassName("automaticallycreated");
    newot = {};
    let i = 0;
    for(i = 0; i < trs.length; i++){
        let inputs = trs[i].getElementsByTagName("input");
        newot[inputs[0].value] = inputs[1].value;
    }
    if(i != monthfiles.length){
        alert("Sie haben Monatsdateien gelöscht, bitte Laden Sie das Projekt neu!");
    }
    config.files = newot;

    closeprojectsettings();
    init();
    settitle(true);
}

function closeprojectsettings(event) {
    document.getElementById("projectsettingswindowcontext").style.display = "none";
}