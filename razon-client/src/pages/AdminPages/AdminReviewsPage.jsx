import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import * as reviewService from '../../services/reviewService';
import { getErrorMessage } from '../../services/api';

const inputClasses = 'mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#2F3E8F]';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: '' });

  const load = () => {
    setLoading(true);
    reviewService
      .fetchReviews()
      .then(({ data }) => setReviews(data.reviews || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(load, []);

  const startEdit = (review) => {
    setEditingId(review._id);
    setForm({ rating: review.rating, comment: review.comment });
  };

  const handleSave = async (id) => {
    try {
      await reviewService.updateReview(id, { rating: Number(form.rating), comment: form.comment });
      setEditingId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewService.deleteReview(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#2F3E8F]">Manage Reviews</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-zinc-500">No reviews yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map((review) => (
            <li key={review._id} className="rounded-2xl border-2 border-zinc-900 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {review.productId?.productName} — by {review.userId?.firstName} {review.userId?.lastName}
              </p>

              {editingId === review._id ? (
                <div className="mt-3 flex flex-col gap-3">
                  <label className="block text-sm text-zinc-700">
                    Rating
                    <select
                      value={form.rating}
                      onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
                      className={inputClasses}
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm text-zinc-700">
                    Comment
                    <textarea
                      rows={2}
                      value={form.comment}
                      onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
                      className={inputClasses}
                    />
                  </label>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={() => handleSave(review._id)}>Save</Button>
                    <Button onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700">{review.comment}</p>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => startEdit(review)}>Edit</Button>
                    <Button variant="primary" onClick={() => handleDelete(review._id)}>Delete</Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReviewsPage;
