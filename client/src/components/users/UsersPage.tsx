import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser } from '../../api/users';
import type { User } from '../../types';

interface UserFormData {
  email: string;
  fullName: string;
  role: 'ADMIN' | 'COLLECTOR';
  password: string;
}

const emptyForm: UserFormData = { email: '', fullName: '', role: 'COLLECTOR', password: '' };

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
      setForm(emptyForm);
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUser(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  function handleOpenCreate() {
    setEditUser(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  }

  function handleOpenEdit(user: User) {
    setEditUser(user);
    setForm({ email: user.email, fullName: user.fullName, role: user.role, password: '' });
    setFormError('');
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (editUser) {
      const data: Partial<UserFormData> = { fullName: form.fullName, role: form.role };
      if (form.password) data.password = form.password;
      updateMutation.mutate({ id: editUser.id, data });
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">ניהול משתמשים</h2>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + משתמש חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            {editUser ? 'עריכת משתמש' : 'משתמש חדש'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            {!editUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="ltr"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תפקיד</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'ADMIN' | 'COLLECTOR' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="COLLECTOR">גובה</option>
                <option value="ADMIN">מנהל</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סיסמה{editUser && ' (השאר ריק לשמירה)'}
              </label>
              <input
                type="password"
                required={!editUser}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {editUser ? 'שמור שינויים' : 'צור משתמש'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">טוען...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">שם</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">אימייל</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">תפקיד</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">סטטוס</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.fullName}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs" dir="ltr">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role === 'ADMIN' ? 'מנהל' : 'גובה'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'פעיל' : 'מושהה'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() =>
                          toggleActiveMutation.mutate({ id: user.id, isActive: !user.isActive })
                        }
                        className="text-xs text-gray-500 hover:underline"
                      >
                        {user.isActive ? 'השהה' : 'הפעל'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
