//=====Speichern

butsaveall.addEventListener("click", saveall);

async function writeFile(fileHandle, contents) {

    console.log("Schreibe in " + fileHandle.name);
    console.log(contents);

    const wwritable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await wwritable.write(contents);
    // Close the file and write the contents to disk.
    await wwritable.close();
}

function saveall() {
    try {
        let savestring = {}

        savestring["config.json"] = config;

        for(const[key, value] of Object.entries(monthdata)){
            savestring[monthfiles[key].name] = value;
        }

        writeFile(project_file, JSON.stringify(savestring));
        issaved = true;
        settitle();
    } catch (error) {
        console.error(error);
        alert("Fehler beim Speichern!" + error);
    }
}

butsaveas.addEventListener("click", save_as);

async function save_as(){
    const options = {
        types: [
          {
            description: 'JSON-Datei',
            accept: {
              'text/json': ['.json'],
            },
          },
        ],
      };
    project_file = await window.showSaveFilePicker(options);
    saveall();
    reinitapplication();
}