const { useState, useEffect, useRef } = React;
const THREE = window.THREE;


const VisualizationMatrix = () => {
    const containerRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10; // Adjust camera position to fit the denser grid

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        const tfidf_matrix = new Array(50).fill().map(() => new Array(50).fill().map(() => Math.random())); // Increase matrix size

        tfidf_matrix.forEach((row, i) => {
            row.forEach((value, j) => {
                const geometry = new THREE.SphereGeometry(0.05); // Keep sphere size the same
                const color = new THREE.Color();
                if (value !== undefined) {
                    color.setHSL(0.5 * value, 1, 0.5);
                }
                const material = new THREE.MeshBasicMaterial({ color });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(i - tfidf_matrix.length / 2, j - row.length / 2, 0); // Adjust positions to fit the denser grid
                scene.add(sphere);
            });
        });

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }, []);

    const containerStyle = {
        width: '100px',
        height: '100px',
    };

    return (
        <div style={containerStyle} ref={containerRef}></div>
    );
}