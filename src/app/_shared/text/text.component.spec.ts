import { setUpTestBed } from '@utils/testing/make-tests-faster-again';
// angular
import {async, TestBed, ComponentFixture, fakeAsync, TestModuleMetadata } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

// to be tested
import { TextComponent } from './text.component';

// utils
import { customMatchers, expect } from '@utils/testing/custom-matcher';

// services
import { StatusService } from '@services/status/status.service';

// shared
import { StatusComponent } from '@shared/status/status.component';

// make-tests-faster-again.ts

// const resetTestingModule = TestBed.resetTestingModule,
//   preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
// let allowAngularToReset = () => TestBed.resetTestingModule = resetTestingModule;

// export const setUpTestBed = (moduleDef: TestModuleMetadata) => {
//   beforeAll(done => (async () => {
//     resetTestingModule();
//     preventAngularFromResetting();
//     TestBed.configureTestingModule(moduleDef);
//     await TestBed.compileComponents();

//     // prevent Angular from resetting testing module
//     TestBed.resetTestingModule = () => TestBed;
//   })().then(done).catch(done.fail));

//   afterAll(() => allowAngularToReset());
// };

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;
  let compiled;
  let inputElement: any;
  let _oldValue: string;

  // input changed
  const CHANGED = true;
  const NOT_CHANGED = false;

  // error message
  const msg = {
    VALID : { valid: true, message: ''},
    INVALID : { valid: false, message: ''},
    ERROR_PATTERN : { valid: false, message: 'pattern'},
    ERROR_REQUIRED : { valid: false, message: 'required'}
  };


  function doAction( action: string , new_value?: string) {
    switch (action) {
      case 'change_input':
        // without event input no value will be set
        inputElement.dispatchEvent(new Event('focus'));
        inputElement.value = new_value;
        inputElement.dispatchEvent(new Event('input'));
        break;
      case 'changed_input':
        // without event input no value will be set
        inputElement.dispatchEvent(new Event('focus'));
        inputElement.value = new_value;
        inputElement.dispatchEvent(new Event('input'));
        inputElement.dispatchEvent(new Event('blur'));
        break;
      case 'touch':
        inputElement.dispatchEvent(new Event('focus'));
        break;
      case 'blur':
        inputElement.dispatchEvent(new Event('blur'));
        break;
      case 'mouseleave':
        inputElement.dispatchEvent(new Event('mouseleave'));
        break;
      case 'input':
        inputElement.dispatchEvent(new Event('focus'));
        inputElement.dispatchEvent(new Event('input'));
        break;
      case 'touched':
        inputElement.dispatchEvent(new Event('focus'));
        inputElement.dispatchEvent(new Event('blur'));
        break;
      case 'active_input':
        inputElement.dispatchEvent(new Event('blur'));
        inputElement.dispatchEvent(new Event('focus'));
        break;
      case 'default':
        // inputElement.dispatchEvent(new Event('input'));
        break;
      }
      fixture.detectChanges();

  }

  function showStatus( action: string, isValid: any, hasChanged: boolean) {
    const inputChanged = (hasChanged === true) ? 'input_changed' : 'input_not_changed';
    expect(component).hasChanged({ action: inputChanged, oldValue:  _oldValue} );
    if (isValid.valid === true) {
      expect(component).isValid('');
    } else {
      expect(component).isInvalid(isValid.message);
    }
    showMessage(action);
  }

  // @TODO: extract to custom matcher  hasChanged isValid
  function showMessage(action) {
    const _compiled = fixture.debugElement.nativeElement;
    const _component = fixture.componentInstance;
    switch (action) {
      case 'has_error':
        expect(_compiled).hideErrorMessage('required');
        expect(_compiled).hideErrorMessage('pattern');
        expect(_compiled).hideErrorMessage('default');
        // check dass nicht wackelt
        expect(_compiled).showErrorIcon(true);
        expect(_component.hasFocus).toEqual(false);
        break;
      case 'has_success':
        expect(_compiled).hideErrorMessage('required');
        expect(_compiled).hideErrorMessage('pattern');
        expect(_compiled).showErrorMessage('default');
        expect(_compiled).showErrorIcon(false);
        expect(_component.hasFocus).toEqual(true);
        break;
      case 'default':
        expect(_compiled).showHiddenErrorMessage('default');
        expect(_compiled).hideErrorMessage('required');
        expect(_compiled).hideErrorMessage('pattern');
        expect(_compiled).showErrorIcon(false);
        expect(_component.hasFocus).toEqual(false);
        break;

      // @TODO: normalize
      case 'default_active':
        expect(_compiled).showErrorMessage('default');
        expect(_compiled).hideErrorMessage('required');
        expect(_compiled).hideErrorMessage('pattern');
        expect(_compiled).showErrorIcon(false);
        expect(_component.hasFocus).toEqual(true);
        break;
      case 'error_required':
        expect(_compiled).showErrorMessage('required');
        expect(_compiled).hideErrorMessage('pattern');
        expect(_compiled).hideErrorMessage('default');
        expect(_compiled).showErrorIcon(true);
        expect(_component.hasFocus).toEqual(true);
        break;
      case 'error_pattern':
        expect(_compiled).showErrorMessage('pattern');
        expect(_compiled).hideErrorMessage('required');
        expect(_compiled).hideErrorMessage('default');
        expect(_compiled).showErrorIcon(true);
        expect(_component.hasFocus).toEqual(true);
        break;
    }
  }

  const moduleDef: TestModuleMetadata = {
    declarations: [
      TextComponent,
      StatusComponent
    ],
    // schemas: [ NO_ERRORS_SCHEMA],
    providers: [StatusService],
    imports: [
      FormsModule,
      ReactiveFormsModule,
    ], // declare the test component
  };
  setUpTestBed(moduleDef);

  // setupTestBed({
  //   declarations: [
  //     TextComponent,
  //     StatusComponent
  //   ],
  //   // schemas: [ NO_ERRORS_SCHEMA],
  //   providers: [StatusService],
  //   imports: [
  //     FormsModule,
  //     ReactiveFormsModule,
  //   ], // declare the test component
  // });

  beforeEach(() => {
    // adding custom Matchers
    jasmine.addMatchers(customMatchers);


    // TestBed.configureTestingModule({
    //   declarations: [
    //     TextComponent,
    //     StatusComponent
    //   ],
    //   // schemas: [ NO_ERRORS_SCHEMA],
    //   providers: [StatusService],
    //   imports: [
    //     FormsModule,
    //     ReactiveFormsModule,
    //   ]
    // }).compileComponents();
  });

  describe('input component (type=text)', () => {

    describe('no validator', () => {
      beforeEach(async(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        component.name = 'foo';
        component.submitted = false;
        component.group = new FormGroup({
          foo:   new FormControl('', [])
        });
        component.ngOnInit();
        // component.submitted = false;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        inputElement = compiled.querySelector('input');
        _oldValue = inputElement.value;
      }));
      describe('not submitted', () => {
        it('#0 should be created', async( () => {
          expect(component).toBeTruthy();
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input is created', fakeAsync(() => {
            doAction('default');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#4 WHEN input touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#6 WHEN input changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#8 WHEN input changed to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN touching input', fakeAsync(() => {
            doAction('touch');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#5 WHEN changing input to empty', fakeAsync(() => {
            doAction('change_input',  '');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#7 WHEN changing input to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
      });
      describe('when submitted with value', () => {
        beforeEach(async(() => {
          doAction('changed_input', 'xx');
          component.submitted = true;
          _oldValue = inputElement.value;
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN given_input === correct', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#2 (TODO) WHEN input has been touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
            // showMessage('has_success');
          }));
          it('#3 WHEN input was changed to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#44 WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#5 WHEN input is changed to valid input', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#6 WHEN input is changing to "x"', fakeAsync(() => {
            // set initial state
            doAction('change_input', 'x');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#7 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('has_success', msg.VALID ,  NOT_CHANGED);
          }));
        });
      });
      describe('when submitted without value', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input not changed', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN input touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#5 WHEN input changed to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#6 WHEN input changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#7 WHEN input changed to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#8 WHEN input has changed correctly', fakeAsync(() => {
            // set initial state
            doAction('active_input');

            // test new state
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);

            // set new state
            doAction('change_input', 'xxx');

            // test renewed state
            showStatus('has_success', msg.VALID ,  CHANGED);

            // set new state
            doAction('touched');

            // test renewed state
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#4 WHEN input is changing to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#8 WHEN input has correctly changed', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);

            // set new state
            doAction('change_input', 'xxx');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });
      });
    });

    describe('VALIDATOR=required', () => {
      beforeEach(async(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        component.name = 'foo';
        component.submitted = false;
        component.required = 'true';
        component.group = new FormGroup({
          foo:   new FormControl('', [Validators.required])
        });
        component.ngOnInit();
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        inputElement = compiled.querySelector('input');
        _oldValue = inputElement.value;
      }));
      describe('not submitted', () => {
        it('#0 should be created', async( () => {
          expect(component).toBeTruthy();
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input created', fakeAsync(() => {
            doAction('default');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#4 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#6 WHEN input is not changed', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#8 WHEN input changed to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN touching input', fakeAsync(() => {
            doAction('touch');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#5 WHEN input is not changing', fakeAsync(() => {
            doAction('change_input',  '');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#7 WHEN input is changing to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
      });
      describe('when submitted with value', () => {
        beforeEach(async(() => {
          doAction('changed_input', 'xx');
          component.submitted = true;
          _oldValue = inputElement.value;
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input has not changed', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN input has been touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
            // showMessage('has_success');
          }));
          it('#5 WHEN input shrinked to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#6 WHEN input changed  to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
          it('#7 WHEN input extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#4 WHEN input is shrinking to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
          it('#4 WHEN input is extending to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#2 WHEN input is not changing', fakeAsync(() => {
            doAction('active_input');
            showStatus('has_success', msg.VALID ,  NOT_CHANGED);
          }));
        });
      });
      describe('newtest', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="required"', () => {
          it('#4XX change focus of input', fakeAsync(() => {
            doAction('change_input', 'xxx');
            fixture.detectChanges();
            showStatus('default_active', msg.VALID ,  CHANGED);
            expect(component.action).toEqual('extended');
            expect(component.lastAction).toEqual('touched');
            expect(component.hasFocus).toEqual(true);
            expect(component.control.value).toEqual('xxx');
            expect(component.startValue).toEqual('');
            expect(component.isTyping).toEqual(false);
            expect(component.showError).toEqual('');


            doAction('blur');
            // # fixture.detectChanges();
            showStatus('default', msg.VALID ,  CHANGED);
            // expect(component.action).toEqual('no');
            expect(component.action).toEqual('extended');
            expect(component.lastAction).toEqual('extended');
            expect(component.hasFocus).toEqual(false);
            expect(component.control.value).toEqual('xxx');
            expect(component.startValue).toEqual('xxx');
            expect(component.isTyping).toEqual(false);
            expect(component.showError).toEqual('');

            _oldValue = inputElement.value;
            doAction('change_input', '');
            // # fixture.detectChanges();
            showStatus('default_active', msg.INVALID ,  CHANGED);
            expect(component.action).toEqual('reset');
            expect(component.lastAction).toEqual('extended');
            expect(component.hasFocus).toEqual(true);
            expect(component.control.value).toEqual('');
            expect(component.startValue).toEqual('xxx');
            expect(component.isTyping).toEqual(false);
            expect(component.showError).toEqual('');

            doAction('blur');
            // # fixture.detectChanges();
            showStatus('default', msg.INVALID ,  CHANGED);
            // expect(component.action).toEqual('no');
            expect(component.action).toEqual('reset');
            expect(component.lastAction).toEqual('reset');
            expect(component.hasFocus).toEqual(false);
            expect(component.control.value).toEqual('');
            expect(component.startValue).toEqual('');
            expect(component.isTyping).toEqual(false);
            expect(component.showError).toEqual('');

            // detecting after blur changes simulates issues with changing fields

            fixture.detectChanges();
            _oldValue = inputElement.value;
            // showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
            // expect(component.action).toEqual('no');
            // expect(component.lastAction).toEqual('no');
            // expect(component.hasFocus).toEqual(false);
            // expect(component.control.value).toEqual('');
            // expect(component.startValue).toEqual('');
            // expect(component.isTyping).toEqual(false);
            // expect(component.showError).toEqual('required');

            showStatus('default', msg.INVALID ,  NOT_CHANGED);
            expect(component.action).toEqual('reset');
            expect(component.lastAction).toEqual('reset');
            expect(component.hasFocus).toEqual(false);
            expect(component.control.value).toEqual('');
            expect(component.startValue).toEqual('');
            expect(component.isTyping).toEqual(false);
            expect(component.showError).toEqual('');


            // expect(component.action).toEqual('reset');
            // expect(component.lastAction).toEqual('reset');
            // expect(component.hasFocus).toEqual(true);
            // expect(component.showError).toEqual('');

             doAction('touch');
             showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
            expect(component.action).toEqual('reset');
            expect(component.lastAction).toEqual('reset');
            expect(component.hasFocus).toEqual(true);
            expect(component.control.value).toEqual('');
            expect(component.startValue).toEqual('');
            expect(component.isTyping).toEqual(false);
            expect(component.showError).toEqual('');
            // # fixture.detectChanges();
            // showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
            // expect(component.action).toEqual('reset');
            // expect(component.lastAction).toEqual('reset');
            // expect(component.hasFocus).toEqual(true);
            // expect(component.control.value).toEqual('');
            // expect(component.startValue).toEqual('');
            // expect(component.isTyping).toEqual(false);
            // expect(component.showError).toEqual('');

            // fixture.detectChanges();
            // showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
            // expect(component.action).toEqual('no');
            // expect(component.lastAction).toEqual('no');
            // expect(component.hasFocus).toEqual(true);
            // expect(component.control.value).toEqual('');
            // expect(component.startValue).toEqual('');
            // expect(component.isTyping).toEqual(false);
            // expect(component.showError).toEqual('');

            // doAction('change_input', '');
            // fixture.detectChanges();
            // showStatus('default_active', msg.VALID ,  CHANGED);
            // expect(component.action).toEqual('extended');
            // expect(component.lastAction).toEqual('touched');
            // expect(component.hasFocus).toEqual(true);
            // expect(component.control.value).toEqual('xxx');
            // expect(component.startValue).toEqual('');
            // expect(component.isTyping).toEqual(false);
            // expect(component.showError).toEqual('');

            // doAction('touched', 'xxx');

          }));
        });
      });
      describe('when submitted without value', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="required"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('required', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
        });
        describe('=> SHOW message="default"', () => {
          it('#5 WHEN input is extended to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#7 WHEN input is extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#4 WHEN input is extending to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#8 WHEN input is changing to a successful state of "xxx"', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);

            // set new state
            doAction('change_input', 'xxx');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#1 WHEN input is empty', fakeAsync(() => {
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#6 WHEN input changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#3 (TODO) WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
        });
      });
    });
    describe('VALIDATOR=pattern', () => {
      beforeEach(async(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        component.name = 'foo';
        component.submitted = false;
        component.group = new FormGroup({
          foo:   new FormControl('', [ Validators.pattern('[^ @]*@[^ @]*')])
        });
        component.ngOnInit();
        // component.submitted = false;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        inputElement = compiled.querySelector('input');
        _oldValue = inputElement.value;
      }));
      describe('not submitted', () => {
        it('#0 should be created', async( () => {
          expect(component).toBeTruthy();
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input created', fakeAsync(() => {
            doAction('default');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#4 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#x6 WHEN input is not changed', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#x8 WHEN input is extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN empty input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN input is touching', fakeAsync(() => {
            doAction('touch');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#5 WHEN input is changing to empty', fakeAsync(() => {
            doAction('change_input',  '');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#x7 (TODO) WHEN input is extending to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.INVALID ,  CHANGED);
            // required
          }));
        });
      });
      describe('when submitted with value "xxx"', () => {
        beforeEach(async(() => {
          doAction('changed_input', 'xx');
          component.submitted = true;
          _oldValue = inputElement.value;
        }));
        describe('=> SHOW message="default"', () => {
          it('#xx1 WHEN input has not changed', fakeAsync(() => {
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#xx6 WHEN input is shrinked to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#xx8 WHEN input is changed to valid', fakeAsync(() => {
            doAction('changed_input', 'xxx@asdf.de');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#xx7  WHEN input is changing to valid input', fakeAsync(() => {
            doAction('change_input', 'xxx@asdf.de');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#xx3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('has_error', msg.ERROR_PATTERN ,  NOT_CHANGED);
          }));
          it('#xx5 (Wrong) WHEN input is shrinked', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#xx2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  NOT_CHANGED);
          }));
          it('#xx4 WHEN input is shrinked to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
      });
      describe('when submitted without value', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="default"', () => {
          it('#xxx1 WHEN input is not changed', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xxx3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xxx6 WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xxx8 (wrong) WHEN input has correctly changed', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);

            // set new state
            doAction('change_input', 'xxx@daf.de');
            showStatus('has_success', msg.VALID ,  CHANGED);

            // set new state
            doAction('touched');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#xxx2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#xxx4 WHEN input is shrinking to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#xxx5 WHEN input is shrinked to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
          it('#xxx7 WHEN input is extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
      });
    });
    describe('VALIDATOR=pattern,required', () => {
      beforeEach(async(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        component.name = 'foo';
        component.submitted = false;
        component.required = 'true';
        component.group = new FormGroup({
          foo:   new FormControl('', [Validators.required, Validators.pattern('[^ @]*@[^ @]*')])
        });
        component.ngOnInit();
        // component.submitted = false;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        inputElement = compiled.querySelector('input');
        _oldValue = inputElement.value;
      }));
      describe('not submitted', () => {
        it('#0 should be created', async( () => {
          expect(component).toBeTruthy();
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input is created', fakeAsync(() => {
            doAction('default');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#4 WHEN input is touched', fakeAsync(() => {
            // set initial state
            doAction('touched');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);

            // test new state
            expect(component).isInvalid('');
            showMessage('default');
          }));
          it('#6 WHEN input is not changed', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#8 WHEN input is extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN empty input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN input is touching', fakeAsync(() => {
            doAction('touch');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#5 WHEN input is shrinking to empty', fakeAsync(() => {
            doAction('change_input',  '');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
           // @TODO: adapt
          it('#7 WHEN input is extending to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.INVALID ,  CHANGED);
            // required
          }));
        });
      });
      describe('when submitted with value "xx"', () => {
        beforeEach(async(() => {
          doAction('changed_input', 'xx');
          component.submitted = true;
          _oldValue = inputElement.value;
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input is not changed', fakeAsync(() => {
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#6 WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
          it('#8 WHEN input is changed to valid input', fakeAsync(() => {
            doAction('changed_input', 'xxx@asdf.de');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('has_error', msg.ERROR_PATTERN ,  NOT_CHANGED);
          }));
          it('#5 WHEN input is shrinked to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
          xit('#6 WHEN input is changed to empty and we  go back to input', fakeAsync(() => {
            // set initial state
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  CHANGED);

            doAction('touch');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);

            // test new state => dont show error
            doAction('changed_input',  'xx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  NOT_CHANGED);
          }));
          it('#4 WHEN input is shrinking to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#7  WHEN input is changed to valid input', fakeAsync(() => {
            doAction('change_input', 'xxx@asdf.de');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });
      });
      describe('when submitted without value', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="default"', () => {
          it('#9 WHEN input has correctly changed', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_required', msg.ERROR_REQUIRED ,  CHANGED);

            // set new state
            doAction('change_input', 'xxx@daf.de');
            showStatus('has_success', msg.VALID ,  CHANGED);

            // set new state
            doAction('touched');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#1 WHEN input is not changed', fakeAsync(() => {
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#3 (TODO) WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
            // success ?
          }));
          it('#5 WHEN input is changed to "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
          it('#6 (TODO) WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#7 WHEN input is extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_required"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#4 (wrong) WHEN input is changing to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_required', msg.ERROR_REQUIRED ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#8 (IMPORTANT) should change error message from required to pattern after leaving field', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_required', msg.ERROR_REQUIRED ,  CHANGED);

            // set new state
            doAction('changed_input', 'xxxx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);

            // set new state  => occurs pattern error
            doAction('touch');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
          it('#XXX (IMPORTANT) should change error message from required to pattern after leaving field', fakeAsync(() => {
            // set initial state
            doAction('changed_input', 'xxx@adsfdf.de');
            showStatus('default', msg.VALID ,  CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);

            // set new state
            doAction('changed_input', 'xxxx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);

            // set new state  => occurs pattern error
            doAction('touch');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
      });
    });
  });
  // TELEPHONE
  describe('input component (type=tel)', () => {
    describe('pattern', () => {
      beforeEach(async(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        component.name = 'foo';
        component.type = 'tel';
        component.submitted = false;
        component.group = new FormGroup({
          foo:   new FormControl('', [
            Validators.pattern('^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s\.\/0-9]*')
          ])
        });
        component.ngOnInit();
        // component.submitted = false;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        inputElement = compiled.querySelector('input');
        _oldValue = inputElement.value;
      }));
      describe('not submitted', () => {
        it('#0 should be created', async( () => {
          expect(component).toBeTruthy();
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 WHEN input created', fakeAsync(() => {
            doAction('default');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#4 display WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#x6 WHEN input is not changed', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#x8 (WRONG) WHEN input is extended to "xxx"', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
          it('#x8 WHEN input is extended to "012"', fakeAsync(() => {
            doAction('changed_input', '012');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#xx (TODO) WHEN input is changed to valid value and submitted', fakeAsync(() => {
            doAction('changed_input',  '030 6796786');
            showStatus('default', msg.VALID ,  CHANGED);

            // subtmit
            const _newValue = inputElement.value;
            component.submitted = true;
            fixture.detectChanges();
            // input not changed


            // test new state
            expect(component).hasChanged({ action: 'input_not_changed', oldValue:  _newValue} );
            expect(component).isValid('');
            showMessage('default');
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN empty input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN input is touching', fakeAsync(() => {
            doAction('touch');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          it('#x5 WHEN input is changing to empty', fakeAsync(() => {
            doAction('change_input',  '');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
          // @TODO: adapt
          it('#x7 (WRONG) WHEN input is changing to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.INVALID ,  CHANGED);
            // error_requierd
          }));
          it('#x8 WHEN input is extended to "012"', fakeAsync(() => {
            doAction('changed_input', '012');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#xx (TODO) WHEN input is changed to incorrect value and submitted', fakeAsync(() => {
            doAction('changed_input',  'xxx');
            showStatus('default', msg.INVALID ,  CHANGED);

            // subtmit
            component.submitted = true;
            fixture.detectChanges();

             showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
             // input not changed
          }));
        });
      });
      describe('when submitted with value "012"', () => {
        beforeEach(async(() => {
          doAction('changed_input', '012');
          component.submitted = true;
          _oldValue = inputElement.value;
        }));
        describe('=> SHOW message="default"', () => {
          it('#xx1 WHEN input is not changed', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xx3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xx6 WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#xx8 WHEN input is changed to valid input', fakeAsync(() => {
            doAction('changed_input', '+49 565');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          it('#xx2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('has_success', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xx7  WHEN input is changed to valid input', fakeAsync(() => {
            doAction('change_input', '020/345667');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#xx4 WHEN input is changing to wrong value "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#xx5 (Wrong) WHEN input is changed to invalid value "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
      });
      describe('when submitted without value', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="default"', () => {
          it('#xxx1 WHEN input is not changed', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xxx3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xxx6 WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#xxx8 (wrong) WHEN input is changed to valid valued', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);

            // set renewed state
            doAction('change_input', '+49 565');
            showStatus('has_success', msg.VALID ,  CHANGED);

            // set new state
            doAction('touched');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
          it('#xxx7 WHEN input is changed to valid input', fakeAsync(() => {
            doAction('changed_input', '012 2345345');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#xxx2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#xxx4 WHEN input is changing to invalid value "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#xxx5 WHEN input is changed to wrong value "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
      });
    });
    describe('pattern and required', () => {
      beforeEach(async(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;
        component.name = 'foo';
        component.type = 'tel';
        component.submitted = false;
        component.required = 'true';
        component.group = new FormGroup({
          foo:   new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s\.\/0-9]*')])
        });
        component.ngOnInit();
        // component.submitted = false;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
        inputElement = compiled.querySelector('input');
        _oldValue = inputElement.value;
      }));
      describe('not submitted', () => {
        it('#0 should be created', async( () => {
          expect(component).toBeTruthy();
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 display state=default when input created', fakeAsync(() => {
            doAction('default');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#4 display state=default when input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#6 display state=default when input is not changed', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#8 display state=default when input is changed', fakeAsync(() => {
            doAction('changed_input', 'xxx');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 display state=default when empty input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#3 display state=default when user touches input', fakeAsync(() => {
            doAction('touch');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          it('#5 display state=default when user is changing input', fakeAsync(() => {
            doAction('change_input',  '');
            showStatus('default_active', msg.INVALID ,  NOT_CHANGED);
          }));
          // @TODO: adapt
          it('#7 WHEN input is changing to "xxx"', fakeAsync(() => {
            doAction('change_input', 'xxx');
            showStatus('default_active', msg.INVALID ,  CHANGED);
            // requiered?
          }));
          it('#7 WHEN input is changing to "012 678"', fakeAsync(() => {
            doAction('change_input', '012 678');
            showStatus('default_active', msg.VALID ,  CHANGED);
          }));
        });
      });
      describe('when submitted with value', () => {
        beforeEach(async(() => {
          doAction('changed_input', '012');
          component.submitted = true;
          _oldValue = inputElement.value;
        }));
        describe('=> SHOW message="default"', () => {
          it('#1 (wrong) WHEN input is not changed', fakeAsync(() => {
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('default', msg.VALID ,  NOT_CHANGED);
          }));
          it('#6 WHEN input is changed to empty', fakeAsync(() => {
            // set initial state
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  CHANGED);
          }));
          it('#8 WHEN input is changed to valid value "+49 565"', fakeAsync(() => {
            doAction('changed_input', '+49 565');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="default_active"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('default_active', msg.VALID ,  NOT_CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#5 (TODO) WHEN input is changed to invalid value "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
          // @TODO: fix and copy for reqired and pattern
          xit('#6 (TODO) WHEN input is changed to empty and we go back to input', fakeAsync(() => {
            // set initial state
            doAction('changed_input',  '');
            showStatus('default', msg.INVALID ,  CHANGED);

            // touch
            doAction('touch');
            showStatus('default', msg.INVALID ,  CHANGED);
            // TODO: test new state => dont show error

            doAction('changed_input',  'xx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#4 WHEN input is changing to "x"', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          xit('#4 WHEN input is changing to "012 6374538"', fakeAsync(() => {
            doAction('change_input', '012 6374538');
            showStatus('has_success', msg.INVALID ,  CHANGED);
          }));
          it('#7 WHEN input is changed to valid input', fakeAsync(() => {
            doAction('change_input', '+49 565');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });

      });
      describe('when submitted without value', () => {
        beforeEach(async(() => {
          component.submitted = true;
          doAction('touched');
        }));
        describe('=> SHOW message="default"', () => {
          it('#9 (IMPORTANT) AFTER input has correctly changed', fakeAsync(() => {
            // set initial state
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_required', msg.ERROR_REQUIRED ,  CHANGED);

            // set new state
            doAction('change_input', '+49 565');
            showStatus('has_success', msg.VALID ,  CHANGED);

            // set new state
            doAction('touched');
            showStatus('default', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_success"', () => {
          xit('#7 (WRONG) WHEN input is changed to valid input "030 45678"', fakeAsync(() => {
            doAction('changed_input', '030 45678');
            showStatus('has_success', msg.VALID ,  CHANGED);
          }));
        });
        describe('=> SHOW message="has_error"', () => {
          it('#1 WHEN input is not changed', fakeAsync(() => {
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#3 WHEN input is touched', fakeAsync(() => {
            doAction('touched');
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#5 WHEN input is changed to wrong value "x"', fakeAsync(() => {
            doAction('changed_input', 'x');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
          }));
          it('#6 (TODO) WHEN input is changed to empty', fakeAsync(() => {
            doAction('changed_input',  '');
            showStatus('has_error', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#8 (IMPORTANT) should change error message from required to pattern after leaving field', fakeAsync(() => {
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_required', msg.ERROR_REQUIRED ,  CHANGED);

            // set new state
            doAction('changed_input', 'xxxx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);
            // changed?

            // set new state  => occurs pattern error
            doAction('touch');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_required"', () => {
          it('#2 WHEN input is active', fakeAsync(() => {
            doAction('active_input');
            showStatus('error_required', msg.ERROR_REQUIRED ,  NOT_CHANGED);
          }));
          it('#4 (TODO) WHEN input is changing to wrong value', fakeAsync(() => {
            doAction('change_input', 'x');
            showStatus('error_required', msg.ERROR_REQUIRED ,  CHANGED);
          }));
        });
        describe('=> SHOW message="error_pattern"', () => {
          it('#XXX (IMPORTANT) should change error message from required to pattern after leaving field', fakeAsync(() => {
            // set initial state
            doAction('changed_input', '+49 565');
            showStatus('default', msg.VALID ,  CHANGED);

            // set new state  => occurs pattern error
            doAction('change_input', 'xxx');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);

            // set new state
            doAction('changed_input', 'xxxx');
            showStatus('has_error', msg.ERROR_PATTERN ,  CHANGED);

            // set new state  => occurs pattern error
            doAction('touch');
            showStatus('error_pattern', msg.ERROR_PATTERN ,  CHANGED);
            // why changed

            // test renewed state message
          }));
        });
      });
    });
  });
});

