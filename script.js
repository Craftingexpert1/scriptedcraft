class V {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class Block {
    constructor(vector, type) {
        this.vector = vector;
        this.type = type;
    }
}
function Minecraft() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.loader = new THREE.TextureLoader();
    document.body.appendChild(this.renderer.domElement);

    var frameTime = 0, lastLoop = performance.now(), thisLoop; //fps variables
    setInterval(() => document.querySelector("#fps").innerHTML = Math.floor(1000 / frameTime) + " fps", 1000); //display fps every second

    this.time = 0; //in game time

    this.vertices = [
        { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0], face:0},
        { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], face:0},
        { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], face:0},
        { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1], face:0},
        { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0], face:1},
        { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], face:1},
        { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], face:1},
        { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1], face:1},
        { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0], face:2},
        { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], face:2},
        { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], face:2},
        { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], face:2},
        { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], face:2},
        { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1], face:2},
        { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0], face:3},
        { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], face:3},
        { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], face:3},
        { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], face:3},
        { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], face:3},
        { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1], face:3},
        { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0], face:4},
        { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], face:4},
        { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], face:4},
        { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], face:4},
        { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], face:4},
        { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1], face:4},
        { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0], face:5},
        { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], face:5},
        { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], face:5},
        { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], face:5},
        { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], face:5},
        { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1], face:5},
    ];
    this.positions = [];
    this.normals = [];
    this.uvs = [];
    this.indices = [];
    for (const vertex of this.vertices) {
        let ndx = this.positions.length / 3;
        this.positions.push(vertex.pos[0], vertex.pos[1], vertex.pos[2]);
        this.uvs.push(...vertex.uv);
        this.normals.push(...vertex.norm);
        this.indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3,);
    }
    this.geometry = new THREE.BufferGeometry();
    this.positionNumComponents = 3;
    this.normalNumComponents = 3;
    this.uvNumComponents = 2;
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.positions), this.positionNumComponents));
    this.geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.normals), this.normalNumComponents));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uvs), this.uvNumComponents));
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map:this.loader.load("https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3") });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.geometry.setIndex(this.indices);
    this.scene.add(this.cube);
    this.cube.position.z = -5;

    this.update = () => { //runs 20 times per second (this function is a tick)

        this.time++; //update time
        this.time = this.time == 24000 ? 0 : this.time;
        document.querySelector("#time").innerHTML = (Math.floor(minecraft.time / 1000 + 6) + "") + ":" + (Number((minecraft.time / 1000 + 6 - Math.floor(minecraft.time / 1000 + 6)).toFixed(2)) * 60 / 100).toFixed(2).slice(2);
        //this.cube.rotation.x += 0.015;
        //this.cube.rotation.z += 0.025;

    }
    setInterval(this.update, 50);

    this.animate = () => {

        // calculate fps
        var thisFrameTime = (thisLoop = performance.now()) - lastLoop;
        frameTime += (thisFrameTime - frameTime) / 10;
        lastLoop = thisLoop;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate);
    }

}

var minecraft = new Minecraft();
minecraft.animate();