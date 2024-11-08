import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import Home from "./Pages/Home";
import Furniture from "./Pages/Furniture";
import PayDel from "./Pages/PayDel";
import Contact from "./Pages/Contact";
import Returns from "./Pages/Returns";
import Exchanges from "./Pages/Exchanges";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";  
import Check from "./Pages/Check";
import OrderConfirmation  from "./Pages/OrderConfirmation";  
import Logging from "./Admin/Pages/Logging"; 
import Registration from "./Admin/Pages/Registration"; 
import Admin from "./Admin/Pages/Admin-panel"; 
import Request from "./Admin/Pages/Request"; 
import Order from "./Admin/Pages/Order"; 
import Product from "./Admin/Pages/Product"; 
import Slide from "./Admin/Pages/Slide";
import RequestDetail from "./Admin/Components/Request/request-detail";
import NewProduct from "./Admin/Pages/NewProduct"; 
import { useAuth } from './Admin/Components/auth/AuthContext'; 
import EditCard from "./Admin/Pages/editCard";
import { CartProvider } from './Components/cart/CartContext';
import OrderDetails from "./Admin/Pages/OrderDetails";


export default function App() {
    const { isAuthenticated } = useAuth(); 

    return (
        <CartProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/furniture" element={<Furniture />} />
                <Route path="/payment-delivery" element={<PayDel />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/exchanges" element={<Exchanges />} />
                <Route path="/cart" element={<Cart />} /> 
                <Route path="/checkout" element={<Check />} /> 
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/furniture/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<Logging />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/admin-panel" element={isAuthenticated ? <Admin /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/request" element={isAuthenticated ? <Request /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/order" element={isAuthenticated ? <Order /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/order/:id" element={isAuthenticated ? <OrderDetails /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/product" element={isAuthenticated ? <Product /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/product/:id" element={isAuthenticated ? <EditCard /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/slide" element={isAuthenticated ? <Slide /> : <Navigate to="/admin" />} />
                <Route path="/admin-panel/request/:id_request" element={isAuthenticated ? <RequestDetail /> : <Navigate to="/admin" />} />
                <Route path="/newproduct/:id" element={isAuthenticated ? <NewProduct /> : <Navigate to="/admin" />} />
            </Routes>
        </Router>
        </CartProvider>
    );
}
