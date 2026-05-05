
import { customer_db, item_db, order_db } from '../db/db.js';



export function refreshDashboard() {

  // ── Stat Cards
  const totalRevenue = order_db.reduce((sum, o) => sum + o.total, 0);
  const lowStock     = item_db.filter(i => parseInt(i.quantity) <= 5);

  $('#dash-sales').text('Rs. ' + totalRevenue.toFixed(2));
  $('#dash-orders').text(order_db.length);
  $('#dash-customers').text(customer_db.length);
  $('#dash-lowstock').text(lowStock.length);

