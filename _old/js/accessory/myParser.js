"use strict";

var myParser = function(){
  
  var functions=[];
  //keyword, begin, end, parameters
  functions.push(["addition(", 0, ")"]);
  functions.push(["random(", 0, ")"]);
  functions.push(["+", -1, 1]);
  functions.push(["pi", 0, 0]);
  
  //Return true if the value (string) is a number ?
  function isNumber(value){
    var result=true;
    var index=0;
    
    //Search all character in the string
    while(result && index<value.length){
      var currentChar=value.charCodeAt(index);
      //need to check : 46=. 48-57=digits
      if(currentChar<46 || currentChar==47 || currentChar>57){
        //not a number
        result=false;
      }
      //next character
      index++;
    }
    // return the result
    return result;
  }
  
  //Return true if the value (string) is a word (only letter) ?
  function isLetterOnly(value){
    var result=true;
    var index=0;
    
    //Search all character in the string
    while(result && index<value.length){
      var currentChar=value.charCodeAt(index);
      //need to check : 65-90 (capital letters) + 97-122 (small letters)
      if(currentChar<65 || (currentChar>90 && currentChar<97) || currentChar>122){
        //not a letter
        result=false;
      }
      //next character
      index++;
    }
    // return the result
    return result;
  }
  
  //Search for the function name
  //Need improvements : check only function similar (need sort the function list)
  function getFunction(anInput, indexInLine){
    var functionIdx=0;
    var functionName="";
    
    //function names can't start with a digit (else, it's a value) !
    if(!isNumber(anInput[indexInLine])){
      //compare to the current function in the list
      while(functionName == "" && functionIdx<functions.length){
        var currentFunction=functions[functionIdx][0];
        var endIndex=indexInLine+currentFunction.length;
        //Extract the name (if possible) and check if strings are equals.
        if(endIndex<anInput.length){
          var stringExtractedInLine=anInput.substring(indexInLine, endIndex);
          if(currentFunction == stringExtractedInLine){
            functionName=currentFunction;
          }
        }
        //Check the next function
        functionIdx++;
      }
    }
    //return the function name
    return functionName;
  }
  
  //Search for the variable
  //ex : x, y, a1, b2, ab3, 
  function getVariable(anInput, indexInLine){
    var variableName="";
    var index=indexInLine;
    
    //Step 1 : variable name start only with letters
    while(index<anInput.length && isLetterOnly(anInput[index])){
      //get the letter
      variableName=variableName+anInput[index];
      //next character
      index++;
    }
    
    //Continue only if the 1st part (letters) is present
    if(variableName !== ""){
      //get the number (a value)
      variableName=variableName+getValue(anInput, index);
      //next character
      index++;
    }
    //return the variable name
    return variableName;
  }
  
  //Search for the value
  function getValue(anInput, indexInLine){
    var value="";
    var index=indexInLine;
    
    //search characters
    while(index<anInput.length && isNumber(anInput[index])){
      //get the number
      value=value+anInput[index];
      //next character
      index++;
    }
    //return the value
    return value;
  }
  

  
  
  function calculate(anInput){
    var error=false;
    var done=false;
    var anElement="";
    var currentCharIdx=0;
    
    //main loop
    while(!error && !done){
      
      //Loop characters in the input
      while(!error && currentCharIdx<anInput.length){
        
        //Check functions
        anElement=getFunction(anInput, currentCharIdx);
        if(anElement !== ""){
          console.log("Function", anElement);
        }else{
          console.log("IN variable");
          //Check variables
          anElement=getVariable(anInput, currentCharIdx);
          if(anElement !== ""){
            console.log("Variable", anElement);
          }else{
            console.log("IN value");
            //Check values
            anElement=getValue(anInput, currentCharIdx);
            if(anElement !== ""){
              console.log("Value", anElement);
            }else{
              //Error : not a function, not a variable, not a value !
              console.log("Error", anElement);
              error=true;
            }
          }
        }
        //Continue in the loop
        currentCharIdx=currentCharIdx+anElement.length;
      }
      
      done=true;
    }
  }
  
  if(arguments.length>0){
    //'Constructor' WITH a formula : calculate
    return calculate.apply(null, arguments);
  }else{
    //else, return the function to calculate
    return calculate;
  }
};

