import * as cartService from '../services/cartService';

export const findMyCart = async (userId) => {
  const { data } = await cartService.fetchCarts();
  return (data.carts || []).find((cart) => cart.userId?._id === userId || cart.userId === userId) || null;
};

const computeTotal = (items) =>
  items.reduce((sum, item) => sum + (item.unitPrice ?? 0) * item.quantity, 0);

export const addToCart = async ({ userId, product, quantity, existingCart }) => {
  if (existingCart) {
    const items = existingCart.products.map((entry) => ({
      productId: entry.productId?._id || entry.productId,
      quantity: entry.quantity,
      unitPrice: entry.productId?.price ?? 0,
    }));

    const existingIndex = items.findIndex((item) => item.productId === product._id);
    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
      items[existingIndex].unitPrice = product.price;
    } else {
      items.push({ productId: product._id, quantity, unitPrice: product.price });
    }

    return cartService.updateCart(existingCart._id, {
      products: items.map(({ productId, quantity }) => ({ productId, quantity })),
      totalPrice: computeTotal(items),
    });
  }

  const items = [{ productId: product._id, quantity, unitPrice: product.price }];
  return cartService.createCart({
    userId,
    products: items.map(({ productId, quantity }) => ({ productId, quantity })),
    totalPrice: computeTotal(items),
  });
};

export const removeFromCart = async ({ cart, productId }) => {
  const items = cart.products
    .filter((entry) => (entry.productId?._id || entry.productId) !== productId)
    .map((entry) => ({
      productId: entry.productId?._id || entry.productId,
      quantity: entry.quantity,
      unitPrice: entry.productId?.price ?? 0,
    }));

  return cartService.updateCart(cart._id, {
    products: items.map(({ productId, quantity }) => ({ productId, quantity })),
    totalPrice: computeTotal(items),
  });
};

export const updateCartItemQuantity = async ({ cart, productId, quantity }) => {
  const items = cart.products.map((entry) => {
    const id = entry.productId?._id || entry.productId;
    return {
      productId: id,
      quantity: id === productId ? quantity : entry.quantity,
      unitPrice: entry.productId?.price ?? 0,
    };
  });

  return cartService.updateCart(cart._id, {
    products: items.map(({ productId: pid, quantity: qty }) => ({ productId: pid, quantity: qty })),
    totalPrice: computeTotal(items),
  });
};
