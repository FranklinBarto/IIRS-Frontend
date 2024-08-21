import React,{useEffect} from "react";
import {Map,View} from 'ol';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from 'ol/proj';

export default function MapComponent(){
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });
        const map = new Map({
            target: 'map',
            layers: [osmLayer],
            view: new View({
                center: fromLonLat([36.817223, -1.23455]),
                zoom: 5,
            }),
        });
        return () => map.setTarget(null)
    }, []);

    return(
        <div style={{height:'calc(100vh - 80px)', width:'100%'}} id="map" className="map-container" />
    )
}