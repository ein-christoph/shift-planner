const butDir = document.getElementById('opendir');
const butsaveall = document.getElementById("saveall");
const butsaveas = document.getElementById("saveas");

async function init() {

    buildmonthtable();

    settitle();

    //Auswahlliste der Personen
    personendiv = document.createElement("div");
    personendiv.id = "personenauswahl";

    person = document.createElement("div");
    person.innerHTML = "";
    person.setAttribute("tabindex", "-1");
    person.style.height = "30px";
    person.classList.add("personelement");
    personendiv.appendChild(person);

    for (const [key, value] of Object.entries(config.staff)) {
        if(key.includes("+")){//kleine Spielerei für geteielte Dienste (durch + getrennt)
            if(!("multiperson" in specials)) specials["multiperson"] = [];
            let persons = key.split("+");
            persons.forEach(person => {
                specials["multiperson"][person] = persons.length;
            });
            continue;
        }
        person = document.createElement("div");
        person.innerHTML = key;
        person.setAttribute("tabindex", "-1");
        person.classList.add("personelement");
        if (config.staff[key] in config.groups)
            person.style.backgroundColor = config.groups[config.staff[key]][1];
        personendiv.appendChild(person);
    }


    document.getElementById("defaultOpen").click();
    document.getElementById("perpagetabs").style.display = "block";
}

function filterpersonenauswahl(event = null) {
    let outline = false;
    let enter = false;
    if(event){
        if(event.key == "ArrowDown")
            outline = 1;
        else if(event.key == "ArrowUp"){
            outline = -1;
        }else if(event.key == "Enter"){
            enter = true;
        }
    }
    let divs = document.getElementById("personenauswahl").getElementsByTagName('div');
    let lastdiv = null;
    let nextdivfocus = false;
    let firstname = divs[0];
    for (let i = 0; i < divs.length; i += 1) {
        if (!divs[i].innerHTML.includes(lastinput.value) && !isEmpty(lastinput.value) && !isEmpty(divs[i].innerHTML))
            divs[i].style.display = "none";
        else{
            if(firstname == divs[0])
                 firstname = divs[i];
            if(nextdivfocus){
                divs[i].classList.add("focus"); 
                lastdiv.classList.remove("focus");
                nextdivfocus = false;
            }
            //Nur selected ändern, wenn outline gesetzt ist, das aktuelle element focus hat
            if((outline||enter) && divs[i].classList.contains("focus")){
                if(enter){
                    divs[i].classList.remove("focus");
                    divs[i].click();
                    return;
                }

                if(outline == -1 && lastdiv != null){lastdiv.classList.add("focus"); divs[i].classList.remove("focus");}
                if(outline == 1 && i +1 < divs.length){ nextdivfocus = true;}
                outline = false; 
            }
            divs[i].style.display = "block";
            lastdiv = divs[i];
        }
    }

    if(outline){
        firstname.classList.add("focus");
    }
    
}

async function buildmonthtable() {
    let div = document.getElementById("d-monthtable");
    div.innerHTML = "";

    let month = monthdata[currentfileindex];

    let monthdate = new Date(month.date);
    monthdate.addHours(3); //Zeitumstellung... FIXME...

    let columns = 0;

    //Tabelle für die Namen bauen
    //Eventuell in Fuktion auslagern, da zweimal gebaut wird?

    let tbl = document.createElement("table");
    tbl.id = "monthtable";
    let tbdy = document.createElement("tbody");
    //Thead
    let tr = document.createElement("tr");
    //Date
    let th = document.createElement("th");
    th.innerHTML = monthdate.toLocaleDateString("de-DE", { month: "long" });
    th.classList.add("date");
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = monthdate.toLocaleDateString("de-DE", { year: "numeric" });
    th.classList.add("date");
    tr.appendChild(th);
    //Positions
    for (const [key, value] of Object.entries(month.positions)) {
        th = document.createElement("th");
        th.innerHTML = value;
        tr.appendChild(th);
        columns++;
    }
    tbdy.appendChild(tr);
    //Monthdates
    let nextmonth = new Date(monthdate);
    nextmonth.setMonth(nextmonth.getMonth() + 1);
    for (let datei = new Date(monthdate); datei < nextmonth; datei.setDate(datei.getDate() + 1)) {
        let tr = document.createElement("tr");
        let weekdayname = datei.toLocaleDateString("de-DE", { weekday: "short" });;
        if (weekdayname == "Sa") tr.classList.add("sa");
        if (weekdayname == "So") tr.classList.add("so");
        let isweeekend = (weekdayname == "So" || weekdayname == "So");
        //Date
        let th = document.createElement("td");
        th.innerHTML = weekdayname;
        tr.appendChild(th);
        th = document.createElement("td");
        th.innerHTML = datei.toLocaleDateString("de-DE", { month: "numeric", day: "numeric" });
        tr.appendChild(th);
        //Positions
        //schauen, ob es in der Datei daten für die Tabelle gibt
        if (datei.toISOString().split('T')[0] in month.days) {
            let monthrow = month.days[datei.toISOString().split('T')[0]];
            if (monthrow.length < columns) {
                console.error("Monatsarray von" + datei.toISOString().split('T')[0] + " hat falsche Länge");
                continue;
            }
            for (let i = 0; i < columns; i++) {
                let id = datei.toISOString().split('T')[0] + "-" + i;
                th = document.createElement("td");
                th.appendChild(buildsearchbox(id, monthrow[i], true, isweeekend));
                tr.appendChild(th);
            }
        } else
            for (let i = 0; i < columns; i++) {
                let id = datei.toISOString().split('T')[0] + "-" + i;
                th = document.createElement("td");
                th.appendChild(buildsearchbox(id, null, true, isweeekend));
                tr.appendChild(th);
            }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    div.appendChild(tbl);

    //Tabelle für die Einstellungen bauen
    div = document.getElementById("d-einststudtable");
    div.innerHTML = "";
    tbl = document.createElement("table");
    tbl.id = "einststudtable";
    tbdy = document.createElement("tbody");
    //Thead
    tr = document.createElement("tr");
    //Date
    th = document.createElement("th");
    th.innerHTML = monthdate.toLocaleDateString("de-DE", { month: "long" });
    th.classList.add("date");
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = monthdate.toLocaleDateString("de-DE", { year: "numeric" });
    th.classList.add("date");
    tr.appendChild(th);
    //Positions
    columns = 0;
    for (const [key, value] of Object.entries(month.positions)) {
        th = document.createElement("th");
        th.innerHTML = value;
        tr.appendChild(th);
        columns++;
    }
    tbdy.appendChild(tr);
    //Monthdates
    for (let datei = new Date(monthdate); datei < nextmonth; datei.setDate(datei.getDate() + 1)) {
        let tr = document.createElement("tr");
        let weekdayname = datei.toLocaleDateString("de-DE", { weekday: "short" });;
        if (weekdayname == "Sa") tr.classList.add("sa");
        if (weekdayname == "So") tr.classList.add("so");
        //Date
        let th = document.createElement("td");
        th.innerHTML = weekdayname;
        tr.appendChild(th);
        th = document.createElement("td");
        th.innerHTML = datei.toLocaleDateString("de-DE", { month: "numeric", day: "numeric" });
        tr.appendChild(th);
        //Positions
        //schauen, ob es in der Datei daten für die Tabelle gibt

        if (datei.toISOString().split('T')[0] in month.einststudtable) {
            let monthrow = month.einststudtable[datei.toISOString().split('T')[0]];
            if (monthrow.length < columns) {
                console.error("Monatsarray von" + datei.toISOString().split('T')[0] + " hat falsche Länge");
                continue;
            }
            for (let i = 0; i < columns; i++) {
                let id = "s-" + datei.toISOString().split('T')[0] + "-" + i;
                th = document.createElement("td");
                th.appendChild(buildsearchbox(id, monthrow[i], false));
                tr.appendChild(th);
            }
        } else
            for (let i = 0; i < columns; i++) {
                let id = "s-" + datei.toISOString().split('T')[0] + "-" + i;
                th = document.createElement("td");
                th.appendChild(buildsearchbox(id, null, false));
                tr.appendChild(th);
            }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    div.appendChild(tbl);
}


function buildsearchbox(id, value, name = true, isweeekend = false) {
    let div = document.createElement("div");
    div.id = "d-" + id;
    let input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.classList.add("nameinput");
    if (name) {
        if (value in config.staff && config.staff[value] in config.groups)
            input.style.backgroundColor = config.groups[config.staff[value]][1];
        input.addEventListener("focusin", inputfocus);
        input.addEventListener("keyup", filterpersonenauswahl);
        input.addEventListener("focusout", inputfocusout_name);
    } else {
        input.placeholder = "---";
        input.classList.add("emptyplaceholdr");
        input.addEventListener("focusout", inputfocusout_studeinst);
    }
    input.id = id;
    if(isweeekend) input.classList.add("weekend");
    div.appendChild(input);
    return div;
}