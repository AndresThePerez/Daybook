import React, { useEffect, useState } from "react";
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
        <div className="card">
            <div className="card-header bg-ink text-white px-4 py-2">Edit Note</div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="category" className="block mb-1">Choose A Category:</label>
                        <select
                            id="category"
                            aria-label="Default select"
                            required
                            className="w-full border border-hairline rounded px-2 py-1"
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
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="title" className="block mb-1">Note Title:</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Note Title..."
                            required
                            defaultValue={note.title}
                            className="w-full border border-hairline rounded px-2 py-1"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="body" className="block mb-1">Note Body:</label>
                        <textarea
                            id="body"
                            rows={3}
                            required
                            defaultValue={note.body}
                            className="w-full border border-hairline rounded px-2 py-1"
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default EditNoteComponent;
