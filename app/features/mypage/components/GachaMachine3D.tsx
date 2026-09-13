import { useI18n } from "@app/i18n";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getMyPage } from "../api/Mypage";
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
  onResult,
  onShowResult,
  isOverlayOpen,
}: {
  items: GachaItem[];
  onResult?: (item: GachaItem) => void;
  onShowResult: (item: GachaItem | null) => void;
  isOverlayOpen: boolean;
}) {
  const { t } = useI18n();
  const groupRef = useRef<THREE.Group | null>(null);
  const chosenRef = useRef<THREE.Mesh | null>(null);

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
    if (spinning || dropping || !groupRef.current) return;

    setSpinning(true);

    try {
      // 먼저 마이페이지 정보를 가져와서 잔액 확인
      const myPageInfo = await getMyPage();

      if (myPageInfo.pointBalance < 100) {
        showError(t("mypage.gacha.insufficientBalance"));
        setSpinning(false);
        return;
      }

      // 잔액이 충분하면 뽑기 API 호출
      const result = await drawPoint();

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
            onResult?.(resultItem);
          }
        },
      });
    } catch (error) {
      console.error("뽑기 실패:", error);
      setSpinning(false);
      // 에러 처리는 drawPoint 함수에서 처리
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
        onResult?.(resultItem);
      },
    });
  };

  const RingBalls = () => (
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
      <RingBalls />
      <mesh ref={chosenRef} visible={dropping}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#FFD54F" />
      </mesh>

      {/* 조명 */}
      <hemisphereLight intensity={0.6} groundColor={new THREE.Color("#bcd")} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} />
      <Environment preset="city" />

      <OrbitControls enableZoom={false} enablePan={false} />

      {/* 뽑기 버튼 */}
      {!isOverlayOpen && (
        <Html position={[0, -1.4, 0]} center>
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
  onResult,
  width = "100%",
  height = 520,
  className,
  modelScale = 0.7,
}: GachaMachine3DProps) {
  const deviceRatio =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1.5;

  const safeItems: GachaItem[] =
    items.length > 0
      ? items
      : [
          // Fallback wheel. `label` is the API prize code, as above.
          { id: "1", label: "ENERGY_DRINK", weight: 61, color: "#74B8FF" },
          { id: "2", label: "COFFEE_LOW", weight: 32, color: "#FF5975" },
          {
            id: "3",
            label: "CLUB_DUES_DISCOUNT_COUPON",
            weight: 5.5,
            color: "#C2B5FB",
          },
          { id: "4", label: "COFFEE_HIGH", weight: 1.0, color: "#CEF286" },
          { id: "5", label: "CHICKEN", weight: 0.5, color: "#FDF385" },
        ];

  const [resultItem, setResultItem] = useState<GachaItem | null>(null);

  return (
    <div style={{ width, height, position: "relative" }} className={className}>
      <Canvas
        dpr={deviceRatio}
        camera={{ position: [0.6, 0.6, 2.2], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <group scale={[modelScale, modelScale, modelScale]}>
          <Machine3D
            items={safeItems}
            onResult={onResult}
            onShowResult={setResultItem}
            isOverlayOpen={!!resultItem}
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
