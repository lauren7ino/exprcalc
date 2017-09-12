import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-iconbutton',
  templateUrl: './iconbutton.component.html',
  styleUrls: ['./iconbutton.component.css']
})
export class IconbuttonComponent implements OnInit {
  @Input() icon: string;

  constructor() { }
  ngOnInit() { }
}
