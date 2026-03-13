import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Row, Col, Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainTable() {
    const [loadingData, setLoadingData] = useState(true);

    const columns = [
        { label: "ID", width: "5%" },
        { label: "Category", width: "15%" },
        { label: "Title", width: "20%" },
        { label: "Body", width: "40%" },
        { label: "Action", width: "20%" },
    ];

    const [data, setData] = useState([]);
    //gotta make these promises so that toasts work.
    const getNotes = () =>
        new Promise((resolve, reject) => {
            axios
                .get("/api/notes/showAll")
                .then((response) => {
                    setData(response.data);
                    setLoadingData(false);
                    resolve();
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    useEffect(() => {
        toast.promise(getNotes, {
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    }, []);

    const deleteNote = (id) =>
        new Promise((resolve, reject) => {
            if (confirm("Do you really want to delete this note?")) {
                axios.delete("/api/notes/delete/" + id).then((response) => {
                    getNotes();
                    resolve();
                });
            } else {
                reject("Request cancelled");
            }
        });

    const handleDelete = (id) =>
        toast.promise(deleteNote(id), {
            success: "Successfully deleted note!",
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
                    <h1 className="page-title mb-0">Notes</h1>
                </Col>
                <Col xs="auto">
                    <Link to="/notes/create">
                        <Button variant="primary">New Note</Button>
                    </Link>
                </Col>
            </Row>
            {loadingData ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading...</p>
                </div>
            ) : (
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
                        {data.length
                            ? data.map((row) => (
                                  <tr key={row.id}>
                                      <td>{row.id}</td>
                                      <td title={row.category.name}>{row.category.name}</td>
                                      <td title={row.title}>{row.title}</td>
                                      <td title={row.body}>{row.body}</td>
                                      <td>
                                          <div className="action-buttons">
                                              <Link to={"/notes/" + row.id}>
                                                  <Button variant="outline-primary" size="sm">
                                                      View
                                                  </Button>
                                              </Link>
                                              <Link to={"/notes/edit/" + row.id}>
                                                  <Button variant="outline-warning" size="sm">
                                                      Edit
                                                  </Button>
                                              </Link>
                                              <Button
                                                  variant="outline-danger"
                                                  size="sm"
                                                  onClick={() =>
                                                      handleDelete(row.id)
                                                  }
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
                                        No notes found. Create one to get started!
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default MainTable;
