/**
The constructor of a program
@params name of program, array of parameters, array of operators
@return program
*/
function Program(name, parameters, operators) {
  this.name = name;
  this.parameters = parameters || [];
  this.operators = operators || [];
  //TODO Fix this anyway
  if (operators.length != 0) operators[0].setAdditionalInfo("rrel_init: ");
  //for(var i = 0; i < this.operators.length; i++) 
  //  this.operators[i].id = i + 1;
  this.toString = function() {
  	return "scp_program -> " + this.getName() + " (*<br>" + this.getParameters() + this.getOperators() + "*);;";
  }
  this.getName = function() {
  	return this.name;
  }
  this.getOperators = function() {
  	var operatorString = "-> rrel_operators: ... (*<br>";
	  for(var i = 0; i < this.operators.length; i++) {
	    var operator = this.operators[i];
	    operatorString += operator.toString();
	  }
    operatorString += "*);;<br>";
	  return operatorString;
  }
  this.getParameters = function() {
    if (parameters.length != 0) {
      var parameterString = "-> rrel_params: ... (*<br>";
      for(var i = 0; i < this.parameters.length; i++) {
        var parameter = this.parameters[i];
        parameterString += "-> " + parameter.toString() + ";;<br>";
      }
      parameterString += "*);;<br>";
      return parameterString;  
    }
    else return "";
  }
}

/**
  Base constructor for operators
  @return operator with random id
*/
function Operator() {
  this.id = Math.floor(Math.random()*65536);
}

/**
  Constructor for non-complicated operators
  @params type of operator
  @return basic operator with toString() method
*/
function BasicOperator(type) {
  Operator.call(this);
  this.type = type;
  this.arguments = [];
  this.transitions = [];
  this.additionalInfo = "";
  this.isEmpty = function() {
    return false;
  }
  this.addTransition = function(transition) {
    this.transitions.push(transition);
  }
  this.toString = function() {
    return "->" + this.getAdditionalInfo() + this.getName() + " (*<br>" + this.getType() + this.getArguments() + this.getTransitions() + "*);;<br>";
  }
  this.getType = function() {
    return "<- " + this.type + ";;<br>";
  }
  this.getArguments = function() {
    var argumentString = "";
    for(var i = 0; i < this.arguments.length; i++) {
      var argument = this.arguments[i];
      if (argument) argumentString += "-> " + argument.toString() + ";;<br>";
    }
    return argumentString;
  }
  this.getTransitions = function() {
    var transitionString = "";
    for(var i = 0; i < this.transitions.length; i++) {
      var transition = this.transitions[i];
      transitionString += transition.toString();
    }
    return transitionString;
  }
  this.getName = function() {
    return "..operator" + this.id;
  }
  this.getAdditionalInfo = function() {
    return this.additionalInfo;
  }
  this.setAdditionalInfo = function(additionalInfo) {
    this.additionalInfo = additionalInfo;
  }
}

/**
  Constructor for operators without rrel_set arguments
  @params type of operator, arguments
  @return operator with toString() method
*/
function SimpleOperator(type, arguments) {
  BasicOperator.call(this, type);
  this.setArguments = function(arguments) {
    //Remove this.arguments = [];
    for(var i = 0; i < arguments.length; i++) {
      if (!arguments[i]) continue;
      this.arguments.push(new NumberArgument((i + 1), arguments[i]));
    }
  }
  this.setArguments(arguments);
}

function SetOperator(type, arguments) {
  BasicOperator.call(this, type);
  this.setArguments = function(arguments) {
    //Remove this.arguments = [];
    for(var i = 0; i < arguments.length; i++) {
      var argument = arguments[i];
      if (!argument) continue;
      if (i < arguments.length / 2)
        this.arguments.push(new NumberArgument((i + 1), argument));
      else 
        this.arguments.push(new NumberSetArgument((i + 1 - arguments.length / 2), argument));
    }
  }
  this.setArguments(arguments); 
}

function ComplicatedOperator(operators) {
  Operator.call(this);
  this.operators = operators;
  this.isEmpty = function() {
    return this.operators.length == 0;
  }
  this.toString = function() {
    var body = "";
    for(var i = 0; i < this.operators.length; i++) {
      var operator = this.operators[i];
      if (!operator) continue;
      body += operator.toString();
    }
    return body;
  }
  this.getName = function() {
    return this.operators[0].getName();
  }
  this.setAdditionalInfo = function(additionalInfo) {
    if (!this.isEmpty()) this.operators[0].setAdditionalInfo(additionalInfo);
  }
  while(!this.isEmpty() && this.operators[0].isEmpty()) this.operators.shift();
}

function Argument(name) {
  this.identifier = name;
}

function ArgumentSet(arguments) {
  this.setArguments = function(arguments) {
    preparedArguments = [];
    for(var i = 0; i < arguments.length; i++) {
      if (arguments[i]) preparedArguments.push(new NumberArgument((i + 1), arguments[i]));
    }
    this.arguments = preparedArguments;
  }
  this.toString = function() {
    var body = "... (*<br>";
    for(var i = 0; i < this.arguments.length; i++) {
      var argument = this.arguments[i];
      body += "-> " + argument.toString() + ";;<br>";
    }
    body += "*)"
    return body;
  }
  this.setArguments(arguments);
}

function SimpleArgument(name) {
  Argument.call(this, name);
  this.toString = function() {
    return this.identifier;
  }
}

function RandomArgument() {
  SimpleArgument.call(this, "_argument" + Math.floor(Math.random()*65536));
}

function ArgumentDecorator(name, argument) {
  Argument.call(this, name);
  this.argument = argument;
  this.toString = function() {
    return "rrel_" + this.identifier + ": " + this.argument.toString();
  }
}

function Transition(name, operator) {
  this.name = name;
  this.operator = operator;
  this.toString = function() {
    var body = "";
    if (this.operator) body += "=> nrel_" + this.name + ": " + this.operator.getName() + ";;<br>";
    return body;
  }
  this.getOperator = function() {
    return this.operator;
  }
}

function GotoTransition(nextOperator) {
  Transition.call(this, "goto", nextOperator);
}

function ThenTransition(thenOperator) {
  Transition.call(this, "then", thenOperator);
}

function ElseTransition(elseOperator) {
  Transition.call(this, "else", elseOperator);
}