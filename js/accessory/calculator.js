"use strict";

var parameterSeparator=",";

//FUNCTIONS : MATH
function fct_math_isInteger(parameters){
  return Number.isInteger(parameters);
}
function fct_math_isNumber(parameters){
  return isNaN(parameters);
}
function fct_math_addition(parameters){
  var result=parameters[0];
  var idx;
  for(idx=1; idx<parameters.length; idx++){
    result=result+parameters[idx];
  }
  return result;
}
function fct_math_subtraction(parameters){
  var result=parameters[0];
  var idx;
  for(idx=1; idx<parameters.length; idx++){
    result=result-parameters[idx];
  }
  return result;
}
function fct_math_multiplication(parameters){
  var result=parameters[0];
  var idx;
  for(idx=1; idx<parameters.length; idx++){
    result=result*parameters[idx];
  }
  return result;
}
function fct_math_division(parameters){
  var result=parameters[0];
  var idx;
  for(idx=1; idx<parameters.length; idx++){
    result=result/parameters[idx];
  }
  return result;
}
function fct_math_mod(parameters){
  //TODO : replace
  return value1%value2;
}
function fct_math_percent(parameters){
    //TODO : replace
  return fct_math_division(parameters,100);
}
function fct_math_factorial(parameters){
  if(fct_math_isInteger(parameters)){
    return fct_math_factorialInteger(parameters);
  }else{
    //fact_Gamma(value+1)
    //TODO value+1 in parameters....
    return fct_math_factorialGamma(fct_math_addition(value));
  }
}
function fct_math_factorialInteger(value){
  if(value == 0){
    //fact(0)=1
    return 1;
  }else{
    //fact(value)=value*fact(value-1)
    return fct_math_multiplication(value, fct_math_factorialInteger(fct_math_subtraction(value,1)));
  }
}
function fct_math_factorialGamma(value) {
  var tmp=(value-0.5)*Math.log(value+4.5)-(value+4.5);
  var ser=1.0+76.18009173/(value+0)-86.50532033/(value+1)+24.01409822/(value+2);
  ser=ser-1.231739516/(value+3)+0.00120858003/(value+4)-0.00000536382/(value+5);
  return Math.exp(tmp+Math.log(ser*Math.sqrt(2*Math.PI)));
}
function fct_math_random(value){
  return Math.random;
}
function fct_math_pi(value){
  return 3.141592653589793;
}
function fct_math_e(value){
  return 2.718281828459045;
}
function fct_check_Parenthesis(value){
  var parenthesesNotClosed=0;
  var pos=0;
  var error=false;
  
  //Loop all characters
  //Until error OR end of string
  while(!error && pos<value.length){
    if(value[pos] == "("){
      parenthesesNotClosed++;
    }else{
      if(value[pos] == ")"){
        parenthesesNotClosed--;
      }
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



//Array (key = function name) -> category, function, number of arguments
var functions=[];
functions["random"]=["Math", fct_math_random, 0];
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
functions["addition"]=["Math", fct_math_addition, 2];
functions["subtraction"]=["Math", fct_math_subtraction, 2];
functions["multiplication"]=["Math", fct_math_multiplication, 2];
functions["division"]=["Math", fct_math_division, 2];
functions["mod"]=["Math", fct_math_mod, 2];
functions["pow"]=["Math", Math.pow, 2];
functions["atan2"]=["Math", Math.atan2, 2];
functions["max"]=["Math", Math.max];
functions["min"]=["Math", Math.min];
functions["hypot"]=["Math", Math.hypot];

functions["factorial"]=["Math", fct_math_factorial, 1]; //special operator : n!
functions["percent"]=["Math", fct_math_percent, 1];  //special operator : n%

///FORMULATEXT(cell); //return formula !!!!
//ADDRESS(row_num, column_num, [abs_num], [a1], [sheet_text])
//AREAS(reference)

var values=[];
values["pi"]=["Math", fct_math_pi];
values["e"]=["Math", fct_math_e];

//Keyname -> mathematical symbol
//Warning !!! order IS important !!!!!
var specialSymbols=[];
specialSymbols["square"]=["²"];
specialSymbols["pow"]=["^"];
specialSymbols["factorial"]=["!"]; 
specialSymbols["percent"]=["%"]; //=x/100
specialSymbols["mod"]=["%"];
specialSymbols["division"]=["/"];
specialSymbols["multiplication"]=["*"];
specialSymbols["addition"]=["+"];
specialSymbols["subtraction"]=["-"];

//minus sign ???

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

//execute the functionName(parameter)
function doFunction(functionName, parameter){
  //If the function exist
  if(functionName in functions){

    //Split the string parameters into array
    var parameters=splitParameters(parameter);

    return functions[functionName][1](parameters);
  }
  //ERROR not a function???
}

//Split a string, containing separated values, into array of string
//Beware of escaping character !
function splitParameters(parameter){
  var parameters=[];
  var error=false;
  var pos=0;
  var currentParameter="";
  var previousCharacter="";
  var insideString=false;
  
  //loop all characters in String
  //for spiting
  //until error or done
  while(!error && pos<parameter.length){
    var currentChar=parameter[pos];
    //if the current character is the parameter separator
    if(parameter[pos] == parameterSeparator){
      parameters.push(currentParameter);
      currentParameter="";
    }else{
      currentParameter=currentParameter+currentChar;
    }
    
    //save the current character for later
    //case : of escaping quotes
    parameterSeparator=currentChar;
  }
  return parameters;
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
  
  if(fct_check_Parenthesis(aFormula)>0){
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
    //until : end of the formula (no parenthesis) OR error or new formula
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
    
    //if new formula, save it
    if(simplifiedFormula !== ""){
      currentFormula=simplifiedFormula;
      if(stepByStep){
        steps.push(currentFormula);
      }
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
