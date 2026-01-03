import { useEffect, useState } from 'react';
import { groupsAPI } from '../lib/api';

interface Group {
  id: string;
  waGroupId: string | null;
  name: string;
  kasBalance: number;
  _count: {
    members: number;
    matches: number;
  };
  createdAt: string;
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupsAPI.getAllGroups();
      setGroups(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Gagal memuat daftar komunitas');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Match Sport Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola komunitas olahraga Anda
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchGroups}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Komunitas
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {groups.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Members
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {groups.reduce((sum, g) => sum + g._count.members, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Matches
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {groups.reduce((sum, g) => sum + g._count.matches, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Communities Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Komunitas Anda
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            // Loading State
            <div className="flex justify-center py-12">
              <div className="animate-spin">
                <svg
                  className="w-12 h-12 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500 ml-4">Loading komunitas...</p>
            </div>
          ) : groups.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Belum ada komunitas
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai dengan mengundang bot ke grup WhatsApp Anda
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block text-left">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  📱 Cara memulai:
                </p>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Buat grup WhatsApp baru</li>
                  <li>2. Invite bot ke grup</li>
                  <li>3. Ketik /help untuk melihat perintah</li>
                </ol>
              </div>
            </div>
          ) : (
            // Groups Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow p-6"
                >
                  {/* Group Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(group.createdAt)}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium">
                        Members
                      </p>
                      <p className="text-2xl font-bold text-primary-600">
                        {group._count.members}
                      </p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium">
                        Matches
                      </p>
                      <p className="text-2xl font-bold text-secondary-600">
                        {group._count.matches}
                      </p>
                    </div>
                  </div>

                  {/* Kas Balance */}
                  <div className="bg-amber-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 font-medium">Kas Grup</p>
                    <p className="text-xl font-bold text-amber-600">
                      {formatCurrency(Number(group.kasBalance))}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 rounded-lg transition-colors">
                    Lihat Detail
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
