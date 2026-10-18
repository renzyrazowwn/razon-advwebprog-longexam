import Button from './Button';
import { formatPHP } from '../utils/format';
import { getProductImageUrl, handleImageError } from '../utils/image'; // PART 7

const ProductCard = ({ product, index }) => {
  return (
    <article className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.25rem] bg-zinc-200">
        <img
          src={getProductImageUrl(product.image, 600)} // PART 7: image from the database (Cloudinary)
          alt={product.productName}
          onError={handleImageError} // PART 7: fallback if the image link is broken
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {product.categoryId?.categoryName || 'Uncategorized'} {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-zinc-900">{product.productName}</h3>
      <p className="mt-2 text-base font-bold text-zinc-900">{formatPHP(product.price)}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        {product.description?.length > 120 ? `${product.description.slice(0, 120)}...` : product.description}
      </p>
      <Button to={`/products/${product._id}`} className="mt-4">View Product</Button>
    </article>
  );
};

export default ProductCard;