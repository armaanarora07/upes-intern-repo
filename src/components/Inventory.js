import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, Search, Package, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTitle } from "../slices/navbarSlice";
import ReactDOM from "react-dom";
import StaggeredContainer, { StaggeredItem } from './StaggeredContainer';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); //nre state declarations added - by Armaan
 
  // Added by Armaan: State for rows per page dropdown functionality
 const [rowsPerPage, setRowsPerPage] = useState({
  value: 10,
  showAll: false,
  isOpen: false
});
  
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    loadData();
    const setNavTitle = () => {
      dispatch(setTitle('Inventory Management'));
    }
    setNavTitle();
  }, []);

  // Added by Armaan: Reset pagination when items per page changes
useEffect(() => {
  setCurrentPage(1);
}, [rowsPerPage.value, rowsPerPage.showAll]);

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


  //new fucntion for deletion - by armaan
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async (productId) => {
    setShowDeleteModal(false); //new code line added
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

  // Added by Armaan: Handle rows per page selection
  const handleRowsPerPageChange = (value) => {
  if (value === 'all') {
    setRowsPerPage(prev => ({...prev, showAll: true, isOpen: false}));
  } else {
    setRowsPerPage(prev => ({...prev, value: parseInt(value), showAll: false, isOpen: false}));
  }
};

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modified by Armaan: Updated pagination logic to handle "Show All" option
const currentProducts = rowsPerPage.showAll 
  ? filteredProducts 
  : filteredProducts.slice(
      (currentPage - 1) * rowsPerPage.value, 
      currentPage * rowsPerPage.value
    );
const totalPages = rowsPerPage.showAll ? 1 : Math.ceil(filteredProducts.length / rowsPerPage.value);

  const handleNextPage = () => {
    if (currentPage < totalPages && !rowsPerPage.showAll) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !rowsPerPage.showAll) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (!rowsPerPage.showAll) {
      setCurrentPage(pageNumber);
    }
  };

  // Portal-based dropdown component with proper animations and positioning
  const RowsPerPageDropdown = () => {
    const buttonRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false });
    const options = [10, 20, 30, 50, 100];

    // Calculate position when dropdown opens
    useEffect(() => {
      if (rowsPerPage.isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const estimatedMenuHeight = 320;
        
        const spaceBelow = viewportHeight - rect.bottom;
        const showAbove = spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight;
        
        setMenuPosition({
          top: showAbove ? rect.top - 8 : rect.bottom + 8,
          left: rect.right - 160, // Align to right edge of button
          width: Math.max(rect.width, 160),
          showAbove
        });
      }
    }, [rowsPerPage.isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e) => {
      if (!rowsPerPage.isOpen) return;
      const currentIndex = options.indexOf(rowsPerPage.value);
      
      switch (e.key) {
        case 'Escape':
          setRowsPerPage(prev => ({ ...prev, isOpen: false }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (rowsPerPage.showAll) {
            handleRowsPerPageChange(options[0]);
          } else {
            const next = options[currentIndex + 1];
            if (next) handleRowsPerPageChange(next);
            else handleRowsPerPageChange('all');
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (rowsPerPage.showAll) {
            handleRowsPerPageChange(options[options.length - 1]);
          } else if (currentIndex > 0) {
            handleRowsPerPageChange(options[currentIndex - 1]);
          }
          break;
        case 'Home':
          handleRowsPerPageChange(options[0]);
          break;
        case 'End':
          handleRowsPerPageChange('all');
          break;
        default:
          break;
      }
    }, [rowsPerPage.isOpen, rowsPerPage.value, rowsPerPage.showAll, options]);

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Render portal dropdown
    const dropdownMenu = rowsPerPage.isOpen && ReactDOM.createPortal(
      <>
        {/* Backdrop with blur */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
          onClick={() => setRowsPerPage(prev => ({ ...prev, isOpen: false }))}
        />
        
        {/* Menu */}
        <div
          className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            top: menuPosition.showAbove ? 'auto' : `${menuPosition.top}px`,
            bottom: menuPosition.showAbove ? `${window.innerHeight - menuPosition.top}px` : 'auto',
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
            transformOrigin: menuPosition.showAbove ? 'bottom center' : 'top center',
            animation: 'dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div className="py-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {options.map((v) => {
              const isActive = rowsPerPage.value === v && !rowsPerPage.showAll;
              return (
                <button
                  key={v}
                  onClick={() => handleRowsPerPageChange(v)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{v} rows</span>
                  {isActive && (
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              );
            })}
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <button
              onClick={() => handleRowsPerPageChange('all')}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                rowsPerPage.showAll
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span>Show All</span>
              {rowsPerPage.showAll && (
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Animation styles */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes dropdownIn {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(-4px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
            background: #4b5563;
          }
        `}</style>
      </>,
      document.body
    );

    return (
      <>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setRowsPerPage(prev => ({ ...prev, isOpen: !prev.isOpen }))}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={rowsPerPage.isOpen}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 select-none">
            {rowsPerPage.showAll ? 'Show All' : `${rowsPerPage.value} rows`}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${rowsPerPage.isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {dropdownMenu}
      </>
    );
  };

  return (
    <div className="p-8 min-h-screen dark:bg-gray-800">
      <div className="mt-3">
      {/* Analytics Cards */}
      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-2 mb-6">
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-gray-800 mt-2 dark:text-gray-200">{totalItems}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Total Products</p>
          </div>
        </StaggeredItem>
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-gray-800 mt-2 dark:text-gray-200">{totalStock}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Total Stock Items</p>
          </div>
        </StaggeredItem>
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-amber-500 mt-2 dark:text-gray-200">{lowStockItems}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Low Stock Items</p>
          </div>
        </StaggeredItem>
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-red-500 mt-2 dark:text-gray-200">{outOfStockItems}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Out of Stock Items</p>
          </div>
        </StaggeredItem>
      </StaggeredContainer>
      {/* Close the .mt-3 div */}
      </div>

      {/* Search and Add Product */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-white rounded-t-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
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
            className="w-full border border-[#4154f1] rounded-lg p-2 pl-10 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
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
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full sm:w-auto dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
        >
          Add Product
        </button>
      </div>
      
      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-gray-800 dark:border-gray-700">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Product Inventory</h2>
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
                <tr className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">HSN Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">GST Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{product.hsn_code}</td>
                    {/* //previous code */}
                    {/* <td className="px-6 py-4 whitespace-nowrap  dark:text-gray-200">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.quantity === 0 
                          ? "bg-red-100 text-red-800 dark:bg-red-200" 
                          : product.quantity < 10 
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-200"
                      }`}>
                        {product.quantity} {product.unit_metrics}
                      </span>
                    </td> */}
                    {/* //new code added by armaan */}
                    <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    product.quantity === 0
      ? "bg-red-100 text-red-800 dark:bg-red-200"
      : product.quantity < 10
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
      : "bg-green-100 text-green-800 dark:bg-green-200"
  }`}>
    {product.quantity} {product.unit_metrics}
  </span>
  {/* This is the new part */}
  {product.quantity > 0 && product.quantity < 10 && (
    <p className="text-red-500 text-xs mt-1">Few items available</p>
  )}
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{product.gst_rate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setNewProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors dark:text-gray-200"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          // onClick={() => handleDelete(product._id)}
                          onClick={() => openDeleteModal(product)}
                          className="text-red-600 hover:text-red-800 transition-colors dark:text-gray-200"
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
        
        {/* Modified by Armaan: Updated pagination controls with rows per page dropdown */}
{/* Modified by Armaan: Updated pagination controls with rows per page dropdown */}
{currentProducts.length > 0 && (
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center space-x-4 relative">
      {/* Pagination controls */}
      {!rowsPerPage.showAll && (
        <>
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
                        ? "z-10 bg-blue-600 text-white border-blue-600 dark:hover:bg-blue-700 dark:border-blue-800"
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
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
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
        </>
      )}
    </div>
    
    {/* Right side container with dropdown and showing text */}
    <div className="flex items-center gap-4">
      {/* Rows per page dropdown */}
      <RowsPerPageDropdown />
      
      {/* Showing text */}
      <div className="text-sm text-gray-600 dark:text-gray-200 whitespace-nowrap">
        {rowsPerPage.showAll ? (
          `Showing all ${currentProducts.length} products`
        ) : (
          `Page ${currentPage} of ${totalPages} • Showing ${currentProducts.length} of ${filteredProducts.length} products`
        )}
      </div>
    </div>
  </div>
)}
      {/* Modal for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative dark:bg-gray-800 dark:border-gray-700">
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                  required
                />
              </div>
              <div>
                <label htmlFor="serial_no" className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200">
                  Serial Number
                </label>
                <input
                  id="serial_no"
                  type="text"
                  value={newProduct.serial_no}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, serial_no: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                />
              </div>
              <div>
                <label htmlFor="hsn_code" className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200">
                  HSN Code
                </label>
                <input
                  id="hsn_code"
                  type="text"
                  value={newProduct.hsn_code}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, hsn_code: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200">
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
                  className="border border-gray-300 p-2 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200">
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
                    className="border border-gray-300 p-2 pl-8 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gst_rate" className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200">
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
                  className="border border-gray-300 p-2 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="unit_metrics"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200"
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
                  className="border border-gray-300 p-2 rounded-lg w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
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
                  className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-800 dark:text-gray-200"
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
                  className="border border-gray-300 p-2 rounded-lg w-full h-24 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
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
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                >
                  {newProduct._id ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PASTE THE NEW MODAL CODE HERE */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowDeleteModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80"></div>
            </div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-headline">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Are you sure you want to delete the product <span className="font-semibold text-gray-700 dark:text-gray-200">{productToDelete?.name}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDelete(productToDelete?._id)}
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 text-base font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

    </div>
  );
};

export default Inventory;