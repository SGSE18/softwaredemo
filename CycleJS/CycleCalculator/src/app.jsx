import {h2, div, p, button, span} from '@cycle/dom';
import {Observable} from 'rxjs';


export function App (sources) {

  const pressZero$ = sources.DOM.select('.button0').events('click')
    .map(() =>{
      return 0;
    });

  const pressOne$ = sources.DOM.select(".button1").events('click')
    .map(() =>{
      return 1;
    })
  
  const pressTwo$ = sources.DOM.select(".button2").events('click')
    .map(event => 2);

  const pressThree$ = sources.DOM.select(".button3").events('click')
    .map(event => 3);  

  const pressFour$ = sources.DOM.select(".button4").events('click')
    .map(event => 4);

  const pressFive$ = sources.DOM.select(".button5").events('click')
    .map(event => 5);

  const pressSix$ = sources.DOM.select(".button6").events('click')
    .map(event => 6); 

  const pressSeven$ = sources.DOM.select(".button7").events('click')
    .map(event => 7);

  const pressEight$ = sources.DOM.select(".button8").events('click')
    .map(event => 8);

  const pressNine$ = sources.DOM.select(".button9").events('click')
    .map(event => 9); 

  const pressMinus$ = sources.DOM.select(".buttonMinus").events('click')
    .map(event => {
      return {operant: "Minus"}
    });

  const pressPlus$ = sources.DOM.select(".buttonPlus").events('click')
    .map(event => {
      return {operant: "Plus"}
    });

  const pressMulti$ = sources.DOM.select(".buttonMulti").events('click')
  .map(event => {
    return {operant: "Multi"}
  });

  const pressDivide$ = sources.DOM.select(".buttonDivide").events('click')
  .map(event => {
    return {operant: "Divide"}
  });

  const pressEquals$ = sources.DOM.select(".buttonEquals").events('click')
  .map(event => {
    return {operant: "Equals"}
  });
  
  
  const numberStream$ = Observable.merge(pressZero$, pressOne$, pressTwo$, pressThree$, pressFour$, pressFive$, pressSix$, pressSeven$, pressEight$, pressNine$);
  const operantStream$ = Observable.merge(pressDivide$, pressMinus$, pressPlus$, pressMulti$, pressEquals$);
  

  const numberDisplay$ = Observable.merge(numberStream$, operantStream$)
  .scan((acc, value) => {
    if(value.operant == undefined){
      acc.firstOperand += value;
    }
    else{
      acc.firstOperand = "";
    }
    return acc;
  }, {firstOperand: ""}).filter(value => value.firstOperand != "").share();


  const numbers$ = numberStream$.buffer(operantStream$).map( bufferedNumbers => {
    let number = "";
    bufferedNumbers.forEach(buffer =>{
      number += buffer
    })
    return parseInt(number);
  }).filter(value => value != "");

  const bufferedValues$ = operantStream$.withLatestFrom(numbers$)
  .scan((result, numberAndOperator) => {
    if(result.operator == undefined){
      result.result = numberAndOperator[1];
      result.operator = numberAndOperator[0].operant;
    }
    else{

      switch(result.operator){

        case "Minus":
          result.result -= numberAndOperator[1];
          break;

        case "Plus":
          result.result += numberAndOperator[1];
          break;          

        case "Multi":
          result.result *= numberAndOperator[1];
          break;

        case "Divide":
          result.result /= numberAndOperator[1];
          break;
      }
      result.operator = numberAndOperator[0].operant;
    }
    return result;
  }, {result: 0, operator: undefined})

  const state$ = Observable.merge(numberDisplay$, bufferedValues$)
  .map(value => {
    if(value.firstOperand == undefined){
      return value.result;
    }
    else{

    }
    return value.firstOperand;
  }).startWith(0)
   

  const vtree$ = state$.map(numberDisplay =>
    div([
      h2(".display","" + numberDisplay),
      div([button(".button7 .w3-button .w3-theme", '7'), button('.button8 .w3-button .w3-theme', '8'), button('.button9 .w3-button .w3-theme', '9'),]),
      div([button('.button4 .w3-button .w3-theme', '4'), button('.button5 .w3-button .w3-theme', '5'),button('.button6 .w3-button .w3-theme', '6'),]),
      div([button('.button1 .w3-button .w3-theme', '1'), button('.button2 .w3-button .w3-theme', '2'), button('.button3 .w3-button .w3-theme', '3')]),
      div([button('.buttonMinus .w3-button .w3-theme', '-'), button('.button0 .w3-button .w3-theme', '0'), button('.buttonPlus .w3-button .w3-theme', '+')]),
      div([button('.buttonMulti .w3-button .w3-theme', '*'), button('.buttonDivide .w3-button .w3-theme', '/'), button('.buttonEquals .w3-button .w3-theme', "=")])
    ])
  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
