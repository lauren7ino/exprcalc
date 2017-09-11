import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input() historyList: string[];
  @Input() visible: boolean;
  @Output() onCopyToDisplay = new EventEmitter<string>();

  constructor() { }
  ngOnInit() { }

  copyToDisplay(text: string) {
    this.onCopyToDisplay.emit(text);
  }
  resetHistory() {
    this.onCopyToDisplay.emit(null);
  }
}
