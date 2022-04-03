import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { Row, Col, Button, Input } from "reactstrap";
import SinglePostComment from "./SinglePostComment";
import {
  CommentLine,
  CommentSectionContainer,
} from "../UserProfile/UserProfileElements";

export default function PostCommentList(props) {
  const [commentsUnderPost, setCommentsUnderPost] = useState([]);
  const [writtenComment, updateWrittenComment] = useState("");

  useEffect(() => {
    getCommentsUnderPost();
  }, []);

  const getCommentsUnderPost = () => {
    axiosInstance.get(`posts/${props.post.id}/comments/`).then((res) => {
      setCommentsUnderPost(res.data.comments);
    });
  };

  const handleCommentChange = (e) => {
    updateWrittenComment({
      writtenComment,
      [e.target.name]: e.target.value,
    });
  };

  const uploadComment = () => {
    axiosInstance
      .post(`posts/${props.post.id}/comments/`, {
        content: writtenComment.myComment,
      })
      .then(() => {
        getCommentsUnderPost();
      });
  };

  const updatePageAfterCommentDeletion = () => {
    getCommentsUnderPost();
  };

  const inputAreaID = "myComment" + props.post.id;

  const clearInputField = () => {
    document.getElementById(inputAreaID).value = "";
  };

  const displayCommentsUnderPost = () => {
    if (commentsUnderPost.length > 0) {
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CommentSectionContainer>
              {commentsUnderPost.map((comment) => {
                return (
                  <div key={comment.id} style={{ marginBottom: "1rem" }}>
                    <CommentLine>
                      <SinglePostComment
                        comment={comment}
                        post={props.post}
                        updatePageAfterCommentDeletion={
                          updatePageAfterCommentDeletion
                        }
                      />
                    </CommentLine>
                  </div>
                );
              })}
            </CommentSectionContainer>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Row style={{ marginTop: "1rem" }}>
              <Col xs="9">
                <Input
                  type="textarea"
                  rows="1"
                  id={inputAreaID}
                  name="myComment"
                  placeholder="Leave a comment here..."
                  onChange={handleCommentChange}
                  style={{
                    border: "0",
                    backgroundColor: "#F3F3F3",
                    borderBottomLeftRadius: "100px",
                    borderTopLeftRadius: "100px",
                    height: "3rem",
                  }}
                />
              </Col>
              <Col xs="3">
                <Button
                  onClick={(e) => {
                    uploadComment(e, 0);
                    clearInputField();
                  }}
                  style={{
                    borderBottomRightRadius: "100px",
                    borderTopRightRadius: "100px",
                    height: "3rem",
                  }}
                >
                  <p> Send </p>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Row style={{ marginTop: "1rem" }}>
              <Col xs="9">
                <Input
                  type="textarea"
                  rows="1"
                  id="myComment"
                  name="myComment"
                  placeholder="Leave a comment here..."
                  onChange={handleCommentChange}
                  style={{
                    border: "0",
                    backgroundColor: "#F3F3F3",
                    borderBottomLeftRadius: "100px",
                    borderTopLeftRadius: "100px",
                    height: "3rem",
                  }}
                />
              </Col>
              <Col xs="3">
                <Button
                  onClick={(e) => uploadComment(e, 0)}
                  style={{
                    borderBottomRightRadius: "100px",
                    borderTopRightRadius: "100px",
                    height: "3rem",
                  }}
                >
                  <p> Send </p>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  };

  return <>{displayCommentsUnderPost()}</>;
}
