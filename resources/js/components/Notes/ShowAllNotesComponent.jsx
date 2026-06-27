import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainTable() {
    const [loadingData, setLoadingData] = useState(true);

    const columns = [
        { label: "ID", width: "5%" },
        { label: "Category", width: "15%" },
        { label: "Title", width: "20%" },
        { label: "Body", width: "40%" },
        { label: "Action", width: "20%" },
    ];

    const [data, setData] = useState([]);
    //gotta make these promises so that toasts work.
    const getNotes = () =>
        new Promise((resolve, reject) => {
            axios
                .get("/api/notes/showAll")
                .then((response) => {
                    setData(response.data);
                    setLoadingData(false);
                    resolve();
                })
                .catch((err) => {
                    reject(err.response.data.message);
                });
        });

    useEffect(() => {
        toast.promise(getNotes, {
            error: {
                render({ data }) {
                    return data;
                },
            },
        });
    }, []);

    const deleteNote = (id) =>
        new Promise((resolve, reject) => {
            if (confirm("Do you really want to delete this note?")) {
                axios.delete("/api/notes/delete/" + id).then((response) => {
                    getNotes();
                    resolve();
                });
            } else {
                reject("Request cancelled");
            }
        });

    const handleDelete = (id) =>
        toast.promise(deleteNote(id), {
            success: "Successfully deleted note!",
            error: {
                render({ data }) {
                    return data;
                },
            },
        });

    return (
        <div className="content-card">
            <div className="flex items-center mb-4">
                <h1 className="page-title mb-0 flex-1">Notes</h1>
                <div>
                    <Link to="/notes/create">
                        <button type="button" className="btn-primary">New Note</button>
                    </Link>
                </div>
            </div>
            {loadingData ? (
                <div className="text-center py-5">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full" role="status" aria-label="loading" />
                    <p className="mt-2 text-ink-soft">Loading...</p>
                </div>
            ) : (
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
                        {data.length
                            ? data.map((row) => (
                                  <tr key={row.id} className="border-b border-hairline">
                                      <td className="px-3 py-2">{row.id}</td>
                                      <td className="px-3 py-2" title={row.category.name}>{row.category.name}</td>
                                      <td className="px-3 py-2" title={row.title}>{row.title}</td>
                                      <td className="px-3 py-2" title={row.body}>{row.body}</td>
                                      <td className="px-3 py-2">
                                          <div className="action-buttons flex gap-1">
                                              <Link to={"/notes/" + row.id}>
                                                  <button type="button" className="btn-sm btn-outline-primary">View</button>
                                              </Link>
                                              <Link to={"/notes/edit/" + row.id}>
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
                                        No notes found. Create one to get started!
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MainTable;
