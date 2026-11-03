import type { PointShopDrawResponse } from "@app/api/generated/model";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PRIZE_CODES, PRIZES } from "./mypage";

const RING_RADIUS = 0.55;
const RING_Y = 0.15;
const BALL_RADIUS = 0.17;
const IDLE_SPEED = 0.35;
const SPIN_SPEED = 9;
const LAND_SECONDS = 1.5;
const DROP_SECONDS = 0.9;

interface GachaMachineProps {
  /** True while the draw request is on its way. */
  spinning: boolean;
  /** The prize to land on; changes once per draw. */
  result: PointShopDrawResponse | null;
  /** Called after the winning ball has dropped. */
  onSettled: () => void;
}

type Phase =
  | { name: "idle" }
  | { name: "spinning" }
  | { name: "landing"; from: number; to: number; t: number; index: number }
  | { name: "dropping"; t: number; index: number };

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInQuad = (t: number) => t * t;

function Machine({ spinning, result, onSettled }: GachaMachineProps) {
  const ring = useRef<THREE.Group>(null);
  const drop = useRef<THREE.Mesh>(null);
  const balls = useRef<(THREE.Mesh | null)[]>([]);
  const phase = useRef<Phase>({ name: "idle" });
  const handled = useRef<number | null>(null);
  const settle = useRef(onSettled);
  settle.current = onSettled;

  const step = (Math.PI * 2) / PRIZE_CODES.length;
  const angles = useMemo(() => PRIZE_CODES.map((_, i) => i * step), [step]);

  useEffect(() => {
    if (spinning && phase.current.name === "idle") {
      phase.current = { name: "spinning" };
    }
    // The draw failed; a success goes on to land instead.
    if (!spinning && phase.current.name === "spinning") {
      phase.current = { name: "idle" };
    }
  }, [spinning]);

  useEffect(() => {
    if (!result || handled.current === result.drawHistoryId || !ring.current) {
      return;
    }
    handled.current = result.drawHistoryId;
    const index = PRIZE_CODES.indexOf(result.item);
    const current = ring.current.rotation.y;
    // Turn until the winning ball faces the chute at the front (+z), with a
    // couple of extra turns so it never looks like it snapped into place.
    const facing = angles[index] - Math.PI / 2;
    const base = current + Math.PI * 4;
    const to =
      base +
      ((((facing - base) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
    phase.current = { name: "landing", from: current, to, t: 0, index };
    for (const ball of balls.current) if (ball) ball.visible = true;
  }, [result, angles]);

  useFrame((_, delta) => {
    const group = ring.current;
    if (!group) return;
    const state = phase.current;

    if (state.name === "idle") group.rotation.y += delta * IDLE_SPEED;
    if (state.name === "spinning") group.rotation.y += delta * SPIN_SPEED;

    if (state.name === "landing") {
      state.t = Math.min(1, state.t + delta / LAND_SECONDS);
      group.rotation.y =
        state.from + (state.to - state.from) * easeOutCubic(state.t);
      if (state.t === 1) {
        const ball = balls.current[state.index];
        if (ball) ball.visible = false;
        if (drop.current) {
          const material = drop.current.material as THREE.MeshStandardMaterial;
          material.color.set(PRIZES[PRIZE_CODES[state.index]].color);
          drop.current.visible = true;
        }
        phase.current = { name: "dropping", t: 0, index: state.index };
      }
    }

    if (state.name === "dropping" && drop.current) {
      state.t = Math.min(1, state.t + delta / DROP_SECONDS);
      const t = easeInQuad(state.t);
      drop.current.position.set(0, RING_Y - t * 1.05, RING_RADIUS + t * 0.55);
      drop.current.rotation.x = t * Math.PI * 3;
      if (state.t === 1) {
        phase.current = { name: "idle" };
        settle.current();
        window.setTimeout(() => {
          if (drop.current) drop.current.visible = false;
          const ball = balls.current[state.index];
          if (ball) ball.visible = true;
        }, 400);
      }
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Base: an ink plinth with the blue band from the buttons. */}
      <mesh position={[0, -0.98, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 0.24, 64]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[0.62, 0.7, 0.1, 64]} />
        <meshStandardMaterial color="#2852d8" roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.86, 0.7]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.36, 0.18, 0.08]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.8} />
      </mesh>

      {/* Glass dome. */}
      <mesh>
        <sphereGeometry args={[0.92, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          thickness={0.15}
          roughness={0.04}
          transparent
          opacity={0.38}
        />
      </mesh>

      <group ref={ring}>
        {PRIZE_CODES.map((code, i) => (
          <mesh
            key={code}
            ref={(mesh) => {
              balls.current[i] = mesh;
            }}
            position={[
              Math.cos(angles[i]) * RING_RADIUS,
              RING_Y,
              Math.sin(angles[i]) * RING_RADIUS,
            ]}
          >
            <sphereGeometry args={[BALL_RADIUS, 40, 40]} />
            <meshStandardMaterial
              color={PRIZES[code].color}
              roughness={0.32}
              metalness={0.05}
            />
          </mesh>
        ))}
      </group>

      <mesh ref={drop} visible={false}>
        <sphereGeometry args={[BALL_RADIUS, 40, 40]} />
        <meshStandardMaterial roughness={0.32} metalness={0.05} />
      </mesh>
    </group>
  );
}

/**
 * Drag to turn the machine around. Only a little tilt is allowed, and on
 * touch screens vertical swipes still scroll the page.
 */
function DragToTurn({ damping }: { damping: boolean }) {
  const camera = useThree((state) => state.camera);
  const element = useThree((state) => state.gl.domElement);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const orbit = new OrbitControls(camera, element);
    orbit.enableZoom = false;
    orbit.enablePan = false;
    orbit.enableDamping = damping;
    orbit.minPolarAngle = Math.PI * 0.36;
    orbit.maxPolarAngle = Math.PI * 0.58;
    element.style.touchAction = "pan-y";
    // Renders on demand when motion is reduced.
    const render = () => invalidate();
    orbit.addEventListener("change", render);
    controls.current = orbit;
    return () => {
      orbit.removeEventListener("change", render);
      orbit.dispose();
      controls.current = null;
    };
  }, [camera, element, invalidate, damping]);

  useFrame(() => controls.current?.update());
  return null;
}

/** The prize machine. Loaded on demand; three.js is heavy. */
export default function GachaMachine(props: GachaMachineProps) {
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Without motion the result is shown as soon as it arrives.
  useEffect(() => {
    if (reducedMotion && props.result) props.onSettled();
  }, [reducedMotion, props.result, props.onSettled]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.25, 4.2], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={1.6} />
      <hemisphereLight intensity={0.7} groundColor="#d8d4ca" />
      <directionalLight position={[2.5, 3, 2.5]} intensity={1.6} />
      <directionalLight position={[-2, 1, -1]} intensity={0.5} />
      <Machine {...props} />
      <DragToTurn damping={!reducedMotion} />
    </Canvas>
  );
}
