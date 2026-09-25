import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';

const inputClasses =
  'mt-2 w-full rounded-xl border border-[#00000] bg-[#F9FAFB] px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignInPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const sessionUser = await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || (sessionUser.role === 'Admin' ? '/admin/products' : '/');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-[#2F3E8F] sm:text-4xl">Log In to BulldogEx Shop</h1>
      <p className="mt-3 text-sm leading-6 text-[#2F3E8F]">
        Access your store account to review orders, saved items, and pickup details.
      </p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signin-email" className="text-sm font-medium text-[#2F3E8F]">
            Email Address
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="text-sm font-medium text-[#2F3E8F]">
            Password
          </label>
          <input
            id="signin-password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName}>
          {loading ? 'Logging In…' : 'Log In'}
        </Button>
      </form>

      <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
        No account yet?{' '}
        <Link to="/auth/signup" className="font-semibold text-[#2F3E8F] transition hover:text-[#000000]">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInPage;
