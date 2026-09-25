import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import * as userService from '../../services/userService';
import { getErrorMessage } from '../../services/api';

const inputClasses = 'mt-1 w-full rounded-xl border-2 border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#2F3E8F]';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const load = () => {
    setLoading(true);
    userService
      .fetchUsers()
      .then(({ data }) => setUsers(data.users || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(load, []);

  const startEdit = (user) => {
    setEditingId(user._id);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    });
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (id) => {
    try {
      await userService.updateUser(id, form);
      setEditingId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleActive = async (user) => {
    try {
      await userService.updateUser(user._id, { isActive: !user.isActive });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#2F3E8F]">Manage Users</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading users…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-2 border-zinc-900 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2F3E8F] text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-zinc-200 align-top">
                  {editingId === user._id ? (
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-sm text-zinc-700">
                          First Name
                          <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClasses} />
                        </label>
                        <label className="block text-sm text-zinc-700">
                          Last Name
                          <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClasses} />
                        </label>
                        <label className="block text-sm text-zinc-700">
                          Email
                          <input name="email" value={form.email} onChange={handleChange} className={inputClasses} />
                        </label>
                        <label className="block text-sm text-zinc-700">
                          Phone
                          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={inputClasses} />
                        </label>
                        <label className="block text-sm text-zinc-700">
                          Address
                          <input name="address" value={form.address} onChange={handleChange} className={inputClasses} />
                        </label>
                        <label className="block text-sm text-zinc-700">
                          Role
                          <select name="role" value={form.role} onChange={handleChange} className={inputClasses}>
                            <option value="Customer">Customer</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </label>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="primary" onClick={() => handleSave(user._id)}>Save</Button>
                        <Button onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-2 font-medium text-zinc-900">{user.firstName} {user.lastName}</td>
                      <td className="px-4 py-2 text-zinc-600">{user.email}</td>
                      <td className="px-4 py-2 text-zinc-600">{user.role}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => startEdit(user)}>Edit</Button>
                          <Button variant="primary" onClick={() => toggleActive(user)}>
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
