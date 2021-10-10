import React, { useState, useEffect } from 'react';
import Products from './components/products/Products';
import Navbar from './components/navbar/Navbar';
import Cart from './components/cart/Cart';
import Checkout from './components/CheckoutFrom/Checkout/Checkout';
import { commerce } from './lib/commerce';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProduts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    } 

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        setCart(item.cart);
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const response  = await commerce.cart.update(productId, { quantity });
        setCart(response.cart);
    }

    const handleRemoveFromCart = async (productId) => {
        const response = await commerce.cart.remove(productId);
        setCart(response.cart);
    }

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();
        setCart(response.cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
    
        setCart(newCart);
      };

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
          const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
    
          setOrder(incomingOrder);
    
          refreshCart();
        } catch (error) {
          setErrorMessage(error.data.error.message);
        }
      };

    useEffect(() => {
        fetchProduts();
        fetchCart();
    }, []);

    console.log(cart);

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items}/>
                <Switch>
                    <Route exact path='/'>
                        <Products products={products} onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route exact path='/Cart'>
                        <Cart 
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart} />
                    </Route>
                    <Route exact path='/Checkout'>
                        <Checkout cart={cart} order={order} onCaptureCheckout={refreshCart} error={errorMessage}/>
                    </Route>

                </Switch>
            </div>
        </Router>
    )
}

export default App

