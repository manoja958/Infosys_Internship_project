import React, { useState } from "react";
import axios from "axios";

function ProductsSection({ products, fetchData, token }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    category: "",
    supplier: "",
    unitPrice: "",
    stockQuantity: "",
    minStockLevel: ""
  });

  /* ========================= */
  /* FILTER LOGIC */
  /* ========================= */

  let filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterCategory) {
    filteredProducts = filteredProducts.filter(
      p => p.category?.toLowerCase().includes(filterCategory.toLowerCase())
    );
  }

  if (showLowStock) {
    filteredProducts = filteredProducts.filter(
      p => p.stockQuantity <= p.minStockLevel
    );
  }

  /* ========================= */
  /* PRODUCT ACTIONS */
  /* ========================= */

  const handleAddProduct = async () => {

    if (!newProduct.name || !newProduct.sku) {
      alert("Name and SKU are required");
      return;
    }

    await axios.post(
      "http://localhost:9090/product/add",
      {
        ...newProduct,
        unitPrice: Number(newProduct.unitPrice),
        stockQuantity: Number(newProduct.stockQuantity),
        minStockLevel: Number(newProduct.minStockLevel)
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowAddForm(false);
    setNewProduct({
      sku: "",
      name: "",
      category: "",
      supplier: "",
      unitPrice: "",
      stockQuantity: "",
      minStockLevel: ""
    });

    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(
      `http://localhost:9090/product/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const handleUpdate = async () => {
    await axios.put(
      `http://localhost:9090/product/update/${editingProduct.productId}`,
      editingProduct,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingProduct(null);
    fetchData();
  };

  const handleStockIn = async (id) => {
    const qty = prompt("Enter quantity to add");
    if (!qty) return;

    await axios.post(
      `http://localhost:9090/product/stock-in?id=${id}&quantity=${qty}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const handleStockOut = async (id) => {
    const qty = prompt("Enter quantity to remove");
    if (!qty) return;

    await axios.post(
      `http://localhost:9090/product/stock-out?id=${id}&quantity=${qty}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  /* ========================= */
  /* UI */
  /* ========================= */

  return (
    <>
      <h2>Product Inventory</h2>

      <div className="product-controls">

        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />

        <button onClick={() => setShowLowStock(!showLowStock)}>
          {showLowStock ? "Show All" : "Low Stock Only"}
        </button>

        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          + Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="product-form">
          {Object.keys(newProduct).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={newProduct[key]}
              onChange={(e) =>
                setNewProduct({ ...newProduct, [key]: e.target.value })
              }
            />
          ))}

          <button onClick={handleAddProduct}>Save</button>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Min</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr><td colSpan="8">No Products Found</td></tr>
          ) : (
            filteredProducts.map((p) => (
              <tr
                key={p.productId}
                className={p.stockQuantity <= p.minStockLevel ? "low-row" : ""}
              >
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹ {p.unitPrice}</td>
                <td>{p.stockQuantity}</td>
                <td>{p.minStockLevel}</td>
                <td>
                  {p.stockQuantity <= p.minStockLevel ?
                    <span className="low-stock">LOW</span> :
                    <span className="in-stock">OK</span>}
                </td>
                <td>
                  <button onClick={() => setEditingProduct(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.productId)}>Delete</button>
                  <button onClick={() => handleStockIn(p.productId)}>+Stock</button>
                  <button onClick={() => handleStockOut(p.productId)}>-Stock</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingProduct && (
        <div className="edit-box">
          <h3>Edit Product</h3>

          {Object.keys(editingProduct).map((key) =>
            key !== "productId" ? (
              <input
                key={key}
                value={editingProduct[key]}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    [key]: e.target.value
                  })
                }
              />
            ) : null
          )}

          <button onClick={handleUpdate}>Update</button>
        </div>
      )}
    </>
  );
}

export default ProductsSection;
// import React, { useState } from "react";
// import axios from "axios";

// function ProductsSection({ products, fetchData, token }) {

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [showLowStock, setShowLowStock] = useState(false);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
// const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     sku: "",
//     name: "",
//     category: "",
//     supplier: "",
//     unitPrice: "",
//     stockQuantity: "",
//     minStockLevel: ""
//   });

//   /* ========================= */
//   /* FILTER LOGIC */
//   /* ========================= */

//   let filteredProducts = products.filter(p =>
//     p.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (filterCategory) {
//     filteredProducts = filteredProducts.filter(
//       p => p.category?.toLowerCase().includes(filterCategory.toLowerCase())
//     );
//   }

//   if (showLowStock) {
//     filteredProducts = filteredProducts.filter(
//       p => p.stockQuantity <= p.minStockLevel
//     );
//   }

//   /* ========================= */
//   /* PRODUCT ACTIONS */
//   /* ========================= */

//   const handleAddProduct = async () => {

//     if (!newProduct.name || !newProduct.sku) {
//       alert("Name and SKU are required");
//       return;
//     }

//     await axios.post(
//       "http://localhost:9090/product/add",
//       {
//         ...newProduct,
//         unitPrice: Number(newProduct.unitPrice),
//         stockQuantity: Number(newProduct.stockQuantity),
//         minStockLevel: Number(newProduct.minStockLevel)
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setShowAddForm(false);
//     setNewProduct({
//       sku: "",
//       name: "",
//       category: "",
//       supplier: "",
//       unitPrice: "",
//       stockQuantity: "",
//       minStockLevel: ""
//     });

//     fetchData();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) return;

//     await axios.delete(
//       `http://localhost:9090/product/delete/${id}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchData();
//   };

//   const handleUpdate = async () => {

//     await axios.put(
//       `http://localhost:9090/product/update/${editingProduct.productId}`,
//       editingProduct,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setEditingProduct(null);
//     fetchData();
//   };

//   const handleStockIn = async (id) => {
//     const qty = prompt("Enter quantity to add");
//     if (!qty) return;

//     await axios.post(
//       `http://localhost:9090/product/stock-in?id=${id}&quantity=${qty}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchData();
//   };

//   const handleStockOut = async (id) => {
//     const qty = prompt("Enter quantity to remove");
//     if (!qty) return;

//     await axios.post(
//       `http://localhost:9090/product/stock-out?id=${id}&quantity=${qty}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchData();
//   };

//   /* ========================= */
//   /* UI */
//   /* ========================= */

//   return (
//     <>
//       <h2>Product Inventory</h2>

//       {/* Top Controls */}
//       <div className="product-controls">

//         <input
//           type="text"
//           placeholder="Search product..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <input
//           type="text"
//           placeholder="Filter by category"
//           value={filterCategory}
//           onChange={(e) => setFilterCategory(e.target.value)}
//         />

//         <button onClick={() => setShowLowStock(!showLowStock)}>
//           {showLowStock ? "Show All" : "Low Stock Only"}
//         </button>

//         <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
//           + Add Product
//         </button>
//       </div>

//       {/* Add Product Form */}
//       {showAddForm && (
//         <div className="product-form">
//           {Object.keys(newProduct).map((key) => (
//             <input
//               key={key}
//               placeholder={key}
//               value={newProduct[key]}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, [key]: e.target.value })
//               }
//             />
//           ))}

//           <button onClick={handleAddProduct}>Save</button>
//         </div>
//       )}

//       {/* Product Table */}
//       <table className="product-table">
//         <thead>
//           <tr>
//             <th>SKU</th>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Price</th>
//             <th>Stock</th>
//             <th>Min</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredProducts.length === 0 ? (
//             <tr><td colSpan="8">No Products Found</td></tr>
//           ) : (
//             filteredProducts.map((p) => (
//               <tr
//                 key={p.productId}
//                 className={p.stockQuantity <= p.minStockLevel ? "low-row" : ""}
//               >
//                 <td>{p.sku}</td>
//                 <td>{p.name}</td>
//                 <td>{p.category}</td>
//                 <td>₹ {p.unitPrice}</td>
//                 <td>{p.stockQuantity}</td>
//                 <td>{p.minStockLevel}</td>
//                 <td>
//                   {p.stockQuantity <= p.minStockLevel ?
//                     <span className="low-stock">LOW</span> :
//                     <span className="in-stock">OK</span>}
//                 </td>
//                 <td>
//                   <button onClick={() => setEditingProduct(p)}>Edit</button>
//                   <button onClick={() => handleDelete(p.productId)}>Delete</button>
//                   <button onClick={() => handleStockIn(p.productId)}>+Stock</button>
//                   <button onClick={() => handleStockOut(p.productId)}>-Stock</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Edit Section */}
//       {editingProduct && (
//         <div className="edit-box">
//           <h3>Edit Product</h3>

//           {Object.keys(editingProduct).map((key) =>
//             key !== "productId" ? (
//               <input
//                 key={key}
//                 value={editingProduct[key]}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     [key]: e.target.value
//                   })
//                 }
//               />
//             ) : null
//           )}

//           <button onClick={handleUpdate}>Update</button>
//         </div>
//       )}
//     </>
//   );
// }

// export default ProductsSection;