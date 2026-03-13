import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShowAllCategoriesComponent() {
    const columns = [
        { label: "ID", width: "10%" },
        { label: "Name", width: "55%" },
        { label: "Action", width: "35%" },
    ];

    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        toast.promise(getCategories, {
            error: "Error retrieving categories",
        });
    }, []);

    const deleteCategory = (id) =>
        new Promise((resolve, reject) => {
            if (confirm("Do you really want to delete this category?")) {
                axios
                    .delete("/api/categories/delete/" + id)
                    .then((response) => {
                        getCategories();
                        resolve();
                    });
            } else {
                reject("Request cancelled");
            }
        });

    const handleDelete = (id) =>
        toast.promise(deleteCategory(id), {
            success: "Successfully deleted category!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });

    return (
        <div className="content-card">
            <Row className="align-items-center mb-4">
                <Col>
                    <h1 className="page-title mb-0">Categories</h1>
                </Col>
                <Col xs="auto">
                    <Link to="/categories/create">
                        <Button variant="primary">New Category</Button>
                    </Link>
                </Col>
            </Row>
            <Table striped bordered hover className="table-fixed">
                <colgroup>
                    {columns.map((col) => (
                        <col key={col.label} style={{ width: col.width }} />
                    ))}
                </colgroup>
                <thead className="table-dark">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.label}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.length
                        ? categories.map((row) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td title={row.name}>{row.name}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Link to={"/categories/" + row.id}>
                                            <Button variant="outline-primary" size="sm">View</Button>
                                        </Link>
                                        <Link to={"/categories/edit/" + row.id}>
                                            <Button variant="outline-warning" size="sm">Edit</Button>
                                        </Link>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        : (
                            <tr>
                                <td colSpan={columns.length} className="text-center text-muted py-4">
                                    No categories found. Create one to get started!
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>
        </div>
    );
}

export default ShowAllCategoriesComponent;
