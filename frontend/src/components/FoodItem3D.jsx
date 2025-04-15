import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Component to display a 3D representation of a food item
export default function FoodItem3D({ itemName, size = 150 }) {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(size, size);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Create a 3D object based on the item name
    let geometry;
    let material;
    let mesh;
    
    // Different shapes for different food items
    switch(itemName.toLowerCase()) {
      case 'ganthiya':
        geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
        material = new THREE.MeshStandardMaterial({ color: 0xf5c242 });
        break;
      case 'chevda':
        geometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
        material = new THREE.MeshStandardMaterial({ color: 0xf9e076 });
        break;
      case 'sakarpara':
        geometry = new THREE.BoxGeometry(1, 1, 0.2);
        material = new THREE.MeshStandardMaterial({ color: 0xe8c39e });
        break;
      case 'sev':
        // Create multiple thin cylinders for sev
        geometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        material = new THREE.MeshStandardMaterial({ color: 0xf5a742 });
        mesh = new THREE.Group();
        
        for (let i = 0; i < 20; i++) {
          const sevPiece = new THREE.Mesh(geometry, material);
          sevPiece.position.x = Math.random() * 2 - 1;
          sevPiece.position.y = Math.random() * 2 - 1;
          sevPiece.position.z = Math.random() * 2 - 1;
          sevPiece.rotation.x = Math.random() * Math.PI;
          sevPiece.rotation.z = Math.random() * Math.PI;
          mesh.add(sevPiece);
        }
        break;
      case 'bhakarwadi':
        geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        break;
      case 'chakli':
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        material = new THREE.MeshStandardMaterial({ color: 0xd4a76a });
        break;
      default:
        // Default shape for unknown items
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        material = new THREE.MeshStandardMaterial({ color: 0xf5c242 });
    }
    
    // Create mesh if not already created (for sev)
    if (!mesh) {
      mesh = new THREE.Mesh(geometry, material);
    }
    
    scene.add(mesh);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the object
      if (mesh) {
        mesh.rotation.y += 0.01;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up on unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [itemName, size]);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: size, 
        height: size, 
        margin: '0 auto',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
}