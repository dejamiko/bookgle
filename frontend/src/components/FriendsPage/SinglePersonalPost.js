import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {
    Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Input, UncontrolledCollapse,
    Modal, ModalBody
} from "reactstrap"
import PersonalPostEditor from "./PersonalPostEditor"
import PostCommentList from "./PostCommentList"
import Gravatar from "react-gravatar"
import { PostContainer, PostHeadingText } from "./UserProfileElements"
import useGetUser from "../../helpers"

export default function SinglePersonalPost(props) {

    const [personalPost, setPersonalPost] = useState("");
    const [writtenComment, updateWrittenComment] = useState("dummy")
    const [isModalVisible, setModalVisibility] = useState()
    const currentUser = useGetUser();

    useEffect(() => {
        setPersonalPost(props.personalPost)
    }, []);

    const deletePost = (post_id, e) => {
        axiosInstance
            .delete(`posts/${post_id}`)
            .then((res) => {
                console.log(res)
                props.updatePageAfterDeletion()
            })
            .catch(error => console.error(error));
    }

    const uploadComment = (post_id, e, index) => {
        console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${post_id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                console.log(res.data)
                const comment = { author: localStorage.username, content: writtenComment.myComment }
                console.log(commentsRef.current[index])
                commentsRef.current[index].addComment(comment)
                console.log("adding post in parent: ", comment)
            })
    }

    // const handleCommentChange = (e) => {
    //     updateWrittenComment({
    //         writtenComment,
    //         [e.target.name]: e.target.value,
    //     })
    // }

    const changeModalVisibility = () => {
        setModalVisibility(!isModalVisible);
    }

    const commentsRef = useRef([]);
    // used to have unique togglers
    const togglerID = "toggler" + personalPost.id
    const HashtagTogglerId = "#toggler" + personalPost.id


    return(
        <div className="personalPost" key={personalPost.id}>

            <Card style={{ marginBottom: "1rem",
                marginRight: "1rem",
                marginTop: "1rem",
                marginLeft: "1rem",
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "3px solid rgba(0,0,0,.125)"}}
            >
                <CardHeader>
                    <Row >
                        <Col xs="1">
                            <Gravatar email={currentUser.email} size={30} style={{ 
                                        borderRadius: "50px",
                                        marginTop: "0rem",
                                        marginBottom: "0rem"
                                    }} 
                            />
                        </Col>
                        <Col xs="11" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Button style={{marginRight: "1rem"}} onClick={() => changeModalVisibility()}>
                                    Edit                    
                                </Button>
                                <Button name={personalPost.id} onClick={(e) => deletePost(personalPost.id, e)}>
                                    X
                                </Button>
                            </div>
                        </Col>
                    </Row>    
                </CardHeader>

                <CardBody>
                    <div style={{display: 'flex', justifyContent: "center"}}>
                        <CardTitle> 
                            <PostHeadingText>
                                {personalPost.title} 
                            </PostHeadingText>
                        </CardTitle>
                    </div>

                    <CardText>    
                        <h5> {personalPost.content} </h5> 
                    </CardText>
                </CardBody>
                
                <Button color="link" id={togglerID} style={{marginBottom: "1rem"}}>
                    view all comments
                </Button>

                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div style={{maxHeight: "25rem", marginBottom: "2rem"}}>
                        <PostCommentList post={personalPost}/>
                    </div>
                </UncontrolledCollapse>
            </Card>
            <Modal
                isOpen = {isModalVisible}
                toggle = {() => changeModalVisibility()}
                style={{
                    left: 0,
                    top: 100
                }}
            >
                <ModalBody style={{overflowY: "scroll"}}>
                    <PersonalPostEditor personalPost={personalPost}/>
                </ModalBody>
            </Modal>
        </div>
    )
}