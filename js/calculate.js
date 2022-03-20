function calculatestud(fileindex = currentfileindex, buildtable = true) {
    if (!init_all) return 0;

    let studobjects = {};
    let stud = [0];
    let studname = ["Name", "Gesamt"];

    for (position of Object.entries(monthdata[fileindex].positions)) {
        stud.push(0);
        studname.push(position[1]);
    }

    //Wochenende hinzunehmen
    studname.push("WE");
    let weposition = stud.push(0) - 1;

    //Gesammtstunden-Tabelle
    let overview_name = ["Gruppe", "Dieser Monat", "Gesamt"];
    let overview = {};

    for (const [key, value] of Object.entries(config.staff)) {
        if( !(value in studobjects)) studobjects[value] = {};
        studobjects[value][key] = [...stud]; 
    }

    for(const [index, value] of Object.entries(config.groups)){
        //Ja... Das Object sortieren ... nicht ganz fair aber fein
        studobjects[index] = Object.keys(studobjects[index]).sort().reduce(
            (obj, key) => { 
              obj[key] = studobjects[index][key]; 
              return obj;
            }, 
            {}
          );
          overview[value[0]] = []
          overview[value[0]][0] = 0;
          overview[value[0]][1] = 0;
    }

    let table = document.getElementById("monthtable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (i > 0) {
            let inputs = row.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i += 1) {

                //+ ist Indikator für geteilte Stelle
                if (inputs[i].value == "" || inputs[i].value.includes("+")) continue;

                if(!(inputs[i].value in config.staff)){
                    console.error("Unbekannter Name '"+inputs[i].value+"' bei Berechnung!");
                    continue;
                }
                let wstudarray_index = config.staff[inputs[i].value];

                studobjects[wstudarray_index][inputs[i].value][i + 1] += 1;

                if(inputs[i].classList.contains("weekend"))
                    studobjects[wstudarray_index][inputs[i].value][weposition] += 1;

                let ngestudwert = studobjects[wstudarray_index][inputs[i].value][0] + parseFloat(document.getElementById("s-" + inputs[i].id).value)
                studobjects[wstudarray_index][inputs[i].value][0] = ngestudwert;
                overview[config.groups[wstudarray_index][0]][0] += ngestudwert;

                //Check geteilte Stelle
                let geteilt = false;
                for (let name in studobjects[wstudarray_index]) {
                    if (name.includes(inputs[i].value) && name.includes("+")) {
                        studobjects[wstudarray_index][name][i + 1] += 1;
                        studobjects[wstudarray_index][name][0] += parseFloat(document.getElementById("s-" + inputs[i].id).value);

                        break;
                    }
                }
            }
        }
    }

    //Kopie der einfachen Tabelle bearbeiten
    //FIXME: Felder, die nicht mit im lookup sind markieren
    let lookup = calculate_overall(fileindex, JSON.parse(JSON.stringify(studobjects)), studname, overview);

    if(buildtable){
        let div = document.getElementById("d-berechnungen");
        div.innerHTML = "";
        headding = document.createElement("h3");
        headding.innerHTML = "Übersicht";
        div.appendChild(headding);
        createstudtableber(overview, overview_name, div);
        for(let key in studobjects){
            let headding = document.createElement("h2");
            headding.innerHTML = config.groups[key][0];
            headding.style.backgroundColor = config.groups[key][1];
            div.appendChild(headding);
            headding = document.createElement("h3");
            headding.innerHTML = "Diesen Monat";
            div.appendChild(headding);
            createstudtableber(studobjects[key], studname, div);
            headding = document.createElement("h3");
            headding.innerHTML = "Gesamt";
            div.appendChild(headding);
            let einst = document.createElement("div");
            let editable = null;
            if(monthdata[fileindex].prevcalculation == "start"){
                einst.innerHTML = "<p>Diese Tabelle dient als Ausgangspunkt.<br />Sie können die Grundlagendaten in der Gesamtstundentabelle ggf. anpassen.</p>";
                editable = true;
            }else{
                einst.innerHTML = 'Refferenz-Stunden:<input type="text" id="reff'+fileindex+"i"+key+'" onfocusout="calculatestud(); settitle(true);" value="'+monthdata[fileindex]["overall"]["reff"][key]+'">';
                editable = false;
            }
            div.appendChild(einst);
            createstudtableber(monthdata[fileindex]["overall"][key], monthdata[fileindex]["overall"]["positions"], div, true, editable, key)
        }
    }
}

function calculate_overall(fileindex, studobjects, studname, overview){
    //FIXME: könnte problematisch werden, wenn sich die Positionen über Monate ändern ist aber auch kein vorgesehener usecase bisher
    //Wenns igrnore ist sind wir am Anfang und damit können wirs ignorieren

    if(monthdata[fileindex].prevcalculation == "start" && "overall" in monthdata[fileindex]) 
        // Wenn Start nichts berechnen, da es manuelle Startwerte geben könnte
        // Wenn es allerdings noch nichts gibt wird es mit den Standard-werten initialisiert
        return;

    calculate = monthdata[fileindex].prevcalculation != "start";
    let prevmonth_index = false;
    if(calculate){
        //schauen obs für den vorherigen Monat überhaupt Daten gibt
        //FIXME der Lookup des fileindex muss mal überarbeitet wernde -> eigene Funktion?
        for(const [key, value] of Object.entries(monthfiles)){
            if(value.name ==  monthdata[fileindex].prevcalculation)
                prevmonth_index = key;
        }

        if(prevmonth_index === false || !("overall" in monthdata[prevmonth_index])){
            calculate = false;
        }
    }

    if(!("overall" in monthdata[fileindex]))
        monthdata[fileindex]["overall"] = {};

    monthdata[fileindex]["overall"]["positions"] = studname;

    let lookup = []; //Abbildung der Positionen des aktuellen Monats auf die des vorherigen (siweit vorhanden)
    if(calculate){
        //FIXME: Performance (wie eigentlich die ganze Routine XD)
        for(let gkey in studname){
            lookup[gkey] = false;
            for(const [key, value] of Object.entries(monthdata[prevmonth_index].overall.positions)){
                if(value  == studname[gkey]) lookup[gkey] = key;
            }
        }
    }

    for(const [position_index, studobject] of Object.entries(studobjects)){
        //Refferenz initialisieren wenns keins gibt
        if(!("reff" in monthdata[fileindex]["overall"])) monthdata[fileindex]["overall"]["reff"] = {};
        //Refferenzstunden anschauen (wenns sie gibt)
        if(typeof(document.getElementById("reff"+fileindex+"i"+position_index)) != 'undefined' 
            && document.getElementById("reff"+fileindex+"i"+position_index) != null){
            monthdata[fileindex]["overall"]["reff"][position_index] = parseFloat(document.getElementById("reff"+fileindex+"i"+position_index).value);
        }
        else if(!(position_index in monthdata[fileindex]["overall"]["reff"])){
            monthdata[fileindex]["overall"]["reff"][position_index] = 0; //Auf Null setzen, wenns keine Vorgabe giebt
            console.warn("NULL "+fileindex+"»"+position_index);
        }
        
        
        monthdata[fileindex]["overall"][position_index] = studobjects[position_index]; //berechnete Werte übernehmen
        for(const [name, studs] of Object.entries(studobjects[position_index])){
            if(calculate && name in monthdata[prevmonth_index]["overall"][position_index]){ //Prüfen ob Name in Berechnung des Vormonats enthalten //FIXME: Positionewechsel wird als nullung genommen
                for(let i = 1; i < studname.length; i++){
                    if(lookup[i]){
                        monthdata[fileindex]["overall"][position_index][name][i-1] += monthdata[prevmonth_index]["overall"][position_index][name][lookup[i]-1]; // vorherigen Monat dazu addieren
                    }
                }                        
            }

            //overview addieren
            overview[config.groups[position_index][0]][1] += monthdata[fileindex]["overall"][position_index][name][0];

            //Für die Gesamtübersicht immer die referenz abziehen
            let reff = monthdata[fileindex]["overall"]["reff"][position_index];
            if(name in specials["multiperson"]){//Wenn geteilter dienst nur den Anteil der Referenz abziehen
                monthdata[fileindex]["overall"][position_index][name][0] -= (reff / specials["multiperson"][name]);
            }else{
                //Sonnst ganze Referenz
                monthdata[fileindex]["overall"][position_index][name][0] -= reff;
            }
            
        }
    }
}

//Farbskala
//FIXME: Muss ein min-max skala werden
function GreenYellowRed(value, max) {
    value--;
    var r, g, b;
    if (value < max / 2) {
        r = Math.floor(200 * (value / (max / 2)));
        g = 255;
    } else {
        r = 255;
        g = Math.floor(255 * (((max / 2) - value % (max / 2)) / (max / 2))) + 50;
    }
    b = 0;
    return r + "," + g + "," + b;
}

function createstudtableber(studobject, studname, div, color = true, editable = false, position_index = null) {

    let tbl = document.createElement("table");
    tbl.classList.add("berechnungen");
    let tbdy = document.createElement("tbody");

    let th = null;
    let td = null;

    let tr = document.createElement("tr");
    for (n of studname) {
        th = document.createElement("th");
        th.innerHTML = n;
        tr.appendChild(th);
    }
    tbdy.appendChild(tr);

    let studmax = []; //Cachen der Studmax
    let studmin = []; //Cachen der Studmin
    for (let row_t in studobject) {
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.innerHTML = row_t;
        tr.appendChild(td);
        let k = 0;
        for (let column in studobject[row_t]) {
            td = document.createElement("td");
            if(color){
                if(!(column in studmax)){
                    //Wir haben noch keinen Maximalwert also müssen wir einen berechnen
                    studmax[column] = 0;
                    studmin[column] = false;
                    for(let row_i in studobject){
                        if(studobject[row_i][column] > studmax[column]) studmax[column] = studobject[row_i][column];
                        if(!studmin[column] || studobject[row_i][column] < studmin[column]) studmin[column] = studobject[row_i][column];
                    }
                }
                td.style.backgroundColor = "rgb(" + GreenYellowRed(studobject[row_t][column], studmax[column]) + ")";
            }
            if(editable){
                td.setAttribute("contenteditable", "true");
                td.setAttribute("tabindex", "0");
                td.addEventListener("focusout", updateoverall);
                //monthdata[fileindex]["overall"][position_index][row_t][column]
                td.id = currentfileindex+"|"+position_index+"|"+row_t+"|"+column;
            }
            td.innerHTML = studobject[row_t][column];
            tr.appendChild(td);
            k++;
        }
        tbdy.appendChild(tr);
    }

    tbl.appendChild(tbdy);
    div.appendChild(tbl);
}