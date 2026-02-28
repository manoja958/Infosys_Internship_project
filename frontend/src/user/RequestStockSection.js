import React, { useState, useEffect } from "react";
import axios from "axios";

function RequestStockSection() {

  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    axios.get("http://localhost:9090/product/all", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProducts(res.data));
  }, []);

  const handleRequest = async () => {

    await axios.post("http://localhost:9090/product/request-stock", {
      productName,
      quantity: Number(quantity)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Stock request sent");
    setProductName("");
    setQuantity("");
  };

  return (
    <>
      <h2>Request Stock</h2>

      <select
       className="input-field"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p.productId} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <input
       className="input-field"
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={handleRequest}>Submit</button>
    </>
  );
}

export default RequestStockSection;