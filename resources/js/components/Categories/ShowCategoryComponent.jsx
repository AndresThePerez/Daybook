import Card from "react-bootstrap/Card";
import { useParams } from "react-router";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";

function ShowCategoryComponent() {
    const { id } = useParams();

    const [category, setCategory] = useState([]);

    useEffect(() => {
        async function getCategory() {
            await axios.get("/api/categories/" + id).then((response) => {
                setCategory(response.data);
            });
        }
        getCategory();
    }, []);

    return (
        <Card>
            <Card.Header className="bg-dark text-white">
                Category ID: {category.id}
            </Card.Header>
            <Card.Body>
                <Card.Title className="mb-3">Category Details</Card.Title>
                <Table bordered>
                    <tbody>
                        <tr>
                            <th className="bg-light" style={{ width: "20%" }}>Name</th>
                            <td>{category.name}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">Created At</th>
                            <td>{category.created_at}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">Updated At</th>
                            <td>{category.updated_at}</td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default ShowCategoryComponent;
