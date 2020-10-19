import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircle,
  faSave,
} from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface ToDoEntryProps {
  id: string;
  text: string;
  done: boolean;
  onDelete: Function;
  onDoneToggle: Function;
  onEdit: Function;
}

interface ToDoEntryState {
  done: boolean;
  edit: boolean;
  newText: string;
}

class ToDoEntry extends Component<ToDoEntryProps, ToDoEntryState> {
  state = { done: false, edit: false, newText: "" };

  componentDidMount() {
    this.setState({ done: this.props.done });
  }

  handleDone = async () => {
    if (this.state.edit) {
      this.finishEdit();
      return;
    }
    this.setState((prevState) => ({ done: !prevState.done }));

    this.props.onDoneToggle(this.props.id, this.state.done);
  };

  handleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  toggleEditMode = () => {
    this.setState(prevState => ({ edit: !prevState.edit }));
  };

  handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    this.finishEdit();
  };

  handleFormEscape = (e: React.KeyboardEvent) => {
    if (e.keyCode === 27) this.toggleEditMode();
  };

  finishEdit = () => {
    this.toggleEditMode();
    let text = this.state.newText;
    if (text.trim() === "") text = this.props.text;
    this.props.onEdit(this.props.id, text);
  };

  getTextComponent = () => {
    if (this.state.edit) {
      return (
        <div
          className={
            this.state.edit ? "todo-entry-text edit" : "todo-entry-text"
          }
          onDoubleClick={this.toggleEditMode}
        >
          <form onSubmit={this.handleEditSave} onKeyUp={this.handleFormEscape}>
            <input
              autoFocus
              onChange={(e) => this.setState({ newText: e.target.value })}
              onFocus={(e) => e.target.select()}
              defaultValue={this.props.text}
            />
          </form>
        </div>
      );
    }
    return (
      <div
        className={
          this.state.done ? "todo-entry-text checked" : "todo-entry-text"
        }
        onDoubleClick={this.toggleEditMode}
      >
        {this.props.text}
      </div>
    );
  };

  getIcon = () => {
    if (this.state.edit) return faSave;
    return this.state.done ? faCheckCircle : faCircle;
  };

  render() {
    return (
      <div className="todo-entry">
        <div className="todo-entry-holder">
          <div
            className="todo-checkbox"
            data-toggle="tooltip"
            title="Toggle done state"
            onClick={this.handleDone}
          >
            <FontAwesomeIcon
              className={
                this.state.done && !this.state.edit ? "icon-checked" : ""
              }
              icon={this.getIcon()}
            />
          </div>
          {this.getTextComponent()}
        </div>
        <div className="todo-entry-actions">
          <div
            className="todo-entry-action"
            data-toggle="tooltip"
            title="Delete entry"
            onClick={this.handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      </div>
    );
  }
}

export default ToDoEntry;
