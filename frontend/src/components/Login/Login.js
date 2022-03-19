import React, { useState } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText, Form, VisibilityToggle } from './LoginElements'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";
import { FormLayout } from '../SignUp/SignUpStyle'


// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePassword = () => {
      setPasswordVisible(!passwordVisible);
    }

    const initialFormData = Object.freeze({
        username: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)

        axiosInstance
            .post(`token/`, {
                username: formData.username,
                password: formData.password,
            })
            .then((response) => {
                localStorage.setItem('access_token', response.data.access) // receiving the tokens from the api
                localStorage.setItem('refresh_token', response.data.refresh)
                localStorage.setItem('username', formData.username)
                axiosInstance.defaults.headers['Authorization'] = // updating the axios instance header with the new access token.
                    'JWT ' + localStorage.getItem('access_token')
                navigate("/home") // change to redirect to dashboard
                console.log(response);
                console.log(response.data);
            })
    }

    return (
        <div>
            <Row>
                <Navbar color="light" expand="md" light>
                    <NavbarBrand href="/">
                        <h1> bookgle </h1>
                    </NavbarBrand>
                </Navbar>
            </Row>
            <Container fluid>
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Sign into your account</HeadingText><br />
                        <ParaText>
                            If you haven't created one yet, you can do so <Link to="/sign_up/" style={{ color: "#0057FF", textDecoration: "none" }}>here <FaExternalLinkAlt style={{ height: "15px", color: "#0057FF" }} />
                            </Link> .
                        </ParaText>
                        <LoginContainer>
                            <FormLayout>
                                <FormGroup>
                                    <Label><ParaText>Username</ParaText></Label>
                                    <Input
                                        name="username"
                                        onChange={handleChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                <Label for="password"><ParaText>Password</ParaText></Label>
                                <Container fluid style={{ display: "flex", flexDirection: "row", padding: "0px" }}>
                                <Input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                />
                                <Button 
                                    onClick={togglePassword}
                                    style={{ backgroundColor: "#653FFD" }}
                                    >
                                    {passwordVisible ? <BsFillEyeSlashFill /> : <BsFillEyeFill /> }
                                    </Button>
                                </Container>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={{ size: 10, offset: 4 }}>
                                        <Button type="submit" onClick={handleSubmit} style={{ backgroundColor: "#653FFD", width: "7rem" }}>Log In</Button>
                                    </Col>
                                </FormGroup>
                            </FormLayout>
                        </LoginContainer>
                    </Col>
                    <Col />
                </Row>
            </Container>
        </div>
    )
}
