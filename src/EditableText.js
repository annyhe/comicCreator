import React, { useState } from "react";
import Portal from "./Portal"; // to render DOM nodes in Konva
import { Group, Text } from "react-konva";

function EditableText(props) {
  const [textEditVisible, setTextEditVisible] = useState();
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);
  const [textValue, setTextValue] = useState(props.textValue || "Hello"); 

  return (
    <Group>
      {/* need Portal to render DOM elements in konva canvas */}
      <Portal>
        <textarea
          value={textValue}
          style={{
            display: textEditVisible ? "block" : "none",
            position: "absolute",
            top: textY + 700 + "px",
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
        x={225}
        y={295}
        fontSize={20}
        onDblClick={e => {
          const absPos = e.target.getAbsolutePosition();
          setTextEditVisible(true);
          setTextX(absPos.x);
          setTextY(absPos.y);
        }}
        fontSize={16}
        fontFamily="Calibri"
        fill="black"
        width={220}
        padding={15}
        align="center"
      />
    </Group>
  );
}

export default EditableText;
