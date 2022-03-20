function isEmpty(str) {
    return !str.trim().length;
}

function evaluateinput() {
    let value = lastinput.value;
    if (isEmpty(lastinput.value)) { lastinput.style.backgroundColor = ""; return };

    if (value in config.staff && config.staff[value] in config.groups)
        lastinput.style.backgroundColor = config.groups[config.staff[value]][1];
    else if (value in config.staff) {
        lastinput.style.backgroundColor = "#FA842B";
        console.log("Falsche Gruppe von " + value);
    } else {
        lastinput.style.backgroundColor = "#f63d3d";
    }
}

function inputfocus(event) {
    lastinput = event.target;
    hasfocus = true;
    try {
        document.getElementById("d-" + event.target.id).appendChild(personendiv);
    } catch (error) {
        console.warn(error);
    }
    filterpersonenauswahl();

}

function savetableentry(id, montharrayindex, targetid) {
    let date = targetid.replace("s-", "");
    date = date.substring(0, date.length - 2);
    let index = targetid.split('-');
    index = index[index.length - 1];
    if (!(date in monthdata[currentfileindex][montharrayindex])) monthdata[currentfileindex][montharrayindex][date] = [];
    for (let i = 0; i < Object.keys(monthdata[currentfileindex].positions).length; i++) {
        if (i == index)
            monthdata[currentfileindex][montharrayindex][date][i] = document.getElementById(targetid).value;
        else if (!(i in monthdata[currentfileindex][montharrayindex][date]))
            monthdata[currentfileindex][montharrayindex][date][i] = null;
    }

    settitle(true);
}

document.addEventListener("click", globalclick);

function globalclick(event) {
    if (event.target == lastinput || !hasfocus)
        return;
    hasfocus = false;

    if (event.target.classList.contains("personelement")) {
        lastinput.value = event.target.innerHTML;
        inputfocusout_name();
    }

    try {
        if (!hasfocus)
            document.getElementById("personenauswahl").remove();
    } catch (error) {
        console.warn(error);
    }
}

function inputfocusout_name(event) {
    evaluateinput();
    savetableentry("monthtable", "days", lastinput.id);
}

function inputfocusout_studeinst(event) {
    savetableentry("einststudtable", "einststudtable", event.target.id);
}

function evaleinststud() {
    if (!init_all) return 0;
    let table = document.getElementById("monthtable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (i > 0) {
            let inputs = row.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i += 1) {
                if (document.getElementById("s-" + inputs[i].id).value == ""){
                    inputs[i].classList.add("nouse");
                    inputs[i].setAttribute("tabindex", "-1");
                }else{
                    inputs[i].classList.remove("nouse");
                    inputs[i].setAttribute("tabindex", "0");
                }
            }
        }
    }
}

function changecurrentfile(event) {
    init_all = false;

    //Berechnung ausführen für eine Speicherung
    calculatestud(currentfileindex, false);

    links = document.getElementsByClassName("filelinks");
    for (i = 0; i < links.length; i++) {
        links[i].className = links[i].className.replace(" active", "");
    }
    event.target.classList.add("active");
    currentfileindex = event.target.getAttribute("file");
    init();
    init_all = true;
    evaleinststud();
    calculatestud();
}

document.getElementById("search1").addEventListener("keyup", searchtable);
document.getElementById("search2").addEventListener("keyup", searchtable);

function searchtable(event) {
    if (!init_all) return 0;
    let table = document.getElementById("monthtable");
    let aclass = event.target.getAttribute("aclass");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (i > 0) {
            let inputs = row.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i += 1) {
                if (document.getElementById(inputs[i].id).value == event.target.value && !isEmpty(event.target.value))
                    inputs[i].classList.add(aclass);
                else inputs[i].classList.remove(aclass);
            }
        }
    }
}
//Bei Starttabelle kann man die Stunden editieren, um overall anzupassen
//Die ID des tds folgt dabei dem Schema, sodass nichts neues mehr nachgeschlagen werden muss
function updateoverall(event){
    //monthdata[fileindex]["overall"][position_index][row_t][column]
    //td.id = fileindex+"|"+position_index+"|"+row_t+"|"+column;
    let id = event.target.id;
    id = id.split("|");
    monthdata[id[0]]["overall"][id[1]][id[2]][id[3]] = parseFloat(event.target.innerHTML);
    calculatestud();//Stundenberechnung durchführen, um Farbskala zu aktualisieren
    settitle(true);
}

function settitle(showsaveind = false){
    let title = showsaveind ? config.name + "*" : config.name;
    if(showsaveind) issaved = false;
    document.getElementById("projectname").innerHTML = title;
    window.document.title = title;
}

window.onbeforeunload = function() {
    if(!issaved)
        return "Es gibt ungespeicherte Änderungen! Wollen sie das Programm wirklich schließen?";
}