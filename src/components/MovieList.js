import React, { useState, useEffect } from "react";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [addingMovie, setAddingMovie] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: "",
    description: "",
    image: null,
    id: "", // Thêm id vào formData
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("https://react-node-app-production-5585.up.railway.app/movies");
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie._id);
    setFormData({
      name: movie.name,
      category: movie.category,
      date: movie.date,
      description: movie.description,
      image: movie.image,
      language: movie.language,
      id: movie.id,
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else if (e.target.name === "category") {
      const categoryId = generateCategoryId(e.target.value); // Tạo ID theo thể loại
      setFormData({ ...formData, category: e.target.value, id: categoryId });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const generateCategoryId = (category) => {
    let categoryCode = '';
  
    switch (category) {
      case "Action":
        categoryCode = "ACT";
        break;
      case "Comedy":
        categoryCode = "COM";
        break;
      case "Romance":
        categoryCode = "ROM";
        break;
      case "Horror":
        categoryCode = "HOR";
        break;
      default:
        categoryCode = "";
    }
  
    if (categoryCode) {
      const count = movies.length; 
      const idSuffix = String(count + 1).padStart(4, "0"); 
      return `MVE${categoryCode}${idSuffix}`;
    }
  
    return "";
  };
  
  const handleUpdateMovie = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("id", formData.id);

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const res = await fetch(`https://react-node-app-production-5585.up.railway.app/movies-update/${editingMovie}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (res.ok) {
        fetchMovies();
        setEditingMovie(null);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật phim:", error);
    }
  };

  const handleAddMovie = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("id", formData.id);

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const res = await fetch("https://react-node-app-production-5585.up.railway.app/movies-add", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        fetchMovies();
        setAddingMovie(false);
        setFormData({ name: "", category: "", date: "", description: "", image: null, id: "" });
      }
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phim này không?")) return;
    try {
      const res = await fetch(`https://react-node-app-production-5585.up.railway.app/movies-delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMovies(); // Refresh danh sách sau khi xóa
      }
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">🎬 Danh sách phim</h2>
      <button onClick={() => setAddingMovie(true)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        ➕ Thêm phim mới
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-white rounded-lg shadow-lg overflow-hidden p-4">
            <img src={`https://react-node-app-production-5585.up.railway.app${movie.image}`} alt={movie.name} className="w-full h-56 object-cover" />
            <h3 className="text-xl font-semibold">{movie.name}</h3>
            <p className="text-gray-600 text-sm">{movie.category}</p>
            <p className="text-gray-500 text-sm">{movie.date}</p>
            <p className="text-gray-700 mt-2 text-sm">{movie.description}</p>
            <p className="text-gray-700 mt-2 text-sm">Language: {movie.language}</p>
            <button onClick={() => handleEditClick(movie)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              ✏️ Sửa
            </button>
            <button
              onClick={() => handleDeleteMovie(movie._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              🗑️ Xóa
            </button>
          </div>
        ))}
      </div>

      {editingMovie && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Sửa phim</h2>
            <input type="text" name="id" value={formData.id} readOnly className="w-full border p-2 mb-2 bg-gray-100"/>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 mb-2" />
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 mb-2" />
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 mb-2" />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 mb-2" />
            <input type="text" name="language" value={formData.language} onChange={handleChange} className="w-full border p-2 mb-2" />
            <input type="file" name="image" onChange={handleChange} className="w-full border p-2 mb-2" />
            <button onClick={handleUpdateMovie} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              ✅ Cập nhật
            </button>
            <button onClick={() => setEditingMovie(null)} className="bg-red-500 text-white px-4 py-2 rounded">
              ❌ Hủy
            </button>
          </div>
        </div>
      )}

      {addingMovie && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">🎉 Thêm phim mới</h2>
            <input type="text" name="id" value={formData.id} readOnly className="w-full border p-2 mb-2 bg-gray-100"/>
            <input type="text" name="name" onChange={handleChange} placeholder="Tên phim" className="w-full border p-2 mb-2" />
            <select name="category" onChange={handleChange} className="w-full border p-2 mb-2">
              <option value="">Chọn thể loại</option>
              <option value="Action">Hành động</option>
              <option value="Comedy">Hài</option>
              <option value="Romance">Tình cảm</option>
              <option value="Horror">Kinh dị</option>
            </select>
            <input type="date" name="date" onChange={handleChange} className="w-full border p-2 mb-2" />
            <textarea name="description" onChange={handleChange} placeholder="Mô tả" className="w-full border p-2 mb-2" />
            <input type="text" name="language" onChange={handleChange} placeholder="Ngôn ngữ" className="w-full border p-2 mb-2" />
            <input type="file" name="image" onChange={handleChange} className="w-full border p-2 mb-2" />
            <div className="flex justify-between">
              <button onClick={handleAddMovie} className="bg-green-500 text-white px-4 py-2 rounded">
                ✅ Thêm
              </button>
              <button onClick={() => setAddingMovie(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
