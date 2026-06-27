import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <nav className="bg-white py-3">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="font-bold text-lg">
                    Daybook
                </Link>
                <div className="flex gap-4">
                    <Link to="/">Notes</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/history">History</Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
