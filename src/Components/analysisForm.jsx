'use client'
import React,{useState} from "react";

export default function AnalysisForm(){
    const [weights, setWeights] = useState({
        lulc:'', aspect:'', slope:'', chours:'', temperature:'', sdepth:'', stexture:'', elevation:'', rainfall:'', soil:''
    })

    const handleFormChange = (event) => {
        const {name,value} = event.target;
        setWeights(prevWeights => ({ ...prevWeights, [name]: value }));
    }

    
    const submit = (event) => {
        event.preventDefault();
        console.log(weights);
    }

    return(
        <div className="flex flex-col space-y-4 w-full md:ml-6 lg:w-1/3">
            <p className="text-xl font-semibold">Input the respective weights</p>
            <form onSubmit={submit}>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">LULC</label>
                    <input type="number" step="0.1" name="lulc" className="px-4 py-2 border " placeholder="LULC weight" value={weights.lulc} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Slope</label>
                    <input type="number" step="0.1" name="slope" className="px-4 py-2 border " placeholder="Slope weight" value={weights.slope} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Aspect</label>
                    <input type="number" step="0.1" name="aspect" className="px-4 py-2 border " placeholder="Aspect weight" value={weights.aspect} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Chilling Hours</label>
                    <input type="number" step="0.1" name="chours" className="px-4 py-2 border " placeholder="Chilling hours weight" value={weights.chours} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Temperature</label>
                    <input type="number" step="0.1" name="temperature" className="px-4 py-2 border " placeholder="Temperature weight" value={weights.temperature} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Soil Depth</label>
                    <input type="number" step="0.1" name="sdepth" className="px-4 py-2 border " placeholder="Soil Depth weight" value={weights.sdepth} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Soil Texture</label>
                    <input type="number" step="0.1" name="stexture" className="px-4 py-2 border " placeholder="Soil Texture weight" value={weights.stexture} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Elevation</label>
                    <input type="number" step="0.1" name="elevation" className="px-4 py-2 border " placeholder="Elevation weight" value={weights.elevation} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Rainfall</label>
                    <input type="number" step="0.1" name="rainfall" className="px-4 py-2 border " placeholder="Rainfall weight" value={weights.rainfall} onChange={handleFormChange}/>
                </div>
                <div className="flex space-x-4 items-center pb-4 justify-between">
                    <label className="text-lg font-semibold">Soil</label>
                    <input type="number" step="0.1" name="soil" className="px-4 py-2 border " placeholder="Soil weight" value={weights.soil} onChange={handleFormChange}/>
                </div>
                <button type="submit" className="px-4 py-2 text-white bg-black font-semibold text-xl ">Submit&nbsp;Values</button>
            </form>
        </div>
    );
}