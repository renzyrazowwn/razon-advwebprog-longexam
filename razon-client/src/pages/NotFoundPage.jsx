import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center bg-[#2F3E8F] px-4 py-12 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-4xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
          404 Error
        </p>

        <h1 className="mt-4 text-7xl font-extrabold leading-none text-[#F2C94C] sm:text-8xl">
          Oops!
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          Page not found
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
          The page you are looking for does not exist, may have been moved, or the link may be incorrect.
          You can return to the homepage or continue browsing products.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/" variant="secondary">
            Back Home
          </Button>
          <Button to="/products">
            View Products
          </Button>
        </div>

        <div className="mt-10 grid gap-4 pt-6 sm:grid-cols-2">
          
          <div className="rounded-3xl border-2 border-[#F2C94C] bg-transparent p-5 text-center transition hover:bg-[#F2C94C]/10">
            <h3 className="font-semibold text-[#F2C94C]">Home</h3>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Go back to the main page and explore BulldogEx Shop.
            </p>
            <Button to="/" className="mt-4">
              Go Home
            </Button>
          </div>

          <div className="rounded-3xl border-2 border-[#F2C94C] bg-transparent p-5 text-center transition hover:bg-[#F2C94C]/10">
            <h3 className="font-semibold text-[#F2C94C]">Products</h3>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Browse NU apparel, accessories, collectibles, etc.
            </p>
            <Button to="/products" className="mt-4">
              View Products
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;