import React, {useState} from 'react'
import Base from '../core/Base'
import {Link, Redirect} from "react-router-dom"
import {  authenticate, isAuthenticated, signin } from "../auth/helper/index"


const Signin = () => {
    const [values, setValues] = useState ({
        email :"ellen@sri.com",
        password : "12345",
        error: "",
        loading : false,
        didRedirect: false,
    })


    const {email, password, error, loading, didRedirect} = values
    const {user} = isAuthenticated();

    const handleChange = name => event => {
        //... loads the existing values
        setValues({...values, error:false , [name]:event.target.value })   
    }

    const onSubmit = event => {
            event.preventDefault();
            setValues({...values, error: false, loading : true })
            signin({email, password})
            .then(data => {
                    if(data.error) {
                        console.log("Error present")
                        setValues({...values, error: data.error, loading : false })
                    }
                    else {
                        //console.log("Error else block")
                        authenticate(data, ()=> {
                            setValues({
                                ...values, 
                                email :"",
                                password : "",
                                error: "",
                                loading : false,
                                didRedirect : true
                            })
                        })
                    }
                }
            )
            .catch()
    }

    const performRedirect = () => {

        if(didRedirect){
            if(user && user.role === 1 ){
                
                // console.log("redirect to admin dashboard")
                return <Redirect to="/admin/dashboard"/>
            } else {
               // console.log(user)
                // console.log("redirect to user dashboard")
                return <Redirect to="/user/dashboard"/>
            }
        }
       // console.log(isAuthenticated())
        if(isAuthenticated()){
           // console.log("Home page re direct")
            return <Redirect to="/" />
        }
    }


    const loadingMessage = () => {
        return( 
            loading && (
                <div className = "alert alerty-info">
                    <h2> Loading... </h2>
                </div>
            )

        )
    }

    const errorMessage = () => {
        return(
            <div className = "row">
                <div className = "col-md-6 offset-sm-3 text-left">
        <div className = "alert alert-danger"
        style = {{display: error ? "":"none"}}>
            {error}
        </div> 
        </div>
        </div>)
    }




//Value in  input tag shows the value is copied to the value of this file 
    const signInForm = () => {
        //console.log("Inside signInForm")
        return (
            <div className = "row">
                <div className = "col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className = "form-group">
                            <label  className= "text-light"> Email </label>
                            <input onChange ={handleChange("email")} value={email} className = "form-control" type = "email" /> 
                        </div>
                        <div className = "form-group">
                            <label  className= "text-light"> Password </label>
                            <input onChange ={handleChange("password")} value = {password} className = "form-control" type = "password" />
                        </div>
                        <button onClick={onSubmit} className = "btn btn-success btn-block"> Submit </button>
                    </form>
                </div>
            </div>
        )
    }
    return(
        <Base title = "Sign in page " description = "A page for user to sign in">
        {loadingMessage}
        {errorMessage()}
        {signInForm()}
        {performRedirect()}
        
        <p className=" text-white text-center"> {JSON.stringify(values)}</p>
        
        </Base>
    )
}

export default Signin;