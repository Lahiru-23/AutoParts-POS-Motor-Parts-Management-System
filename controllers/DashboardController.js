
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

// ── Low Stock Alerts ─────────────────────────────────────
  const alertContainer = $('#dashLowStockList');
  alertContainer.empty();

  if (lowStock.length === 0) {
    alertContainer.html(`
            <div class="empty-state">
                <i class="bi bi-check-circle" style="color:var(--success)"></i>
                <p>All parts are sufficiently stocked.</p>
            </div>
        `);
  } else {
    lowStock.forEach(item => {
      const qty    = parseInt(item.quantity);
      const max    = 10;
      const pct    = Math.min(Math.round((qty / max) * 100), 100);
      const color  = qty === 0 ? 'var(--danger)' : qty <= 2 ? 'var(--danger)' : 'var(--warning)';
      const label  = qty === 0 ? 'OUT OF STOCK' : 'LOW STOCK';

      alertContainer.append(`
                <div style="margin-bottom:0.75rem;padding:0.75rem;background:var(--dark-bg);
                            border-radius:8px;border:1px solid var(--border)">
                    <div style="display:flex;justify-content:space-between;
                                align-items:center;margin-bottom:0.4rem">
                        <span style="font-size:0.82rem;font-weight:600;
                                     white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                                     max-width:65%">${item.description}</span>
                        <span style="font-size:0.7rem;font-weight:700;color:${color};
                                     background:rgba(239,68,68,0.1);padding:0.15rem 0.5rem;
                                     border-radius:4px;white-space:nowrap">
                            ${qty} — ${label}
                        </span>
                    </div>
                    <div style="height:5px;border-radius:3px;background:var(--border);overflow:hidden">
                        <div style="height:100%;width:${pct}%;border-radius:3px;
                                    background:${color};transition:width 0.3s"></div>
                    </div>
                </div>
            `);
    });
  }
}
