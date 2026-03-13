import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateCategoryComponent() {
    const [name, setName] = useState([]);

    const navigate = new useNavigate();

    const submitCategory = () =>
        new Promise((resolve, reject) => {
            axios
                .post("/api/categories/create", {
                    name: name,
                })
                .then((response) => {
                    resolve();
                    setTimeout(() => navigate(-1), 1000);
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    let handleSubmit = async (e) => {
        e.preventDefault();

        toast.promise(submitCategory, {
            success: "Successfully created category!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <Card>
            <Card.Header className="bg-dark text-white">Create Category</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Category Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Category Name"
                            required
                            onChange={(e) => setName(e.target.value)}
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

export default CreateCategoryComponent;
