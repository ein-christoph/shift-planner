function opennewpage(event) {
    document.getElementById("newpagewindowcontext").style.display = "flex";
    
    //Vorheriger Monat
    let select = document.getElementById("prevmonth");
    select.innerHTML = "";
    let option = document.createElement("option");
    option.value="";
    option.innerHTML="Keiner";
    select.appendChild(option);
    let i = 0;
    for(const [key, value] of Object.entries(config.files)){
        option = document.createElement("option");
        option.value=value;
        option.innerHTML=key;
        select.appendChild(option);
        i++;
    }

    //Vorlage
    select = document.getElementById("monthpreset");
    select.innerHTML = "";
    option = document.createElement("option");
    option.value="-1";
    option.innerHTML="Keine";
    select.appendChild(option);
    for(let i = 0; i < monthfiles.length; i++){
        option = document.createElement("option");
        option.value=i;
        option.innerHTML=monthfiles[i].name;
        select.appendChild(option);
    }
}

function createnewpage(){
    let newmonthdata = {};
    let js_date = new Date(document.getElementById("startdatte").value);
    js_date.addHours(3); //Zeitumstellung... FIXME...
    let date = js_date.toISOString().split('T')[0];
    newmonthdata["date"] = date;
    if(document.getElementById("prevmonth").value == "")
        newmonthdata["prevcalculation"] = "start";
    else
        newmonthdata["prevcalculation"] = document.getElementById("prevmonth").value;
    
    newmonthdata["positions"] = {};
    newmonthdata["days"] = {};
    newmonthdata["einststudtable"] = {};

    if(document.getElementById("monthpreset").value != "-1"){
        let presetmonth = monthdata[document.getElementById("monthpreset").value];
        newmonthdata.positions = presetmonth.positions;

        //Referenzstunden übernehmen
        newmonthdata["overall"] = {};
        newmonthdata["overall"]["reff"] = presetmonth.overall.reff;

        //Wocheneinstellung übernehmen
        //Referenz = erster Sonntag finden
        let reffstuds = [];
        let filled = 0;
        for (const [date, value] of Object.entries(presetmonth.einststudtable)) {
            let daynr = (new Date(date)).getDay();
            if(!(daynr in reffstuds)){
                reffstuds[daynr] = value;
                filled ++;
            }
            if(filled >= 7)
                break;
        }

        console.log(reffstuds);


        //Durch jedes Datum durchgehen und Stunden übernehmen
        let nextmonth = new Date(js_date);
        nextmonth.setMonth(nextmonth.getMonth() + 1);
        let datei = new Date(js_date)
        let i = datei.getDay();
        for (null; datei < nextmonth; datei.setDate(datei.getDate() + 1)) {
            if(i >= 7) i = 0;
            newmonthdata["einststudtable"][datei.toISOString().split('T')[0]] = reffstuds[i];
            i++;
        }
    }

    let monthname = document.getElementById("newmonthname").value;
    let filename = monthname.replace(" ", "");
    filename = filename.toLowerCase()+".json";

    const newfile = new File([""], filename, {
        type: "text/json"
    });

    let index = (monthdata.push(newmonthdata)) - 1;
    monthfiles[index] = newfile;
    currentfileindex = index;

    config["files"][monthname] = filename

    reinitapplication();
    closenewpage();
    settitle(true);
}

function closenewpage(event) {
    document.getElementById("newpagewindowcontext").style.display = "none";
}