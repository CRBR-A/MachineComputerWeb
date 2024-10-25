//Load dynamically a script into the page
function installJS (file_url, async = true) {
  
  //check if file is already loaded !
  //..
  
  //Create a new SCRIPT element
  var scriptElement = document.createElement("script");
  
  //Set the attributes
  scriptElement.setAttribute("id", "js-000");
  scriptElement.setAttribute("type", "text/javascript");
  scriptElement.setAttribute("src", file_url);
  scriptElement.setAttribute("async", async);
  
  //Add the script into the document body
  document.head.appendChild(scriptElement);
  
  // success event 
  scriptElement.addEventListener("load", () => {
    console.log("File loaded");
  });
   // error event
  scriptElement.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}

//Load dynamically a style into the page
function installCSS (file_url) {
  //Create a new STYLE element
  var styleElement = document.createElement("link");
  
  //Set the attributes
  scriptElement.setAttribute("id", "css-0001");
  styleElement.setAttribute("rel", "stylesheet")
  styleElement.setAttribute("type", "text/css")
  styleElement.setAttribute("href", file_url)
  
  //Add the style into the document head
  document.head.appendChild(styleElement);
  
  // success event 
  styleElement.addEventListener("load", () => {
    console.log("File loaded")
  });
   // error event
  styleElement.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}

//Remove the script in the body
 function removeJS (name) {
  document.body.removeChild(document.getElementById(name));
}

//Remove the style in the head
function removeCSS (name) {
  document.head.removeChild(document.getElementById(name));
}

function run (aPrompt) {
    console.log(aPrompt);
  }

var packagemanager = function(promptValue) {
  "use strict";
  
  var self = this,
    name = "package-manager",
    installJS,
    installCSS,
    removeJS,
    removeCSS,
    run;

  
  //if ( typeof promptValue !== 'undefined') {
  //  run(promptValue);
  //}
  
  //run("init");
  
  //installJS("../accessory/calculator.js");

  return self;
  
};