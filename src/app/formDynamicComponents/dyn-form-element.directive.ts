import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  Input,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { FormInputDynamicElementComponent } from './form-input-dynamic-element/form-input-dynamic-element.component';
import { FormButtonDynamicElementComponent } from './form-button-dynamic-element/form-button-dynamic-element.component';
import { dynElementType, iformField } from '../dataObjects/iformField';

const dynComponents: { [type in dynElementType]?: any } = {
  button: FormButtonDynamicElementComponent,
  input: FormInputDynamicElementComponent,
};

@Directive({
  selector: '[dynFormElementDirective]',
})

export class DynFormElementDirective {

  // This directive here, gets inputs from the parent component (form-container.component.ts) 
  // (via the @Input() decorators) for the formFieldConfig and the dynFormGroup properties.
  // Then, after the component instantiation, it passes them to the properties of the via component.instance
  // So, those properties (or their counterparts) should have been defined in each of the components to be instantiated. 
  @Input()
  formFieldConfig!: iformField;
  @Input() 
  dynFormGroup: any;



  constructor(private viewContainerRef: ViewContainerRef, private cd: ChangeDetectorRef) {}
  private componentRef!: ComponentRef<any>;

  // ngAfterContentInit
  public ngAfterViewInit() {

    this.viewContainerRef.clear();
    
    const controlType: dynElementType = this.formFieldConfig?.formElementControlType;

    if (controlType) {
      const component = dynComponents[controlType];
      this.componentRef = this.viewContainerRef.createComponent(component);
      this.componentRef.instance.fieldConfig = this.formFieldConfig;
      this.componentRef.instance.dfGroup = this.dynFormGroup;
     
      // Without change detection via the following line, we get an error in console:
      // ERROR Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: 
      // Expression has changed after it was checked. Previous value: 'undefined'. 
      // Current value: '[object Object]'. Expression location: FormInputDynamicElementComponent component 
      // It seems like the view has been created after its parent and its children have been dirty checked. 
      // Has it been created in a change detection hook? Find more at https://angular.io/errors/NG0100
      this.cd.detectChanges();
    }

  }

}