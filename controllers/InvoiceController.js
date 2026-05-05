

import { order_db } from '../db/db.js';

// ── Render Invoice List
export function renderInvoiceList() {
  $('#invoiceListView').show();
  $('#invoiceDetailView').hide();

  const tbody = $('#invoiceListBody');
  tbody.empty();

  if (order_db.length === 0) {
    tbody.html(`
            <tr><td colspan="6">
                <div class="empty-state">
                    <i class="bi bi-receipt"></i>
                    <p>No invoices available. Place an order first.</p>
                </div>
            </td></tr>
        `);
    return;
  }
