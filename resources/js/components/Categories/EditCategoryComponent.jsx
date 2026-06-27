import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditCategoryComponent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState([]);
    const [name, setName] = useState([]);

    //gotta make these promises so that toasts work.
    const getCategory = () =>
        new Promise((resolve, reject) => {
            axios
                .get("/api/categories/" + id)
                .then((response) => {
                    setCategory(response.data);
                    setName(response.data.name);
                    resolve();
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    useEffect(() => {
        toast.promise(getCategory, {
            error: "Error retrieving categories",
        });
    }, []);

    const editCategoriesSubmit = () =>
        new Promise((resolve, reject) => {
            axios
                .put("/api/categories/edit/" + id, {
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
        toast.promise(editCategoriesSubmit, {
            success: "Successfully modified category!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    };

    return (
        <div className="card">
            <div className="card-header bg-ink text-white px-4 py-2">Edit Category</div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="block mb-1">Name:</label>
                        <input
                            id="title"
                            type="text"
                            required
                            defaultValue={category.name}
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

export default EditCategoryComponent;
