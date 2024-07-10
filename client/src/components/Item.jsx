import { useCursor, useGLTF } from '@react-three/drei';
import { useEffect, useMemo , useState } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { useGrid } from '../hooks/useGrid';
import { useAtom } from 'jotai';
import { buildModeAtom } from './UI';

export const Item = ({ item, map,onClick, isDragging, dragPosition, canDrop , dragRotation  }) => {
  const { name, size } = item.item;
  const { gridPosition, rotation :itemRotation } = item;
  const { vector3ToGrid, gridToVector3 } = useGrid(map);
  const rotation = isDragging ? dragRotation : itemRotation;
  const { scene } = useGLTF(`/models/items/${name}.glb`);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
  const [hovered, setHovered] = useState(false);
  const buildMode = useAtom(buildModeAtom);
  useCursor(buildMode? hovered : undefined);

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone]);



  return (
    <group
      onClick={onClick}
      position={gridToVector3(isDragging ? (dragPosition || gridPosition) : gridPosition, width, height)}
      onPointerEnter={(e) => setHovered(true)}
        onPointerLeave={(e) => setHovered(false)}
    >
      <primitive
        object={clone}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
      {isDragging && (
        <mesh>
          <boxGeometry args={[width / map.gridDivision, 0.2, height / map.gridDivision]} />
          <meshBasicMaterial color={canDrop ? "green" : "red"} transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
};
