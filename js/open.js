butDir.addEventListener('click', async () => {

    if(!issaved){
        if (!window.confirm("Es gibt ungespeicherte Änderungen! Wollen Sie ohne speichern fortfahren?")) {
            return;
        }          
    }

    issaved = true;

    const dirHandle = await window.showDirectoryPicker();
    DirectoryHandle = dirHandle;
    const promises = [];
    for await (const entry of dirHandle.values()) {
        if (entry.kind !== 'file') {
            break;
        }
        promises.push(entry.getFile().then((file) => { return file; }));
    }
    files = await Promise.all(promises);
    let i = 0;
    for (const file of files) {
        console.log("Datei: " + file.name);
        let text = await file.text();
        text = JSON.parse(text);
        console.log(text);
        if (file.name == "config.json") {
            config = text;
            console.log(config);
            configfile = file;
        }
        else {
            console.log(file);
            monthdata.push(text);
            monthfiles.push(file);
            currentfileindex = i;
            i++;
        }
    }
    reinitapplication();
    
    butsaveall.disabled = false;
    butsaveas.disabled = false;
});

function reinitapplication(){
    init();
    //Dateireiter
    let filediv = document.getElementById("monthfiles");
    filediv.innerHTML = "";
    let button = document.createElement("button");
    button.id="settings";
    button.innerHTML = '<img src="assets/settings_black_24dp.svg"/>';
    button.addEventListener("click", openprojectsettings);
    button.classList.add("settingsbutton");
    button.classList.add("filelinks");
    filediv.appendChild(button);
    for(const [key, value] of Object.entries(config.files)){
        button = document.createElement("button");
        button.classList.add("filelinks");
        if(value == monthfiles[currentfileindex].name) button.classList.add("active");
        button.innerHTML = key;
        for(const [key2, value2] of Object.entries(monthfiles)){
            console.log(value+ "|"+value2.name);
            if(value == value2.name){
                button.setAttribute("file", key2);
                break;
            }
        }
        button.addEventListener("click", changecurrentfile);
        filediv.appendChild(button); 
    }
    button = document.createElement("button");
    button.id="newpage";
    button.addEventListener("click", opennewpage);
    button.classList.add("newpagebutton");
    button.innerHTML = "+";
    button.classList.add("filelinks");
    filediv.appendChild(button);
    init_all = true;
    evaleinststud();
}