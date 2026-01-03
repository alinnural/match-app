import { useEffect, useState } from 'react';
import { groupsAPI } from '../lib/api';
import MainLayout from '../components/MainLayout';

interface Match {
  id: string;
  name: string;
  venue: string;
  price: number | null;
  status: string;
  _count: {
    participants: number;
  };
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchMatches(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await groupsAPI.getAllGroups();
      setGroups(response.data || []);
      if (response.data?.length > 0) {
        setSelectedGroup(response.data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
    }
  };

  const fetchMatches = async (groupId: string) => {
    try {
      setLoading(true);
      const response = await groupsAPI.getGroup(groupId);
      setMatches(response.data?.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">⚽ Pertandingan</h1>
          <p className="text-gray-600">Kelola pertandingan olahraga Anda</p>
        </div>

        {/* Group Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Komunitas:
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Create Match Button */}
        <button className="mb-6 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
          + Buat Pertandingan Baru
        </button>

        {/* Matches List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"></div>
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pertandingan</h3>
            <p className="text-gray-600">Buat pertandingan baru untuk memulai</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{match.name}</h3>
                    <p className="text-gray-600">📍 {match.venue}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {match.status === 'open' ? '🟢 Aktif' : '✅ Selesai'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Harga Per Orang</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {match.price?.toLocaleString('id-ID') || '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Peserta</p>
                    <p className="text-lg font-bold text-gray-900">
                      {match._count.participants} orang
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                    Lihat Detail
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
