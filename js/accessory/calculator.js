//Create simple function for basic operation
function addition(value1, value2){return value1+value2};
function subtraction(value1, value2){return value1-value2};
function multiplication(value1, value2){return value1*value2};
function division(value1, value2){return value1/value2};
function mod(value1, value2){return value1%value2}; //or "remainder"
function percent(value){return value/100};
function factorial(value){ return Number.isInteger(value) ? factorial_int(value) : factorial_gamma(value+1);
function factorial_int(value){ return value == 0 ? 1 : (value * factorial_int(value - 1)) };
function factorial_gamma(value) {
  var tmp=(value-0.5)*Math.log(value+4.5)-(value+4.5);
  var ser=1.0+76.18009173/(value+0)-86.50532033/(value+1)+24.01409822/(value+2)-1.231739516/(value+3)+0.00120858003/(value+4)-0.00000536382/(value+5);
  return Math.exp(tmp+Math.log(ser*Math.sqrt(2*Math.PI)));
}

//keyName (function name) -> category, function, number of arguments
functions={}
functions["pi"]={"Math", Math.PI, 0};
functions["e"]={"Math", Math.E, 0};
functions["random"]={"Math", Math.random, 0};
functions["cos"]={"Math", Math.cos, 1}; 
functions["cosh"]={"Math", Math.cosh, 1};
functions["acos"]={"Math", Math.acos, 1}; 
functions["acosh"]={"Math", Math.acosh, 1};
functions["sin"]={"Math", Math.sin, 1}; 
functions["sinh"]={"Math", Math.sinh, 1}; 
functions["asin"]={"Math", Math.asin, 1}; 
functions["asinh"]={"Math", Math.asinh, 1}; 
functions["tan"]={"Math", Math.tan, 1}; 
functions["tanh"]={"Math", Math.tanh, 1}; 
functions["atan"]={"Math", Math.atan, 1};
functions["atanh"]={"Math", Math.atanh, 1};
functions["sqrt"]={"Math", Math.sqrt, 1};
functions["cbrt"]={"Math", Math.cbrt, 1};
functions["abs"]={"Math", Math.abs, 1};
functions["ceil"]={"Math", Math.ceil, 1};
functions["floor"]={"Math", Math.floor, 1};
functions["round"]={"Math", Math.round, 1};
functions["sign"]={"Math", Math.sign, 1};
functions["trunc"]={"Math", Math.trunc, 1};
functions["ln"]={"Math", Math.log, 1};
functions["log"]={"Math", Math.log10, 1};
functions["exp"]={"Math", Math.exp, 1}; //E^
functions["expm1"]={"Math", Math.expm1, 1};
functions["clz32"]={"Math", Math.clz32, 1};
functions["imul"]={"Math", Math.imul, 2};
functions["fround"]={"Math", Math.fround, 1};

functions["addition"]={"Math", addition, 2}; 
functions["subtraction"]={"Math", subtraction, 2};
functions["multiplication"]={"Math", multiplication, 2}; 
functions["division"]={"Math", division, 2};
functions["mod"]={"Math", mod, 2};
functions["pow"]={"Math", Math.pow, 2};
functions["atan2"]={"Math", Math.atan2, 2};

functions["max"]={"Math", Math.max};
functions["min"]={"Math", Math.min};
functions["hypot"]={"Math", Math.hypot}; 

functions["factorial"]={"Math", factorial, 1}; //special operator : n!
functions["percent"]={"Math", percent, 1};   //special operator : n%

//Keyname -> mathematical symbol
specialSymbols={}
specialSymbols["addition"]={"+"}
specialSymbols["subtraction"]={"-"}
specialSymbols["multiplication"]={"*"}
specialSymbols["division"]={"/"}
specialSymbols["mod"]={"%"}
specialSymbols["pow"]={"^"}
specialSymbols["percent"]={"%"}
specialSymbols["factorial"]={"!"}
//minus sign ??? simplified 
  
//BODMAS :
//Brackets (always  first)
//Orders (powers or square roots)
//Division
//Multiplication
//Addition
//Subtraction
  
function doParenthesis(aFormula){
  var formulaInsideParenthesis="";
  var numParenthesis=0;
  var parenthesisStart=0;
  
  for(var idx = 0; idx < aFormula.length; idx++) {
    var currentChar = aFormula[idx];
    switch (currentChar) {
      case "(":
        parenthesisStart=idx;
        numParenthesis++;
        break;
      case ")":
        numParenthesis--;
        if(numParenthesis < 0){ 
          console.error("ERROR : ", idx); 
        }
        break;
      default:
        break;
    }
  }
  
  if(numParenthesis < 0){ 
    console.error("ERROR : ", end); 
  }else if(numParenthesis > 0){  
    console.error("ERROR : ", end); 
  }
}
