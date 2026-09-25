import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';

const inputClasses =
  'mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  password: '',
};

const SignUpPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await register(form);
      setSuccess('Account created! Redirecting you to log in…');
      setTimeout(() => navigate('/auth/signin'), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-[#D4AF37] sm:text-4xl">Create Your Account</h1>
      <p className="mt-3 text-sm leading-6 text-[#D4AF37]">
        Create a store account for faster checkout, order updates, and pickup details.
      </p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}
      {success && (
        <div className="mt-6">
          <Alert tone="success">{success}</Alert>
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="text-sm font-medium text-[#D4AF37]">
              First Name
            </label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              required
              value={form.firstName}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-sm font-medium text-[#D4AF37]">
              Last Name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              required
              value={form.lastName}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="text-sm font-medium text-[#D4AF37]">
            Email
          </label>
          <input
            id="signup-email"
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone-number" className="text-sm font-medium text-[#D4AF37]">
              Phone Number
            </label>
            <input
              id="phone-number"
              name="phoneNumber"
              type="tel"
              placeholder="09XXXXXXXXX"
              autoComplete="tel"
              required
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium text-[#D4AF37]">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Street, City"
              autoComplete="street-address"
              required
              value={form.address}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="text-sm font-medium text-[#D4AF37]">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className={inputClasses}
          />
          <p className="mt-2 text-xs leading-5 text-[#D4AF37]">
            Must be at least 6 characters.
          </p>
        </div>

        <Button type="submit" variant="secondary" className={actionButtonClassName}>
          {loading ? 'Creating Account…' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-white">
        Already have an account?{' '}
        <Link to="/auth/signin" className="font-semibold text-[#D4AF37] transition hover:text-[#000000]">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
