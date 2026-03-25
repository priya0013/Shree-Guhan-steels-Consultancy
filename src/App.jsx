import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Doors from "./pages/Products/Doors";
import Windows from "./pages/Products/Windows";
import WindowDetail from "./pages/Products/WindowDetail";
import DoorDetail from "./pages/Products/DoorDetail";
import Contact from "./pages/Contacts/Contact";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Cart from "./pages/Cart/Cart";
import Payment from "./pages/Payment/Payment";
import AdminEnquiries from "./pages/Admin/AdminEnquiries";
import AdminOrders from "./pages/Admin/AdminOrders";
import MyOrders from "./pages/Orders/MyOrders";
import TrackOrder from "./pages/Orders/TrackOrder";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/doors" element={<Doors />} />
                <Route path="/products/doors/:id" element={<DoorDetail />} />
                <Route path="/products/windows" element={<Windows />} />
                <Route path="/products/windows/:id" element={<WindowDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/admin/enquiries" element={<AdminEnquiries />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
