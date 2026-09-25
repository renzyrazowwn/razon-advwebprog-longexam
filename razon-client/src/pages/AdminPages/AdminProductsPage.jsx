import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import * as productService from '../../services/productService';
import * as categoryService from '../../services/categoryService';
import { getErrorMessage } from '../../services/api';
import { formatPHP } from '../../utils/format';

const emptyForm = { productName: '', description: '', price: '', stock: '', image: '', categoryId: '' };
const inputClasses = 'mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#2F3E8F]';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([productService.fetchProducts({ limit: 100 }), categoryService.fetchCategories()])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.categories || []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      categoryId: product.categoryId?._id || product.categoryId || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await productService.updateProduct(editingId, payload);
      } else {
        await productService.createProduct(payload);
      }
      cancelEdit();
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#2F3E8F]">Manage Products</h1>

      <form className="flex flex-col gap-4 rounded-2xl border-2 border-zinc-900 bg-white p-5" onSubmit={handleSubmit}>
        <h2 className="text-sm font-semibold text-zinc-900">{editingId ? 'Edit Product' : 'Create Product'}</h2>
        {formError && <Alert tone="error">{formError}</Alert>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-zinc-700">
            Product Name
            <input name="productName" required value={form.productName} onChange={handleChange} className={inputClasses} />
          </label>
          <label className="block text-sm text-zinc-700">
            Category
            <select name="categoryId" required value={form.categoryId} onChange={handleChange} className={inputClasses}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm text-zinc-700">
          Description
          <textarea name="description" required rows={2} value={form.description} onChange={handleChange} className={inputClasses} />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-zinc-700">
            Price (PHP)
            <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={handleChange} className={inputClasses} />
          </label>
          <label className="block text-sm text-zinc-700">
            Stock
            <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} className={inputClasses} />
          </label>
          <label className="block text-sm text-zinc-700">
            Image URL
            <input name="image" required value={form.image} onChange={handleChange} className={inputClasses} />
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}
          </Button>
          {editingId && <Button type="button" onClick={cancelEdit}>Cancel</Button>}
        </div>
      </form>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading products…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-2 border-zinc-900 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2F3E8F] text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-zinc-200">
                  <td className="px-4 py-2 font-medium text-zinc-900">{product.productName}</td>
                  <td className="px-4 py-2 text-zinc-600">{product.categoryId?.categoryName || '—'}</td>
                  <td className="px-4 py-2 text-zinc-600">{formatPHP(product.price)}</td>
                  <td className="px-4 py-2 text-zinc-600">{product.stock}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button onClick={() => startEdit(product)}>Edit</Button>
                      <Button variant="primary" onClick={() => handleDelete(product._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
