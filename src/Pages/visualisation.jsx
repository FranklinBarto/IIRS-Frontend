import React, { useEffect, useState, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import menuIcon from '../Assets/menu.png';

const sampleData = [
  {
    fields: {
      Title: "Flood Event in Nairobi",
      Location: "Nairobi, Kenya",
      Summary: "Severe flooding occurred in Nairobi causing major disruptions.",
      Flooding_date: "2024-08-15",
      Products: "Flooding:Kenya_Floods_30m_Buffer_2024"
    }
  },
  {
    fields: {
      Title: "Flood Event in Mombasa",
      Location: "Mombasa, Kenya",
      Summary: "Coastal flooding affected large areas of Mombasa.",
      Flooding_date: "2024-07-22",
      Products: "flood_data_mombasa"
    }
  },
  {
    fields: {
      Title: "Flood Event in Kisumu",
      Location: "Kisumu, Kenya",
      Summary: "Heavy rains caused flooding in Kisumu and surrounding areas.",
      Flooding_date: "2024-06-30",
      Products: "flood_data_kisumu"
    }
  },
  {
    fields: {
      Title: "Flood Event in Eldoret",
      Location: "Eldoret, Kenya",
      Summary: "Eldoret experienced flash floods after unexpected heavy rains.",
      Flooding_date: "2024-05-12",
      Products: "flood_data_eldoret"
    }
  }
];

function Visualisation() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [mapLeft, setMapLeft] = useState(null);
  const [mapRight, setMapRight] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  const [basemap, setBasemap] = useState('osm');
  const leftWindowRef = useRef(null);
  const rightWindowRef = useRef(null);

  useEffect(() => {
    // const createMap = (target) => new Map({
    //   target,
    //   layers: [new TileLayer({ source: new OSM() })],
    //   view: new View({
    //     center: fromLonLat([37.906, 0.0236]),
    //     zoom: 6,
    //   }),
    // });
    const createMap = (target) => new Map({
        target,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              attributions: 'Tiles &copy; <a href="https://www.esri.com/en-us/home">ESRI</a>',
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([37.906, 0.0236]), // Centered on Kenya
          zoom: 6,
        }),
        controls: [],
      });

    const mapL = createMap(leftWindowRef.current);
    const mapR = createMap(rightWindowRef.current);

    setMapLeft(mapL);
    setMapRight(mapR);

    const syncMaps = (sourceMap, targetMap) => {
      const sourceView = sourceMap.getView();
      const targetView = targetMap.getView();
      
      if (!targetView.getAnimating()) {
        targetView.setCenter(sourceView.getCenter());
        targetView.setZoom(sourceView.getZoom());
        targetView.setRotation(sourceView.getRotation());
      }
    };

    const syncLeftToRight = () => syncMaps(mapL, mapR);
    const syncRightToLeft = () => syncMaps(mapR, mapL);

    ['movestart', 'moveend', 'pointerdrag', 'change:resolution'].forEach(eventName => {
      mapL.on(eventName, syncLeftToRight);
      mapR.on(eventName, syncRightToLeft);
    });

    const handleWheel = (event, sourceMap, targetMap) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -1 : 1;
      const view = sourceMap.getView();
      view.animate({
        zoom: view.getZoom() + delta,
        duration: 250
      });
      syncMaps(sourceMap, targetMap);
    };

    leftWindowRef.current.addEventListener('wheel', (e) => handleWheel(e, mapL, mapR));
    rightWindowRef.current.addEventListener('wheel', (e) => handleWheel(e, mapR, mapL));

    return () => {
      ['movestart', 'moveend', 'pointerdrag', 'change:resolution'].forEach(eventName => {
        mapL.un(eventName, syncLeftToRight);
        mapR.un(eventName, syncRightToLeft);
      });
      leftWindowRef.current.removeEventListener('wheel', handleWheel);
      rightWindowRef.current.removeEventListener('wheel', handleWheel);
      mapL.setTarget(null);
      mapR.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (selectedLayer && mapRight) {
      const wmsLayer = new TileLayer({
        source: new TileWMS({
          url: 'http://localhost:8182/cgi-bin/mapserv',
          params: {
            map: '/map/generic.map',
            SERVICE: 'WMS',
            VERSION: '1.3.0',
            REQUEST: 'GetMap',
            LAYERS: 'GTOPO30_SAMPLE',
            STYLES: '',
            CRS: 'EPSG:4326',
            FORMAT: 'image/png',
            TRANSPARENT: true,
          },
          serverType: 'mapserver',
        }),
      });
  
      mapRight.addLayer(wmsLayer);
      return () => mapRight.removeLayer(wmsLayer);
    }
  }, [selectedLayer, mapRight]);

  const handleSelectionChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedLayer(selectedIndex > 0 ? `${sampleData[selectedIndex - 1].fields.Products}` : null);
  };

  const handleZoom = (delta) => {
    if (mapLeft && mapRight) {
      const newZoom = mapLeft.getView().getZoom() + delta;
      mapLeft.getView().animate({ zoom: newZoom, duration: 250 });
      mapRight.getView().animate({ zoom: newZoom, duration: 250 });
    }
  };

  const getClientCoordinates = (e) => {
    if (e.touches && e.touches.length) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    } else if (e.changedTouches && e.changedTouches.length) {
      return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
    } else {
      return { clientX: e.clientX, clientY: e.clientY };
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    
    const { clientX, clientY } = getClientCoordinates(e);
    const containerRect = document.getElementById('container').getBoundingClientRect();
    
    const newX = ((clientX - containerRect.left) / containerRect.width) * 100;
    const newY = ((clientY - containerRect.top) / containerRect.height) * 100;
    
    setButtonPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (mapLeft && mapRight) {
      mapLeft.updateSize();
      mapRight.updateSize();
    }
  };

  const handleBasemapChange = (e) => {
    setBasemap(e.target.value);
  };

  useEffect(() => {
    const draggableButton = document.getElementById('mBurger');
    const container = document.getElementById('container');

    draggableButton.addEventListener('mousedown', handleStart);
    draggableButton.addEventListener('touchstart', handleStart);
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      draggableButton.removeEventListener('mousedown', handleStart);
      draggableButton.removeEventListener('touchstart', handleStart);
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <section id="container" className="mapFrame">
      <div className="title">
        <span>Kenya</span>
        <h1>Data Visualization</h1>
      </div>
      <div className="navigation">
        <p>Select a dataset of interest below</p>
        <select id="selectBox" onChange={handleSelectionChange}>
          <option value=''>Select a Dataset</option>
          {sampleData.map((item, index) => (
            <option key={index} value={index}>
              {item.fields.Title}
            </option>
          ))}
        </select>
      </div>
      <div className="description" id="displayArea"></div>

      <img 
        className="burger" 
        id="mBurger" 
        src={menuIcon} 
        alt="burger"
        style={{
          position: 'absolute',
          left: `${buttonPosition.x}%`,
          top: `${buttonPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          cursor: 'move',
          zIndex: 1000,
          background: isDragging? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 0, 0, 0.9)',
        }}
      />
        <select id="basemapSelect" value={basemap} onChange={handleBasemapChange}>
          <option value="osm">OpenStreetMap</option>
          <option value="arcgis">ArcGIS Satellite</option>
        </select>

      <div id="leftSplit" className="left" style={{ width: `${buttonPosition.x}%` }}>
        <div ref={leftWindowRef} id="map" className="map"></div>
      </div>
      <div id="rightSplit" className="right">
        <div ref={rightWindowRef} id="map1" className="map"></div>
      </div>

      <div className="zoomControls">
        <button id="zoomInButton" onClick={() => handleZoom(1)}>+</button>
        <button id="zoomOutButton" onClick={() => handleZoom(-1)}>-</button>
      </div>
    </section>
  );
}

export default Visualisation;