export const addItemToCart = (item, next) => {
    let cart = []
    
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            cart =JSON.parse(localStorage.getItem("cart"))
        }
        cart.push({
            ...item,
            count : 1
        })
        localStorage.setItem("cart", JSON.stringify(cart))
        next()
    }
}


export const loadCart = () => {
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart"))
        }
    }    

    
}

export const removeItemFromCart  = (productId) => {
    let cart = []
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            cart =JSON.parse(localStorage.getItem("cart"))
        }
        cart.map((product, i )=> {
            if(product._id === productId){
                //splice method removes 
                cart.splice(i, 1)
            }
        })
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    return cart
}

export const cartEmpty = next => {
    if(typeof window !== undefined){
        localStorage.removeItem("cart")
        //So that the app dosent crash when we empty the cart after payment
        let cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
        next();
    }
}

