import React, { Component, useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Container, Row, Col, Navbar, NavbarBrand, Button } from 'reactstrap'
import { FriendsListContainer, FriendsRequestContainer, UserDetailsContainer } from "./FriendsPageElements";
import Gravatar from 'react-gravatar';

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";
import FriendList from "../FriendList/FriendList";
import FriendRequests from "./FriendRequests";



export default function FriendsPage() {

  const navigate = useNavigate(); // for test purpose if axios works

  const [myFriends, getFriends] = useState("");
  const [myFriendRequests, getFriendRequests] = useState("");

  useEffect(() => {
    getAllFriends();
    getAllFriendRequests();
  }, []);


  const getAllFriends = () => {
    axiosInstance
      .get(`friends/`)
      .then((res) => {
        //navigate("/log_in/") // for test purpose - does api get request fail?
        const allFriends = res.data.friends;
        getFriends(allFriends)
      })
      .catch(error => console.error(error));
  }

  // const deleteFriend = () => {
  //   axiosInstance
  //     .delete(`friends/${id}`)
  //     .then((res) => {
  //       //navigate("/log_in/") // for test purpose - does api get request fail?
  //       console.log(res)
  //     })
  //     .catch(error => console.error(error));
  // }

  const getAllFriendRequests = () => {
    axiosInstance
      .get(`friend_requests/`)
      .then((res) => {
        //navigate("/log_in/") // for test purpose - does api get request fail?
        const allFriendRequests = res.data;
        getFriendRequests(allFriendRequests)
      })
      .catch(error => console.error(error));
  }




  return (
    <div id="ParentDiv">

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

            <Row>
              <Col>
                <Gravatar email='user@example.com' size={170} style={{ borderRadius: "100px", marginLeft: "1rem", marginBottom: "1rem" }} />
              </Col>
            </Row>

            <Row>
              <h1> JaneDoe </h1>
              <h4> janedoe@example.com </h4>
            </Row>

            <Row>
              <UserDetailsContainer>
                <h5> London, UK </h5>
                <h5> Date joined </h5>
              </UserDetailsContainer>
            </Row>

          </Col>
          <Col>

            <h1> Friends Page </h1>
            {/* <p> Tabs instead of buttons. Will be fixed </p>

                <Button>
                  Profile
                </Button>
                <Button style={{marginLeft: "1rem"}}>
                  Books
                </Button>
                <Button onClick={getAllFriends} style={{marginLeft: "1rem"}}>
                  List friends
                </Button>

                <Button style={{marginLeft: "1rem"}}>
                  Posts
                </Button> */}

            <Button onClick={getAllFriendRequests} style={{ marginLeft: "1rem" }}>
              List F.Requests
            </Button>


            <FriendsRequestContainer>
              <p> Here are your friend requests</p>
              <FriendRequests myFriendRequests={myFriendRequests} />
            </FriendsRequestContainer>


            <FriendsListContainer>
              <FriendList myFriends={myFriends} />
            </FriendsListContainer>
          </Col>
          <Col />
        </Row>
      </Container>

    </div>

  );
}