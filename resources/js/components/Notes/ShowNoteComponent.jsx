import { useParams } from "react-router";
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
        <div className="card">
            <div className="card-header bg-ink text-white px-4 py-2">
                Note ID: {note.id}
            </div>
            <div className="card-body p-4">
                <h5 className="card-title mb-3">Note Details</h5>
                <table className="w-full border-collapse border border-hairline">
                    <tbody>
                        <tr className="border-b border-hairline">
                            <th className="bg-sunken px-3 py-2 text-left" style={{ width: "20%" }}>Category</th>
                            <td className="px-3 py-2">{category.name}</td>
                        </tr>
                        <tr className="border-b border-hairline">
                            <th className="bg-sunken px-3 py-2 text-left">Title</th>
                            <td className="px-3 py-2">{note.title}</td>
                        </tr>
                        <tr className="border-b border-hairline">
                            <th className="bg-sunken px-3 py-2 text-left">Body</th>
                            <td className="px-3 py-2" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{note.body}</td>
                        </tr>
                        <tr className="border-b border-hairline">
                            <th className="bg-sunken px-3 py-2 text-left">Created At</th>
                            <td className="px-3 py-2">{note.created_at}</td>
                        </tr>
                        <tr>
                            <th className="bg-sunken px-3 py-2 text-left">Updated At</th>
                            <td className="px-3 py-2">{note.updated_at}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShowNoteComponent;
