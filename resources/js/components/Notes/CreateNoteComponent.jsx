import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateNoteComponent() {
    //categories used for selection.
    const [categories, setCategories] = useState([]);

    //the attributes we're changing.
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("");

    const navigate = new useNavigate();

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

    const submitCategory = () =>
        new Promise((resolve, reject) => {
            axios
                .post("/api/notes/create", {
                    title: title,
                    body: body,
                    category_id: category,
                })
                .then((response) => {
                    resolve();
                    setTimeout(() => navigate(-1), 1000);
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    //what runs on load
    useEffect(() => {
        toast.promise(getCategories, {
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    }, []);

    //handle submit
    let handleSubmit = async (e) => {
        e.preventDefault();
        toast.promise(submitCategory, {
            success: "Successfully created note!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <div className="card">
            <div className="card-header bg-ink text-white px-4 py-2">Create Note</div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="category" className="block mb-1">Choose A Category:</label>
                        <select
                            id="category"
                            aria-label="Default select"
                            required
                            className="w-full border border-hairline rounded px-2 py-1"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Please select a Category...</option>
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
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

export default CreateNoteComponent;
