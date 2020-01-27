import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from "@angular/forms";
 import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  // @Output() ingredientAdded = new EventEmitter<{name:string, amount:number}>();

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
   this.subscription = this.slService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.slService.getIngredient(index);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }
  
  onAddItem(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name,value.amount);
    this.slService.addIngredient(newIngredient);
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
