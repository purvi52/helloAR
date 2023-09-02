// src/components/Globe.js
import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as THREE from 'three';
const API_KEY = `f46ca0741e3c5db72da19c1d8b17cc69`;
const Globe = ({ selectedCity,units }) => {
  const globeRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    // Create a WebGL renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    globeRef.current.appendChild(renderer.domElement);

    // Create a globe
    const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({ 
        color:0xff0000
        // map: new THREE.TextureLoader().load('./assets/download.jpeg') 
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Create a marker
    const markerGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(0, 0, 1); // Position the marker in front of the globe

    scene.add(marker);
    console.log(marker);

    window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

     const cityToCoordinates=async()=> {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
          )
          
          if (response.status === 200) {
            const latitude = response.data.coord.lat;
            const longitude = response.data.coord.lon;
            console.log("lat:"+latitude);
            console.log("long:"+longitude);
            marker.position.set(
                Math.sin(longitude) * Math.cos(latitude),
                Math.sin(latitude),
                Math.cos(longitude) * Math.cos(latitude)
              );
            // return { latitude, longitude };
          } else {
            throw new Error('Error retrieving coordinates from  API');
          }
        } catch (error) {
          console.error('Error converting city to coordinates:', error);
          return null; 
        }
      };
    cityToCoordinates();
        const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize',null);
    };
  }, []);

  return (
    <div className="globe-container" ref={globeRef}>
      {/* The 3D globe will be rendered here */}
    </div>
  );
};

export default Globe;

