import { useEffect, useState } from "react";

import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Products() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        fetchProducts();

    }, []);

    const fetchProducts = async () => {

        try {

            const response = await api.get("products/");

            setProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const addToCart = async (productId) => {

        try {

            await api.post("cart/add/", {

                product_id: productId,

                quantity: 1,

            });

            alert("Added to Cart");

        }

        catch (error) {

            alert("Please login first");

        }

    };

    return (

        <div>

            <h2 className="mb-4">

                Tea Palace Menu

            </h2>

            <div className="row">

                {products.map((product) => (

                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                    />

                ))}

            </div>

        </div>

    );

}

export default Products;