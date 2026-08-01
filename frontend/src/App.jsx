import {

    BrowserRouter,

    Routes,

    Route

} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App(){

    return(

        <BrowserRouter>

            <Navbar/>

            <div className="container mt-4">

                <Routes>

                    <Route path="/" element={<Home/>}/>

                    <Route path="/products" element={<Products/>}/>

                    <Route path="/cart" element={<Cart/>}/>

                    <Route path="/orders" element={<Orders/>}/>

                    <Route path="/login" element={<Login/>}/>

                    <Route path="/register" element={<Register/>}/>

                </Routes>

            </div>

        </BrowserRouter>

    );

}

export default App;