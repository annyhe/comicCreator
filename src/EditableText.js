import React, { Component, useState } from "react";
import Portal from "./Portal"; // to render DOM nodes in Konva
import { 
  Group,
  Text
} from "react-konva";

export default class EditableText extends Component {
  state = {
    selectedShapeName: "",
    textEditVisible: false,
    textX: 0,
    textY: 0,
    textValue: this.props.textValue || "Hello"
  };
  handleTextDblClick = e => {
    const absPos = e.target.getAbsolutePosition();
    this.setState({
      textEditVisible: true,
      textX: absPos.x,
      textY: absPos.y
    });
  };
  handleTextEdit = e => {
    this.setState({
      textValue: e.target.value
    });
  };
  handleTextareaKeyDown = e => {
    if (e.keyCode === 13) {
      this.setState({
        textEditVisible: false
      });
    }
  };

  render() {
    return (
      <Group>
        {/* need Portal to render DOM elements in konva canvas */}
        <Portal>
          <textarea
            value={this.state.textValue}
            style={{
              display: this.state.textEditVisible ? "block" : "none",
              position: "absolute",
              top: this.state.textY + 700 + "px",
              left: this.state.textX + "px"
            }}
            onChange={this.handleTextEdit}
            onKeyDown={this.handleTextareaKeyDown}
          />
        </Portal>
        <Text
          draggable
          name="text"
          text={this.state.textValue}
          x={225}
          y={295}
          fontSize={20}
          onDblClick={this.handleTextDblClick}
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
}