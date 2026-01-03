import { useEffect, useState } from 'react';
import { groupsAPI } from '../lib/api';
import MainLayout from '../components/MainLayout';

export default function Kas() {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [kasBalance, setKasBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupData(selectedGroup);
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

  const fetchGroupData = async (groupId: string) => {
    try {
      setLoading(true);
      const response = await groupsAPI.getGroup(groupId);
      const group = response.data;
      setKasBalance(Number(group.kasBalance) || 0);

      // Mock transactions for demo
      setTransactions([
        {
          id: '1',
          type: 'income',
          amount: 50000,
          description: 'Pertandingan Futsal',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'income',
          amount: 100000,
          description: 'Pertandingan Badminton',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">💰 Kas Grup</h1>
          <p className="text-gray-600">Kelola keuangan dan transaksi grup</p>
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

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <p className="text-primary-100 mb-2">Saldo Kas Grup</p>
          <h2 className="text-5xl font-display font-bold mb-4">
            Rp {kasBalance.toLocaleString('id-ID')}
          </h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors">
              Setor
            </button>
            <button className="px-6 py-2 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors">
              Tarik
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📋 Riwayat Transaksi</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-6 h-6 border-4 border-primary-200 border-t-primary-500 rounded-full"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tipe</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Jumlah</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tx.type === 'income'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tx.type === 'income' ? '➕ Masuk' : '➖ Keluar'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{tx.description}</td>
                      <td className={`px-6 py-4 font-bold ${
                        tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
