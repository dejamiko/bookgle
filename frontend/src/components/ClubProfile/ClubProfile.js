import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  ProfileContainer,
  ProfileHeader,
} from "./ClubProfileElements";
import MainNav from "../Nav/MainNav";
import ClubProfileTabs from "./ClubProfileTabs.js";
import { useParams } from "react-router";
import axiosInstance from "../../axios";

const ClubProfile = () => {
  const { club_id } = useParams();
  const [club, setClub] = useState(null);

  const [memberStatus, setMemberStatus] = useState("notApplied");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    axiosInstance
      .get(`singleclub/${club_id}`)
      .then((res) => {
        setClub(res.data.club);
        const currentUserId = currentUser.id;
        if (res.data.club.members.includes(currentUserId)) {
          setMemberStatus("member");
        } else if (res.data.club.applicants.includes(currentUserId)) {
          setMemberStatus("applied");
        } else if (res.data.club.admins.includes(currentUserId)) {
          setMemberStatus("admin");
        } else if (res.data.club.banned_users.includes(currentUserId)) {
          setMemberStatus("banned");
        } else if (res.data.club.owner === currentUserId) {
          setMemberStatus("owner");
        } else {
          setMemberStatus("notApplied");
        }
      })
      .catch((err) => {
        console.error(err)
      });
  }, []);

  if (!club) return null;

  return (
    <div>
      <Container fluid>
        <Row style={{ marginBottom: "3rem" }}>
          <MainNav />
        </Row>
        <Row>
          <Col />
          <Col xs={6}>
            <ProfileContainer>
              <ProfileHeader>
                {club.name}
                <ClubProfileTabs
                  memberStatus={memberStatus}
                  setMemberStatus={setMemberStatus}
                  club={club}
                  user_id={currentUser.id}
                />
              </ProfileHeader>
            </ProfileContainer>
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
};

export default ClubProfile;
