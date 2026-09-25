import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';
import { getErrorMessage } from '../../services/api';
import { formatPHP } from '../../utils/format';

const statusColors = {
  Pending: 'bg-zinc-200 text-zinc-800',
  Processing: 'bg-amber-100 text-amber-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService
      .fetchOrders()
      .then(({ data }) => {
        const mine = (data.orders || []).filter((o) => (o.userId?._id || o.userId) === user.id);
        setOrders(mine);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-zinc-500">Loading your orders…</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#2F3E8F]">My Orders</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-zinc-900 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-600">You haven't placed any orders yet.</p>
          <Button to="/products" className="mt-4">Browse Products</Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order._id} className="rounded-2xl border-2 border-zinc-900 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-zinc-500">
                  Order #{order._id.slice(-6).toUpperCase()} • {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusColors[order.orderStatus] || statusColors.Pending}`}>
                  {order.orderStatus}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                {order.products.map((p, idx) => (
                  <li key={idx}>{p.productName} × {p.quantity} — {formatPHP(p.price * p.quantity)}</li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between border-t border-zinc-200 pt-3 text-sm">
                <p className="text-zinc-500">{order.paymentMethod} • {order.shippingAddress}</p>
                <p className="font-bold text-zinc-900">{formatPHP(order.totalAmount)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
