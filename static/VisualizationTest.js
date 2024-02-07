const { useState, useEffect, useRef } = React;
const THREE = window.THREE;

const VisualizationTest = (props) => {
    const [terms, setTerms] = useState(props.terms);
    const containerRef = useRef(null);
    const [mouse, setMouse] = useState({x: 0, y: 0});
    

    useEffect(() => {
        setTerms(props.terms);
        initVisualization();
    }, [props.terms]);

    const initVisualization = () => {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        containerRef.current.appendChild(renderer.domElement);

        var geometry = new THREE.Geometry();
        for (let term of terms) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random()*200-100;
            vertex.y = Math.random()*200-100;
            vertex.z = Math.random()*200-100;
            geometry.vertices.push(vertex);
        }

        var material = new THREE.PointsMaterial({size: 100, sizeAttenuation: true});
        var particles = new THREE.Points(geometry, material);
        scene.add(particles);

        camera.position.z = 1000;

        document.addEventListener('mousemove', handleMouseMove, false);

        animate(renderer, scene, camera, particles);

        var container = containerRef.current;
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();

        window.addEventListener('resize', handleResize(renderer, camera, container));
    }

    const handleMouseMove = (e) => {
        var dx = e.clientX - window.innerWidth / 2;
        var dy = e.clientY - window.innerHeight / 2;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var scale = 40 * distance / (Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) / 2);
        setMouse({x: ((e.clientX / window.innerWidth) * 2 - 1) * scale, y: (-(e.clientY / window.innerHeight) * 2 + 1) * scale});
    }

    const animate = (renderer, scene, camera, particles) => {
        requestAnimationFrame(animate.bind(null, renderer, scene, camera, particles));
        particles.rotation.x += mouse.y * 0.001;
        particles.rotation.y += mouse.x * 0.001;
        renderer.render(scene, camera);
    }

    const handleResize = (renderer, camera, container) => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
    }

    const paperVisualizationWrapStyle = {
        width: '100px',
        height: '100px',
        opacity: '70%',
        background: 'black',
    };

    return (
        <div style={paperVisualizationWrapStyle} ref={containerRef}></div>
    );
}