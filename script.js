import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --------------------------------------------------------------
// ДАННЫЕ ПЛАНЕТ (реалистичные цвета, размеры, расстояния)
// --------------------------------------------------------------
const planetsData = [
    { name: 'Меркурий', color: 0xbc9a6c, size: 0.38, distance: 4.5, speed: 0.022, detail: 'Самая маленькая планета. Температура: от -173°C до +427°C.', facts: 'Нет атмосферы, поверхность покрыта кратерами. Год длится 88 земных дней.' },
    { name: 'Венера',   color: 0xe6b856, size: 0.45, distance: 6.0, speed: 0.014, detail: 'Самая горячая планета (464°C), вращается в обратную сторону.', facts: 'Атмосфера из CO₂, давление в 92 раза выше земного. Ярчайшая планета на небе.' },
    { name: 'Земля',    color: 0x4a90e2, size: 0.48, distance: 7.8, speed: 0.012, detail: 'Наш дом, единственная известная жизнь.', facts: '71% поверхности покрыто водой. Единственная планета с тектоникой плит.' },
    { name: 'Марс',     color: 0xd84315, size: 0.42, distance: 9.5, speed: 0.010, detail: 'Красная планета, гора Олимп — высочайшая в Солнечной системе.', facts: 'Есть полярные шапки из CO₂. На поверхности работают марсоходы.' },
    { name: 'Юпитер',   color: 0xd2b48c, size: 1.0,  distance: 14.0, speed: 0.006, detail: 'Гигант, Большое красное пятно, 79 спутников.', facts: 'Состоит из водорода и гелия. Масса в 2.5 раза больше всех остальных планет вместе.' },
    { name: 'Сатурн',   color: 0xf4c542, size: 0.85, distance: 17.5, speed: 0.005, detail: 'Известен своими кольцами, состоит из водорода.', facts: 'Кольца из водяного льда. Плотность меньше воды — он бы плавал.' },
    { name: 'Уран',     color: 0x6cd4c5, size: 0.7,  distance: 21.0, speed: 0.004, detail: 'Вращается лёжа на боку, самая холодная планета.', facts: 'Метан придаёт голубой цвет. Имеет 13 узких тёмных колец.' },
    { name: 'Нептун',   color: 0x4169e1, size: 0.68, distance: 24.5, speed: 0.0035, detail: 'Сильные ветры (2100 км/ч), тёмное пятно.', facts: 'Открыт математически. Самый сильный шторм в Солнечной системе.' }
];

// --------------------------------------------------------------
// СЦЕНА, КАМЕРА, РЕНДЕРЕРЫ
// --------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010118);
scene.fog = new THREE.FogExp2(0x010118, 0.0003);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 18, 45);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.rotateSpeed = 0.8;
controls.target.set(0, 0, 0);
controls.maxDistance = 150;

// --------------------------------------------------------------
// ОСВЕЩЕНИЕ
// --------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffaa66, 1.4, 0, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x88aaff, 0.5);
fillLight.position.set(10, 20, 5);
scene.add(fillLight);

const bhLight = new THREE.PointLight(0xff6600, 0.8, 80);
bhLight.position.set(25, 0, 0);
scene.add(bhLight);

const pulsarLight = new THREE.PointLight(0x00ccff, 0.9, 60);
pulsarLight.position.set(-25, 0, 0);
scene.add(pulsarLight);

// --------------------------------------------------------------
// СОЛНЦЕ
// --------------------------------------------------------------
const sunGeometry = new THREE.SphereGeometry(2.2, 128, 128);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa66,
    emissive: 0xff4411,
    emissiveIntensity: 0.9,
    metalness: 0.1,
    roughness: 0.4
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

const sunGlowGeometry = new THREE.SphereGeometry(2.6, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.2 });
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// --------------------------------------------------------------
// ФУНКЦИЯ ДЛЯ МЕТОК
// --------------------------------------------------------------
function makeLabel(text, colorHex) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = `#${colorHex.toString(16).padStart(6, '0')}`;
    div.style.fontSize = '14px';
    div.style.fontWeight = 'bold';
    div.style.textShadow = '1px 1px 0px black';
    div.style.background = 'rgba(0,0,0,0.6)';
    div.style.padding = '2px 8px';
    div.style.borderRadius = '20px';
    div.style.borderLeft = `3px solid #${colorHex.toString(16).padStart(6, '0')}`;
    div.style.fontFamily = 'monospace';
    div.style.whiteSpace = 'nowrap';
    return new CSS2DObject(div);
}

// --------------------------------------------------------------
// ПЛАНЕТЫ И ОРБИТЫ
// --------------------------------------------------------------
const planets = [];
const planetAngles = [];
const planetLabels = [];
const planetInfos = [];

planetsData.forEach((data, idx) => {
    let material;
    if (data.name === 'Юпитер') {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#d2b48c';
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(139, 90, 43, ${0.3 + Math.random() * 0.3})`;
            ctx.fillRect(0, i * 50, 512, 25);
        }
        ctx.fillStyle = '#b84c3c';
        ctx.beginPath();
        ctx.ellipse(400, 300, 80, 50, 0, 0, 2 * Math.PI);
        ctx.fill();
        const texture = new THREE.CanvasTexture(canvas);
        material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6, metalness: 0.1 });
    } else if (data.name === 'Сатурн') {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f4c542';
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = `rgba(180, 120, 50, 0.3)`;
            ctx.fillRect(0, i * 40, 512, 20);
        }
        const texture = new THREE.CanvasTexture(canvas);
        material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5 });
    } else {
        material = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.5, metalness: 0.1 });
    }
    
    const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 64, 64), material);
    planet.castShadow = true;
    planet.userData = { name: data.name, detail: data.detail, facts: data.facts, type: 'planet' };
    scene.add(planet);
    
    const angle = Math.random() * Math.PI * 2;
    planetAngles.push(angle);
    planets.push(planet);
    
    const x = Math.cos(angle) * data.distance;
    const z = Math.sin(angle) * data.distance;
    planet.position.set(x, 0, z);
    
    const label = makeLabel(data.name, data.color);
    label.position.copy(planet.position);
    label.position.y += data.size + 0.3;
    scene.add(label);
    planetLabels.push(label);
    
    planetInfos.push({
        name: data.name,
        detail: data.detail,
        facts: data.facts,
        distance: data.distance,
        size: data.size,
        speed: data.speed
    });
    
    // Орбита
    const orbitPoints = [];
    const radius = data.distance;
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const xp = Math.cos(a) * radius;
        const zp = Math.sin(a) * radius;
        orbitPoints.push(new THREE.Vector3(xp, 0, zp));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x88aaff, transparent: true, opacity: 0.35 });
    const orbit = new THREE.LineLoop(orbitGeo, orbitMat);
    scene.add(orbit);
});

// Кольца Сатурна
const saturnIndex = planetsData.findIndex(p => p.name === 'Сатурн');
if (saturnIndex !== -1) {
    const saturn = planets[saturnIndex];
    const ringGeo = new THREE.TorusGeometry(1.1, 0.25, 32, 200);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9b37c, emissive: 0x442200, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    saturn.add(ring);
    
    const ring2Geo = new THREE.TorusGeometry(1.35, 0.12, 32, 200);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0xb89a5a, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.2;
    saturn.add(ring2);
}

// --------------------------------------------------------------
// ПОЯС АСТЕРОИДОВ
// --------------------------------------------------------------
const asteroidGroup = new THREE.Group();
const asteroidCount = 2000;
for (let i = 0; i < asteroidCount; i++) {
    const radius = 11 + Math.random() * 4;
    const angle = Math.random() * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 0.8;
    const size = 0.06 + Math.random() * 0.08;
    const asteroidGeo = new THREE.SphereGeometry(size, 8, 8);
    const asteroidMat = new THREE.MeshStandardMaterial({ color: 0xaa9977, roughness: 0.7 });
    const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
    asteroid.position.x = Math.cos(angle) * radius;
    asteroid.position.z = Math.sin(angle) * radius;
    asteroid.position.y = yOffset;
    asteroid.castShadow = true;
    asteroidGroup.add(asteroid);
}
scene.add(asteroidGroup);

// --------------------------------------------------------------
// ЧЁРНАЯ ДЫРА (из простого кода)
// --------------------------------------------------------------
function createBlackHole() {
    const group = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    group.add(core);
    const disk = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 32, 100), new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff2200 }));
    disk.rotation.x = Math.PI / 2;
    group.add(disk);
    group.userData = { core, disk };
    group.position.set(25, 0, 0);
    return group;
}
const blackHole = createBlackHole();
scene.add(blackHole);
const bhLabel = makeLabel('Чёрная дыра', 0xff6600);
bhLabel.position.set(25, 3.2, 0);
scene.add(bhLabel);

// --------------------------------------------------------------
// ПУЛЬСАР (из простого кода)
// --------------------------------------------------------------
function createPulsar() {
    const group = new THREE.Group();
    const star = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x66ccff }));
    group.add(star);
    const beamGeo = new THREE.CylinderGeometry(0.1, 0.3, 12, 32);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.7 });
    const beamLeft = new THREE.Mesh(beamGeo, beamMat);
    beamLeft.rotation.z = Math.PI / 2;
    beamLeft.position.set(-6, 0, 0);
    const beamRight = beamLeft.clone();
    beamRight.position.set(6, 0, 0);
    group.add(beamLeft);
    group.add(beamRight);
    group.userData = { beams: [beamLeft, beamRight] };
    group.position.set(-25, 0, 0);
    return group;
}
const pulsar = createPulsar();
scene.add(pulsar);
const pulsarLabel = makeLabel('Пульсар', 0x00ccff);
pulsarLabel.position.set(-25, 2.2, 0);
scene.add(pulsarLabel);

// --------------------------------------------------------------
// ЗВЁЗДЫ
// --------------------------------------------------------------
const starCount = 8000;
const starGeoField = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPositions[i*3] = (Math.random() - 0.5) * 500;
    starPositions[i*3+1] = (Math.random() - 0.5) * 300;
    starPositions[i*3+2] = (Math.random() - 0.5) * 200 - 80;
}
starGeoField.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMatField = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true });
const starsField = new THREE.Points(starGeoField, starMatField);
scene.add(starsField);

let starTwinkleTime = 0;
function twinkleStars() {
    starTwinkleTime += 0.02;
    const scale = 0.8 + Math.sin(starTwinkleTime) * 0.2;
    starMatField.size = 0.15 * scale;
    requestAnimationFrame(twinkleStars);
}
twinkleStars();

// --------------------------------------------------------------
// НОВАЯ ИНФОРМАЦИОННАЯ ПАНЕЛЬ (МОДАЛЬНОЕ ОКНО)
// --------------------------------------------------------------
const modal = document.getElementById('info-modal');
const modalTitle = document.getElementById('info-modal-title');
const modalBody = document.getElementById('info-modal-body');
const closeModal = document.querySelector('.info-modal-close');

function showInfo(name, detail, extra) {
    modalTitle.innerHTML = `🪐 ${name}`;
    modalBody.innerHTML = `
        <div class="info-detail"><strong>📝 Описание:</strong> ${detail}</div>
        <div class="info-detail"><strong>✨ Интересные факты:</strong> ${extra}</div>
    `;
    modal.style.display = 'flex';
}

closeModal.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// --------------------------------------------------------------
// ВЫБОР ОБЪЕКТА И ПОКАЗ ПАНЕЛИ
// --------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentSelectedObject = null;
let currentSelectedInfo = null;

const clickableObjects = [...planets, blackHole, pulsar];

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, true);
    if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit.parent && !clickableObjects.includes(hit)) hit = hit.parent;
        if (clickableObjects.includes(hit)) {
            let name = '', detail = '', facts = '';
            if (hit === blackHole) {
                name = 'Чёрная дыра';
                detail = 'Сверхмассивная чёрная дыра с аккреционным диском и пульсацией.';
                facts = 'Гравитация настолько сильна, что не выпускает свет. Горизонт событий — точка невозврата.';
            } else if (hit === pulsar) {
                name = 'Пульсар';
                detail = 'Нейтронная звезда с мощными горизонтальными лучами. Вращается и мерцает.';
                facts = 'Вращается сотни раз в секунду. Излучает строго периодические импульсы.';
            } else {
                const idx = planets.indexOf(hit);
                if (idx !== -1) {
                    name = planetsData[idx].name;
                    detail = planetsData[idx].detail;
                    facts = planetsData[idx].facts;
                }
            }
            if (name) {
                currentSelectedObject = hit;
                currentSelectedInfo = { name, detail, facts };
                showInfo(name, detail, facts);
            }
        }
    }
});

// Кнопка "Инфо" показывает информацию о последнем выбранном объекте
document.getElementById('info-btn').addEventListener('click', () => {
    if (currentSelectedInfo) {
        showInfo(currentSelectedInfo.name, currentSelectedInfo.detail, currentSelectedInfo.facts);
    } else {
        showInfo('Ничего не выбрано', 'Нажмите на любой объект в сцене, чтобы увидеть информацию.', '');
    }
});

// Кнопки управления
document.getElementById('reset-view').addEventListener('click', () => {
    camera.position.set(0, 18, 45);
    controls.target.set(0, 0, 0);
    controls.update();
});

let asteroidsVisible = true;
document.getElementById('toggle-asteroids').addEventListener('click', () => {
    asteroidsVisible = !asteroidsVisible;
    asteroidGroup.visible = asteroidsVisible;
});

let timeScale = 1;
document.getElementById('toggle-time').addEventListener('click', () => {
    timeScale = timeScale === 1 ? 0 : 1;
});

// --------------------------------------------------------------
// АНИМАЦИЯ
// --------------------------------------------------------------
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.016 * timeScale;
    
    planets.forEach((planet, idx) => {
        const data = planetsData[idx];
        planetAngles[idx] += data.speed * 0.6 * timeScale;
        if (planetAngles[idx] > Math.PI * 2) planetAngles[idx] -= Math.PI * 2;
        const x = Math.cos(planetAngles[idx]) * data.distance;
        const z = Math.sin(planetAngles[idx]) * data.distance;
        planet.position.set(x, 0, z);
        planet.rotation.y += 0.01 * timeScale;
        if (planetLabels[idx]) {
            planetLabels[idx].position.copy(planet.position);
            planetLabels[idx].position.y += data.size + 0.3;
        }
    });
    
    blackHole.rotation.y += 0.01 * timeScale;
    if (blackHole.userData.disk) blackHole.userData.disk.rotation.z += 0.02 * timeScale;
    const pulse = 1 + Math.sin(time * 3) * 0.1;
    blackHole.userData.core.scale.set(pulse, pulse, pulse);
    bhLight.intensity = 0.8 + Math.sin(time * 2.5) * 0.25;
    
    pulsar.rotation.y += 0.2 * timeScale;
    const flash = 0.5 + Math.sin(time * 20) * 0.5;
    if (pulsar.userData.beams) {
        pulsar.userData.beams.forEach(beam => { beam.material.opacity = flash; });
    }
    pulsarLight.intensity = 0.7 + Math.sin(time * 16) * 0.4;
    
    const sunIntensity = 1.2 + Math.sin(time * 2.5) * 0.2;
    sunLight.intensity = sunIntensity;
    sunGlow.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
    
    starsField.rotation.y += 0.0003 * timeScale;
    starsField.rotation.x += 0.0002 * timeScale;
    
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('УЛЬТРА КОСМОС загружен. Информационная панель — по центру, полные данные.');