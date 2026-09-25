import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import ProductList from '../../components/ProductList.jsx';
import Alert from '../../components/Alert.jsx';
import * as productService from '../../services/productService';
import * as categoryService from '../../services/categoryService';
import { getErrorMessage } from '../../services/api';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService
      .fetchCategories()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {
        // Category filter is a nice-to-have; don't block the page on it.
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch on filter change
    setLoading(true);
    setError('');

    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;

    productService
      .fetchProducts(params)
      .then(({ data }) => setProducts(data.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2F3E8F]">
            BulldogEx Products
          </p>

          <h1 className="text-3xl font-bold leading-tight text-[#2F3E8F] sm:text-4xl">
            Browse our product collection
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            Discover NU apparel, accessories, and essentials all in one place.
          </p>

          <div className="mt-6 flex justify-center">
            <Button to="/">Return Home</Button>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Featured Products
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Product card grid</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-xl border-2 border-[#2F3E8F] bg-white px-4 py-2 text-sm outline-none"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border-2 border-[#2F3E8F] bg-white px-4 py-2 text-sm outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <Alert tone="error">{error}</Alert>}

        {loading ? (
          <p className="text-sm text-zinc-500">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-zinc-500">No products found.</p>
        ) : (
          <ProductList products={products} />
        )}
      </section>
    </div>
  );
};

export default ProductListPage;
