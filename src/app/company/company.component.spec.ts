import { StatusComponent } from './../status/status.component';
import {async, TestBed, ComponentFixture,  fakeAsync } from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { TextComponent } from '../text/text.component';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let compiled;
  let inputElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyComponent,
        TextComponent, 
        StatusComponent
      ],
      // schemas: [ NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;

    component.tagName = 'company';
    component.submitted = false;
    component.required = 'true';
    component.group = new FormGroup({
      company:  new FormControl('', [Validators.required])
    });
    component.ngOnInit();
    // component.submitted = false;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    inputElement = compiled.querySelector('input');
  }));

  it('should be created', async( () => {
    expect(component).toBeTruthy();
  }));
  it('should not display error when input is touched', fakeAsync(() => {
    const control = component.group.controls.company;
    // without event input no value will be set
    inputElement.dispatchEvent(new Event('blur'));

    fixture.detectChanges();
    expect(control.valid).toEqual(false);
    expect(control.pristine).toEqual(true);
    expect(control.touched).toEqual(true);
    expect(control.value).toEqual('');
    expect(compiled.querySelector('.company-error').innerText).toEqual('');
    let errors = {};
    const name = component.group.controls['company'];
    errors = name.errors || {};
    expect(errors['required']).toEqual(true);
  }));
  it('should not display error when input is given', fakeAsync(() => {
    const control = component.group.controls.company;
    // without event input no value will be set
    inputElement.value = 'xxx';
    inputElement.dispatchEvent(new Event('blur'));
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(control.valid).toEqual(true);
    expect(control.pristine).toEqual(false);
    expect(control.touched).toEqual(true);
    expect(control.value).toEqual('xxx');

    expect(compiled.querySelector('.company-error').innerText).not.toContain('Name is required');
    const errors = control.errors || {};
    expect(errors['required']).toEqual(undefined);
    // let errors = {};
    // const name = component.group.controls['company'];
    // errors = name.errors || {};
    // expect(errors['required']).toEqual(true);
  }));
});
