import React from "react";

export default function Navbar(){
    return (
        <header className="p-4 flex justify-between items-center z-10 bg-gray-100 w-full">
            <div className="text-2xl font-bold">Kenya - IIRS Portal</div>
            <nav>
                <ul className="flex space-x-4 lg:space-x-6">
                    <li className="text-xl font-semibold tracking-wide">
                        <a href={`/`}>Home</a>
                    </li>
                    <li className="text-xl font-semibold tracking-wide">
                        <a href={`/visualization`}>View&nbsp;Data</a>
                    </li>
                    <li className="text-xl font-semibold tracking-wide">
                        <a href={`/suitability`}>AHP&nbsp;Tool</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}