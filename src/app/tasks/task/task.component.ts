import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  animations: [
    trigger('rollout', [
      state(
        'hidden',
        style({
          height: '0',
          opacity: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          height: '*',
          opacity: '1',
          overflow: 'hidden',
        })
      ),
      transition('hidden <=> visible', [
        animate('0.4s ease-in-out'),
      ]),
    ]),
    trigger('round-button', [
      state(
        'unrounded',
        style({
          'border-bottom-right-radius': '0',
        })
      ),
      state(
        'rounded',
        style({
          'border-bottom-right-radius': '0.6rem',
        })
      ),
      transition('unrounded => rounded', [
        animate('0.5s ease-in'),
      ]),
      transition('rounded => unrounded', [
        animate('0.2s ease-out'),
      ])
    ])
  ]
})
export class TaskComponent {
  subtasksVisible = false;

  toggleSubtasks() {
    this.subtasksVisible = !this.subtasksVisible;
  }
}
