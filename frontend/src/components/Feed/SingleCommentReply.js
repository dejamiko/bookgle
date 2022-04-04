import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { Row, Col, Button, Modal, ModalBody } from "reactstrap";
import Gravatar from "react-gravatar";
import { ReplyLineBox } from "../UserProfile/UserProfileElements";
import { useNavigate } from "react-router";
import ThumbUp from "@mui/icons-material/ThumbUp";
import LikesUsersList from "./LikesUsersList";

export default function SingleCommentReply(props) {
  const [singleReply, setSingleReply] = useState("");
  const [singleComment, setSingleComment] = useState("");
  const [posterEmail, setPosterEmail] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [isModalVisible, setModalVisibility] = useState(false);
  const [likesCount, setLikesCount] = useState(props.reply.likesCount);
  const [likedByUser, setLikedByUser] = useState(props.reply.liked);

  const navigate = useNavigate();

  useEffect(() => {
    setSingleComment(props.comment);
    setSingleReply(props.reply);
    setPosterEmail(props.reply.author__email);
  }, []);

  const deleteComment = () => {
    axiosInstance
      .delete(
        `posts/${props.post.id}/comments/${props.comment.id}/replies/${props.reply.id}`
      )
      .then(() => {
        props.updatePageAfterReplyDeletion();
      })
      .catch((error) => console.error(error));
  };

  const updateReplyUpvotes = () => {
    axiosInstance
      .get(
        `posts/${props.post.id}/comments/${props.comment.id}/replies/${props.reply.id}`
      )
      .then((res) => {
        setLikesCount(res.data.reply.upvotes.length);
        setLikedByUser(res.data.reply.liked);
      })
      .catch((error) => console.error(error));
  };

  const likeReply = () => {
    axiosInstance
      .put(
        `posts/${props.post.id}/comments/${props.comment.id}/replies/${props.reply.id}`,
        {
          action: "upvote",
        }
      )
      .then(() => {
        updateReplyUpvotes();
      })
      .catch((error) => console.error(error));
  };

  const navigateToProfile = () => {
    navigate(`/user_profile/${singleReply.author}/`);
  };

  const getLikesUsersListReply = (setLikesUsersList) => {
    axiosInstance
      .get(
        `posts/${props.post.id}/comments/${props.comment.id}/replies/${props.reply.id}`
      )
      .then((res) => {
        setLikesUsersList(res.data.reply.upvotes);
      })
      .catch((error) => console.error(error));
  };

  const changeModalVisibility = () => {
    setModalVisibility(!isModalVisible);
  };

  return (
    <div className="singleComment" key={singleReply.id}>
      <Row>
        <Col>
          <Row>
            <Col
              xs="2"
              style={{
                height: "3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Gravatar
                email={posterEmail}
                size={30}
                onClick={navigateToProfile}
                style={{
                  borderRadius: "50px",
                  marginTop: "0rem",
                  marginBottom: "0rem",
                }}
              />
            </Col>
            <Col
              xs="9"
              style={{
                height: "3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ReplyLineBox>
                <h6> {singleReply.content} </h6>
              </ReplyLineBox>
            </Col>
            <Col xs="1" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                data-testid={"reply-like-button"}
                style={{
                  height: "2rem",
                  background: likedByUser ? "#653FFD" : "#ffffff",
                  color: likedByUser ? "#ffffff" : "#653FFD",
                  borderColor: "#653FFD",
                }}
                onClick={likeReply}
              >
                <ThumbUp />
              </Button>
              &nbsp;
              <Button
                style={{
                  height: "2rem",
                  background: "#653FFD",
                  color: "#ffffff",
                  borderColor: "#653FFD",
                }}
                onClick={changeModalVisibility}
              >
                Likes: {likesCount}
              </Button>
              {singleReply.author === currentUser.id && (
                <Button
                  color="danger"
                  name={singleReply.id}
                  onClick={(e) => deleteComment(singleReply.id, e)}
                  style={{
                    height: "3rem",
                    borderTopRightRadius: "100px",
                    borderBottomRightRadius: "100px",
                  }}
                >
                  <p> x </p>
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        isOpen={isModalVisible}
        toggle={() => changeModalVisibility()}
        style={{
          left: 0,
          top: 100,
        }}
      >
        <ModalBody style={{ overflowY: "scroll" }}>
          <LikesUsersList
            type="reply"
            getLikesUsersList={getLikesUsersListReply}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
