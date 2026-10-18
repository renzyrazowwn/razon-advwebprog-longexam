import { useEffect, useRef, useState } from 'react'; // PART 7: useRef
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import * as productService from '../../services/productService';
import * as categoryService from '../../services/categoryService';
import { getErrorMessage } from '../../services/api';
import { formatPHP } from '../../utils/format';
// PART 7: image validation + display helpers
import {
  IMAGE_ACCEPT,
  MAX_IMAGE_SIZE_MB,
  formatFileSize,
  getProductImageUrl,
  handleImageError,
  validateImageFile,
} from '../../utils/image';

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

  // PART 7: selected image file, its local preview URL, and image errors
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  // PART 7: free the browser memory used by the old preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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

  // PART 7: clear the chosen image file + preview
  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // PART 7: validate the chosen file first, then show a preview before saving
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    setSuccessMessage('');

    if (!file) {
      clearImage();
      return;
    }

    const validationError = await validateImageFile(file);
    if (validationError) {
      setImageFile(null);
      setImagePreview('');
      setImageError(validationError);
      event.target.value = '';
      return;
    }

    setImageError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const startEdit = (product) => {
    clearImage(); // PART 7
    setFormError('');
    setSuccessMessage('');
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
    clearImage(); // PART 7
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    // PART 7: a new product must have an image
    if (!editingId && !imageFile) {
      setImageError('Please choose a product image before creating the product.');
      return;
    }

    setSaving(true);

    // PART 7: the image now comes from the uploaded file, not a typed URL
    const { image: _currentImage, ...fields } = form;
    const payload = {
      ...fields,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await productService.updateProduct(editingId, payload, imageFile); // PART 7
      } else {
        await productService.createProduct(payload, imageFile); // PART 7
      }
      setSuccessMessage(editingId ? 'Product updated successfully.' : 'Product created successfully.');
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
        {successMessage && <Alert tone="success">{successMessage}</Alert>}

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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-zinc-700">
            Price (PHP)
            <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={handleChange} className={inputClasses} />
          </label>
          <label className="block text-sm text-zinc-700">
            Stock
            <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} className={inputClasses} />
          </label>
        </div>

        {/* PART 7: image upload with preview */}
        <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
          <div className="flex flex-col gap-2">
            <label className="block text-sm text-zinc-700">
              Product Image {editingId ? '(optional, choose a file to replace the current image)' : ''}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept={IMAGE_ACCEPT}
                onChange={handleImageChange}
                className={`${inputClasses} file:mr-3 file:rounded-full file:border-0 file:bg-[#2F3E8F] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white`}
              />
            </label>
            <p className="text-xs text-zinc-500">
              JPEG, PNG, or WEBP only. Maximum size {MAX_IMAGE_SIZE_MB}MB.
            </p>
            {imageError && <Alert tone="error">{imageError}</Alert>}
            {imageFile && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                <span>
                  Selected: <span className="font-semibold text-zinc-900">{imageFile.name}</span> ({formatFileSize(imageFile.size)})
                </span>
                <Button onClick={clearImage}>Remove</Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-700">
              {imagePreview ? 'New image preview' : editingId ? 'Current image' : 'Image preview'}
            </span>
            <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-100">
              {imagePreview || (editingId && form.image) ? (
                <img
                  src={imagePreview || getProductImageUrl(form.image, 400)}
                  alt="Product preview"
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="px-3 text-center text-xs text-zinc-500">No image selected</span>
              )}
            </div>
          </div>
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
                <th className="px-4 py-2">Image</th>{/* PART 7 */}
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
                  {/* image from the database (Cloudinary URL) */}
                  <td className="px-4 py-2">
                    <img
                      src={getProductImageUrl(product.image, 120)}
                      alt={product.productName}
                      onError={handleImageError}
                      className="h-12 w-12 rounded-lg border border-zinc-300 object-cover"
                    />
                  </td>
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