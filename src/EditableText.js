import React, { useState, useRef } from "react";
import Portal from "./Portal"; // to render DOM nodes in Konva
import { Group, Text } from "react-konva";

function EditableText(props) {
  const textAreaRef = useRef(null);
  const [textEditVisible, setTextEditVisible] = useState();
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);
  const [textValue, setTextValue] = useState(props.textValue || "Hello"); 

  return (
    <Group>
      {/* need Portal to render DOM elements in konva canvas */}
      <Portal>
        <textarea
          ref={textAreaRef}
          value={textValue}
          style={{
            display: textEditVisible ? "block" : "none",
            position: "absolute",
            top: textY + 500 + "px",
            left: textX + "px"
          }}
          onChange={e => setTextValue(e.target.value)}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              setTextEditVisible(false);
            }
          }}
        />
      </Portal>
      <Text
        draggable
        name="text"
        text={textValue}
        x={props.x}
        y={props.y}
        fontSize={20}
        onDblClick={e => {
          const absPos = e.target.getAbsolutePosition();
          setTextEditVisible(true);
          setTextX(absPos.x);
          setTextY(absPos.y);
          textAreaRef.current.focus();
        }}
        fontFamily="Calibri"
        fill="black"
        width={220}
        padding={16}
        align="center"
      />
    </Group>
  );
}

export default EditableText;
