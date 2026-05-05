
export default class OrderModel {
  constructor(id, customerName, items, total, date) {
    this.id           = id;
    this.customerName = customerName;
    this.items        = items;   // Array of OrderDetailsModel
    this.total        = Number(total);
    this.date         = date || new Date().toLocaleString('en-LK');
  }
}
