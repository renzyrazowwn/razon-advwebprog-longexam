import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import * as orderService from '../../services/orderService';
import { getErrorMessage } from '../../services/api';
import { formatPHP } from '../../utils/format';

// The schema's enum is Pending/Processing/Shipped/Delivered/Cancelled.
// For a campus pickup shop: Processing = "Confirmed", Shipped = "Ready for claiming".
const statusActions = [
  { label: 'Confirm Order', value: 'Processing' },
  { label: 'Ready for Claiming', value: 'Shipped' },
  { label: 'Mark Delivered', value: 'Delivered' },
  { label: 'Cancel Order', value: 'Cancelled' },
];

const statusColors = {
  Pending: 'bg-zinc-200 text-zinc-800',
  Processing: 'bg-amber-100 text-amber-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    orderService
      .fetchOrders()
      .then(({ data }) => setOrders(data.orders || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(load, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await orderService.updateOrder(orderId, { orderStatus });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#2F3E8F]">Manage Orders</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-zinc-500">No orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order._id} className="rounded-2xl border-2 border-zinc-900 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    #{order._id.slice(-6).toUpperCase()} — {order.userId?.firstName} {order.userId?.lastName}
                  </p>
                  <p className="text-xs text-zinc-500">{order.userId?.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusColors[order.orderStatus] || statusColors.Pending}`}>
                  {order.orderStatus}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                {order.products.map((p, idx) => (
                  <li key={idx}>{p.productName} × {p.quantity}</li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                <p className="text-sm font-bold text-zinc-900">{formatPHP(order.totalAmount)}</p>
                <div className="flex flex-wrap gap-2">
                  {statusActions.map((action) => (
                    <Button
                      key={action.value}
                      variant={order.orderStatus === action.value ? 'primary' : 'secondary'}
                      onClick={() => handleStatusChange(order._id, action.value)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrdersPage;
