import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import { useAuth } from '../context/AuthContext';

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'border-[#000000] bg-[#2F3E8F] text-white'
      : 'border-transparent text-[#2F3E8F] hover:border-[#000000] hover:bg-[#2F3E8F] hover:text-[#FFFFFF]',
  ].join(' ');

const NavBar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const guestLinks = [
    { label: 'Sign In', to: '/auth/signin' },
    { label: 'Sign Up', to: '/auth/signup' },
  ];

  const customerLinks = [
    { label: 'Cart', to: '/cart' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Profile', to: '/account/profile' },
  ];

  const adminLinks = [{ label: 'Admin', to: '/admin/products' }];

  const baseLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Products', to: '/products' },
  ];

  const roleLinks = !isAuthenticated ? guestLinks : isAdmin ? adminLinks : customerLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-zinc-900 bg-[#D4AF37] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="BulldogEx" className="h-9 w-9 rounded-full border-2 border-zinc-900 bg-[#2F3E8F] object-contain" />
          <div className="space-y-0.5">
            <p className="text-xl font-bold text-[#2F3E8F]">BulldogEx Shop</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {baseLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}

          {roleLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border-2 border-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2F3E8F] transition hover:border-[#000000] hover:bg-[#2F3E8F] hover:text-white"
            >
              Log Out{user?.firstName ? ` (${user.firstName})` : ''}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
