import { useEffect, useRef, useState } from "react";

function App() {
  const [blocks, setBlocks] = useState([]);

  // get coordinate
  function getCoordinate(value) {
    return Math.floor(Math.random() * value);
  }

  const createBlock = (parent) => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Generate random top and left
    const top = getCoordinate(containerHeight - 150);
    const left = getCoordinate(containerWidth - 150);

    // Set the random coordinates as the left and top position of the block
    const nexBlock = {};
    nexBlock["id"] = blocks.length + 1;
    nexBlock["parent"] = parent < 0 ? null : parent;
    nexBlock["left"] = left;
    nexBlock["top"] = top;
    nexBlock["childs"] = [];

    if (parent != -1) {
      let parentBlock = blocks.find((block) => block.id == parent);
      parentBlock.childs.push(nexBlock);
    }

    setBlocks(() => [...blocks, nexBlock]);
  };

  const moveBlock = (i, currentBoxInfo) => {
    let isMoving = true;
    let currentBox = document.getElementById(`sm-card-${i}`);

    const mouseMove = ({ movementX, movementY }) => {
      const style = window.getComputedStyle(currentBox);
      const left = parseInt(style.left);
      const top = parseInt(style.top);
      if (isMoving) {
        currentBox.style.left = `${left + movementX}px`;
        currentBox.style.top = `${top + movementY}px`;

        let updatedBlock = {
          ...currentBoxInfo,
          left: parseInt(currentBox.style.left),
          top: parseInt(currentBox.style.top),
        };

        setBlocks((prev) => {
          const index = prev.findIndex((block) => block.id === updatedBlock.id);
          const newBlocks = [...prev];
          newBlocks[index] = updatedBlock;
          return newBlocks;
        });
      }
    };
    const mouseUp = (e) => {
      isMoving = false;
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  useEffect(() => {
    createBlock(-1);
  }, []);

  const drawConnector = (parentId, childId) => {
    if (parentId) {
      let parent = document.getElementById(`sm-card-${parentId}`);
      let child = document.getElementById(`sm-card-${childId}`);
      let line = document.getElementById(`line-${childId}`);

      var parentBlock = {
        x: parent.offsetLeft,
        y: parent.offsetTop + parent.offsetHeight / 2,
      };

      var childBlock = {
        x: child.offsetLeft,
        y: child.offsetTop + child.offsetHeight / 2,
      };

      var dStrLeft =
        "M" +
        parentBlock.x +
        "," +
        parentBlock.y +
        " " +
        "C" +
        (parentBlock.x + 100) +
        "," +
        parentBlock.y +
        " " +
        (childBlock.x + 100) +
        "," +
        childBlock.y +
        " " +
        childBlock.x +
        "," +
        childBlock.y;
      line.setAttribute("d", dStrLeft);
    }
  };

  useEffect(() => {
    blocks.forEach((block) => drawConnector(block.parent, block.id));
  }, [blocks]);

  return (
    <div className="main">
      {blocks.map((block, i) => (
        <>
          <div
            key={block.id}
            className="sm-card"
            id={`sm-card-${block.id}`}
            style={{ left: block.left, top: block.top }}
            onMouseDown={(e) => {
              if (e.target.tagName !== "BUTTON") {
                moveBlock(block.id, block);
              }
            }}>
            <p>{block.id}</p>
            <button
              className="add_btn"
              onClick={(e) => {
                createBlock(block.id);
              }}>
              +
            </button>
          </div>
        </>
      ))}
      <svg width="100%" height="100%">
        <g fill="none" stroke="black" strokeWidth="1">
          {blocks.map((block) => (
            <>
              <path
                key={`line-${block.id}`}
                id={`line-${block.id}`}
                style={{ strokeDasharray: "5,5" }}
              />
            </>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default App;
