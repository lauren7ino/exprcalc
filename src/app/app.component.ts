import { DisplayComponent } from './display/display.component';
import { Component, OnInit, NgModule } from '@angular/core';
import { HostListener } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _expression: string;
  private _localThousands;
  private _localDecimal;
  private _evalError = '…';

  displayExpression: string;
  private _result: any;
  localResult: string;
  inError: boolean;

  private _historyKey = 'history';
  historyList: string[] = [];
  private _maxHistory = 10;

  constructor(
    public localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    const localNum = parseFloat('1234.5').toLocaleString();
    this._localThousands = localNum[1] !== '2' ? localNum[1] : ''; // May not exist thousands separator
    this._localDecimal = localNum[localNum.length - 2];
    this.resetPress();
    this._retrieveHistory();
  }

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key === 'c' || event.key === 'Delete') {
        this.resetPress();
      } else if (event.key === '(' || event.key === ')') {
        this.parensPress(event.key);
      } else if (event.key === 'Backspace') {
        this.deletePress();
      } else if (event.key >= '0' && event.key <= '9' || event.key === '.' || event.key === ',') {
        this.numberPress(event.key !== ',' ? event.key : '.');
      } else if (event.key === '/' || event.key === '*' || event.key === '-' || event.key === '+') {
        this.operatorPress(event.key);
      } else if (event.key === 'Enter') {
        this._saveToHistory();
      }
      // console.log(event.key);
    }

  resetPress() {
    this._saveToHistory();
    this._assign('');
  }
  parensPress(keyInput: string) {
    let expr = this._expression;
    //
    expr = this._trimEndDecimal(expr); // Delete ',' in 4,'
    if (expr === '0' || expr === '-0') {
      expr = this._trimLastChar(expr);
    }
    // Convert '3(' into '3*('
    const lastChar = this._lastChar(expr);
    if (keyInput === '(' && lastChar !== '' && lastChar !== '(' && !this._isOperation(lastChar)) {
      keyInput = '*' + keyInput;
    }
    //
    if (keyInput === ')') {
      // '3+)' => '3)'
      if (this._isOperation(lastChar)) {
        expr = this._trimLastChar(expr);
      }
      // Auto-add '('s if too few
      const leftCount = this._countChr(expr, '(');
      const rightCount = this._countChr(expr, ')') + 1; // 1 the one being pressed
      let missing = leftCount - rightCount;
      if (missing < 0) {
        while (missing < 0) {
          expr = '(' + expr;
          missing++;
        }
      }
    }
    //
    expr = this._autoTrimEndDecimals(expr);
    expr = expr + keyInput;
    expr = this._replaceAll(expr, '()', ''); // Delete '()'
    //
    this._assign(expr);
  }
  deletePress() {
    let expr = this._expression;
    const lastChar = this._lastChar(expr);
    let delMinus = this._isDigit(lastChar);
    expr = this._trimLastChar(expr);   // Actual delete
    const nextoToLastChar = this._nextoToLastChar(expr);
    delMinus = delMinus && expr.endsWith('-') && (!this._isDigit(nextoToLastChar) && nextoToLastChar !== ')');
    expr = this._trimEndDecimal(expr); // Delete ',' in 4,'
    if (delMinus) {
      expr = this._trimLastChar(expr); // Delete '-' in -4' but not in '2 - 4' or '(2) - 4'
    }
    // Auto delete '()' on '(3)' but not '(4)*(5)'
    if (lastChar === ')' && expr.startsWith('(')) {
      const newExpr = expr.substr(1);
      if (this._canEvalExpression(newExpr)) { // Make smart decision
        expr = newExpr;
      }
    }
    //
    this._assign(expr);
  }
  numberPress(keyInput: string) {
    let expr = this._expression;
    // Convert ')9' into ')+9'
    if (expr.endsWith(')')) {
      expr += '+';
    }
    // Decimal separator
    if (this._isDigit(keyInput)) {
      // Delete initial '0' (avoid '062')
      if (this._lastNumber(expr) === '0') {
        expr = this._trimLastChar(expr);
      }
    } else { // It's the '.'
        // Only one '.' per part
        const lastPart = this._lastNumber(expr);
        if (lastPart.indexOf('.') !== -1) {
          return;
        }
        // Auto-add '0.'
        if (!this._isDigit(this._lastChar(expr))) {
          keyInput = '0.';
        }
    }
    //
    this._assign(expr += keyInput);
  }
  operatorPress(keyInput: string) {
    let expr = this._expression;
    // Delete end '.'
    expr = this._trimEndDecimal(expr);
    // Invert zero
    if (keyInput === '-') {
      if (expr === '0') {
        expr = '-0';
        keyInput = '';
      } else if (expr === '-0') {
        expr = '0';
        keyInput = '';
      }
    }
    // Skip '(+'
    let lastChar = this._lastChar(expr);
    if (lastChar === '(' && this._isOperation(keyInput) && keyInput !== '-') {
      return;
    }
    // '/*+' replaces last '/*-+' (see *1) Note: don't replace '-' in '3*-2'
    if (keyInput !== '-' && this._isOperation(keyInput) && this._isOperation(lastChar)) {
      expr = this._trimLastChar(expr);
      // Avoid situations like '*/'
      lastChar = this._lastChar(expr);
      if (this._isOperation(lastChar)) {
        expr = this._trimLastChar(expr);
      } else if (lastChar === '(') {
        keyInput = '';
      }
    }
    expr = this._autoTrimEndDecimals(expr);
    expr += keyInput;
    // *1) since '-' was excluded, fix '-' here
    expr = this._replaceAll(expr, '+-', '-');
    expr = this._replaceAll(expr, '--', '+');
    expr = this._replaceAll(expr, '/+', '/');
    expr = this._replaceAll(expr, '*+', '*');
    expr = this._replaceAll(expr, '(+', '(');
    //
    this._assign(expr);
  }

  private _assign(expr: string) {
    if (expr.length === 0) { // Zero empty display
      expr = '0';
    }
    if (this._expression === expr) { // Optimization
      return;
    }
    this._expression = expr;
    // console.log(this._expression);
    this.displayExpression = this._beatifyExpr(expr);
    //
    this._calculate();
  }
  private _calculate() {
    try {
      this._result = eval(this._expression);
      this.localResult = this._beautifyResult(this._result);
      this.inError = false;
    } catch (e) {
      this._result = undefined;
      this.localResult = this._evalError; // Can't be evaluated
      this.inError = true;
    }
  }
  private _canEvalExpression(expr: string): boolean {
    try {
      eval(expr);
      return true;
    } catch (e) {
      return false;
    }
  }

  private _beatifyExpr(expr: string): string {
    // Spaces: Sutract/negative number problem
    if (expr.endsWith('-')) {
      expr = this._insertAt(expr, expr.length - 1, ' ');
    }
    for (let i = expr.length - 2; i >= 1; i--) {
      if (expr[i] === '-') {
        const chBefore = expr[i - 1];
        const chAfter  = expr[i + 1];
        if (this._isDigit(chBefore) && this._isDigit(chAfter)) { // '8 - 8'
             expr = this._insertAt(expr, i + 1, ' ');
             expr = this._insertAt(expr, i, ' ');
        } else if (this._isDigit(chBefore) && !this._isDigit(chAfter)) { // '8 -('
             expr = this._insertAt(expr, i, ' ');
        } else if (chBefore === ')' && this._isDigit(chAfter)) { // ')- 8'
             expr = this._insertAt(expr, i + 1, ' ');
        }
      }
    }
    // Add other spaces
    expr = this._replaceAll(expr, '.', this._localDecimal);
    expr = this._replaceAll(expr, '/', ' ÷ ');
    expr = this._replaceAll(expr, '*', ' × ');
    expr = this._replaceAll(expr, '+', ' + ');
    expr = this._replaceAll(expr, '(', ' ( ');
    expr = this._replaceAll(expr, ')', ' ) ');
    // Trim excess spaces
    expr = this._replaceAll(expr, '  ', ' ').trim();
    //
    return expr;
  }

  private _lastChar(text: string): string {
      if (text.length >= 1 ) {
        return text[text.length - 1];
      }
      return '';
  }
  private _nextoToLastChar(text: string): string {
      if (text.length >= 2 ) {
        return text[text.length - 2];
      }
      return '';
  }
  private _lastNumber(expr: string): string {
    let i;
    for (i = expr.length - 1; i >= 0; i--) {
      if (expr[i] !== '.' && !this._isDigit(expr[i])) {
        break;
      }
    }
    return expr.substr(i + 1);
  }

  private _trimLastChar(text: string): string {
      if (text.length >= 1 ) {
        text = text.substring(0, text.length - 1);
      }
      return text;
  }
  private _trimEndDecimal(expr: string): string {
    if (expr.endsWith('.')) {
       return this._trimLastChar(expr);
    }
    return expr;
  }
  private _insertAt(text: string, index: number, insert: string) {
    return text.substr(0, index) + insert + text.substr(index);
  }

  private _isDigit(chr: string): boolean {
    return chr >= '0' && chr <= '9';
  }
  private _isOperation(chr: string): boolean {
    return chr === '/' || chr === '*' || chr === '-' || chr === '+';
  }

  private _replaceAll(text: string, search: string, replace: string): string {
    // Fix chars that are reserved
    for (let i = search.length - 1; i >= 0; i--) {
      search = this._insertAt(search, i, '\\');
    }
    //
    return text.replace(new RegExp(search, 'g'), replace);
  }
  private _countChr(text: string, chr: string): number {
    let count = 0;
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] === chr) {
        count++;
      }
    }
    return count;
  }
  private _beautifyResult(num: number): string {
    if (!isFinite(num)) {
      return num.toString(); // Nothing to beautify on Infinity or NaN
    }
    // Beautify manually because toLocaleString() only shows 2 decimals
    const text = String(Math.round(num * 100000.0) / 100000.0);
    const parts = text.split('.');
    if (this._localThousands !== '') {
      for (let i = parts[0].length - 3; i > 0; i -= 3) {
        parts[0] = this._insertAt(parts[0], i, this._localThousands);
      }
    }
    if (parts.length === 1) {
      return parts[0];
    } else {
      return parts[0] + this._localDecimal + parts[1];
    }
  }
  private _autoTrimEndDecimals(expr: string): string {
    const lastNum = this._lastNumber(expr);
    if (lastNum.indexOf('.') !== -1) {
      while (expr.endsWith('0')) {
        expr = this._trimLastChar(expr);
      }
      expr = this._trimEndDecimal(expr);
    }
    return expr;
  }
  private _retrieveHistory() {
    if (this.localStorageService.isSupported) {
      try {
        const history: string[] = JSON.parse(this.localStorageService.get<string>(this._historyKey));
        if (history !== null && history.length > 0) {
          this.historyList = history;
        }
      } catch (e) {
        this.localStorageService.clearAll(); // Just in case the format changed
      }
    }
  }
  private _saveToHistory() {
    if (!this.inError && this._expression !== undefined &&
      this._expression !== '0' && this._expression !== this._result.toString()
    ) {
      const newHist = this._expression + ' = ' + this.localResult;
      // Avoid duplications
      if (this.historyList.length > 0 && this.historyList[this.historyList.length - 1] === newHist) {
        return;
      }
      // Trim history
      while (this.historyList.length >= this._maxHistory) {
        this.historyList.shift();
      }
      //
      this.historyList.push(newHist);
      this.localStorageService.set(this._historyKey, JSON.stringify(this.historyList));
    }
  }
}
