import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShowAllCategoriesComponent() {
    const columns = [
        { label: "ID", width: "10%" },
        { label: "Name", width: "55%" },
        { label: "Action", width: "35%" },
    ];

    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        toast.promise(getCategories, {
            error: "Error retrieving categories",
        });
    }, []);

    const deleteCategory = (id) =>
        new Promise((resolve, reject) => {
            if (confirm("Do you really want to delete this category?")) {
                axios
                    .delete("/api/categories/delete/" + id)
                    .then((response) => {
                        getCategories();
                        resolve();
                    });
            } else {
                reject("Request cancelled");
            }
        });

    const handleDelete = (id) =>
        toast.promise(deleteCategory(id), {
            success: "Successfully deleted category!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });

    return (
        <div className="content-card">
            <div className="flex items-center mb-4">
                <h1 className="page-title mb-0 flex-1">Categories</h1>
                <div>
                    <Link to="/categories/create">
                        <button type="button" className="btn-primary">New Category</button>
                    </Link>
                </div>
            </div>
            <table className="table-fixed w-full">
                <colgroup>
                    {columns.map((col) => (
                        <col key={col.label} style={{ width: col.width }} />
                    ))}
                </colgroup>
                <thead className="bg-ink text-white">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.label} className="px-3 py-2 text-left">{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.length
                        ? categories.map((row) => (
                            <tr key={row.id} className="border-b border-hairline">
                                <td className="px-3 py-2">{row.id}</td>
                                <td className="px-3 py-2" title={row.name}>{row.name}</td>
                                <td className="px-3 py-2">
                                    <div className="action-buttons flex gap-1">
                                        <Link to={"/categories/" + row.id}>
                                            <button type="button" className="btn-sm btn-outline-primary">View</button>
                                        </Link>
                                        <Link to={"/categories/edit/" + row.id}>
                                            <button type="button" className="btn-sm btn-outline-warning">Edit</button>
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        : (
                            <tr>
                                <td colSpan={columns.length} className="text-center text-ink-soft py-4">
                                    No categories found. Create one to get started!
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    );
}

export default ShowAllCategoriesComponent;
