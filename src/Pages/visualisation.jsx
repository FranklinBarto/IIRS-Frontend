import React, { useEffect, useState, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { XYZ } from "ol/source";
import { fromLonLat, transformExtent } from "ol/proj";
import TileWMS from "ol/source/TileWMS";
import menuIcon from "../Assets/menu.png";
import Navbar from "../Components/navbar";

function Visualisation() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [mapLeft, setMapLeft] = useState(null);
  const [mapRight, setMapRight] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  const [basemap, setBasemap] = useState("osm");
  const leftWindowRef = useRef(null);
  const rightWindowRef = useRef(null);
  const [mapServerData, setMapServerData] = useState(null);

  const [legendUrl, setLegendUrl] = useState(null);
  const [legendError, setLegendError] = useState(null);

  // const fetchLegend = () => {
  //   if (selectedLayer) {
  //     const legendUrl = `http://localhost:8182/cgi-bin/mapserv?map=/map/generic.map&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=${selectedLayer.layer}&FORMAT=image/png&SLD_VERSION=1.1.0`;
  //     setLegendUrl(legendUrl);
  //     setLegendError(null); // Reset error state
  //   }
  // };

  const fetchLegend = () => {
    if (selectedLayer) {
      const legendUrl = `http://localhost:8600/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=${selectedLayer.layer}&FORMAT=image/png&SLD_VERSION=1.1.0`;
      setLegendUrl(legendUrl);
      setLegendError(null); // Reset error state
    }
  };

  useEffect(() => {
    fetchLegend();
  }, [selectedLayer]);

  function Legend({ url, error }) {
    if (error) {
      return <div className="legend error">Error loading legend: {error}</div>;
    }
  
    if (!url) return null;
  
    return (
      <div className="legend">
        <h3>Legend</h3>
        <img 
          src={url} 
          alt="Legend" 
          onError={() => setLegendError("Failed to load legend image")}
        />
      </div>
    );
  }


  const getLayers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8600/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities"
      );
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  
      const layers = xmlDoc.getElementsByTagName("Layer");
  
      let Arr = [];
      Array.from(layers).forEach((item) => {
        let fields = {};
        fields.layer = item.getElementsByTagName("Name")[0]?.textContent;
        fields.title = item.getElementsByTagName("Title")[0]?.textContent;
        Arr.push({ fields: fields });
      });
      return Arr;
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const fetchLayers = async () => {
      const layersData = await getLayers();
      setMapServerData(layersData);
    };

    fetchLayers();
  }, []);

  useEffect(() => {
  
    const createMap = (target) =>
      new Map({
        target,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              attributions:
                'Tiles &copy; <a href="https://www.esri.com/en-us/home">ESRI</a>',
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

    ["movestart", "moveend", "pointerdrag", "change:resolution"].forEach(
      (eventName) => {
        mapL.on(eventName, syncLeftToRight);
        mapR.on(eventName, syncRightToLeft);
      }
    );

    const handleWheel = (event, sourceMap, targetMap) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -1 : 1;
      const view = sourceMap.getView();
      view.animate({
        zoom: view.getZoom() + delta,
        duration: 250,
      });
      syncMaps(sourceMap, targetMap);
    };

    leftWindowRef.current.addEventListener("wheel", (e) =>
      handleWheel(e, mapL, mapR)
    );
    rightWindowRef.current.addEventListener("wheel", (e) =>
      handleWheel(e, mapR, mapL)
    );

    return () => {
      ["movestart", "moveend", "pointerdrag", "change:resolution"].forEach(
        (eventName) => {
          mapL.un(eventName, syncLeftToRight);
          mapR.un(eventName, syncRightToLeft);
        }
      );
      leftWindowRef.current.removeEventListener("wheel", handleWheel);
      rightWindowRef.current.removeEventListener("wheel", handleWheel);
      mapL.setTarget(null);
      mapR.setTarget(null);
    };
  }, []);

 
  const getLayerExtent = async (url) => {
    try {
      // Fetch the GetCapabilities document
      const response = await fetch(
        `${url}/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`
      );
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  
      // Extract extents for the specific layer
      const layers = xmlDoc.getElementsByTagName("Layer");
      const layer = Array.from(layers).find((l) => {
        const name = l.getElementsByTagName("Name")[0]?.textContent;
        return name === selectedLayer.layer;
      });
  
      if (layer) {
        console.log(layer)
        const bbox = layer.getElementsByTagName("BoundingBox")[0];
        if (bbox) {
          return {
            minx: parseFloat(bbox.getAttribute("minx")),
            miny: parseFloat(bbox.getAttribute("miny")),
            maxx: parseFloat(bbox.getAttribute("maxx")),
            maxy: parseFloat(bbox.getAttribute("maxy")),
          };
        }
      }
  
      return null;
    } catch (error) {
      console.error("Error fetching or parsing GetCapabilities:", error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedLayer && mapRight) {
      // const wmsLayer = new TileLayer({
      //   source: new TileWMS({
      //     url: "http://localhost:8182/cgi-bin/mapserv",
      //     params: {
      //       map: "/map/generic.map",
      //       SERVICE: "WMS",
      //       VERSION: "1.3.0",
      //       REQUEST: "GetMap",
      //       LAYERS: selectedLayer.layer,
      //       STYLES: "",
      //       // 'STYLES': `sld:${sldUrl}`, // Apply SLD
      //       CRS: "EPSG:4326",
      //       FORMAT: "image/png",
      //       TRANSPARENT: true,
      //     },
      //     serverType: "mapserver",
      //   }),
      // });

      const wmsLayer = new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8600/geoserver/wms",
          params: {
            LAYERS: selectedLayer.layer,
            STYLES: "",
            CRS: "EPSG:4326",
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
      });

      // Usage
      const url = "http://localhost:8600/geoserver";
      
      getLayerExtent(url).then((extent) => {
        if (extent) {
          console.log("Layer extent:", extent);
          let extArr = [extent.minx, extent.miny, extent.maxx, extent.maxy];
      
          // Transform the extent from EPSG:4326 (WGS84) to EPSG:3857 (Spherical Mercator)
          const extent3857 = transformExtent(extArr, "EPSG:4326", "EPSG:3857");
      
          // Fit the map views to the transformed extent
          mapRight.getView().fit(extent3857, { size: mapRight.getSize() });
          mapLeft.getView().fit(extent3857, { size: mapLeft.getSize() });
        } else {
          console.error("Failed to retrieve layer extent");
        }
      });

      mapRight.addLayer(wmsLayer);
      return () => mapRight.removeLayer(wmsLayer);
    }
  }, [selectedLayer, mapRight]);

  const handleSelectionChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedLayer(
      selectedIndex > 0?{
      layer: `${mapServerData[selectedIndex - 1].fields.layer}`,
      title: `${mapServerData[selectedIndex - 1].fields.title}`,}
      :null
    );
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
      return {
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
      };
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
    const containerRect = document
      .getElementById("container")
      .getBoundingClientRect();

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
    const draggableButton = document.getElementById("mBurger");
    const container = document.getElementById("container");

    draggableButton.addEventListener("mousedown", handleStart);
    draggableButton.addEventListener("touchstart", handleStart);
    container.addEventListener("mousemove", handleMove);
    container.addEventListener("touchmove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);

    return () => {
      draggableButton.removeEventListener("mousedown", handleStart);
      draggableButton.removeEventListener("touchstart", handleStart);
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  return (
    <>
      <Navbar />
      <section id="container" className="mapFrame">
        {
          selectedLayer && (
            <div className="title">
              <span>Active Dataset</span>
              <h1>{selectedLayer?.title}</h1>
              <h1>{selectedLayer?.layer}</h1>
            </div>
          )
        }


        <Legend url={legendUrl} error={legendError} />
        
        <div className="navigation">
          <p>Select a dataset of interest below</p>
          <select id="selectBox" onChange={handleSelectionChange}>
            <option value="">Select a Dataset</option>
            {mapServerData && mapServerData.map((item, index) => (
              <option key={index} value={item.fields.layer}>
                { item.fields.title }
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
            position: "absolute",
            left: `${buttonPosition.x}%`,
            top: `${buttonPosition.y}%`,
            transform: "translate(-50%, -50%)",
            cursor: "move",
            zIndex: 1000,
            background: isDragging
              ? "rgba(0, 255, 0, 0.7)"
              : "rgba(255, 0, 0, 0.9)",
          }}
        />
        <select
          id="basemapSelect"
          value={basemap}
          onChange={handleBasemapChange}
        >
          <option value="osm">OpenStreetMap</option>
          <option value="arcgis">ArcGIS Satellite</option>
        </select>

        <div
          id="leftSplit"
          className="left"
          style={{ width: `${buttonPosition.x}%` }}
        >
          <div ref={leftWindowRef} id="map" className="map"></div>
        </div>
        <div id="rightSplit" className="right">
          <div ref={rightWindowRef} id="map1" className="map"></div>
        </div>

        <div className="zoomControls">
          <button id="zoomInButton" onClick={() => handleZoom(1)}>
            +
          </button>
          <button id="zoomOutButton" onClick={() => handleZoom(-1)}>
            -
          </button>
        </div>
      </section>
    </>
  );
}

export default Visualisation;
