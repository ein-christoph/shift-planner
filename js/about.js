let version = '0.0.2b alpha';

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function openabout(){
    document.getElementById("abputpagecontext").style.display = "flex";
    document.getElementById("version").innerHTML = version;
}

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

function checkupdate(){
    let newversion = httpGet("https://raw.githubusercontent.com/ein-christoph/shift-planner/main/version.txt");
    newversion = newversion.replace("\n", "");
    if(newversion != version){
        document.getElementById("update").innerHTML = "Es gibt eine neue Version ("+escapeHtml(newversion)+") steht zur verfügung. Laden Sie diese über die GitHub-Seite herunter.";
        document.getElementById("update").style.color = "#a71e00";
    }else{
        document.getElementById("update").innerHTML = "Ihre Version ist aktuell";
        document.getElementById("update").style.color = "#009a10";
    }
}

function openfeaturecontext(){
    document.getElementById("featurecontext").style.display = "flex";
}

if(!("showDirectoryPicker" in window)){
    openfeaturecontext();
}