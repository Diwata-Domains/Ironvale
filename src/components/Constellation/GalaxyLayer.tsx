import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// The galaxy: the constellation seen from far away. A three.js point field + hairline edge
// segments reading the SAME simulation positions as the rich SVG — two renderers, one layout,
// one camera. Lazy-loaded; small skies never pay for it.
//
// Data-agnostic: it knows nothing about the graph's domain. Each point's color/size/brightness
// is handed in via the `visuals` map the parent computes; the ego (self) simply keeps its full
// brightness. The edge hue is a theme prop.

export interface GalaxyVisual {
  size: number;
  bright: number;
  color: string;
}

interface SimNodeLike {
  id: string;
  x: number;
  y: number;
  self: boolean;
}

interface GalaxyProps {
  nodesRef: React.MutableRefObject<SimNodeLike[]>;
  edgesRef: React.MutableRefObject<{ source: string; target: string }[]>;
  visuals: Map<string, GalaxyVisual>;
  /** Sim clock — bumps every physics tick so we re-read positions. */
  tick: number;
  cam: { k: number; tx: number; ty: number };
  w: number;
  h: number;
  opacity: number;
  /** Hex the point color lerps toward for non-ego stars (the "parchment" of the palette). */
  parchment: string;
  /** Hex of the hairline edge segments. */
  edgeColor: string;
}

const POINT_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aBright;
  uniform float uZoom;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vBright;
  void main() {
    vColor = aColor;
    vBright = aBright;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(2.0, aSize * uZoom * 1.6) * uPixelRatio;
  }
`;

const POINT_FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vBright;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    float alpha = smoothstep(1.0, 0.45, d) * (0.25 + 0.75 * vBright) * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function GalaxyLayer({
  nodesRef,
  edgesRef,
  visuals,
  tick,
  cam,
  w,
  h,
  opacity,
  parchment,
  edgeColor,
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    points?: THREE.Points;
    lines?: THREE.LineSegments;
    pointMat?: THREE.ShaderMaterial;
    lineMat?: THREE.LineBasicMaterial;
    edgePairs: [number, number][];
    builtNodes?: SimNodeLike[];
    builtEdges?: { source: string; target: string }[];
    builtVisuals?: Map<string, GalaxyVisual>;
  } | null>(null);

  // one renderer per mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
    threeRef.current = { renderer, scene, camera, edgePairs: [] };
    return () => {
      const t = threeRef.current;
      if (t) {
        t.points?.geometry.dispose();
        t.pointMat?.dispose();
        t.lines?.geometry.dispose();
        t.lineMat?.dispose();
        t.renderer.dispose();
      }
      threeRef.current = null;
    };
  }, []);

  // (re)build buffers when the node/edge set changes; gated on array identity (the parent
  // replaces nodesRef.current wholesale on rebuild) so it can never run against a stale graph.
  function rebuildBuffers(visualsNow: Map<string, GalaxyVisual>) {
    const t = threeRef.current;
    if (!t) return;
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    t.builtNodes = nodes;
    t.builtEdges = edges;
    t.builtVisuals = visualsNow;

    if (t.points) {
      t.scene.remove(t.points);
      t.points.geometry.dispose();
    }
    if (t.lines) {
      t.scene.remove(t.lines);
      t.lines.geometry.dispose();
    }

    const n = nodes.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const bright = new Float32Array(n);
    const parchmentColor = new THREE.Color(parchment);
    const scratch = new THREE.Color();
    nodes.forEach((node, i) => {
      const v = visualsNow.get(node.id);
      scratch.set(v?.color ?? parchment);
      if (!node.self) scratch.lerp(parchmentColor, 0.3);
      col[i * 3] = scratch.r;
      col[i * 3 + 1] = scratch.g;
      col[i * 3 + 2] = scratch.b;
      size[i] = v?.size ?? 8;
      bright[i] = node.self ? 1 : v?.bright ?? 0.5;
    });
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pgeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    pgeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    pgeo.setAttribute('aBright', new THREE.BufferAttribute(bright, 1));
    if (!t.pointMat) {
      t.pointMat = new THREE.ShaderMaterial({
        vertexShader: POINT_VERT,
        fragmentShader: POINT_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uZoom: { value: 1 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uOpacity: { value: 1 },
        },
      });
    }
    t.points = new THREE.Points(pgeo, t.pointMat);
    t.points.frustumCulled = false;
    t.scene.add(t.points);

    const index = new Map(nodes.map((node, i) => [node.id, i]));
    t.edgePairs = [];
    for (const e of edges) {
      const ia = index.get(e.source);
      const ib = index.get(e.target);
      if (ia !== undefined && ib !== undefined) t.edgePairs.push([ia, ib]);
    }
    const lpos = new Float32Array(t.edgePairs.length * 6);
    const lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
    if (!t.lineMat) {
      t.lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(edgeColor),
        transparent: true,
        opacity: 0.045,
        depthWrite: false,
      });
    }
    t.lines = new THREE.LineSegments(lgeo, t.lineMat);
    t.lines.frustumCulled = false;
    t.scene.add(t.lines);
  }

  // resize — refresh pixel ratio too (window may have moved between displays)
  useEffect(() => {
    const t = threeRef.current;
    if (!t) return;
    const pr = Math.min(window.devicePixelRatio, 2);
    t.renderer.setPixelRatio(pr);
    t.renderer.setSize(w, h, false);
    if (t.pointMat) t.pointMat.uniforms.uPixelRatio.value = pr;
  }, [w, h]);

  // draw: positions from the shared sim refs; camera = visible world rect.
  const frame = useMemo(() => ({ tick, cam, opacity }), [tick, cam, opacity]);
  useEffect(() => {
    const t = threeRef.current;
    if (!t) return;
    if (frame.opacity <= 0.02) return; // hidden — skip buffer churn and the render
    const nodes = nodesRef.current;
    if (t.builtNodes !== nodes || t.builtEdges !== edgesRef.current || t.builtVisuals !== visuals) {
      rebuildBuffers(visuals);
    }
    if (!t.points || !t.lines) return;
    const ppos = t.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const count = Math.min(nodes.length, ppos.count);
    for (let i = 0; i < count; i++) {
      ppos.setXYZ(i, nodes[i].x, nodes[i].y, 0);
    }
    ppos.needsUpdate = true;
    const lpos = t.lines.geometry.getAttribute('position') as THREE.BufferAttribute;
    t.edgePairs.forEach(([ia, ib], e) => {
      if (ia >= count || ib >= count) return;
      lpos.setXYZ(e * 2, nodes[ia].x, nodes[ia].y, 0);
      lpos.setXYZ(e * 2 + 1, nodes[ib].x, nodes[ib].y, 0);
    });
    lpos.needsUpdate = true;

    const { k, tx, ty } = frame.cam;
    t.camera.left = (0 - tx) / k;
    t.camera.right = (w - tx) / k;
    // world Y grows downward; ortho top/bottom swapped on purpose to match the SVG
    t.camera.top = (0 - ty) / k;
    t.camera.bottom = (h - ty) / k;
    t.camera.updateProjectionMatrix();
    if (t.pointMat) {
      t.pointMat.uniforms.uZoom.value = k;
      t.pointMat.uniforms.uOpacity.value = frame.opacity;
    }
    if (t.lineMat) t.lineMat.opacity = 0.045 * frame.opacity;
    t.renderer.render(t.scene, t.camera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, w, h, visuals]);

  return (
    <canvas
      ref={canvasRef}
      className="iv-galaxy-canvas"
      style={{ opacity: opacity < 0.02 ? 0 : 1 }}
      aria-hidden="true"
    />
  );
}
