import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateCategoryComponent() {
    const [name, setName] = useState([]);

    const navigate = new useNavigate();

    const submitCategory = () =>
        new Promise((resolve, reject) => {
            axios
                .post("/api/categories/create", {
                    name: name,
                })
                .then((response) => {
                    resolve();
                    setTimeout(() => navigate(-1), 1000);
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    let handleSubmit = async (e) => {
        e.preventDefault();

        toast.promise(submitCategory, {
            success: "Successfully created category!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <div className="card">
            <div className="card-header bg-ink text-white px-4 py-2">Create Category</div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="block mb-1">Category Name:</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Category Name"
                            required
                            className="w-full border border-hairline rounded px-2 py-1"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreateCategoryComponent;
