import React, {useState, useEffect } from 'react'
//importing css
import "../styles.css"
//import api from backend
import {API} from "../backend"
import Base from "./Base"
import Card from "./Card"
import { loadCart } from './helper/cartHelper'
import Paymentb from './Paymentb'


const Cart = () => {

    const [products, setProducts] = useState([])
    //used to reload
    const [reload, setreload]=useState([false])


    //[reload] remounts the compomnent 
    useEffect(() => {
        setProducts(loadCart())
    },[reload])

    const loadAllProducts = products => {
        return (
            <div>
                <h2> To load Products</h2>
                {products.map((product, index)=> (
                    <Card 
                        key={index}
                        product={product}
                        removeFromCart={true}
                        addtoCart= {false}
                        setreload={setreload}
                        reload={reload}
                    />
                ))}
            </div> 
        )
    }

    const loadCheckout = () => {
        return (
            <div>
                <h2> To load Checkout</h2>
            </div> 
        )
    }

  
    
    return (
        <Base title="Cart Page" description="Ready to checkout">
          <div className="row">
              <div className="row text-center">
                  <div className="col-6">{products.length > 0 ? loadAllProducts(products): (<h3>No products in cart</h3>)}</div>
                  <div className="col-6"><Paymentb products={products} setreload={setreload}/></div>
              </div>
          </div>
        </Base>
      );
}


export default Cart;