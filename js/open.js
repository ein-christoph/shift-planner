butDir.addEventListener('click', async () => {

    if(!issaved){
        if (!window.confirm("Es gibt ungespeicherte Änderungen! Wollen Sie ohne speichern fortfahren?")) {
            return;
        }          
    }

    issaved = true;

    [project_file] = await window.showOpenFilePicker();
    file = await project_file.getFile();
    const contents = await file.text();
    text = JSON.parse(contents);
    console.log(text);

    //HOTFIX: Ein Datei für einfacheres Teilen
    //FIXME: Das muss überarbeitet werden (Datei-Struktur überarbeiten)

    let i = 0;

    for(key in text){
        console.log(key)
        if(key == "config.json")
            config = text[key];
        else{
            monthdata.push(text[key]);
            fake_fileobject = {
                name: key
            }
            monthfiles.push(fake_fileobject);
            currentfileindex = i;
            i++; 
        }
    }
    console.log("=====");
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