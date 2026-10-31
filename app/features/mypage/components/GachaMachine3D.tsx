import { useI18n } from "@app/i18n";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { drawPoint } from "../api/PointDraw";
import { useValueAnimator } from "../hooks/useValueAnimator";
import type { GachaItem, GachaMachine3DProps } from "../model/Gacha";
import { showError } from "../utils/alert";
import { easeInOutCubic, easeOutCubic } from "../utils/Easing";
import GachaResultCard from "./GachaResultCard";

// 공 (구체)
function BallMesh({ color = "#FFD54F" }: { color?: string }) {
  return (
    <mesh>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial metalness={0.1} roughness={0.35} color={color} />
    </mesh>
  );
}

// 본체
function Machine3D({
  items,
  onShowResult,
  isOverlayOpen,
  overlayContainer,
}: {
  items: GachaItem[];
  onShowResult: (item: GachaItem | null) => void;
  isOverlayOpen: boolean;
  overlayContainer: React.RefObject<HTMLElement>;
}) {
  const { t } = useI18n();
  const groupRef = useRef<THREE.Group | null>(null);
  const chosenRef = useRef<THREE.Mesh | null>(null);
  const drawingRef = useRef(false);

  const [spinning, setSpinning] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [resultIdx, setResultIdx] = useState<number | null>(null);

  const ringRadius = 0.55;
  const ringY = 0.2;
  const step = (Math.PI * 2) / items.length;
  const baseAngles = useMemo(
    () => items.map((_, i) => i * step),
    [items, step]
  );

  const { start: startSpinAnim } = useValueAnimator();
  const { start: startDropAnim } = useValueAnimator();

  // 대기 중 천천히 회전
  useFrame((_, dt) => {
    if (!spinning && groupRef.current) groupRef.current.rotation.y += dt * 0.2;
  });

  const handleSpin = async () => {
    // 버튼은 별도 React 루트(drei Html)에 있어 state 반영이 늦을 수 있으므로
    // ref로 즉시 막아 포인트가 두 번 차감되지 않게 합니다.
    if (drawingRef.current || spinning || dropping || !groupRef.current) return;

    drawingRef.current = true;
    setSpinning(true);

    try {
      const result = await drawPoint();
      drawingRef.current = false;

      // API 호출이 성공하면 회전 애니메이션 시작
      const initialCurrent = groupRef.current.rotation.y;
      const initialTurns = 6 + Math.random() * 2; // 6~8바퀴
      const initialTarget = initialCurrent + initialTurns * Math.PI * 2;

      startSpinAnim({
        from: initialCurrent,
        to: initialTarget,
        duration: 2000,
        ease: easeOutCubic,
        onUpdate: (v) => {
          if (groupRef.current) groupRef.current.rotation.y = v;
        },
        onComplete: () => {
          // `label` carries the API prize code, so the result matches directly
          // and no language-specific name table is involved.
          const idx = items.findIndex((item) => item.label === result.item);
          const targetIdx = idx >= 0 ? idx : null;

          setResultIdx(targetIdx);
          setSpinning(false);

          if (targetIdx !== null) {
            startDrop(targetIdx, result.item);
          } else {
            // Nothing on the wheel matches, so show the result straight away.
            const resultItem = { id: "api-result", label: result.item };
            onShowResult(resultItem);
          }
        },
      });
    } catch (error) {
      drawingRef.current = false;
      setSpinning(false);
      showError(
        error instanceof Error ? error.message : t("mypage.errors.draw")
      );
    }
  };

  const startDrop = (idx: number, apiItemCode: string) => {
    setDropping(true);

    // 선택된 아이템의 색상 적용
    const color = items[idx]?.color || "#000000";
    if (chosenRef.current) {
      (chosenRef.current.material as THREE.MeshStandardMaterial).color.set(
        color
      );
    }

    startDropAnim({
      from: 0,
      to: 1,
      duration: 800,
      ease: easeInOutCubic,
      onUpdate: (t) => {
        if (chosenRef.current) {
          // 간단한 포물선 경로
          const x = t * 0.3;
          const y = ringY + 0.1 - t * 1.0 - t * t * 0.5; // 포물선 형태로 떨어짐
          const z = ringRadius * 0.9 + t * 0.4;

          chosenRef.current.position.set(x, y, z);
          chosenRef.current.rotation.x = THREE.MathUtils.lerp(
            0,
            Math.PI * 4,
            t
          );
          chosenRef.current.rotation.z = Math.sin(t * Math.PI * 6) * 0.3;
        }
      },
      onComplete: () => {
        setDropping(false);
        // The prize code from the API is carried through; the card resolves
        // the display name.
        const resultItem = { id: "api-result", label: apiItemCode };
        onShowResult(resultItem);
      },
    });
  };

  const ringBalls = (
    <group ref={groupRef}>
      {items.map((it, i) => {
        const a = baseAngles[i];
        const x = Math.cos(a) * ringRadius;
        const z = Math.sin(a) * ringRadius;
        const hidden = dropping && resultIdx === i;
        return (
          <group
            key={it.id}
            position={[x, ringY, z]}
            rotation={[0, -a + Math.PI / 2, 0]}
            visible={!hidden}
          >
            <BallMesh color={it.color} />
          </group>
        );
      })}
    </group>
  );

  return (
    <>
      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#eef3f9" />
      </mesh>

      {/* 베이스 */}
      <group>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.2, 32]} />
          <meshStandardMaterial color="#5BB0FF" />
        </mesh>
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.5, 0.55, 0.3, 32]} />
          <meshStandardMaterial color="#61B6FF" />
        </mesh>
        <mesh position={[0, -0.82, 0.7]}>
          <torusGeometry args={[0.18, 0.04, 16, 64, Math.PI]} />
          <meshStandardMaterial color="#2E7CCB" />
        </mesh>
      </group>

      {/* 돔 */}
      <mesh>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshPhysicalMaterial
          transmission={0.9}
          thickness={0.2}
          roughness={0.05}
          transparent
          opacity={0.5}
          color="#FFFFFF"
        />
      </mesh>

      {/* 링 & 드랍 */}
      {ringBalls}
      <mesh ref={chosenRef} visible={dropping}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#FFD54F" />
      </mesh>

      {/* 조명 */}
      <ambientLight intensity={2.6} />
      <hemisphereLight intensity={0.6} groundColor={new THREE.Color("#bcd")} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} />

      <OrbitControls enableZoom={false} enablePan={false} />

      {/* 뽑기 버튼 */}
      {/* Html re-targets once R3F connects its events and the button would
          disappear, so the container is fixed from the first render. */}
      {!isOverlayOpen && (
        <Html position={[0, -1.4, 0]} center portal={overlayContainer}>
          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || dropping}
            style={{
              width: "120px",
              height: "50px",
              borderRadius: "20px",
              background: "#000000",
              color: "white",
              fontWeight: 700,
              fontSize: "16px",
              cursor: spinning || dropping ? "not-allowed" : "pointer",
            }}
          >
            {spinning || dropping
              ? t("mypage.gacha.spinning")
              : t("mypage.gacha.spin")}
          </button>
        </Html>
      )}
    </>
  );
}

// 최종 결과
export default function GachaMachine3D({
  items,
  width = "100%",
  height = 520,
  className,
  modelScale = 0.7,
}: GachaMachine3DProps) {
  const deviceRatio =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1.5;

  const [resultItem, setResultItem] = useState<GachaItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ width, height, position: "relative" }}
      className={className}
    >
      <Canvas
        dpr={deviceRatio}
        camera={{ position: [0.6, 0.6, 2.2], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <group scale={[modelScale, modelScale, modelScale]}>
          <Machine3D
            items={items}
            onShowResult={setResultItem}
            isOverlayOpen={!!resultItem}
            overlayContainer={containerRef as React.RefObject<HTMLElement>}
          />
        </group>
      </Canvas>

      {/* 결과 카드 */}
      {resultItem && (
        <GachaResultCard
          item={resultItem}
          onClose={() => setResultItem(null)}
        />
      )}
    </div>
  );
}
