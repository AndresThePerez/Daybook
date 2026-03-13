import Card from "react-bootstrap/Card";
import { useParams } from "react-router";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";

function ShowNoteComponent() {
    const { id } = useParams();

    const [note, setNote] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        async function getNote() {
            await axios.get("/api/notes/" + id).then((response) => {
                setNote(response.data);
                setCategory(response.data.category);
            });
        }
        getNote();
    }, []);

    return (
        <Card>
            <Card.Header className="bg-dark text-white">
                Note ID: {note.id}
            </Card.Header>
            <Card.Body>
                <Card.Title className="mb-3">Note Details</Card.Title>
                <Table bordered>
                    <tbody>
                        <tr>
                            <th className="bg-light" style={{ width: "20%" }}>Category</th>
                            <td>{category.name}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">Title</th>
                            <td>{note.title}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">Body</th>
                            <td style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{note.body}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">Created At</th>
                            <td>{note.created_at}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">Updated At</th>
                            <td>{note.updated_at}</td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default ShowNoteComponent;
