import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';
import apparelImg from '../../assets/img/nu-sweatshirt-v2.jpg';
import essentialsImg from '../../assets/img/nu-tote-bag.png';
import merchImg from '../../assets/img/nu-baller.png';

const HomePage = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="relative min-h-[28rem] overflow-hidden border-y-2 border-zinc-900 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/45" />

                <div className="relative z-10 flex min-h-[22rem] items-start justify-end text-right sm:min-h-[24rem]">
                    <div className="max-w-xl">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-200">
                            National University Campus Marketplace
                        </p>
                        <h1 className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl">
                            Welcome to BulldogEx Shop
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-zinc-100 sm:text-base">
                            Your one-stop shop for NU apparel, student essentials, and official merchandise.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <Button to="/products">
                                Shop Now
                            </Button>
                            <Button to="/about" variant="primary">
                                About Store
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        Store Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Quick shopping blocks</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">15</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Products
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">03</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Categories
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">67</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Orders
                        </p>
                    </div>
                    <div className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-5">
                        <p className="text-2xl font-bold text-zinc-900">5</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            Pickup Slots
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        Shop Categories
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Browse by Categories</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">
                        <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.25rem] bg-zinc-200">
                        <img
                            src={apparelImg}
                            alt="Apparel"
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Apparel</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Clothing items designed for everyday campus wear, combining comfort, style, and school identity.
                        </p>
                        <Button to="/products" className="mt-4" variant="primary">View Apparel</Button>
                    </article>

                    <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">
                        <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.25rem] bg-zinc-200">
                        <img
                            src={essentialsImg}
                            alt="Essentials"
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Essentials</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Practical add-ons and essentials that support daily student needs while adding a touch of NU style.
                        </p>
                        <Button to="/products" className="mt-4" variant="primary">View Essentials</Button>
                    </article>

                    <article className="rounded-3xl border-2 border-zinc-900 bg-zinc-100 p-4">
                        <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.25rem] bg-zinc-200">
                        <img
                            src={merchImg}
                            alt="Collectibles"
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Collectibles</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Affordable NU-themed items and merchandise perfect for personal use, decoration, and showing school pride.
                        </p>
                        <Button to="/products" className="mt-4" variant="primary">
                            View Merch
                        </Button>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
