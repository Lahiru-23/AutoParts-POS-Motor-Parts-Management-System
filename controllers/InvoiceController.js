

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

  [...order_db].reverse().forEach(o => {
    tbody.append(`
            <tr>
                <td><span class="order-id-badge">${o.id}</span></td>
                <td style="font-weight:600">${o.customerName}</td>
                <td>${o.items.length} part(s)</td>
                <td style="color:var(--primary);font-weight:700;font-family:'Rajdhani',sans-serif">
                    Rs. ${o.total.toFixed(2)}
                </td>
                <td style="color:var(--text-muted);font-size:0.78rem">${o.date}</td>
                <td>
                    <button class="btn-pos btn-pos-sm btn-pos-primary view-inv-btn" data-id="${o.id}">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `);
  });
}

// ── Show Single Invoice ──────────────────────────────

export function showInvoice(orderId) {
  const o = order_db.find(x => x.id === orderId);
  if (!o) return;

  const rows = o.items.map((item, i) => `
        <tr>
            <td style="padding:0.75rem;color:var(--text-muted);border-bottom:1px solid var(--border)">${i + 1}</td>
            <td style="padding:0.75rem;font-weight:600;border-bottom:1px solid var(--border)">${item.description}</td>
            <td style="padding:0.75rem;text-align:center;border-bottom:1px solid var(--border)">${item.quantity}</td>
            <td style="padding:0.75rem;border-bottom:1px solid var(--border)">
                Rs. ${parseFloat(item.unitPrice).toFixed(2)}
            </td>
            <td style="padding:0.75rem;font-weight:700;color:var(--primary);border-bottom:1px solid var(--border)">
                Rs. ${(item.unitPrice * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

  $('#invoiceContent').html(`
        <div style="display:flex;justify-content:space-between;align-items:flex-start;
                    margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border)">
            <div>
                <div style="font-size:2.5rem;margin-bottom:0.3rem">🔧</div>
                <div style="font-family:'Rajdhani',sans-serif;font-size:1.6rem;font-weight:700">
                    AutoParts Motor Shop
                </div>
                <div style="color:var(--text-muted);font-size:0.82rem;margin-top:0.15rem">
                    Your Trusted Motor Parts Supplier
                </div>
                <div style="color:var(--text-muted);font-size:0.78rem;margin-top:0.25rem">
                    📞 011-270-2916 &nbsp;|&nbsp; ✉ info@autoparts.lk
                </div>
                <div style="color:var(--text-muted);font-size:0.78rem">
                    📍 No. 45, Main Street, Colombo 10
                </div>
            </div>
            <div style="text-align:right">
                <div style="font-family:'Rajdhani',sans-serif;font-size:2rem;font-weight:700;color:var(--primary)">
                    INVOICE
                </div>
                <table style="font-size:0.82rem;margin-left:auto;border-collapse:collapse">
                    <tr>
                        <td style="padding:0.15rem 0.5rem;color:var(--text-muted)">Invoice #</td>
                        <td style="padding:0.15rem 0;font-weight:700">${o.id}</td>
                    </tr>
                    <tr>
                        <td style="padding:0.15rem 0.5rem;color:var(--text-muted)">Date</td>
                        <td style="padding:0.15rem 0">${o.date}</td>
                    </tr>
                </table>
                <div style="margin-top:0.75rem;background:rgba(34,197,94,0.1);
                            border:1px solid rgba(34,197,94,0.3);color:var(--success);
                            padding:0.3rem 0.85rem;border-radius:6px;font-size:0.75rem;
                            font-weight:700;display:inline-block">
                    ✓ PAID
                </div>
            </div>
        </div>

        <div style="margin-bottom:1.5rem;padding:1rem;background:var(--dark-bg);
                    border-radius:10px;border:1px solid var(--border)">
            <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.08em;
                        color:var(--text-muted);margin-bottom:0.4rem;font-weight:600">
                Bill To
            </div>
            <div style="font-size:1rem;font-weight:700">${o.customerName}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem">
            <thead>
                <tr style="background:rgba(255,107,0,0.07)">
                    <th style="padding:0.75rem;font-size:0.68rem;text-transform:uppercase;
                                letter-spacing:0.08em;color:var(--text-muted);font-weight:600;
                                border-bottom:1px solid var(--border)">#</th>
                    <th style="padding:0.75rem;font-size:0.68rem;text-transform:uppercase;
                                letter-spacing:0.08em;color:var(--text-muted);font-weight:600;
                                border-bottom:1px solid var(--border)">Part Description</th>
                    <th style="padding:0.75rem;font-size:0.68rem;text-transform:uppercase;
                                letter-spacing:0.08em;color:var(--text-muted);font-weight:600;
                                border-bottom:1px solid var(--border);text-align:center">Qty</th>
                    <th style="padding:0.75rem;font-size:0.68rem;text-transform:uppercase;
                                letter-spacing:0.08em;color:var(--text-muted);font-weight:600;
                                border-bottom:1px solid var(--border)">Unit Price</th>
                    <th style="padding:0.75rem;font-size:0.68rem;text-transform:uppercase;
                                letter-spacing:0.08em;color:var(--text-muted);font-weight:600;
                                border-bottom:1px solid var(--border)">Total</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="padding:1rem 0.75rem"></td>
                    <td style="padding:1rem 0.75rem;font-size:0.8rem;
                                color:var(--text-muted);font-weight:600;
                                border-top:2px solid var(--border)">Subtotal</td>
                    <td style="padding:1rem 0.75rem;font-weight:700;
                                border-top:2px solid var(--border)">
                        Rs. ${o.total.toFixed(2)}
                    </td>
                </tr>
                <tr>
                    <td colspan="3"></td>
                    <td style="padding:0.4rem 0.75rem;font-size:0.8rem;color:var(--text-muted)">Tax (0%)</td>
                    <td style="padding:0.4rem 0.75rem">Rs. 0.00</td>
                </tr>
                <tr style="background:rgba(255,107,0,0.06)">
                    <td colspan="3"></td>
                    <td style="padding:0.85rem 0.75rem;font-family:'Rajdhani',sans-serif;
                                font-size:1rem;font-weight:700;border-top:2px solid var(--border)">
                        GRAND TOTAL
                    </td>
                    <td style="padding:0.85rem 0.75rem;font-family:'Rajdhani',sans-serif;
                                font-size:1.3rem;font-weight:700;color:var(--primary);
                                border-top:2px solid var(--border)">
                        Rs. ${o.total.toFixed(2)}
                    </td>
                </tr>
            </tfoot>
        </table>

        <div style="text-align:center;color:var(--text-muted);font-size:0.78rem;
                    padding-top:1.5rem;border-top:1px solid var(--border);line-height:1.8">
            <strong style="color:var(--text-main)">Thank you for choosing AutoParts Motor Shop!</strong><br>
            For returns or warranty claims, please present this invoice within 14 days.<br>
            Goods once sold will not be returned without prior approval.
        </div>
    `);

  $('#invoiceListView').hide();
  $('#invoiceDetailView').show();
}

// ── Events ───────────────────────────────────────────────────

// View invoice from list
$(document).on('click', '.view-inv-btn', function () {
  showInvoice($(this).data('id'));
});

// View invoice from order history
$(document).on('click', '.view-invoice-btn', function () {
  showInvoice($(this).data('id'));
  // Navigate to invoices section
  window.posNavigateTo('invoices');
});

// Back buttons
$('#backToInvoices, #backToInvoices2').on('click', renderInvoiceList);
