import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";

function HistoryComponent() {
    const [noteHistory, setNoteHistory] = useState([]);
    const [categoryHistory, setCategoryHistory] = useState([]);

    const noteColumns = [
        { label: "ID", width: "5%" },
        { label: "Category", width: "15%" },
        { label: "Title", width: "20%" },
        { label: "Body", width: "35%" },
        { label: "Deleted At", width: "25%" },
    ];
    const categoryColumns = [
        { label: "ID", width: "15%" },
        { label: "Name", width: "45%" },
        { label: "Deleted At", width: "40%" },
    ];

    useEffect(() => {
        async function getNoteHistory() {
            await axios.get("/api/notes/history").then((response) => {
                setNoteHistory(response.data);
            });
        }
        getNoteHistory();
    }, []);

    useEffect(() => {
        async function getCategoryHistory() {
            await axios.get("/api/categories/history").then((response) => {
                setCategoryHistory(response.data);
            });
        }
        getCategoryHistory();
    }, []);

    return (
        <Row className="g-4">
            <Col lg={7}>
                <div className="content-card">
                    <h2 className="page-title mb-4">Deleted Notes</h2>
                    <Table striped bordered hover className="table-fixed">
                        <colgroup>
                            {noteColumns.map((col) => (
                                <col key={col.label} style={{ width: col.width }} />
                            ))}
                        </colgroup>
                        <thead className="table-dark">
                            <tr>
                                {noteColumns.map((col) => (
                                    <th key={col.label}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {noteHistory.length
                                ? noteHistory.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td title={row.category.name}>{row.category.name}</td>
                                        <td title={row.title}>{row.title}</td>
                                        <td title={row.body}>{row.body}</td>
                                        <td>{row.deleted_at}</td>
                                    </tr>
                                ))
                                : (
                                    <tr>
                                        <td colSpan={noteColumns.length} className="text-center text-muted py-4">
                                            No deleted notes.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </div>
            </Col>

            <Col lg={5}>
                <div className="content-card">
                    <h2 className="page-title mb-4">Deleted Categories</h2>
                    <Table striped bordered hover className="table-fixed">
                        <colgroup>
                            {categoryColumns.map((col) => (
                                <col key={col.label} style={{ width: col.width }} />
                            ))}
                        </colgroup>
                        <thead className="table-dark">
                            <tr>
                                {categoryColumns.map((col) => (
                                    <th key={col.label}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categoryHistory.length
                                ? categoryHistory.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td title={row.name}>{row.name}</td>
                                        <td>{row.deleted_at}</td>
                                    </tr>
                                ))
                                : (
                                    <tr>
                                        <td colSpan={categoryColumns.length} className="text-center text-muted py-4">
                                            No deleted categories.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    );
}

export default HistoryComponent;
