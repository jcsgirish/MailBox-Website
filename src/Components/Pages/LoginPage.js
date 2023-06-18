import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authActions } from '../../Store';


const Login = () => {
    const [login, setLogin] = useState(false);
    const enteredMail = useRef();
    const enteredPassword = useRef();
    const enteredConfirmPassword = useRef();

    let dispatch = useDispatch();
    const history = useHistory();
    const toggleLogin = () => {
        setLogin(!login);
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!login) {
            if (enteredMail.current.value.length > 0 && enteredPassword.current.value.length > 0 && enteredConfirmPassword.current.value.length > 0) {
                if (enteredPassword.current.value !== enteredConfirmPassword.current.value) {
                    alert("password and confirmPasswors not matching")
                } else {
                    try {
                        let responce = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCfyCYlKPxEvfAWcUuBq-XvgR3bE9-5bgA", {
                            method: "POST",
                            body: JSON.stringify({
                                "email": enteredMail.current.value,
                                "password": enteredPassword.current.value,
                                "returnSecureToken": true
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        if (responce.ok) {
                            console.log("User has successfully signed up")
                            alert(`User has successfully signed up`)
                            const data = await responce.json();
                            dispatch(authActions.setToken(data.idToken));
                            dispatch(authActions.setUser(enteredMail.current.value));
                            localStorage.setItem("token", data.idToken)
                            localStorage.setItem("user", enteredMail.current.value)
                        } else {
                            alert("Authentication failed")
                            throw new Error("Sign up failed");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                alert("please fill all the data")
            }
        } else {
            if (enteredMail.current.value.length > 0 && enteredPassword.current.value.length > 0) {
                try {
                    let responce = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCfyCYlKPxEvfAWcUuBq-XvgR3bE9-5bgA", {
                        method: "POST",
                        body: JSON.stringify({
                            "email": enteredMail.current.value,
                            "password": enteredPassword.current.value,
                            "returnSecureToken": true
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    if (responce.ok) {
                        const data = await responce.json();
                        console.log(data.idToken);
                        dispatch(authActions.setToken(data.idToken));
                        dispatch(authActions.setUser(enteredMail.current.value));
                        localStorage.setItem("token", data.idToken)
                        console.log("User has successfully Log in")
                        alert(`User has successfully logged in`)
                        localStorage.setItem("user", enteredMail.current.value)
                        history.push('/inbox')
                    } else {
                        alert("Authentication failed")
                        throw new Error("Log in failed");
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                alert("please fill all the data")
            }
        }
    }
    return (
        <div className='container w-25 my-3 border border-1 align-top bg-light rounded'>
            <Form className='my-auto'>
                <h4 className='text-center py-4'>{!login ? "Sign Up" : "Log In"}</h4>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Email" ref={enteredMail} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" ref={enteredPassword} />
                </Form.Group>
                {!login && <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Control type="password" placeholder="Confirm Password" ref={enteredConfirmPassword} />
                </Form.Group>}
                <Button variant="primary" className='w-100' type="submit" onClick={handleLogin}>
                    {!login ? "Sign Up" : "Log In"}
                </Button>
                {login && <p className='text-center text-primary'></p>}
                <Button variant="outline-success" className='my-2 w-100' onClick={toggleLogin}>
                    {!login ? "Have an account?Login" : "Haven't Account?Sign Up"}
                </Button>
            </Form>
        </div>
    )
}

export default Login
