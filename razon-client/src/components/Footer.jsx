const Footer = () => {
  return (
    <footer className="border-t-2 border-[#FFFFF] bg-[#D4AF37] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-[#2F3E8F]">BulldogEx Shop</p>
          <p className="mt-1 text-sm text-[#2F3E8F]">
            Campus essentials, simple ordering, and student-friendly pickup.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-[11px] font-semibold uppercase tracking-[0.24em]">
          <a href="/" className="hover:text-[#2F3E8F]">Home</a>
          <a href="/about" className="hover:text-[#2F3E8F]">About</a>
          <a href="/products" className="hover:text-[#2F3E8F]">Products</a>
          <a href="/auth/signin" className="hover:text-[#2F3E8F]">Sign In</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;