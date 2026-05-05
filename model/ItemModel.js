
export default class ItemModel {
  constructor(id, description, unitPrice, quantity, category, picture) {
    this.id          = id;
    this.description = description;
    this.unitPrice   = Number(unitPrice);
    this.quantity    = Number(quantity);
    this.category    = category || 'Other';
    this.picture     = picture  || '';
  }
}
