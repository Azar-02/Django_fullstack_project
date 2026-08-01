import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">

                <Navbar />

                <main className="container my-4 flex-grow-1">

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                </main>

                <Footer />

            </div>
        </BrowserRouter>
    );
}

export default App;