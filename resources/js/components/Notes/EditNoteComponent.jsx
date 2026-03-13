import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditNoteComponent() {
    //get params
    const { id } = useParams();

    //to edit, we need the note itself, the category that is tied to it, and the list of categories
    const [category, setCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [note, setNote] = useState("");

    //also what is being set...
    const [categoryId, setCategoryId] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const navigate = new useNavigate();

    //gotta make these promises so that toasts work.
    const getNote = () =>
        new Promise((resolve, reject) => {
            axios
                .get("/api/notes/" + id)
                .then((response) => {
                    setNote(response.data);
                    setCategory(response.data.category);

                    setBody(response.data.body);
                    setCategoryId(response.data.category.id);
                    setTitle(response.data.title);
                    resolve();
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

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

    const editNotesSubmit = () =>
        new Promise((resolve, reject) => {
            axios
                .put("/api/notes/edit/" + id, {
                    title: title,
                    body: body,
                    category_id: categoryId,
                })
                .then((response) => {
                    resolve();
                    setTimeout(() => navigate(-1), 1000);
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    useEffect(() => {
        toast.promise(getCategories, {
            error: "Error retrieving Categories",
        });

        toast.promise(getNote, {
            error: "Error retrieving Notes",
        });
    }, []);

    let handleSubmit = async (e) => {
        e.preventDefault();
        toast.promise(editNotesSubmit, {
            success: "Successfully modified note!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <Card>
            <Card.Header className="bg-dark text-white">Edit Note</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Choose A Category:</Form.Label>
                        <Form.Select
                            aria-label="Default select"
                            required
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option>Please select a Category...</option>
                            {categories.map((entity) => (
                                <option
                                    selected={entity.id === category.id}
                                    value={entity.id}
                                    key={entity.id}
                                >
                                    {entity.name}
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
                            defaultValue={note.title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Note Body:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            required
                            defaultValue={note.body}
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

export default EditNoteComponent;
