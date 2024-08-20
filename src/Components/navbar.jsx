import React from "react";

export default function Navbar(){
    return (
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div className="text-2xl font-bold">IIRS Portal</div>
            <nav>
                <ul className="flex space-x-4 lg:space-x-6">
                    <li class="text-xl font-semibold tracking-wide">
                        <a href={`/`}>Home</a>
                    </li>
                    <li class="text-xl font-semibold tracking-wide">
                        <a href={`/visualization`}>View&nbsp;Data</a>
                    </li>
                    <li class="text-xl font-semibold tracking-wide">
                        <a href={`/analysis`}>AHP&nbsp;Tool</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}