
import { customer_db, item_db, order_db } from '../db/db.js';



export function refreshDashboard() {

  // ── Stat Cards
  const totalRevenue = order_db.reduce((sum, o) => sum + o.total, 0);
  const lowStock     = item_db.filter(i => parseInt(i.quantity) <= 5);

  $('#dash-sales').text('Rs. ' + totalRevenue.toFixed(2));
  $('#dash-orders').text(order_db.length);
  $('#dash-customers').text(customer_db.length);
  $('#dash-lowstock').text(lowStock.length);

  // ── Recent Transactions
  const recentTbody = $('#dashRecentOrders');
  recentTbody.empty();

  if (order_db.length === 0) {
    recentTbody.html(`
            <tr><td colspan="5">
                <div class="empty-state">
                    <i class="bi bi-receipt"></i>
                    <p>No orders yet. Place your first order.</p>
                </div>
            </td></tr>
        `);
  } else {
    [...order_db].reverse().slice(0, 6).forEach(o => {
      const itemSummary = o.items.slice(0, 2)
          .map(i => `${i.description} ×${i.quantity}`)
          .join(', ')
        + (o.items.length > 2 ? ` +${o.items.length - 2} more` : '');

      recentTbody.append(`
                <tr>
                    <td><span class="order-id-badge">${o.id}</span></td>
                    <td style="font-weight:600">${o.customerName}</td>
                    <td style="font-size:0.78rem;color:var(--text-muted)">${itemSummary}</td>
                    <td style="color:var(--primary);font-weight:700;font-family:'Rajdhani',sans-serif">
                        Rs. ${o.total.toFixed(2)}
                    </td>
                    <td><span class="badge-pos badge-success">Completed</span></td>
                </tr>
            `);
    });
  }

