import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-component',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() buttonText: string;
  @Input() extraClass: string;

  constructor() { }

  ngOnInit() { }
}
