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
        showError("잔액이 부족합니다.");
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
          // API 코드를 상품명으로 변환
          const ITEM_CODE_MAP: Record<string, string> = {
            COFFEE_LOW: "컴포즈커피 아메리카노",
            CLUB_DUES_DISCOUNT_COUPON: "회비 할인 쿠폰",
            COFFEE_HIGH: "스타벅스 1만원권",
            ENERGY_DRINK: "핫식스",
            CHICKEN: "치킨 한 마리",
          };

          const itemName = ITEM_CODE_MAP[result.item] || result.item;
          console.log("API result:", result.item, "-> mapped to:", itemName);

          // 결과에서 아이템 찾기
          const idx = items.findIndex((item) => item.label === itemName);
          const targetIdx = idx >= 0 ? idx : null; // 못 찾으면 null

          console.log(
            "Found item at index:",
            targetIdx,
            "item:",
            targetIdx !== null ? items[targetIdx] : "not found"
          );

          setResultIdx(targetIdx);
          setSpinning(false);

          if (targetIdx !== null) {
            startDrop(targetIdx, itemName);
          } else {
            // 매칭되는 아이템이 없으면 바로 결과 표시
            const resultItem = { id: "api-result", label: itemName };
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

  const startDrop = (idx: number, apiItemName: string) => {
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
        // API에서 받은 아이템명을 사용
        const resultItem = { id: "api-result", label: apiItemName };
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
            {spinning || dropping ? "추첨 중..." : "뽑기 시작!"}
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
          { id: "1", label: "핫식스", weight: 61, color: "#74B8FF" },
          {
            id: "2",
            label: "컴포즈커피 아메리카노",
            weight: 32,
            color: "#FF5975",
          },
          { id: "3", label: "회비 할인 쿠폰", weight: 5.5, color: "#C2B5FB" },
          { id: "4", label: "스타벅스 1만원권", weight: 1.0, color: "#CEF286" },
          { id: "5", label: "치킨 한 마리", weight: 0.5, color: "#FDF385" },
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
