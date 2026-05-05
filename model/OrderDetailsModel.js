
export default class OrderDetailsModel {
  constructor(description, quantity, unitPrice, itemIndex) {
    this.description = description;
    this.quantity    = Number(quantity);
    this.unitPrice   = Number(unitPrice);
    this.itemIndex   = itemIndex;   // reference back to item_db index
    this.lineTotal   = this.unitPrice * this.quantity;
  }
}
