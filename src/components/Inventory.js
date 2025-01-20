import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const productRes = await axios.get("https://fyntl.sangrahinnovations.com/stock/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", productRes.data);

      if (Array.isArray(productRes.data.data)) {
        setProducts(productRes.data.data);
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
        ? `https://fyntl.sangrahinnovations.com/stock/product/${newProduct._id}`
        : "https://fyntl.sangrahinnovations.com/stock/product";
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
        `https://fyntl.sangrahinnovations.com/stock/product/${productId}`,
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
        // If there's an error response from the API
        console.error("API Error Response:", err.response);
        setError(`Failed to delete the product: ${err.response.data.message || "Unknown error"}`);
      } else if (err.request) {
        // If there was no response from the API
        setError("Network error: Unable to reach the server.");
      } else {
        // Generic error
        setError("Error deleting product. Please try again.");
      }
    }
  };
  

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#4154f1]">Inventory Management</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded"
            />
          </div>
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
              user_id:""
            });
            setIsModalOpen(true);
          }}
          className="bg-[#4154f1] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-gray-500 text-center">
          {searchTerm
            ? "No products match your search."
            : "No products available."}
        </div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">item code</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Purchase Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="border p-2 ">{product.name}</td>
                <td className="border p-2 text-center">{product.hsn_code}</td>
                <td className="border p-2 text-center">{product.quantity}</td>
                <td className="border p-2 text-center">₹{product.price}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setNewProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)} // Now it will call the handleDelete function
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[40rem]">
            <h2 className="text-xl font-bold mb-4">
              {newProduct.id ? "Edit Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct();
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="serial_no" className="block text-sm font-medium mb-1">
                  Serial Number
                </label>
                <input
                  id="serial_no"
                  type="text"
                  value={newProduct.serial_no}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, serial_no: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="hsn_code" className="block text-sm font-medium mb-1">
                  HSN Code
                </label>
                <input
                  id="hsn_code"
                  type="text"
                  value={newProduct.hsn_code}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, hsn_code: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">
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
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price
                </label>
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
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
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
                  className="border p-2 rounded w-full"
                ></textarea>
              </div>
              <div>
                <label htmlFor="gst_rate" className="block text-sm font-medium mb-1">
                  GST Rate
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
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="unit_metrics"
                  className="block text-sm font-medium mb-1"
                >
                  Unit Metrics
                </label>
                <input
                  id="unit_metrics"
                  type="text"
                  value={newProduct.unit_metrics}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      unit_metrics: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-[#4154f1] text-white px-4 py-2 rounded-lg"
                >
                  Save Product
                </button>
              </div>
            </form>
            <button
            
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
