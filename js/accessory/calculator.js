//not happy with the current coding...
//ScientificCalculator is working, 
//BasicCalculator is not working...


"use strict";

var BasicCalculator = function(){

  function doOperation(leftValue, operation, rightValue){
    var results=[];
    leftValue=parseFloat(leftValue);
    rightValue=parseFloat(rightValue);
    switch (operation) {
      case '+':
        results.push(leftValue+rightValue);
        break;
      case '-':
        results.push(leftValue-rightValue);
        break;
      case '*':
        results.push(leftValue*rightValue);
        break;
      case '/':
        results.push(leftValue/rightValue);
        break;
      case '!':
        results.push(factorial(leftValue));
        results.push(rightValue);
        break;
      case '^':
        results.push(Math.pow(leftValue, rightValue));
        break;
      case '²':
        results.push(Math.pow(leftValue,2));
        results.push(rightValue);
        break;
      default:
        console.error("ERROR", leftValue, operation, rightValue);
    }
    return results;
  }
  
  function factorial(value){
    if(Number.isInteger(value)){
      return factorialInt(value);
    }else{
      return factorialNumber(value+1);
    }
  }
  function factorialInt(value){
    if(value == 0){
      return 1;
    }else{
      return value*factorialInt(value-1);
    }
  }
  function factorialNumber(value) {
    //Gamma Euler
    var tmp=(value-0.5)*Math.log(value+4.5)-(value+4.5);
    var ser=1.0+76.18009173/(value+0)-86.50532033/(value+1)+24.01409822/(value+2);
    ser=ser-1.231739516/(value+3)+0.00120858003/(value+4)-0.00000536382/(value+5);
    return Math.exp(tmp+Math.log(ser*Math.sqrt(2*Math.PI)));
  }

  var decimalSeparator=".";
  //Flag : replace value with this when calculated
  var valueWasCalculated=null; 
    
  //Array of operations (array) IN ORDER !!!
  //Index=1 : boolean : right-associative (right to left group of same operation)
  //Index=2 : string of symbols
  var operationsOrders=[];
  operationsOrders.push([true, "^²"]);
  operationsOrders.push([false, "!/*"]);
  operationsOrders.push([false, "+-"]);
  
  var operationsAvailable="";
  for(var key in operationsOrders){
    //Get all symbols operations
    operationsAvailable=operationsAvailable+operationsOrders[key][1];
  }
  
  //Symbols alias (to replace)
  var operationsAlias=[];
  operationsAlias["square"]=["²", "^2"];
  operationsAlias["percent"]=["%", "/100"];
  

  
  /* FOR LATER....
  specialSymbols["concatenate"]=["&"];
  specialSymbols["equal"]=["="];  //affectation AND test !!!
  specialSymbols["notEqual"]=["<>"];
  specialSymbols["lessEqual"]=["<="];
  specialSymbols["greaterEqual"]=[">="];
  specialSymbols["less"]=["<"];
  specialSymbols["greater"]=[">"];
  specialSymbols["wildcard"]=["*"];
  specialSymbols["absolute"]=["$"];
  specialSymbols["sheetReference"]=["!"];  //Sheet2!A1:B1 */

  //parse the expression into an array
  function parseExpression(aFormula){
    var arrayFormula=[];
    var currentIdx=0;
    var previousItemIdx=0;
    var error=false;
    
    //Read and split the formula into elements of array
    while(!error && currentIdx<aFormula.length){
      
      //get the current character and the next character
      var currentChar=aFormula[currentIdx];
      var nextCharacter=aFormula[currentIdx+1];
      //Check if it's an operation
      if(operationsAvailable.indexOf(currentChar)>-1){
        //get the previous value
        var aValue=aFormula.substring(previousItemIdx, currentIdx);
        //Push the value in the array Formula
        arrayFormula.push(aValue);
        
        //Special case : <= and >=
        if(nextCharacter=="="){
          currentChar=currentChar+nextCharacter;
          currentIdx++;
        }
        
        //Push the operation in the array Formula
        arrayFormula.push(currentChar);
        //save the currentIdxition for the next value to get
        previousItemIdx=currentIdx+1;
      }
        
      //if no error, go to the next character
      if(!error){
        currentIdx++;
      }
    }
    
    //if no error, add the last item of the formula
    if(!error){
      //get the last value of the formula
      var aValue=aFormula.substring(previousItemIdx, aFormula.length);
      //Push the last value of the formula in the value
      arrayFormula.push(aValue);
    }

    return arrayFormula;
  }
  
  //read the array to found operations
  function searchIndexOperations(arrayFormula){
    var arrayOperations=[];
    var currentIdx=0;
    var currentElement="";
    var idxOrder=0;
    var error=false;
    
    //Create a sub-array (operation index in the formula) for each order
    for(var key in operationsOrders){
      arrayOperations.push([]);
    }
    
    //loop all array element to found operations
    while(!error && currentIdx<arrayFormula.length){
      //get the current element
      currentElement=arrayFormula[currentIdx];
      //reset the index of the order
      idxOrder=0;

      var founded=false;
      while(!error && !founded && idxOrder<operationsOrders.length){
        if(operationsOrders[idxOrder][1].indexOf(currentElement)>-1){
          //Found the operation in this order, save the index
          arrayOperations[idxOrder].push(arrayFormula.length-1);
          founded=true;
        }
        //do the next order
        idxOrder++;
      }
      //do the next item
      currentIdx++;
    }
    
    return arrayOperations;
  }

  //Join (or concatenate) all elements in the Formula-array 
  function joinElements(arrayFormula){
    var result="";
    for(var idx=0; idx<arrayFormula.length; idx++){
      if(arrayFormula[idx]!==valueWasCalculated){
        result=result+arrayFormula[idx];
      }
    }
    return result;
  }
  
  function showFormula(arrayFormula, showFunction){
    showFunction(joinElements(arrayFormula));
    return null;
  }


  function calculate(aFormula){
    var error=false;
    var currentOrderIndex=0;
    var arrayFormula;
    var arrayOperationsIdxOrder=[];
    var needUpdateOperations=true;

    //parse the formula
    arrayFormula=parseExpression(aFormula);
    console.log("arrayFormula", arrayFormula);

    //do all operations (by order)
    //until ERROR or operations done
    while(!error && currentOrderIndex<operationsOrders.length){
      
      //Check if arrayOperationsIdxOrder is set, else Update it and restart the calculation !!
      if(needUpdateOperations){
        //search all operations
        arrayOperationsIdxOrder=searchIndexOperations(arrayFormula);
        //reset the current order index (need recalculation)
        currentOrderIndex=0;
        needUpdateOperations=false;
      }
      
      //get the limit = length
      var operationsIndexLimitOrders=arrayOperationsIdxOrder[currentOrderIndex].length;
      
      //Continue only if there are operations in this order
      if(operationsIndexLimitOrders>0){
        var currentOperationIndexOrder=0;
        //Do all operations of this order
        while(!error && !needUpdateOperations && currentOperationIndexOrder<operationsIndexLimitOrders){
          //get operation index in the formula-array
          var currentOperationIndexFormula=arrayOperationsIdxOrder[currentOrderIndex][currentOperationIndexOrder];
          //get the symbol
          var currentOperationSymbol=arrayFormula[currentOperationIndexFormula];
          
          //set the 1st operation and the last operation
          //used for right-associative operations
          var firstSameOperationIndexOrder=currentOperationIndexOrder;
          var lastSameOperationIndexOrder=currentOperationIndexOrder;
          
          //Special case : right-associative operation, like the power symbol
          //Need to calculate right to left with same operator symbol
          //2^3^4^5 = (2^(3^(4^5)))
          if(operationsOrders[currentOrderIndex][0]){

            //search the LAST operation in the group
            //until operations are different or no other operation in this order
            var stop=false;
            while(!stop && lastSameOperationIndexOrder<operationsIndexLimitOrders){
              //get the next operation in this order
              var nextOperationSymbol=arrayFormula[arrayOperationsIdxOrder[currentOrderIndex][lastSameOperationIndexOrder+1]];
              //Same operation ? search the next operation, else stop.
              if(currentOperationSymbol==nextOperationSymbol){
                lastSameOperationIndexOrder++;
              }else{
                stop=true;
              }
            }
            //update the current operation
            currentOperationIndexOrder=lastSameOperationIndexOrder;
          }

          //Calculate the group of operation
          while(!error && !needUpdateOperations && firstSameOperationIndexOrder<currentOperationIndexOrder+1){
            //get the operation index in the formula
            currentOperationIndexFormula=arrayOperationsIdxOrder[currentOrderIndex][currentOperationIndexOrder];

            //search for the 1st left value
            var leftIdx=currentOperationIndexFormula-1;
            while(leftIdx>0 && arrayFormula[leftIdx]==valueWasCalculated){
              leftIdx--;
            }
            //search for the 1st right value
            var rightValueIdx=currentOperationIndexFormula+1;
            while(rightValueIdx<arrayFormula.length && arrayFormula[rightValueIdx]==valueWasCalculated){
              rightValueIdx++;
            }
            //get values
            var leftValue=arrayFormula[leftIdx];
            var rightValue=arrayFormula[rightValueIdx];
            
            //calculate
            var results=doOperation(leftValue, currentOperationSymbol, rightValue);
            
            arrayFormula[currentOperationIndexFormula]=results[0];
            
            if(results.length>1){
              needUpdateOperations=true;
            }
            

            //set the left and right value to calculated (flag)
            arrayFormula[leftIdx]=valueWasCalculated;
            arrayFormula[rightValueIdx]=valueWasCalculated;
            
            //go to previous operation
            //used for right-associative operations
            //break loop for left-associative operation (operation done)
            currentOperationIndexOrder--;
          }
          
          if(currentOperationIndexOrder<lastSameOperationIndexOrder){
            //set the current idx with the LAST operation calculated
            //used for right-associative operations
            currentOperationIndexOrder=lastSameOperationIndexOrder;
          }
          
          //go to the next operation of this order
          currentOperationIndexOrder++;

        }
      }
      
      //Do the next order
      currentOrderIndex++;
    }

    //return the result (join)
    return joinElements(arrayFormula);
  }

  if(arguments.length>0){
    //Direct call of the function (with arguments)
    return calculate.apply(null, arguments);
  }else{
    //instance : return the function for later use
    return calculate;
  }
  
}

var ScientificCalculator = function(){

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
    var currentIdx=0;
    var error=false;
    
    //Loop all characters
    //Until error OR end of string
    while(!error && currentIdx<value.length){
      if(value[currentIdx] == "("){
        parenthesesNotClosed++;
      }else{
        if(value[currentIdx] == ")"){
          parenthesesNotClosed--;
        }
      }
      if(parenthesesNotClosed < 0){
        error=true;
      }else{
        currentIdx++;
      }
    }
    if(error || parenthesesNotClosed !== 0){
      return currentIdx;
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

  //minus sign ???

  function consoleError(aFormula, currentIdx, message){
    console.error(aFormula);
    var i, linecurrentIdx="";
    for(i=0; i<currentIdx;i++){
      linecurrentIdx=linecurrentIdx+" "
    }
    linecurrentIdx=linecurrentIdx+"^"
    console.error(linecurrentIdx);
    console.error("c",currentIdx, " : ", message);
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
    var currentIdx=0;
    var currentParameter="";
    var insideString=false;
    var previousCharacter="";
    var currentChar;
    
    //loop all characters in String
    //for spiting
    //until error or done
    while(!error && currentIdx<parameter.length){
      currentChar=parameter[currentIdx];
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
        currentIdx++;
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
    consoleError(currentFormula, currentIdx, msgError);
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
      var currentIdx=0;
      var simplifiedFormula="";
      var lastOpenedParenIdx=0;
      var currentItemStartcurrentIdx=0;
      var itemParenthesisStart;
      var parenthesisRemaining=0;

      //SUB-LOOP 
      //calculate the 1st pair of parenthesis
      //until : Error OR end of the formula (no parenthesis) OR new formula
      //to simplify the first "(...)"
      while(!error && currentIdx<currentFormula.length && simplifiedFormula == ""){
        
        if(currentFormula[currentIdx] == "("){
          //save indexes (parenthesis, previous and new items)
          lastOpenedParenIdx=currentIdx;
          itemParenthesisStart=currentItemStartcurrentIdx;
          currentItemStartcurrentIdx=currentIdx+1;
          parenthesisRemaining++;
        }else if(currentFormula[currentIdx] == ")"){
          var functionName;
          //get the name's function
          if(itemParenthesisStart !== lastOpenedParenIdx){
            functionName=currentFormula.substring(itemParenthesisStart, lastOpenedParenIdx);
          }else{
            functionName="";
          }
          var parameters=currentFormula.substring(lastOpenedParenIdx+1, currentIdx);
          var result=doFunction(functionName, parameters);
          simplifiedFormula=replaceSubFormula(currentFormula, result, itemParenthesisStart, currentIdx+1);
          parenthesisRemaining--;
        }else{
          var key;
          /** REPLACE WITH BASIC CALCULATOR symbols
          
          for(key in specialSymbols){
            if(specialSymbols[key]==currentFormula[currentIdx]){
              //current character is a symbolic operation,
              //reset the currentElement
              currentItemStartcurrentIdx=currentIdx+1;
            }
          }
          */
        }
        
        //if no error, go to next character
        if(!error){
          currentIdx++;
        }
      }
      
      //end of the formula AND no more parenthesis ?? done
      if(currentIdx==currentFormula.length && parenthesisRemaining==0){
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
  
  function calculate(){
    var aFormula = arguments[0];
    var formulaWithoutParenthesis = parenthesesOperations(aFormula);
    //if no error continue :
    //use eval for now....
    return BasicCalculator(formulaWithoutParenthesis);
  }
 
  if(arguments.length>0){
    //'Constructor' WITH a formula : calculate
    return calculate.apply(null, arguments);
  }else{
    //else, return the function to calculate !!!!
    return calculate;
  }

};

