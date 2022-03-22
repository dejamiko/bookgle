import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Button, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";
import {FormLayout, HeadingText, ParaText, SchedulingContainer} from "./SchedulingElements";
import useGetUser from "../../helpers";
import {useNavigate, useParams} from "react-router";


export default function Scheduling() {
    const navigate = useNavigate()
    const {club_id} = useParams();
    console.log("Club ID: " + club_id);

    const user = useGetUser();
    const [books, setBooks] = useState([]);
    const [bookData, setBookData] = useState([]);

    useEffect(() => {
        getRecommendedBooks();
    }, []);

    const getRecommendedBooks = () => {
        axiosInstance
            .post(`recommender/0/10/${club_id}/top_n_for_club/`, {})
            .then(() => {
                axiosInstance
                    .get(`recommender/0/10/${club_id}/top_n_for_club/`, {})
                    .then((res) => {
                        console.log(res)
                        let book_list = []
                        for (let i = 0; i < res.data.length; ++i) {
                            book_list.push({id: res.data[i]['book']['ISBN'], name: res.data[i]['book']['title']})
                        }
                        setBooks(book_list)
                    })
            })
    }

    const initialFormData = Object.freeze({
        name: '',
        description: '',
        book: '',
        start_time: '',
        end_time: '',
        link: ''
    })

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting", formData)


        axiosInstance
            .post(`scheduling/`, {
                name: formData.name,
                description: formData.description,
                club: club_id,
                organiser: user.id,
                book: bookData,
                start_time: formData.start_time,
                end_time: formData.end_time,
                link: formData.link
            })
            .then((res) => {
                console.log(res.data)
                navigate(`/club_profile/${club_id}`)
            })
    }

    if (books.length > 0) {
        return (
            <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{marginTop: "6rem"}}>
                        <Col/>
                        <Col>
                            <HeadingText>Create a meeting</HeadingText>
                            <ParaText/>
                            <SchedulingContainer>
                                <FormLayout>
                                    <FormGroup>
                                        <Label for="name">Name </Label>
                                        <Input
                                            id="name"
                                            data-testid="name"
                                            name="name"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="description"> Description </Label>
                                        <Input
                                            id="description"
                                            data-testid="description"
                                            name="description"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label
                                            for="book"
                                            data-testid="book"
                                        > Book </Label>
                                        <br/>
                                        <select
                                            value={bookData}
                                            onChange={(e) => setBookData(e.target.value)}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        >
                                            <option/>
                                            {books.map(book =>
                                                <option>{book.name}</option>
                                            )}
                                        </select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="start_time"> Start time </Label>
                                        <Input
                                            id="start_time"
                                            data-testid="start_time"
                                            name="start_time"
                                            type="datetime-local"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="end_time"> End time </Label>
                                        <Input
                                            id="end_time"
                                            data-testid="end_time"
                                            name="end_time"
                                            type="datetime-local"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="link"> Meeting link </Label>
                                        <Input
                                            id="link"
                                            data-testid="link"
                                            name="link"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>


                                    <FormGroup>
                                        <Col sm={{size: 10, offset: 5}}>
                                            <Button
                                                type="submit"
                                                className="submit"
                                                onClick={handleSubmit}
                                                style={{backgroundColor: "#653FFD", width: "7rem"}}
                                            >
                                                Create
                                            </Button>
                                        </Col>
                                    </FormGroup>

                                </FormLayout>
                            </SchedulingContainer>

                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
        );
    } else {
        return (
            <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{marginTop: "6rem"}}>
                        <Col/>
                        <Col>
                            <HeadingText
                                data-testid="waiting_message"
                            >Please wait about 20 seconds for the book recommendations</HeadingText>
                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
        )
    }
}