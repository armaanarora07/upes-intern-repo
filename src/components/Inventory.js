import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, Search, Package, ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTitle } from "../slices/navbarSlice";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);
  const itemsPerPage = 10;
  
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    loadData();
    const setNavTitle = () => {
      dispatch(setTitle('Inventory Management'));
    }
    setNavTitle();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const productRes = await axios.get(`${process.env.REACT_APP_API_URL}/stock/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", productRes.data);

      if (Array.isArray(productRes.data.data)) {
        const productData = productRes.data.data;
        setProducts(productData);
        setTotalItems(productData.length);
        
        // Calculate stats
        let totalStock = 0;
        let lowStock = 0;
        let outOfStock = 0;
        
        productData.forEach(product => {
          totalStock += product.quantity;
          if (product.quantity === 0) outOfStock++;
          else if (product.quantity < 10) lowStock++; // Assume 10 as low stock threshold
        });
        
        setTotalStock(totalStock);
        setLowStockItems(lowStock);
        setOutOfStockItems(outOfStock);
      } else {
        console.error("Unexpected API response format:", productRes.data);
        setError("Unexpected data format from server.");
        setProducts([]);
      }
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.status} - ${err.response.data.message}`);
      } else if (err.request) {
        setError("Network Error: Unable to reach the server.");
      } else {
        setError("Error loading data. Please try again later.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const url = newProduct._id
        ? `${process.env.REACT_APP_API_URL}/stock/product/${newProduct._id}`
        : `${process.env.REACT_APP_API_URL}/stock/product`;
      const method = newProduct._id ? "put" : "post";
      
      console.log("Payload being sent:", newProduct);

      const response = await axios[method](url, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Save Response:", response.data);
      setNewProduct(null);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save Product Error:", err.response?.data || err.response || err);
      if (err.response) {
        const serverErrors = err.response.data.errors;
        if (serverErrors) {
          setError(
            Object.values(serverErrors).join(", ") || "Failed to add product."
          );
        } else {
          setError(err.response.data.message || "Failed to add product.");
        }
      } else if (err.request) {
        setError("Network Error: Unable to reach the server.");
      } else {
        setError("Error saving product. Please try again.");
      }
    }
  };

  const handleDelete = async (productId) => {
    if (!productId) {
      console.error("Product ID is not provided");
      setError("Product ID is missing");
      return;
    }
  
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/stock/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Product deleted:", response.data);
      if (response.status === 200) {
        loadData(); // Reload the product list after deleting
      } else {
        setError("Failed to delete the product. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      if (err.response) {
        console.error("API Error Response:", err.response);
        setError(`Failed to delete the product: ${err.response.data.message || "Unknown error"}`);
      } else if (err.request) {
        setError("Network error: Unable to reach the server.");
      } else {
        setError("Error deleting product. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-8">
      <div className="mt-3">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-2 mb-6">
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{totalItems}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Total Products</p>
        </div>
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{totalStock}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Total Stock Items</p>
        </div>
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-amber-500 mt-2">{lowStockItems}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Low Stock Items</p>
        </div>
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-red-500 mt-2">{outOfStockItems}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Out of Stock Items</p>
        </div>
      </div>

      {/* Search and Add Product */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-white rounded-t-xl shadow-sm">
        <div className="relative w-full sm:w-auto">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#4154f1] rounded-lg p-2 pl-10"
          />
        </div>
        
        <button
          onClick={() => {
            setNewProduct({
              name: "",
              serial_no: "",
              hsn_code: "",
              quantity: 0,
              price: 0,
              description: "",
              gst_rate: 0,
              unit_metrics: "Pcs",
              user_id: ""
            });
            setIsModalOpen(true);
          }}
          className="bg-[#4154f1] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>
      
      {/* Main Content */}
      <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Product Inventory</h2>
        </div>
        
        {/* Table Container */}
        <div className="overflow-x-auto">

           {currentProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {searchTerm ? "No products match your search." : "No products available."}
              </p>
              <p className="text-gray-500 mt-1">Add your first product using the button above</p>
            </div>
           )}

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.hsn_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.quantity === 0 
                          ? "bg-red-100 text-red-800" 
                          : product.quantity < 10 
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {product.quantity} {product.unit_metrics}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gst_rate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setNewProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        
        {/* Pagination Controls */}
        {currentProducts.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              
              <div className="hidden md:flex mx-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={index}
                        onClick={() => handlePageClick(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        } mx-1 rounded-md`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={index}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • Showing {currentProducts.length} products
            </div>
          </div>
        )}
      </div>
      
      {/* Modal for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newProduct._id ? "Edit Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="serial_no" className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  id="serial_no"
                  type="text"
                  value={newProduct.serial_no}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, serial_no: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="hsn_code" className="block text-sm font-medium text-gray-700 mb-1">
                  HSN Code
                </label>
                <input
                  id="hsn_code"
                  type="text"
                  value={newProduct.hsn_code}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, hsn_code: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: parseInt(e.target.value, 10),
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="border border-gray-300 p-2 pl-8 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gst_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  GST Rate (%)
                </label>
                <input
                  id="gst_rate"
                  type="number"
                  value={newProduct.gst_rate}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      gst_rate: parseFloat(e.target.value),
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="unit_metrics"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Unit Metrics
                </label>
                <select
                  id="unit_metrics"
                  value={newProduct.unit_metrics}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      unit_metrics: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pcs">Pieces (Pcs)</option>
                  <option value="Kg">Kilograms (Kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="L">Liters (L)</option>
                  <option value="mL">Milliliters (mL)</option>
                  <option value="m">Meters (m)</option>
                  <option value="Box">Box</option>
                  <option value="Carton">Carton</option>
                  <option value="Dozen">Dozen</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full h-24 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4154f1] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {newProduct._id ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Inventory;