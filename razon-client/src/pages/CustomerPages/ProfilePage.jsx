import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import { getErrorMessage } from '../../services/api';

const inputClasses = 'mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#2F3E8F]';

const ProfilePage = () => {
  const { user, updateSessionUser } = useAuth();

  const [form, setForm] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    userService
      .fetchUserById(user.id)
      .then(({ data }) => setForm(data.user))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
      };
      if (password) payload.password = password;

      await userService.updateUser(user.id, payload);
      updateSessionUser({ firstName: form.firstName, email: form.email });
      setPassword('');
      setSuccess('Profile updated!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-zinc-500">Loading your profile…</p>;
  }

  if (!form) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Alert tone="error">{error || 'Could not load your profile.'}</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#2F3E8F]">My Profile</h1>
      <p className="mt-2 text-sm text-zinc-600">Role: {form.role}</p>

      {error && <div className="mt-6"><Alert tone="error">{error}</Alert></div>}
      {success && <div className="mt-6"><Alert tone="success">{success}</Alert></div>}

      <form className="mt-6 flex flex-col gap-4 rounded-2xl border-2 border-zinc-900 bg-white p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-zinc-700">
            First Name
            <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block text-sm text-zinc-700">
            Last Name
            <input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClasses} />
          </label>
        </div>

        <label className="block text-sm text-zinc-700">
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClasses} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-zinc-700">
            Phone Number
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className={inputClasses} />
          </label>
          <label className="block text-sm text-zinc-700">
            Address
            <input name="address" value={form.address} onChange={handleChange} required className={inputClasses} />
          </label>
        </div>

        <label className="block text-sm text-zinc-700">
          New Password <span className="text-zinc-400">(leave blank to keep current password)</span>
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClasses}
          />
        </label>

        <Button type="submit" variant="primary" disabled={saving} className="self-start">
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
