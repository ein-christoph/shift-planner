//Dateien
let configfile = null; //Konfigdatei
let currentfileindex = null; //Aktuelledatei
let DirectoryHandle = null;

let personendiv = null;

let config = null;
let monthdata = [];
let monthfiles = [];
let lastinput = null;
let specials = {}; //Besonderheiten wie aufgeteielte Dienste (markiert durch ein +);
let issaved = true;

enabledebug(true);

let init_all = false;
let hasfocus = false;

//about.js          --> Funktionen zum anzeigen des About-Dialogs und Update-Checks
//application.js    --> Funktionen, die während des Bearbeitens genutzt werden
//calculate.js      --> Berechnung der Stundentabellen und Ausgabe dieser
//createnewpage.js  --> Neue Seite erstellen und Template übernehmen
//debug.js          --> console.log toggeln
//init.js           --> Tabellen und veränderliche UI initialisieren
//open.js           --> Datei öffnen und grundlegende UI (Buttonbars) initialisieren
//projectsettings.js--> Projekteinstellungsdialog
//save.js           --> Datei Speichern
//tab.js            --> Tabänderungen behandeln
//time.js           --> erweiterung des standers new Date um Zeitumstellung einzubeziehen (irgendwie)