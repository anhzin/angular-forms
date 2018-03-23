import {
  Component, OnInit, Input,
  OnChanges
} from '@angular/core';
import {
  FormGroup

 } from '@angular/forms';
import { environment } from '../../environments/environment';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { StatusService } from '../services/status/status.service';
@Component({
  selector: environment.prefix + 'textarea',
  styles: [ `
  .hide-opacity{
  }
  .form-control  + div.text-danger{

  }
  .has-error .form-control:focus  + div.text-danger{
    opacity:1;
  }
  .icon-warning{
   color: red;
   margin-left: -30px;
   font-size: 20px;
   margin-top: 80px; // specific TODO
  }
  .mt30--xs{
    margin-top: 30px;
  }
  .has-error .form-control{
    border: 1px solid red;
  }
  .has-error label{
    color: red;
  }
`],
  template: `
  <div class="form-group"
    [formGroup]="group"
    [ngClass]="{'has-error': statusService.getValidationStatus(this) }"
  >
    <label for="{{name}}" class="control-label">
    {{label}}<span *ngIf="required=='true'">*</span>:
    </label>
    <textarea
    rows="{{rows}}"
    (keydown)="isTyping= true"
    (keyup)="isTyping=false"
    (focus)="hasFocus=true"
    (blur)="hasFocus=false"
    class="form-control" type="text" formControlName="{{name}}"
    ></textarea>
    <form-status
      [showError]="showError"
      [hasFocus]="hasFocus"
      [name]="name"
    ></form-status>
  </div>
  `
})
export class TextAreaComponent implements OnInit, OnChanges, DoCheck {

  @Input() submitted: Boolean;
  @Input() group: FormGroup;
  @Input() name: string;
  @Input() label?: any;
  @Input() rows = 5;
  @Input() required = 'false';
  showError: string;
  hasFocus = false;
  isTyping =  false;
  control: any;
  startValue = '';
  oldValue: '';
  action = '';  // action of input between focuses
  lastAction = '';
  startError = true;
  noRequired =  false;
    constructor(
      private statusService: StatusService
    ) {
    }
    ngOnInit() {
      // set initial state, fixes also tests
      this.hasFocus = false;
      this.isTyping = false;
      this.required = this.required !== 'false' ? 'true' : 'false';
      this.control = this.group.get(this.name);
      this.startValue = '';
      this.oldValue = '';
    }
    ngOnChanges() {
    }

    ngDoCheck() {

      this.statusService.checkStatus(this);

    }
}
