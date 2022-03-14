//=====Speichern

butsaveall.addEventListener("click", saveall);

async function writeFile(fileEntry, contents) {

    console.log("Schreibe in " + fileEntry.name);
    console.log(contents);

    const newFileHandle = await DirectoryHandle.getFileHandle(fileEntry.name, { create: true });
    const writable = await newFileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}

function saveall() {
    try {
        writeFile(configfile, JSON.stringify(config));
        let i = 0;
        monthfiles.forEach(file => {
            console.log(i);
            console.log(JSON.stringify(monthdata[i]));
            console.log("=====");
            writeFile(file, JSON.stringify(monthdata[i]));
            i++;
        });
        issaved = true;
        settitle();
    } catch (error) {
        console.error(error);
        alert("Fehler beim Speichern!" + error);
    }
}

butsaveas.addEventListener("click", save_as);

async function save_as(){
    const dirHandle = await window.showDirectoryPicker();
    DirectoryHandle = dirHandle;
    saveall();
    reinitapplication();
}