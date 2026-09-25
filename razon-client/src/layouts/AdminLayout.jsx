import { NavLink, Outlet } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  [
    'block rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-wide transition',
    isActive ? 'bg-[#2F3E8F] text-white' : 'text-[#2F3E8F] hover:bg-[#2F3E8F]/10',
  ].join(' ');

const AdminLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="flex flex-row gap-2 overflow-x-auto rounded-2xl border-2 border-zinc-900 bg-white p-3 lg:w-56 lg:flex-col">
        <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
        <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/admin/reviews" className={linkClass}>Reviews</NavLink>
        <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
