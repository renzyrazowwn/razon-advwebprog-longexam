import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { findMyCart, removeFromCart, updateCartItemQuantity } from '../../utils/cart';
import * as orderService from '../../services/orderService';
import { deleteCart } from '../../services/cartService';
import { getErrorMessage } from '../../services/api';
import { formatPHP } from '../../utils/format';

const paymentMethods = ['Cash on Delivery', 'GCash', 'Credit Card'];

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    findMyCart(user.id)
      .then(setCart)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user.id]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemQuantity({ cart, productId, quantity });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart({ cart, productId });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError('');

    if (!cart || cart.products.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setCheckoutLoading(true);
    try {
      await orderService.createOrder({
        userId: user.id,
        products: cart.products.map((entry) => ({
          productName: entry.productId?.productName || 'Product',
          price: entry.productId?.price ?? 0,
          quantity: entry.quantity,
        })),
        totalAmount: cart.totalPrice,
        shippingAddress,
        paymentMethod,
      });

      // Clear the cart now that the order has been placed.
      await deleteCart(cart._id);

      navigate('/orders');
    } catch (err) {
      setCheckoutError(getErrorMessage(err));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-zinc-500">Loading your cart…</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#2F3E8F]">Your Cart</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {!cart || cart.products.length === 0 ? (
        <div className="rounded-2xl border-2 border-zinc-900 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-600">Your cart is empty.</p>
          <Button to="/products" className="mt-4">Browse Products</Button>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {cart.products.map((entry) => {
              const p = entry.productId;
              const id = p?._id || entry.productId;
              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-zinc-900 bg-white p-4">
                  <div>
                    <p className="font-semibold text-zinc-900">{p?.productName || 'Product'}</p>
                    <p className="text-sm text-zinc-500">{formatPHP(p?.price)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={entry.quantity}
                      onChange={(event) => handleQuantityChange(id, Number(event.target.value))}
                      className="w-16 rounded-lg border-2 border-zinc-300 px-2 py-1 text-sm"
                    />
                    <Button variant="secondary" onClick={() => handleRemove(id)}>Remove</Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between rounded-2xl border-2 border-[#2F3E8F] bg-[#2F3E8F]/5 p-4">
            <p className="font-semibold text-[#2F3E8F]">Total</p>
            <p className="text-xl font-bold text-[#2F3E8F]">{formatPHP(cart.totalPrice)}</p>
          </div>

          <form className="flex flex-col gap-4 rounded-2xl border-2 border-zinc-900 bg-white p-4" onSubmit={handleCheckout}>
            <h2 className="text-lg font-semibold text-zinc-900">Checkout</h2>
            {checkoutError && <Alert tone="error">{checkoutError}</Alert>}

            <label className="block text-sm text-zinc-700">
              Shipping Address
              <input
                required
                type="text"
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm text-zinc-700">
              Payment Method
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </label>

            <Button type="submit" variant="primary" disabled={checkoutLoading}>
              {checkoutLoading ? 'Placing Order…' : 'Place Order'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default CartPage;
