import React, { useState } from "react";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://react-node-app-production-5585.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        alert("✅ Đăng nhập thành công!");
        setShowLoginForm(false);
        setUsername("");
        setPassword("");
      } else {
        alert(data.message || "❌ Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://react-node-app-production-5585.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
        setShowRegisterForm(false);
        setShowLoginForm(true);
        setUsername("");
        setPassword("");
      } else {
        alert(data.message || "❌ Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("🚪 Đã đăng xuất!");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold flex items-center gap-2">
        🎬 Movie App
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-300">Đã đăng nhập</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <button
            onClick={() => {
              setShowRegisterForm(true);
              setShowLoginForm(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
          >
            Đăng ký
          </button>
          <button
            onClick={() => {
              setShowLoginForm(true);
              setShowRegisterForm(false);
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            Đăng nhập
          </button>
        </div>
      )}

      {/* Form đăng nhập */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-96 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold mb-2">🔐 Đăng nhập</h2>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400" : "bg-green-600"
                } text-white px-4 py-2 rounded`}
              >
                {loading ? "Đang xử lý..." : "✅ Đăng nhập"}
              </button>
              <button
                onClick={() => setShowLoginForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                ❌ Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form đăng ký */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-96 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold mb-2">📝 Đăng ký tài khoản</h2>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRegister}
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400" : "bg-blue-600"
                } text-white px-4 py-2 rounded`}
              >
                {loading ? "Đang xử lý..." : "📝 Đăng ký"}
              </button>
              <button
                onClick={() => setShowRegisterForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                ❌ Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
