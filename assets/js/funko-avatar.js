/* ==========================================================================
   Funko avatar: hover flips the profile photo (pure CSS, see _sidebar.scss);
   click swaps it in place for an interactive 3D Gaussian-splat model.

   three.js and Spark (https://sparkjs.dev) are resolved through the importmap in
   _includes/head/custom.html and are only downloaded on the first click.
   ========================================================================== */

const FOV = 30;                 // degrees; narrow-ish lens = little perspective distortion
const FIT = 0.86;               // fraction of the avatar height the figure should fill
const AUTO_ROTATE_SPEED = 1.5;  // OrbitControls units: 1.5 -> one turn every ~40 s
const AUTO_ROTATE_RESUME_MS = 3000;
const HINT_MS = 2500;

const card = document.querySelector(".avatar-card[data-splat]");
if (card) setUp(card);

function setUp(card) {
  const host = card.closest(".author__avatar");
  const status = card.querySelector(".avatar-card__status");
  let viewer = null;
  let busy = false;

  const close = () => {
    if (!viewer) return;
    viewer.destroy();
    viewer = null;
    host.classList.remove("is-3d", "is-active");
    document.removeEventListener("keydown", onKeyDown);
    card.focus({ preventScroll: true });
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") close();
  };

  card.addEventListener("click", async () => {
    if (busy || viewer) return;
    busy = true;
    host.classList.add("is-active");
    card.classList.add("is-loading");
    status.textContent = "Loading 3D…";

    try {
      viewer = await createViewer(host, card.dataset.splat, {
        onProgress: (percent) => { status.textContent = `Loading 3D… ${percent}%`; },
        onClose: close,
      });
      status.textContent = "";
      host.classList.add("is-3d");
      document.addEventListener("keydown", onKeyDown);
      viewer.closeButton.focus({ preventScroll: true });
    } catch (error) {
      console.error("[funko-avatar] Could not show the 3D model:", error);
      host.classList.remove("is-active");
      status.textContent = "3D view unavailable";
      setTimeout(() => { status.textContent = ""; }, 2500);
    } finally {
      card.classList.remove("is-loading");
      busy = false;
    }
  });
}

async function createViewer(host, url, { onProgress, onClose }) {
  if (!document.createElement("canvas").getContext("webgl2")) {
    throw new Error("WebGL2 is not available");
  }

  const [THREE, { SparkRenderer, SplatMesh }, { OrbitControls }] = await Promise.all([
    import("three"),
    import("@sparkjsdev/spark"),
    import("three/addons/controls/OrbitControls.js"),
  ]);

  // --- DOM ----------------------------------------------------------------
  const wrap = document.createElement("div");
  wrap.className = "avatar-3d";
  const canvas = document.createElement("canvas");
  canvas.className = "avatar-3d__canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "3D model. Drag to rotate.");
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "avatar-3d__close";
  closeButton.setAttribute("aria-label", "Close 3D view");
  closeButton.title = "Back to photo";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", onClose);
  const hint = document.createElement("span");
  hint.className = "avatar-3d__hint";
  hint.textContent = "Drag to rotate";
  wrap.append(canvas, closeButton, hint);
  host.appendChild(wrap);

  // --- three.js + Spark -----------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0); // transparent: the CSS gradient shows through
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100);
  const spark = new SparkRenderer({ renderer });
  scene.add(spark);

  const splat = new SplatMesh({
    url,
    onProgress: (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.min(99, Math.round((100 * event.loaded) / event.total)));
      }
    },
  });
  // The model was exported in OpenCV convention (Y down): flip 180° about X
  splat.quaternion.set(1, 0, 0, 0);
  scene.add(splat);

  const controls = new OrbitControls(camera, canvas);
  let destroyed = false;
  let resizeObserver = null;
  let visibilityObserver = null;
  let resumeTimer = 0;
  let hintTimer = 0;

  const destroy = () => {
    destroyed = true;
    renderer.setAnimationLoop(null);
    resizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    clearTimeout(resumeTimer);
    clearTimeout(hintTimer);
    controls.dispose();
    scene.remove(splat);
    splat.dispose();
    spark.dispose?.();
    renderer.dispose();
    wrap.remove();
  };

  try {
    await splat.initialized;
  } catch (error) {
    destroy();
    throw error;
  }

  // --- Frame the model ------------------------------------------------------
  splat.updateMatrixWorld(true);
  const box = splat.getBoundingBox().applyMatrix4(splat.matrixWorld);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  splat.position.sub(center); // centre the figure on the orbit target (origin)

  const radiusXZ = Math.max(size.x, size.z) / 2;
  const fitDistance = (aspect) => {
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const forHeight = size.y / 2 / tanHalf;
    const forWidth = radiusXZ / (tanHalf * aspect);
    return Math.max(forHeight, forWidth) / FIT + radiusXZ;
  };

  // The figure faces +X; start in front of it, slightly above eye level
  const startDirection = new THREE.Vector3(1, 0.12, 0).normalize();
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = false; // keep the mouse wheel scrolling the page
  controls.enablePan = false;
  controls.rotateSpeed = 0.9;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = Math.PI - 0.3;
  controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
  controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  hintTimer = setTimeout(() => hint.classList.add("is-hidden"), HINT_MS);
  const autoRotateWanted = controls.autoRotate;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    clearTimeout(resumeTimer);
    hint.classList.add("is-hidden");
  });
  controls.addEventListener("end", () => {
    clearTimeout(resumeTimer);
    if (autoRotateWanted) {
      resumeTimer = setTimeout(() => { controls.autoRotate = true; }, AUTO_ROTATE_RESUME_MS);
    }
  });

  // --- Sizing ---------------------------------------------------------------
  let placed = false;
  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const distance = fitDistance(camera.aspect);
    if (!placed) {
      camera.position.copy(startDirection).multiplyScalar(distance);
      placed = true;
    } else {
      camera.position.setLength(distance);
    }
    controls.update();
  };
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  // --- Render loop (paused while the avatar is scrolled out of view) ----------
  const timer = new THREE.Timer();
  const frame = (time) => {
    timer.update(time);
    controls.update(Math.min(timer.getDelta(), 0.1)); // no jump after an off-screen pause
    renderer.render(scene, camera);
  };
  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (destroyed) return;
    renderer.setAnimationLoop(entry.isIntersecting ? frame : null);
  });
  visibilityObserver.observe(canvas);
  renderer.setAnimationLoop(frame);

  // Give Spark a couple of frames to sort the splats before fading in
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  return { closeButton, destroy };
}
