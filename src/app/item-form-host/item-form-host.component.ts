import { Component, Input, SimpleChanges } from '@angular/core';
import { iformField } from '../dataObjects/iformField';
import { ItemsTableFormFields } from '../dataObjects/itemFormFields';
import { IItem } from '../dataObjects/iitem';
import { iformFieldOptionalItem } from '../dataObjects/iformFieldOptionalItem';
import { Utils } from '../Utils';

@Component({
  selector: 'item-form-host',
  templateUrl: './item-form-host.component.html',
  styleUrls: ['./item-form-host.component.css'],
})
export class ItemFormHostComponent {
  // This is the array of table column names that will be used to dynamically generate the form.
  // activeFieldColumnNames: string[] = ['itemName', 'itemDescription'];
  activeFieldColumnNames: string[] = ['itemName', 'itemDescription', 'itemModelYear'];


  
  // This is the item object fetched from backend by the item-query component.  
  @Input()
  public fetchedItem!: IItem;
  @Input()
  public fetchedItemCategories!: iformFieldOptionalItem[];

  
  // This is the array of the selected form fields that will be used to dynamically generate the form.
  itemsFormFieldsSet1: iformField[] = [];

  // A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
  ngOnInit() {
    if (this.fetchedItem) {
      console.log(">===>> ItemFormHostComponent - ngOnInit() - this.fetchedItem", this.fetchedItem);
    }
    this.prepareItemsFormFields();
  }



  // A lifecycle hook that is called when any data-bound property of a directive changes.
  // Called before ngOnInit() (if the component has bound inputs) 
  // and whenever one or more data-bound input properties change.
  // This happens frequently, so any operation you perform here impacts performance significantly.
  public ngOnChanges(changes: SimpleChanges) : void { 
    let ready: boolean = false;
    // console.log(">===>> changes", changes);
    for (const chPropName in changes) { 
      //console.log(">===>> chPropName", chPropName);
      if (chPropName === 'fetchedItem') {
        //console.log(">===>> changes[chPropName]", changes[chPropName]);
        if (changes[chPropName].currentValue === undefined || changes[chPropName].currentValue === null) {
          return;
        }
        this.fetchedItem = changes[chPropName].currentValue;
        console.log(">===>> ItemFormHostComponent - ngOnChanges() - this.fetchedItem", this.fetchedItem);
        ready = true;
      }
      if (chPropName === 'fetchedItemCategories') {
        //console.log(">===>> changes[chPropName]", changes[chPropName]);
        if (changes[chPropName].currentValue === undefined || changes[chPropName].currentValue === null) {
          return;
        }
        this.fetchedItemCategories = changes[chPropName].currentValue;
        console.log(">== %%%%% =>> ItemFormHostComponent - ngOnChanges() - this.fetchedItemCategories", this.fetchedItemCategories);
        ready = true;
      }
      if (ready) {
        this.prepareItemsFormFields();
      } 
    }



  }

  public dynFormSubmitted(formValue: any) {
    console.log('>===>> ItemFormHostComponent - dynFormSubmitted', formValue);
  }



  // This method is called to select valid fields and build the array of fields to be used here (itemsFormFieldsSet1).
  prepareItemsFormFields(): void {
    // if (this.fetchedItem === undefined) {
    //   return;
    // }
    this.itemsFormFieldsSet1 = [];
    ItemsTableFormFields.forEach((field: iformField) => {
      if (this.activeFieldColumnNames.includes(field.tableColumnName!)) {
        field.formElementIsActive = true;
        if (field.formElementControlType === 'input') {
          if (this.fetchedItem !== undefined && this.fetchedItem !== null ) {
            field.formElementInitialValue = this.fetchedItem[field.tableColumnName!];
            console.log('>===>> ItemFormHostComponent - field.formElementInitialValue', field.tableColumnName!, ":", field.formElementInitialValue);
          }
        }
        this.itemsFormFieldsSet1.push(field);
      }
    });

    //console.log('>===>> ItemFormHostComponent - itemsFormFieldsSet1', this.itemsFormFieldsSet1);


    // Here we add a select item
    // ================================================================================
    // Here we assign any item categories fetched with the fetchedItem as preselected values for the select component
    // if (this.fetchedItem !== undefined && this.fetchedItem.categoryNames.length >= 1 && this.fetchedItemCategories !== undefined) {
    if (this.fetchedItemCategories !== undefined && this.fetchedItemCategories !== null && this.fetchedItem !== undefined && this.fetchedItem !== null) {  
      console.log('>===>> ItemFormHostComponent - this.fetchedItem.itemCategoryNames', this.fetchedItem.categoryNames); 
      this.fetchedItem.categoryNames!.forEach(name => {
        this.fetchedItemCategories.forEach(item => {
          if (item.itemValue === name) {
            item.isItemSelected = true;
          }
        });
      });
      //console.log('>===>> ItemFormHostComponent - this.fetchedItemCategories', this.fetchedItemCategories);
    }


    this.itemsFormFieldsSet1.push({
      formElementIsActive: true,
      formElementLabel: 'Select Item Category',
      formElementControlName: 'category',
      formElenentOrder: 3,
      formElementPlaceHolder: 'Select Category',
      formElementControlType: 'select',
      formElementValues: this.fetchedItemCategories,
      formElementSelectMultiple: true,
      
    });


    // Here we add a radio-button item
    // ================================================================================
    let optionsArray2: iformFieldOptionalItem[] = [
      { itemOrder: 1, itemKeyName: 0, itemValue: 'Pending', isItemSelected: true},
      { itemOrder: 2, itemKeyName: 1, itemValue: 'Normal'},
      { itemOrder: 3, itemKeyName: 2, itemValue: 'Canceled' }
    ];

    if (this.fetchedItem !== undefined && this.fetchedItem !== null) {
      // console.log('>== ****** =>> ItemFormHostComponent - this.fetchedItem.itemStatusId', this.fetchedItem.itemStatusId); 
      optionsArray2.forEach(item => {
        if (item.itemKeyName === this.fetchedItem.itemStatusId) {
          item.isItemSelected = true;
          //console.log('>== ****** =>> ItemFormHostComponent - this.fetchedItem.itemStatusId', this.fetchedItem.itemStatusId); 
        }else {
          item.isItemSelected = false;
        }
      });
    }
   
    this.itemsFormFieldsSet1.push({
      formElementIsActive: true,
      formElementLabel: 'Select Item Status',
      formElementControlName: 'itemstatus',
      formElenentOrder: 4,
      formElementControlType: 'radiobutton',
      formElementInputType: "radio",
      formElementValues: optionsArray2,
    });







    
    // Here we add a datetime-local item
    // ================================================================================
    
    let newField: iformField = {
      formElementIsActive: true,
      formElementLabel: 'Select Date & Time:',
      formElementControlName: 'datetimestamp',
      formElenentOrder: 5,
      formElementPlaceHolder: 'Select Date',
      formElementControlType: 'datetime',
      formElementInputType: 'datetime-local',
    };
    if (this.fetchedItem !== undefined && this.fetchedItem !== null && this.fetchedItem.itemCrTimestamp !== undefined) {
      console.log('>===>> ItemFormHostComponent - Date Time this.fetchedItem.itemCrTimestamp', this.fetchedItem.itemCrTimestamp); 
      // let fdate:string = Utils.formatDate(this.fetchedItem.itemCrTimestamp);
      newField.formElementInitialValue = Utils.formatDate(this.fetchedItem.itemCrTimestamp);
    }
    this.itemsFormFieldsSet1.push(newField);





    // Here we add a single checkbox item
    // ================================================================================
    

    let newField2: iformField = {
      formElementIsActive: true,
      formElementLabel: 'I want to subscribe',
      formElementControlName: 'cheksubscribe',
      formElenentOrder: 6,
      formElementControlType: 'checkbox',
      formElementInputType: 'checkbox',
      formElementInitialValue: true,
    };

    this.itemsFormFieldsSet1.push(newField2);



    // Here we add an array of checkbox items (a checkbox group)
    // ================================================================================
       
    let checkBoxArray: iformFieldOptionalItem[] = [
      { itemOrder: 1, itemText: 'It is water-proof',itemKeyName: 'Feature1', itemValue: 'water-proof', isItemSelected: true},
      { itemOrder: 2, itemText: 'It is mediun-size', itemKeyName: 'Feature2', itemValue: 'medium-size'},
      { itemOrder: 3, itemText: 'It has elasticity', itemKeyName: 'Feature3', itemValue: 'elastic' },
      { itemOrder: 4, itemText: 'It is durable', itemKeyName: 'Feature4', itemValue: 'durable' }
    ];

    let newField3: iformField = {
      formElementLabel: 'Select all that apply:',
      formElementControlName: 'chekarray',
      formElenentOrder: 7,
      formElementControlType: 'checkboxarray',
      formElementValues: checkBoxArray,
    };

    this.itemsFormFieldsSet1.push(newField3);




 
    // Here we add a date item
    // ================================================================================
    
    let newFieldDate: iformField = {
      formElementIsActive: true,
      formElementLabel: 'Select Date:',
      formElementControlName: 'datecontrol',
      formElenentOrder: 8,
      formElementPlaceHolder: 'Select Date',
      formElementControlType: 'date',
      formElementInputType: 'date',
    };
    this.itemsFormFieldsSet1.push(newFieldDate);

 
    // Here we add a time item
    // ================================================================================
    
    let newFieldTime: iformField = {
      formElementIsActive: true,
      formElementLabel: 'Select Time:',
      formElementControlName: 'timecontrol',
      formElenentOrder: 9,
      formElementPlaceHolder: 'Select Date',
      formElementControlType: 'time',
      formElementInputType: 'time',
    };
    this.itemsFormFieldsSet1.push(newFieldTime);




    // Here we add a button item
    // ================================================================================
    this.itemsFormFieldsSet1.push({
      formElementIsActive: true,
      formElementLabel: 'Commit',
      formElementControlName: 'submit-button',
      formElenentOrder: 10,
      formElementPlaceHolder: '',
      formElementInputType: 'submit',
      formElementControlType: 'button',
    });
  }
}
