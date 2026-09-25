import { Outlet, useLocation } from 'react-router-dom';
import nuBulldog from '../assets/img/nu-bulldog.png';

const AuthLayout = () => {
  const location = useLocation();

  const isSignIn = location.pathname.includes('signin');
  const isSignUp = location.pathname.includes('signup');

  const gridLayout = isSignUp
    ? 'lg:grid-cols-[0.95fr_1fr]'
    : 'lg:grid-cols-[1fr_0.95fr]';

  const overlayColor = isSignIn
    ? 'bg-[#2F3E8F]/90'
    : 'bg-[#F2C94C]/90';

  const textColor = isSignIn
    ? 'text-[#D4AF37]'
    : 'text-[#2F3E8F]';

  const subTextColor = isSignIn
    ? 'text-[#D4AF37]'
    : 'text-[#2F3E8F]/90';

  const rightBg = isSignIn
    ? 'bg-[#D4AF37]'
    : 'bg-[#2F3E8F]';

  return (
    <section className="min-h-screen text-zinc-900">
      <div className={`grid min-h-screen w-full ${gridLayout}`}>

        <div className="relative flex items-center justify-center overflow-hidden">
          <img
            src={nuBulldog}
            alt="BulldogEx Shop"
            className="absolute inset-0 h-full w-full object-cover scale-105"
          />
          <div className={`absolute inset-0 ${overlayColor}`} />

          <div className={`relative z-10 max-w-md text-center px-6 ${textColor}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">
              BulldogEx Shop
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              {isSignIn ? 'Welcome Back!' : 'Join BulldogEx Now!'}
            </h2>

            <p className={`mt-4 text-sm leading-7 ${subTextColor}`}>
              {isSignIn
                ? 'Log in to access your orders, saved items, and pickup details.'
                : 'Create an account to start shopping and manage your orders easily.'}
            </p>
          </div>
        </div>
        <main className={`flex items-center px-6 py-10 sm:px-10 lg:px-16 ${rightBg}`}>
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>

      </div>
    </section>
  );
};

export default AuthLayout;