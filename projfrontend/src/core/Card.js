import React , {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom';
import { addItemToCart, removeItemFromCart } from './helper/cartHelper';
import ImageHelper from './helper/ImageHelper';

    const Card = ({ 
      product ,
      addtoCart = true,  
      removeFromCart = false ,
      //if you give anything it throws it back 
      setreload = f=> f, 
      //function(f){return f}
      reload = undefined 
      }) => {

      const [redirect, setRedirect] = useState(false);
      const [count, setCount] = useState(product.count)

      const cartTitle = product ? product.name : "A photo fom pixel"
      const cartDescription = product ? product.description : "Default Description"
      const cartPrice = product ? product.price : "DEFAULT"

      const addToCart = () => {
        addItemToCart(product, () => setRedirect(true))
      }

      const getARedirect = (redirect) => {
        if(redirect){
          return <Redirect to="/cart" />
        }
      }

      const showAddToCart = (addtoCart) => {
          return (
            addtoCart && (
              <button
                    onClick={addToCart}
                    className="btn btn-block btn-outline-success mt-2 mb-2"
                  >
                    Add to Cart
                  </button>
            )
          )
      }

      const showRemoveFromCart = (removeFromCart) => {
        return (
          removeFromCart && (
            <button
                    onClick={() => {
                      removeItemFromCart(product._id) 
                      console.log(reload)
                      setreload(!reload)
                      
                    }}
                    className="btn btn-block btn-outline-danger mt-2 mb-2"
                  >
                    Remove from cart
                  </button>
          )
        )
      }


        return (
          <div className="card text-white bg-dark border border-info ">
            <div className="card-header lead">{cartTitle}</div>
            <div className="card-body">
              {getARedirect(redirect)}
              <ImageHelper product = {product}/> 
              <p className="lead bg-success font-weight-normal text-wrap">
                {cartDescription}
              </p>
              <p className="btn btn-success rounded  btn-sm px-4">$ {cartPrice}</p>
              <div className="row">
                <div className="col-12">
                  {showAddToCart((addtoCart))}
                </div>
                <div className="col-12">
                  {showRemoveFromCart((removeFromCart))}
                </div>
              </div>
            </div>
          </div>
        );
};


export default Card;

