import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ShowNoteComponent from "./components/Notes/ShowNoteComponent";
import EditNoteComponent from "./components/Notes/EditNoteComponent";
import CreateNoteComponent from "./components/Notes/CreateNoteComponent";

import HistoryComponent from "./components/History/HistoryComponent";

import CreateCategoryComponent from "./components/Categories/CreateCategoryComponent";
import EditCategoryComponent from "./components/Categories/EditCategoryComponent";
import ShowAllCategoriesComponent from "./components/Categories/ShowAllCategoriesComponent";
import ShowCategoryComponent from "./components/Categories/ShowCategoryComponent";

import Header from "./components/Base/Header";
import ShowAllNotesComponent from "./components/Notes/ShowAllNotesComponent";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
    <Router>
        {/*static Header*/}
        <Header />

        <ToastContainer />

        <Container className="mt-5">
            <Routes>
                {/*This is also the home page */}
                <Route path="/" element={<ShowAllNotesComponent />} />

                {/*As per the requirements, added this extra route. Both point to the same component.*/}
                <Route path="/:id" element={<ShowNoteComponent />} />
                <Route path="/notes/:id" element={<ShowNoteComponent />} />

                {/*Groups the rest of the note components together.*/}
                <Route path="/notes/edit/:id" element={<EditNoteComponent />} />
                <Route path="/notes/create" element={<CreateNoteComponent />} />

                {/*All the Category components can be grouped together.*/}
                <Route
                    path="/categories"
                    element={<ShowAllCategoriesComponent />}
                />
                <Route
                    path="/categories/edit/:id"
                    element={<EditCategoryComponent />}
                />
                <Route
                    path="/categories/:id"
                    element={<ShowCategoryComponent />}
                />
                <Route
                    path="/categories/create"
                    element={<CreateCategoryComponent />}
                />

                {/*Path to show all 'deleted' notes and categories.*/}
                <Route path="/history" element={<HistoryComponent />} />
            </Routes>
        </Container>
    </Router>,

    document.getElementById("root")
);
