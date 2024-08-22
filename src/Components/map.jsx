// import React,{useEffect, useState} from "react";
// import {Map,View} from 'ol';
// import OSM from 'ol/source/OSM';
// import 'ol/ol.css';
// import TileLayer from "ol/layer/Tile";
// import { fromLonLat } from 'ol/proj';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import axios from "axios";

// export default function MapComponent(){
//     //form functions
//     const [weights, setWeights] = useState({
//         lulc:'0', aspect:'0', slope:'0', chours:'0', temperature:'0', sdepth:'0', stexture:'0', elevation:'0', rainfall:'0', soil:'0'
//     })


//     const vectorSource = new VectorSource({
//         features: new GeoJSON().readFeatures(geojson, {
//             featureProjection: 'EPSG:3857'
//         })
//     });

//     const handleInputChange = (event) => {
//         const {name,value} = event.target;
//         setWeights(prevWeights => ({ ...prevWeights, [name]: value }));
//     }

    
//     const submit = async (event) => {
//         event.preventDefault();
//         console.log(weights);
//         try {
//             const response = await fetch('/api/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(weights),
//             });
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const geojsonData = await response.json();
//             setWeights(prev => ({ ...prev, lulc: '0', aspect: '0', slope: '0', chours: '0', temperature: '0', sdepth: '0', stexture: '0', elevation: '0', rainfall: '0', soil: '0' }));
//         } catch (error) {
//             console.error("There was an error fetching the GeoJSON data!", error);
//         }
//     };

//     // map functions
//     useEffect(() => {
//         const osmLayer = new TileLayer({
//             preload: Infinity,
//             source: new OSM(),
//         });
        

//         const vectorLayer = new VectorLayer({
//             source: vectorSource
//         });

//         const map = new Map({
//             target: 'map',
//             layers: [osmLayer,vectorLayer],
//             view: new View({
//                 center: fromLonLat([36.817223, -1.23455]),
//                 zoom: 5,
//             }),
//         });
//         return () => map.setTarget(null)
//     }, []);

//     return(
//         <div style={{height:'calc(100vh - 80px)', width:'100%'}} id="map" className="map-container">
//             <form onSubmit={submit} style={{height:'calc(80vh - 80px)'}} className="overlay-form">
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">LULC</label>
//                 <input type="number" step="0.1" min="0" name="lulc" className="px-4 py-2 border " placeholder="LULC weight" value={formData.lulc} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Slope</label>
//                 <input type="number" step="0.1" min="0" name="slope" className="px-4 py-2 border " placeholder="Slope weight" value={formData.slope} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Aspect</label>
//                 <input type="number" step="0.1" min="0" name="aspect" className="px-4 py-2 border " placeholder="Aspect weight" value={formData.aspect} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Chilling Hours</label>
//                 <input type="number" step="0.1" min="0" name="chours" className="px-4 py-2 border " placeholder="Chilling hours weight" value={formData.chours} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Temperature</label>
//                 <input type="number" step="0.1" min="0" name="temperature" className="px-4 py-2 border " placeholder="Temperature weight" value={formData.temperature} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Soil Depth</label>
//                 <input type="number" step="0.1" min="0" name="sdepth" className="px-4 py-2 border " placeholder="Soil Depth weight" value={formData.sdepth} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Soil Texture</label>
//                 <input type="number" step="0.1" min="0" name="stexture" className="px-4 py-2 border " placeholder="Soil Texture weight" value={formData.stexture} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Elevation</label>
//                 <input type="number" step="0.1" min="0" name="elevation" className="px-4 py-2 border " placeholder="Elevation weight" value={formData.elevation} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Rainfall</label>
//                 <input type="number" step="0.1" min="0" name="rainfall" className="px-4 py-2 border " placeholder="Rainfall weight" value={formData.rainfall} onChange={handleInputChange}/>
//             </div>
//             <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
//                 <label className="text-lg font-semibold">Soil</label>
//                 <input type="number" step="0.1" min="0" name="soil" className="px-4 py-2 border " placeholder="Soil weight" value={formData.soil} onChange={handleInputChange}/>
//             </div>
//             <button type="submit" className="px-4 py-2 text-white bg-black font-semibold text-xl ">Submit&nbsp;Values</button>
//             </form>
//         </div>
//     )
// }

import React, { useEffect, useRef, useState } from 'react';

import 'ol/ol.css';

import Map from 'ol/Map';

import View from 'ol/View';

import TileLayer from 'ol/layer/Tile';

import VectorLayer from 'ol/layer/Vector';

import VectorSource from 'ol/source/Vector';

import GeoJSON from 'ol/format/GeoJSON';

import OSM from 'ol/source/OSM';

import { Style, Fill, Stroke, Circle } from 'ol/style';
import { fromLonLat } from 'ol/proj';

 

function MapComponent () {

  const mapRef = useRef();

  const [map, setMap] = useState(null);
  
  const [formData, setFormData] = useState({
    lulc:'0', aspect:'0', slope:'0', chillhour:'0', temperature:'0', soildepth:'0', texture:'0', elevation:'0', rainfall:'0'
})
 

  useEffect(() => {

    const initialMap = new Map({

      target: mapRef.current,

      layers: [

        new TileLayer({

          source: new OSM()

        })

      ],

      view: new View({

        center: fromLonLat([80.03737, 29.2876]),

        zoom: 8

      })

    });

 

    setMap(initialMap);

 

    return () => initialMap.setTarget(undefined);

  }, []);

 

  const handleInputChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

 

  const handleSubmit = async (e) => {

    e.preventDefault();

 

    try {

      const response = await fetch('/api/', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify(formData),

      });

 

      if (!response.ok) {

        throw new Error(`HTTP error! status: ${response.status}`);

      }

 

      const geojsonData = await response.json();
      console.log(geojsonData.suitability_map);
     

      // Remove existing vector layers

      map.getLayers().getArray()

        .filter(layer => layer instanceof VectorLayer)

        .forEach(layer => map.removeLayer(layer));

     const vectorSource = new VectorSource({
 
       features: new GeoJSON().readFeatures(JSON.parse(geojsonData.suitability_map), {
 
         featureProjection: 'EPSG:7755'
 
       })
 
     });
 
  
 
     // Create a color scale function
 
     const getColor = (value) => {
 
       if (value <= 2.0) return 'rgb(255, 0, 0)';
 
       if (value <= 2.5) return 'rgb(255, 128, 0)';
 
       if (value <= 3.0) return 'rgb(255, 255, 0)';
 
       return 'rgb(0, 255, 0)';
 
     };
 
  
 
     const vectorLayer = new VectorLayer({
 
       source: vectorSource,
 
       style: (feature) => {
 
         return new Style({
 
           fill: new Fill({
 
             color: getColor(feature.get('value'))
 
           }),
 
           stroke: new Stroke({
 
             color: 'black',
 
             width: 1
 
           })
 
         });
 
       }
 
     });
 
  
 

      map.addLayer(vectorLayer);

      map.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });

    } catch (error) {

      console.error('Error fetching GeoJSON:', error);

    }

  };

 

  return (

    <div>

    <form onSubmit={handleSubmit} style={{height:'calc(80vh - 80px)'}} className="overlay-form">
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">LULC</label>
                    <input type="number" step="0.1" min="0" name="lulc" className="px-4 py-2 border " placeholder="LULC weight" value={formData.lulc} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Slope</label>
                    <input type="number" step="0.1" min="0" name="slope" className="px-4 py-2 border " placeholder="Slope weight" value={formData.slope} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Aspect</label>
                    <input type="number" step="0.1" min="0" name="aspect" className="px-4 py-2 border " placeholder="Aspect weight" value={formData.aspect} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Chilling Hours</label>
                    <input type="number" step="0.1" min="0" name="chillhour" className="px-4 py-2 border " placeholder="Chilling hours weight" value={formData.chillhour} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Temperature</label>
                    <input type="number" step="0.1" min="0" name="temperature" className="px-4 py-2 border " placeholder="Temperature weight" value={formData.temperature} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Soil Depth</label>
                    <input type="number" step="0.1" min="0" name="soildepth" className="px-4 py-2 border " placeholder="Soil Depth weight" value={formData.soildepth} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Soil Texture</label>
                    <input type="number" step="0.1" min="0" name="texture" className="px-4 py-2 border " placeholder="Soil Texture weight" value={formData.texture} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Elevation</label>
                    <input type="number" step="0.1" min="0" name="elevation" className="px-4 py-2 border " placeholder="Elevation weight" value={formData.elevation} onChange={handleInputChange}/>
                </div>
                <div className="flex flex-col space-y-2 items-left pb-4 justify-between">
                    <label className="text-lg font-semibold">Rainfall</label>
                    <input type="number" step="0.1" min="0" name="rainfall" className="px-4 py-2 border " placeholder="Rainfall weight" value={formData.rainfall} onChange={handleInputChange}/>
                </div>
                <button type="submit" className="px-4 py-2 text-white bg-black font-semibold text-xl ">Submit&nbsp;Values</button>
                </form>
      <div ref={mapRef} style={{height:'calc(100vh - 80px)', width:'100%'}} className="map-container"></div>

    </div>

  );

}

 

export default MapComponent;