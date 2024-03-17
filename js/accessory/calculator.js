"use strict";

var Calculate = function(mainFormula){

  var parameterSeparator=",";

  //FUNCTIONS : MATH
  function fct_math_isInteger(parameters){
    return Number.isInteger(parameters);
  }
  function fct_math_isNumber(parameters){
    return !isNaN(parameters);
  }

  //parse and return the good type of value
  function fct_useGoodType(parameter){
    if( fct_math_isNumber(parameter)){
      return parseFloat(parameter);
    }else{
      return parameter;
    }
  }

  function fct_math_addition(){
    var result=arguments[0];
    var idx;
    for(idx=1; idx<arguments.length; idx++){
      result=result+arguments[idx];
    }
    return result;
  }
  function fct_math_subtraction(){
    var result=arguments[0];
    var idx;
    for(idx=1; idx<arguments.length; idx++){
      result=result-arguments[idx];
    }
    return result;
  }
  function fct_math_multiplication(){
    var result=arguments[0];
    var idx;
    for(idx=1; idx<arguments.length; idx++){
      result=result*arguments[idx];
    }
    return result;
  }
  function fct_math_division(){
    var result=arguments[0];
    var idx;
    for(idx=1; idx<arguments.length; idx++){
      result=result/arguments[idx];
    }
    return result;
  }
  function fct_math_mod(){
    var result=arguments[0];
    var idx;
    for(idx=1; idx<arguments.length; idx++){
      result=result%arguments[idx];
    }
    return result;
  }
  function fct_math_percent(){
    return fct_math_division(arguments[0],100);
  }
  function fct_math_factorial(parameters){
    if(fct_math_isInteger(parameters)){
      return fct_math_factorialInteger(parameters);
    }else{
      //fact_Gamma(value+1)
      //TODO value+1 in parameters....
      return fct_math_factorialGamma(fct_math_addition(value, 1));
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
    return Math.random();
  }
  function fct_math_pi(value){
    return Math.Pi; //or 3.141592653589793;
  }
  function fct_math_e(value){
    return Math.E; //or 2.718281828459045;
  }
  
  function checkParenthesis(value){
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
  specialSymbols["cellReference"]=[":"];
  specialSymbols["intersection"]=[" "]; //(=common cells)
  specialSymbols["square"]=["²"];
  specialSymbols["pow"]=["^"];
  specialSymbols["factorial"]=["!"]; 
  specialSymbols["percent"]=["%"]; //=x/100
  specialSymbols["mod"]=["%"];
  specialSymbols["division"]=["/"];
  specialSymbols["multiplication"]=["*"];
  specialSymbols["addition"]=["+"];
  specialSymbols["subtraction"]=["-"];
  
  specialSymbols["concatenate"]=["&"];
  specialSymbols["equal"]=["="];  //affectation AND test !!!
  specialSymbols["notEqual"]=["<>"];
  specialSymbols["lessEqual"]=["<="];
  specialSymbols["greaterEqual"]=[">="];
  specialSymbols["less"]=["<"];
  specialSymbols["greater"]=[">"];
  specialSymbols["wildcard"]=["*"];
  specialSymbols["absolute"]=["$"];
  specialSymbols["sheetReference"]=["!"];  //Sheet2!A1:B1
  

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

  //execute the functionName(parameter)
  function doFunction(functionName, parameter){
    //Split the string parameters into array
    var parameters=splitParameters(parameter);

    //If the function exist
    if(functionName in functions){
      return functions[functionName][1].apply(null, parameters);
    }
    //ERROR not a function???
  }

  //Split a string (formula) into sub string, depending of separator
  //return array of string
  //Beware of escaping character !
  function splitParameters(parameter){
    var result=[];
    var error=false;
    var pos=0;
    var currentParameter="";
    var insideString=false;
    var previousCharacter="";
    var currentChar;
    
    //loop all characters in String
    //for spiting
    //until error or done
    while(!error && pos<parameter.length){
      currentChar=parameter[pos];
      //if the current character is the parameter separator
      if(currentChar == parameterSeparator){
        var subResult=symbolicOperations(currentParameter);
        result.push(fct_useGoodType(subResult));
        //reset current parameter
        currentParameter="";
      }else{
        currentParameter=currentParameter+currentChar;
      }
      
      //save the current character for later
      //in case of string (like escaping quotes)
      previousCharacter=currentChar;
      
      //Next character if no errors
      if(!error){
        pos++;
      }
    }
    
    //Add the last parameter (if formula is not empty)
    if(parameter.length>0){
      result.push(fct_useGoodType(currentParameter));
    }
    
    return result;
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
   
  
  function replaceSubFormula(mainFormula, subFormula, start, end){
    var leftFormula=mainFormula.substring(0, start);
    var rightFormula=mainFormula.substring(end, mainFormula.length);
    var result=leftFormula+subFormula+rightFormula;
    return result;
  }

  function parenthesesOperations(aFormula){
    
    var error=false;
    var currentFormula=aFormula;
    var done=false;
    
    //check parenthesis errors
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
      //until : Error OR end of the formula (no parenthesis) OR new formula
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
          simplifiedFormula=replaceSubFormula(currentFormula, result, itemParenthesisStart, pos+1);
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
      
      //end of the formula AND no more parenthesis ?? done
      if(pos==currentFormula.length && parenthesisRemaining==0){
        done=true;
      }
      
      //if new formula, save it
      if(simplifiedFormula !== ""){
        currentFormula=simplifiedFormula;
        //if (typeof stepFunction !== 'undefined') {
        //  stepFunction(currentFormula);
        //}
      }
    }
    
    //Return the new formula, without parenthesis
    return currentFormula;
  }

  function symbolicOperations(aFormula, start, end){
    
    var error=false;
    var done=false;
    var currentFormula;
    
    if (typeof start !== 'undefined') {
      //if no end position, use the formula length
      if (typeof end == 'undefined') {
        end=aFormula.length;
      }
      //extract the sub-formula
      currentFormula=aFormula.substring(start, end);
    }else{
      //calculate the full formula
      currentFormula=aFormula
    }
   
    //CHEATING AT THE MOMENT !
    //USING EVAL : since NO parenthesis = NO JS code !! = safe !
    var simplifiedFormula=eval(currentFormula);
    
    //Return the result
    return simplifiedFormula;
  }
  
  function calculate(){
    var aFormula = arguments[0];
    var formulaWithoutParenthesis = parenthesesOperations(aFormula);
    //if no error continue :
    return symbolicOperations(formulaWithoutParenthesis);
  }
 
  if (arguments.length>0) {
    //'Constructor' WITH a formula : calculate
    return calculate.apply(null, arguments);
  }else{
    //else, return the function to calculate !!!!
    return calculate;
  }

};

