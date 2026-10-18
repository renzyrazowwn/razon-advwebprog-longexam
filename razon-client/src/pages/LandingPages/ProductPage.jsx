import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import Alert from '../../components/Alert.jsx';
import { useAuth } from '../../context/AuthContext';
import * as productService from '../../services/productService';
import * as reviewService from '../../services/reviewService';
import { getErrorMessage } from '../../services/api';
import { findMyCart, addToCart } from '../../utils/cart';
import { formatPHP } from '../../utils/format';
import { getProductImageUrl, handleImageError } from '../../utils/image';

function ProductPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cartStatus, setCartStatus] = useState('');
  const [cartError, setCartError] = useState('');

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const loadProduct = () => {
    setLoading(true);
    setError('');
    productService
      .fetchProductById(id)
      .then(({ data }) => setProduct(data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  const loadReviews = () => {
    reviewService
      .fetchReviews()
      .then(({ data }) => setReviews((data.reviews || []).filter((r) => (r.productId?._id || r.productId) === id)))
      .catch(() => {
      });
  };

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const handleAddToCart = async () => {
    setCartStatus('');
    setCartError('');
    try {
      const existingCart = await findMyCart(user.id);
      await addToCart({ userId: user.id, product, quantity: 1, existingCart });
      setCartStatus('Added to cart!');
    } catch (err) {
      setCartError(getErrorMessage(err));
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    try {
      await reviewService.createReview({
        userId: user.id,
        productId: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: '' });
      setReviewSuccess('Review posted!');
      loadReviews();
    } catch (err) {
      setReviewError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <p className="text-sm text-zinc-500">Loading product…</p>
        </section>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-zinc-900">Product not found</h1>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <Button to="/products" className="mt-6">Back to Products</Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/products">Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {product.categoryId?.categoryName || 'Uncategorized'}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
            {product.productName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            <span className="font-bold text-zinc-900">{formatPHP(product.price)}</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex aspect-4/3 items-center justify-center rounded-[1.25rem] border-2 border-zinc-900 bg-zinc-200">
            <img
              src={getProductImageUrl(product.image, 1200)} // PART 7: image from the database (Cloudinary)
              alt={product.productName}
              onError={handleImageError} // PART 7: fallback if the image link is broken
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="prose prose-sm max-w-none space-y-4 text-zinc-700">
            <p className="text-base leading-7 text-zinc-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="mt-8 border-t-2 border-zinc-900 pt-6">
            {cartStatus && <p className="mb-3 text-sm font-medium text-emerald-700">{cartStatus}</p>}
            {cartError && <Alert tone="error">{cartError}</Alert>}

            {isAuthenticated && user.role === 'Customer' ? (
              <Button variant="primary" className="mr-3" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            ) : !isAuthenticated ? (
              <Button variant="primary" className="mr-3" to="/auth/signin">
                Sign In to Add to Cart
              </Button>
            ) : null}
            <Button to="/products">Back to Products</Button>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-zinc-900">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="rounded-2xl border-2 border-zinc-900 bg-white p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}{' '}
                    <span className="font-normal text-zinc-500">
                      by {review.userId?.firstName || 'A shopper'}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}

          {isAuthenticated && user.role === 'Customer' && (
            <form className="mt-6 space-y-3 rounded-2xl border-2 border-[#2F3E8F] bg-white p-4" onSubmit={handleReviewSubmit}>
              <h3 className="text-sm font-semibold text-[#2F3E8F]">Write a Review</h3>
              {reviewError && <Alert tone="error">{reviewError}</Alert>}
              {reviewSuccess && <Alert tone="success">{reviewSuccess}</Alert>}

              <label className="block text-sm text-zinc-700">
                Rating
                <select
                  value={reviewForm.rating}
                  onChange={(event) => setReviewForm((prev) => ({ ...prev, rating: event.target.value }))}
                  className="mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} star{value > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm text-zinc-700">
                Comment
                <textarea
                  required
                  rows={3}
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))}
                  className="mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm"
                />
              </label>

              <Button type="submit" variant="primary">Post Review</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;