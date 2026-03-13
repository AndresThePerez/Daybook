import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditCategoryComponent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState([]);
    const [name, setName] = useState([]);

    //gotta make these promises so that toasts work.
    const getCategory = () =>
        new Promise((resolve, reject) => {
            axios
                .get("/api/categories/" + id)
                .then((response) => {
                    setCategory(response.data);
                    setName(response.data.name);
                    resolve();
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    useEffect(() => {
        toast.promise(getCategory, {
            error: "Error retrieving categories",
        });
    }, []);

    const editCategoriesSubmit = () =>
        new Promise((resolve, reject) => {
            axios
                .put("/api/categories/edit/" + id, {
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
        toast.promise(editCategoriesSubmit, {
            success: "Successfully modified category!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <Card>
            <Card.Header className="bg-dark text-white">Edit Category</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            defaultValue={category.name}
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

export default EditCategoryComponent;
