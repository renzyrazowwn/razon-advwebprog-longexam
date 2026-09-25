import Button from '../../components/Button';
import logo from '../../assets/img/nubdexchange_logo.png';
import bulldog from '../../assets/img/nu-bulldog.png';
import apparelImg from '../../assets/img/nu-classic-shirt.jpg';
import accessoriesImg from '../../assets/img/nu-cap-v2.jpg';
import essentialsImg from '../../assets/img/nu-tumbler.jpg';
import merchImg from '../../assets/img/nu-fan.jpg';

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-[#2F3E8F] bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="rounded-3xl border-2 border-[#2F3E8F] p-6">
            <div className="group relative flex min-h-72 items-center justify-center overflow-hidden rounded-[1.25rem]">
              <img
                src={bulldog}
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#2F3E8F]/60 transition group-hover:bg-[#2F3E8F]/80" />

              <img
                src={logo}
                alt="BulldogEx"
                className="relative z-10 h-44 w-44 rounded-full border-4 border-[#D4AF37] bg-white object-contain shadow-xl transition duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2F3E8F]">
              About BulldogEx
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-[#2F3E8F] sm:text-4xl">
              A campus marketplace made for NU students.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
              BulldogEx Shop provides a simple way for students to browse NU apparel,
              accessories, essentials, and merchandise in one organized online store.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/products" variant="primary">
                Shop Products
              </Button>
              <Button to="/">
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#2F3E8F] bg-[#D4AF37] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2F3E8F]">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2F3E8F]">
            Key store highlights
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5">
            <p className="text-2xl font-bold text-[#2F3E8F]">15</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Products
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5">
            <p className="text-2xl font-bold text-[#2F3E8F]">04</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Categories
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5">
            <p className="text-2xl font-bold text-[#2F3E8F]">05</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Pickup Slots
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5">
            <p className="text-2xl font-bold text-[#2F3E8F]">67</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Orders
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#2F3E8F] bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2F3E8F]">
              Shopping Experience
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2F3E8F]">
              Designed for simple campus shopping
            </h2>

            <div className="mt-6 space-y-4">
              <article className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2F3E8F]">
                  Organized Product Catalog
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Products are grouped into clear categories so students can easily find
                  apparel, accessories, essentials, and merchandise.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2F3E8F]">
                  Clear Product Details
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Each item includes its price, stock status, and short description to help
                  users make quick and informed choices.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#2F3E8F] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2F3E8F]">
                  Student-Friendly Navigation
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  The store layout keeps browsing simple, with direct buttons and accessible
                  links for moving between pages.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[#2F3E8F] bg-[#2F3E8F] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F2C94C]">
              Product Categories
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="group relative flex aspect-square overflow-hidden rounded-[1.25rem] border-2 border-[#F2C94C]">
                <img
                  src={apparelImg}
                  alt="NU Apparel"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#2F3E8F]/35" />
                <p className="absolute bottom-4 left-4 text-sm font-bold text-white">
                  Apparel
                </p>
              </div>

              <div className="group relative flex aspect-square overflow-hidden rounded-[1.25rem] border-2 border-[#F2C94C]">
                <img
                  src={accessoriesImg}
                  alt="NU Accessories"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#2F3E8F]/35" />
                <p className="absolute bottom-4 left-4 text-sm font-bold text-white">
                  Accessories
                </p>
              </div>

              <div className="group relative flex aspect-square overflow-hidden rounded-[1.25rem] border-2 border-[#F2C94C]">
                <img
                  src={essentialsImg}
                  alt="NU Essentials"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#2F3E8F]/35" />
                <p className="absolute bottom-4 left-4 text-sm font-bold text-white">
                  Essentials
                </p>
              </div>

              <div className="group relative flex aspect-square overflow-hidden rounded-[1.25rem] border-2 border-[#F2C94C]">
                <img
                  src={merchImg}
                  alt="NU Merchandise"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#2F3E8F]/35" />
                <p className="absolute bottom-4 left-4 text-sm font-bold text-white">
                  Merch
                </p>
              </div>
            </div>

            <Button to="/products" className="mt-5">
              Browse Categories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;