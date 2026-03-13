import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateNoteComponent() {
    //categories used for selection.
    const [categories, setCategories] = useState([]);

    //the attributes we're changing.
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("");

    const navigate = new useNavigate();

    //gotta make these promises so that toasts work.
    const getCategories = () =>
        new Promise((resolve, reject) => {
            axios
                .get("/api/categories/showAll")
                .then((response) => {
                    setCategories(response.data);
                    resolve();
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    const submitCategory = () =>
        new Promise((resolve, reject) => {
            axios
                .post("/api/notes/create", {
                    title: title,
                    body: body,
                    category_id: category,
                })
                .then((response) => {
                    resolve();
                    setTimeout(() => navigate(-1), 1000);
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    //what runs on load
    useEffect(() => {
        toast.promise(getCategories, {
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    }, []);

    //handle submit
    let handleSubmit = async (e) => {
        e.preventDefault();
        toast.promise(submitCategory, {
            success: "Successfully created note!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <Card>
            <Card.Header className="bg-dark text-white">Create Note</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Choose A Category:</Form.Label>
                        <Form.Select
                            aria-label="Default select"
                            required
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Please select a Category...</option>
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Note Title:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Note Title..."
                            required
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Note Body:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            required
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default CreateNoteComponent;
