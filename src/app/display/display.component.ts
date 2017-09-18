import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  @Input() size: string;
  @Input() label: string;
  @Input() extraClass: string;
  @Input() clipboardLabel: string;

  constructor() { }
  ngOnInit() { }
}
