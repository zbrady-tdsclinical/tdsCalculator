import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  maxDisplayLength = 9;
  subText = '';
  mainText = '';
  operand1: number = 0;
  operand2: number = 0;
  operator = '';
  displayingAnswer = false;
  operatorSet = false;

  displayingErrorText() {
    if (this.mainText === 'ERROR' || 
        this.mainText === 'Infinity' || 
        this.mainText === 'NaN') {
      return true;
    }
    else {
      return false;
    }
  }

  addKeyToDisplay (key: string) {
    if (this.mainText.length > this.maxDisplayLength) {
      return;
    }
    this.mainText += key;
  }

  pressOperator(key: string) {
    if (this.displayingErrorText()) {
      this.pressAllClear();
    }
    if (this.operatorSet) {
      return; //Don't allow multiple operators
    }
    if (this.mainText === '') {
      return; //Don't allow operators without numbers
    }
    this.operatorSet = true;
    this.operator = key;
    this.addKeyToDisplay (key);
  }

  pressDigit(key: string) {
    if (this.displayingErrorText()) {
      this.pressAllClear();
    }
    //If we're displaying an answer and they didn't start with an operator
    if (this.displayingAnswer && !this.operatorSet) {
      //Reset the display
      this.pressAllClear();
    }
    this.addKeyToDisplay (key);
  }

  pressAllClear() {
    this.mainText = '';
    this.subText = '';
    this.operatorSet = false;
    this.displayingAnswer = false;
  }

  pressCalculate() {
    if (this.mainText === '' || //Don't allow equals without text 
        (!this.displayingAnswer && !this.operatorSet) || //Not a recalculation and no operator specified
        this.displayingErrorText()) { //Don't allow recalcs on error text
      return; 
    }

    if (this.displayingAnswer && !this.operatorSet) { //Performing a recalculation
      this.operand1 = parseFloat(this.mainText);
      this.subText = this.operand1 + this.operator + this.operand2;
    } 
    else { //Fresh calculation
      var operands = this.mainText.split(this.operator);
      if (operands[0] == '') { // For example /10 with no left, lets clear
         this.pressAllClear();
         return;
      }
      else if (operands[1] == '') { // The right side is empty, let them keep typing.    
        return;
      }      
      this.operand1 = parseFloat(operands[0]);
      this.operand2 = parseFloat(operands[1]);
      this.operatorSet = false;
      this.subText = this.mainText;
    }
    var answer = '';

    if (this.operator === '/') {
      answer = (this.operand1 / this.operand2).toString();
    } else if (this.operator === 'x') {
      answer = (this.operand1 * this.operand2).toString();
    } else if (this.operator === '-') {
      answer = (this.operand1 - this.operand2).toString();
    } else if (this.operator === '+') {
      answer = (this.operand1 + this.operand2).toString();
    } else {
      this.subText = 'ERROR: Invalid Operation';
    }
    
    if (answer.length > this.maxDisplayLength) { //We got a problem here
      var answerSplit = answer.split('.'); //Determine if we can floor off some precision
      var availablePrescision = this.maxDisplayLength - (answerSplit[0].length + 1);
      if (availablePrescision <= 0) { //There is no room for precision.
        answer = answerSplit[0];
      }
      else {
        answer = answerSplit[0] + '.' + answerSplit[1].substr(0, availablePrescision);
      }
    }

    // It's still too powerful
    if (answer.length > this.maxDisplayLength ||
        answer.includes('e')) {
      this.mainText = 'ERROR';
      this.subText = 'Range Exceeded';
    }
    else {
      this.mainText = answer;
    }

    this.displayingAnswer = true;
  }
}