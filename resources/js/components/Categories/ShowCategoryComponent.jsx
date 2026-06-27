import { useParams } from "react-router";
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
        <div className="card">
            <div className="card-header bg-ink text-white px-4 py-2">
                Category ID: {category.id}
            </div>
            <div className="card-body p-4">
                <h5 className="card-title mb-3">Category Details</h5>
                <table className="w-full border-collapse border border-hairline">
                    <tbody>
                        <tr className="border-b border-hairline">
                            <th className="bg-sunken px-3 py-2 text-left" style={{ width: "20%" }}>Name</th>
                            <td className="px-3 py-2">{category.name}</td>
                        </tr>
                        <tr className="border-b border-hairline">
                            <th className="bg-sunken px-3 py-2 text-left">Created At</th>
                            <td className="px-3 py-2">{category.created_at}</td>
                        </tr>
                        <tr>
                            <th className="bg-sunken px-3 py-2 text-left">Updated At</th>
                            <td className="px-3 py-2">{category.updated_at}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShowCategoryComponent;
