import React, { useState, useEffect } from "react"
import { Container, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'
import { useNavigate } from "react-router";


export default function PersonalPostForm(props) {
    console.log(props)

    const [titleErr, setTitleErr] = useState('')
    const [contentErr, setContentErr] = useState('')
    const [clubIDErr, setClubIDErr] = useState('')
    const [clubData, setClubData] = useState("")
    const currentUser = JSON.parse(localStorage.user);
    const [availableClubs, setAvailableClubs] = useState("") 

    const initialFormData = Object.freeze({ // After the user has typed in their data, it can no longer be changed. (.freeze)
        club_id : '',
        title : '',
        content : '', 
        image_link : '',
        book_link : ''
    })

    const [formData, updateFormData] = useState(initialFormData)
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof (currentUser.id) != "undefined") {
            getAvailableClubs();
            console.log("current user!: " + currentUser.id)
        }
    }, [currentUser]);

    const handleChange = (e) => {
        updateFormData({
          ...formData, 
          [e.target.name]: e.target.value.trim(), 
        })
      }
    
    const handlePostFriendRequest = (e) => {
        e.preventDefault()
        
        axiosInstance
            .post("posts/", {
                club : formData.club_id,
                title : formData.title,
                content : formData.content, 
            })
            .then((res) => {
                navigate("/friends_page/")
                navigate("/home/")
            })
            .catch((e) => {
                console.log(e.response.data)
                setTitleErr(e.response.data.title)
                setContentErr(e.response.data.content)
                setClubIDErr(e.response.data.club_id)
            })
    }

    const getAvailableClubs = () => {
        axiosInstance
            .get(`clubs/user/${currentUser.id}`)
            .then((res) => {
                console.log(res.data.clubs)
                const allAvailableClubs = res.data.clubs;
                setAvailableClubs(allAvailableClubs)
                console.log("the current user is: " + currentUser.id)
                console.log(availableClubs + "=" + res.data.clubs)
            })
            .catch(error => console.error(error));
    }
    
    const displayPersonalPostForm = (e) => {
        
        return(
            <Container fluid>
            <Row>
                <Col>
                    <h1> Upload Post </h1>
                    

                    <Container>
                    <Form> 
                        
                        <FormGroup>
                            <Label for="title"> Title </Label>
                            <Input
                                id="title"
                                name="title"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                        <div>{titleErr}</div>

                        <FormGroup>
                            <Label for="content"> Content </Label>
                            <Input type="textarea" rows="5"
                                id="content"
                                name="content"
                                onChange={handleChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            />
                        </FormGroup>
                        <div>{contentErr}</div>

                        
                        { availableClubs.length > 0  && 
                            <Row>
                            <Col xs="3">
                                <FormGroup>
                                    <Label for="club_id"> Club ID </Label>
                                    <br/>
                                    <select
                                        
                                        value={clubData}
                                            onChange={(e) => setClubData(e.target.value)}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        >
                                        <option/>

                                        {availableClubs.map(club =>
                                            <option> {club.name} </option>
                                        )}
                                            
                                    </select>
                                    {/* <Button onClick={getAvailableClubs}>
                                        hi
                                    </Button> */}
                                </FormGroup>
                                <div>{clubIDErr}</div>
                            
                            </Col>
                            </Row>
                        }

                        <FormGroup>
                            <Col sm={{ size: 10, offset: 5 }}>
                                <Button
                                type="submit"
                                className="submit"
                                onClick={handlePostFriendRequest}
                                style={{ width: "7rem" }}
                                >
                                Post!
                                </Button>
                            </Col>
                        </FormGroup> 

                    </Form>
                    </Container>

                </Col>
            </Row>
        </Container>
        )
}
    return (
        <>
            {displayPersonalPostForm(props)}
        </>
    )

}
