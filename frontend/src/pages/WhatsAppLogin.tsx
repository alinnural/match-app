import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { whatsappAPI } from '../lib/api';

export default function WhatsAppLogin() {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState('Loading...');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCode();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchQRCode = async () => {
    try {
      const data = await whatsappAPI.getQR();
      setQrCode(data.qrCode);
      if (data.status === 'already_connected') {
        setIsConnected(true);
        setStatus('✅ Bot Terhubung!');
      } else {
        setStatus('📱 Scan dengan WhatsApp Anda');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading QR code:', error);
      // Bot already connected - auto redirect
      setIsConnected(true);
      setStatus('✅ Bot Terhubung!');
      setQrCode(null);
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const data = await whatsappAPI.getStatus();
      if (data.ready || data.connected) {
        setIsConnected(true);
        setStatus('✅ Bot Terhubung!');
        setQrCode(null);
      }
    } catch (error) {
      // Ignore errors during polling
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary-700 mb-2">
            Match Sport App
          </h1>
          <p className="text-gray-600">Setup WhatsApp Bot</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-12">
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
              <p className="text-gray-500 mt-4">Loading...</p>
            </div>
          ) : !isConnected ? (
            // QR Code State
            <>
              {qrCode ? (
                <>
                  <div className="bg-gray-50 p-6 rounded-xl mb-6 flex justify-center">
                    <img
                      src={qrCode}
                      alt="WhatsApp QR Code"
                      className="w-64 h-64 rounded-lg shadow-md"
                    />
                  </div>

                  <p className="text-center text-lg font-semibold text-gray-700 mb-6">
                    {status}
                  </p>

                  {/* Instructions */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold text-blue-900 mb-3">
                      📱 Langkah-langkah:
                    </p>
                    <ol className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start">
                        <span className="font-bold mr-2">1.</span>
                        <span>Buka WhatsApp di HP Anda</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">2.</span>
                        <span>Tap Settings → Linked Devices</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">3.</span>
                        <span>Tap Link a Device</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">4.</span>
                        <span>Scan QR Code di atas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">5.</span>
                        <span>Tunggu sampai Bot Terhubung ✅</span>
                      </li>
                    </ol>
                  </div>

                  {/* Auto Refresh Info */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <p className="text-sm text-amber-800">
                      💡 Halaman akan otomatis update setelah bot terhubung
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{status}</p>
                </div>
              )}
            </>
          ) : (
            // Connected State
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <svg
                    className="w-10 h-10 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Berhasil!
                </h2>
                <p className="text-gray-600 mb-6">{status}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Bot WhatsApp Anda sudah siap digunakan. Anda dapat mengundang bot ke grup WhatsApp dan mulai menggunakan perintah.
                </p>
              </div>

              <button
                onClick={handleGoToDashboard}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Lanjut ke Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Match Sport App v1.0
        </p>
      </div>
    </div>
  );
}
