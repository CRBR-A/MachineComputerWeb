"use strict";

//Create simple function for basic operation
function addition(value1, value2){return value1+value2;}
function subtraction(value1, value2){return value1-value2;}
function multiplication(value1, value2){return value1*value2;}
function division(value1, value2){return value1/value2;}
function mod(value1, value2){return value1%value2;} //remainder from division
function percent(value){return value/100;}
function factorial(value){
  return (Number.isInteger(value) ? factorial_int(value) : factorial_gamma(value+1));
}
function factorial_int(value){
  return (value == 0 ? 1 : (value * factorial_int(value - 1)));
}
function factorial_gamma(value) {
  var tmp=(value-0.5)*Math.log(value+4.5)-(value+4.5);
  var ser=1.0+76.18009173/(value+0)-86.50532033/(value+1)+24.01409822/(value+2);
  ser=ser-1.231739516/(value+3)+0.00120858003/(value+4)-0.00000536382/(value+5);
  return Math.exp(tmp+Math.log(ser*Math.sqrt(2*Math.PI)));
}

//Array (key = function name) -> category, function, number of arguments
var functions=[];
functions["random"]=["Math", Math.random, 0];
functions["cos"]=["Math", Math.cos, 1];
functions["cosh"]=["Math", Math.cosh, 1];
functions["acos"]=["Math", Math.acos, 1];
functions["acosh"]=["Math", Math.acosh, 1];
functions["sin"]=["Math", Math.sin, 1];
functions["sinh"]=["Math", Math.sinh, 1];
functions["asin"]=["Math", Math.asin, 1];
functions["asinh"]=["Math", Math.asinh, 1];
functions["tan"]=["Math", Math.tan, 1];
functions["tanh"]=["Math", Math.tanh, 1];
functions["atan"]=["Math", Math.atan, 1];
functions["atanh"]=["Math", Math.atanh, 1];
functions["sqrt"]=["Math", Math.sqrt, 1];
functions["cbrt"]=["Math", Math.cbrt, 1];
functions["abs"]=["Math", Math.abs, 1];
functions["ceil"]=["Math", Math.ceil, 1];
functions["floor"]=["Math", Math.floor, 1];
functions["round"]=["Math", Math.round, 1];
functions["sign"]=["Math", Math.sign, 1];
functions["trunc"]=["Math", Math.trunc, 1];
functions["ln"]=["Math", Math.log, 1];
functions["log"]=["Math", Math.log10, 1];
functions["exp"]=["Math", Math.exp, 1]; //E^
functions["expm1"]=["Math", Math.expm1, 1];
functions["clz32"]=["Math", Math.clz32, 1];
functions["imul"]=["Math", Math.imul, 2];
functions["fround"]=["Math", Math.fround, 1];
functions["addition"]=["Math", addition, 2];
functions["subtraction"]=["Math", subtraction, 2];
functions["multiplication"]=["Math", multiplication, 2];
functions["division"]=["Math", division, 2];
functions["mod"]=["Math", mod, 2];
functions["pow"]=["Math", Math.pow, 2];
functions["atan2"]=["Math", Math.atan2, 2];
functions["max"]=["Math", Math.max];
functions["min"]=["Math", Math.min];
functions["hypot"]=["Math", Math.hypot];

functions["factorial"]=["Math", factorial, 1]; //special operator : n!
functions["percent"]=["Math", percent, 1];   //special operator : n% 

var values=[]
values["pi"]=["Math", Math.PI];
values["e"]=["Math", Math.E];

//Keyname -> mathematical symbol
var specialSymbols=[];
specialSymbols["addition"]=["+"];
specialSymbols["subtraction"]=["-"];
specialSymbols["multiplication"]=["*"];
specialSymbols["division"]=["/"];
specialSymbols["mod"]=["%"];
specialSymbols["pow"]=["^"];
specialSymbols["percent"]=["%"];
specialSymbols["factorial"]=["!"]; 
//minus sign ??? simplified


//BODMAS :
//Brackets (always first)
//Orders (powers or square roots)
//Division
//Multiplication
//Addition
//Subtraction

function consoleError(aFormula, pos, message){
  console.error(aFormula);
  var i, linePos="";
  for(i=0; i<pos;i++){
    linePos=linePos+" "
  }
  linePos=linePos+"^"
  console.error(linePos);
  console.error("c",pos, " : ", message);
}

function calculate(aFormula, stepByStep=false){
  return parenthesesOperations(aFormula, stepByStep);
  //symbolicOperations(simplifiedFormula, stepByStep);
}

function doFunction(functionName, parameter){
  if(functionName in functions){
    if(functions[functionName][2]==0){
      return functions[functionName][1]();
    }else{
      return functionName+"["+parameter+"]";
      //symbolicOperations()
    }
  }
  //ERROR not a function???
  
}

//return -1 if OK, or a positive number (the position of the 1st parenthesis error)
function checkParenthesis(aFormula){
  var parenthesesNotClosed=0;
  var pos=0;
  var error=false;
  
  while(!error && pos<aFormula.length){
  
    if(aFormula[pos] == "("){
      parenthesesNotClosed++;
    }

    if(aFormula[pos] == ")"){
      parenthesesNotClosed--;
    }
    
    if(parenthesesNotClosed < 0){
      error=true;
    }else{
      pos++;
    }
  }
  
  if(error || parenthesesNotClosed !== 0){
    return pos;
  }else{
    return -1;
  }
}


/* if(parenthesesNotClosed !== 0){
  //Error with parentheses (opened or closed),
  //print error and don't continue calculation....
  var typeError="";
  parenthesesNotClosed < 0 ? typeError=")" : typeError="(";
  var msgError=Math.abs(parenthesesNotClosed).toString()+" '"+typeError+"' remaining";
  consoleError(currentFormula, pos, msgError);
}
 */

function parenthesesOperations(aFormula, stepByStep=false){
  
  var error=false;
  var currentFormula=aFormula;
  var steps=[];
  var done=false;
  
  if(checkParenthesis(aFormula)>0){
    error=true;
  }

  //MAIN-LOOP
  //calculate all parenthesis in the formula
  //until : done OR error
  while(!error && !done){
    var pos=0;
    var simplifiedFormula="";
    var lastOpenedParenIdx=0;
    var currentItemStartPos=0;
    var itemParenthesisStart;
    var parenthesisRemaining=0;

    //SUB-LOOP 
    //calculate the 1st pair of parenthesis
    //until : done OR end of the formula reached (no parenthesis) OR error
    //to simplify the first "(...)"
    while(!error && pos<currentFormula.length && simplifiedFormula == ""){
      
      if(currentFormula[pos] == "("){
        //save indexes (parenthesis, previous and new items)
        lastOpenedParenIdx=pos;
        itemParenthesisStart=currentItemStartPos;
        currentItemStartPos=pos+1;
        parenthesisRemaining++;
      }else if(currentFormula[pos] == ")"){
        var functionName;
        //get the name's function
        if(itemParenthesisStart !== lastOpenedParenIdx){
          functionName=currentFormula.substring(itemParenthesisStart, lastOpenedParenIdx);
        }else{
          functionName="";
        }
        var parameters=currentFormula.substring(lastOpenedParenIdx+1, pos);
        var result=doFunction(functionName, parameters);
        
        var leftFormula=currentFormula.substring(0, itemParenthesisStart);
        var rightFormula=currentFormula.substring(pos+1, currentFormula.length);
        simplifiedFormula=leftFormula+result+rightFormula;
        parenthesisRemaining--;
      }else{
        
        var key;
        for(key in specialSymbols){
          if(specialSymbols[key]==currentFormula[pos]){
            //current character is a symbolic operation,
            //reset the currentElement
            currentItemStartPos=pos+1;
          }
        }
      }
      
      //if no error, go to next character
      if(!error){
        pos++;
      }
    }
    
    //Done if pos is at the end + no more parenthesis
    if(pos==currentFormula.length && parenthesisRemaining==0){
      done=true;
    }
    
    currentFormula=simplifiedFormula;
    

    
    if(stepByStep){
      steps.push(currentFormula);
    }
  }

  if(stepByStep){
    return steps;
  }else{
    return currentFormula;
  }
}


function symbolicOperations(aFormula, stepByStep=false){
  return "symbolicOperations";
}
