import { useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../hooks/useGrid";

const ShopItem = ({ item, gridPosition, rotation, map, ...props }) => {
  const { name, size } = item;
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { gridToVector3 } = useGrid(map);

  return (
    <group {...props}>
      <group
        position={gridToVector3([0, 0], size[0], size[1])}
        rotation={[0, rotation * Math.PI / 2, 0]}
      >
        <primitive object={clone} />
      </group>
    </group>
  );
};

export const Shop = ({ items, map, onItemSelected }) => {
  const maxX = useRef(0);

  const shopItems = useMemo(() => {
    let x = 0;
    return Object.entries(items).map(([key, itemObj], index) => {
      const { item, gridPosition, rotation = 0 } = itemObj;
      const xPos = x;
      x += item.size[0] / map.gridDivision + 1;
      maxX.current = x;
      return (
        <ShopItem
          key={key}
          position-x={xPos}
          item={item}
          gridPosition={gridPosition}
          rotation={rotation}
          map={map}
          onClick={(e) => {
            e.stopPropagation();
            onItemSelected(itemObj);
          }}
        />
      );
    });
  }, [items, map]);

  const shopContainer = useRef();
  const scrollData = useScroll();
  useFrame(() => {
    shopContainer.current.position.x = -scrollData.offset * maxX.current;
  });

  return <group ref={shopContainer}>{shopItems}</group>;
};
