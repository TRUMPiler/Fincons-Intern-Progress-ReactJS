// import { useState } from "react";
// import { DragDropProvider } from "@dnd-kit/react";
// import { Draggable } from "../components/Draggable";
// import { Droppable } from "../components/Droppable";

// export const DragDrop = () => {
//   const [sourceItems, setSourceItems] = useState([1, 2, 3, 4, 5]);
//   const [zone1Items, setZone1Items] = useState<number[]>([]);
//   const [zone2Items, setZone2Items] = useState<number[]>([]);

//   const moveItem = (
//     id: number,
//     from: number[],
//     setFrom: React.Dispatch<React.SetStateAction<number[]>>,
//     to: number[],
//     setTo: React.Dispatch<React.SetStateAction<number[]>>
//   ) => {
//     setFrom((prev) => prev.filter((item) => item !== id));
//     setTo((prev) => [...prev, id]);
//   };
  

//   return (
//     <DragDropProvider
//       onDragEnd={(event) => {
//         if (event.canceled) return;

//         const { source, target } = event.operation;
//         const id = source?.id as number;

//         if (!target) return;

//         if (target.id === "zone1") {
//           if (sourceItems.includes(id))
//             moveItem(id, sourceItems, setSourceItems, zone1Items, setZone1Items);
//           else if (zone2Items.includes(id))
//             moveItem(id, zone2Items, setZone2Items, zone1Items, setZone1Items);
//         }

//         if (target.id === "zone2") {
//           if (sourceItems.includes(id))
//             moveItem(id, sourceItems, setSourceItems, zone2Items, setZone2Items);
//           else if (zone1Items.includes(id))
//             moveItem(id, zone1Items, setZone1Items, zone2Items, setZone2Items);
//         }
//       }}
//     >
//       <div className="flex flex-col gap-4 justify-around p-10">

//         {/* Source List */}
//         <Droppable id="source">
//           {sourceItems.map((id) => (
//             <Draggable key={id} id={id} />
//           ))}
//         </Droppable>

//         {/* Zone 1 */}
//         <Droppable id="zone1">
//           {zone1Items.map((id) => (
//             <Draggable key={id} id={id} />
//           ))}
//         </Droppable>

//         {/* Zone 2 */}
//         <Droppable id="zone2">
//           {zone2Items.map((id) => (
//             <Draggable key={id} id={id} />
//           ))}
//         </Droppable>

//       </div>
//     </DragDropProvider>
//   );
// };