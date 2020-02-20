import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface TodoEntryProps {
  id: string;
  text: string;
  done: boolean;
  onDelete: Function;
  onDoneToggle: Function;
}

interface TodoEntryState {
  done: boolean;
}

class TodoEntry extends Component<TodoEntryProps, TodoEntryState> {
  state = { done: false };

  componentDidMount() {
    this.setState({ done: this.props.done });
  }

  handleDone = async () => {
    await this.setState({ done: !this.state.done });

    this.props.onDoneToggle(this.props.id, this.state.done);
  };

  handleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  render() {
    return (
      <div className="todo-entry">
        <div className="todo-entry-holder">
          <div className="todo-checkbox" onClick={this.handleDone}>
            <FontAwesomeIcon
              icon={this.state.done ? faCheckCircle : faCircle}
            />
          </div>
          <div
            className={
              this.state.done ? "todo-entry-text checked" : "todo-entry-text"
            }
          >
            {this.props.text}
          </div>
        </div>
        <div className="todo-entry-actions">
          <div className="todo-entry-action" onClick={this.handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      </div>
    );
  }
}

export default TodoEntry;
