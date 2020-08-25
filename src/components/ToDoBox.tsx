import React, { Component } from "react";
import $ from "jquery";
import FadeIn from "react-fade-in";
import { Lottie } from "@crello/react-lottie";
import { getProvider } from "../utils/ProviderManager";
import checked from "../assets/checked.json";
import ToDoEntry from "./ToDoEntry";
import "../styles/ToDoBox.scss";

interface ToDoEntryState {
  text: string;
  done: boolean;
  id: string;
}

interface ToDoBoxProps {
  setupTooltip: Function;
}

interface ToDoBoxState {
  entries: Array<ToDoEntryState>;
  loaded: boolean;
}

class ToDoBox extends Component<ToDoBoxProps, ToDoBoxState> {
  state = { entries: new Array<ToDoEntryState>(), loaded: false };

  componentDidMount() {
    const todo = getProvider().getValue("todo-list");
    if (todo !== null) {
      const entries = JSON.parse(todo);
      this.setState({ entries, loaded: true });
    } else {
      this.setState({ loaded: true });
      this.saveTodoList();
    }
  }

  saveTodoList = () => {
    getProvider().setValue("todo-list", JSON.stringify(this.state.entries));
    this.props.setupTooltip();
  };

  handleInputKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 13) {
      const value = (e.target as any).value as string;

      if (value.trim().length === 0) {
        return;
      }

      let id = "";

      do {
        id =
          Math.random().toString(36).substring(2, 12) +
          Math.random().toString(36).substring(2, 12) +
          Math.random().toString(36).substring(2, 12) +
          Math.random().toString(36).substring(2, 12);
      } while (
        // eslint-disable-next-line
        this.state.entries.filter((entry) => entry.id === id).length !== 0
      );

      const { entries } = this.state;
      entries.push({ text: value, done: false, id });
      this.setState({ entries });
      this.saveTodoList();
      (e.target as any).value = "";
    }
  };

  handleDelete = (id: string) => {
    $(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip("dispose");
    });
    setTimeout(async () => {
      let { entries } = this.state;
      entries = entries.filter((value) => value.id !== id);
      await this.setState({ entries });
      this.saveTodoList();
    }, 200);
  };

  handleDoneToggle = async (id: string, done: boolean) => {
    let { entries } = this.state;
    entries = entries.map((value) => {
      const newValue = value;
      if (value.id === id) newValue.done = done;

      return newValue;
    });
    await this.setState({ entries });
    this.saveTodoList();
  };

  handleEdit = async (id: string, newText: string) => {
    let { entries } = this.state;
    entries = entries.map((value) => {
      const newValue = value;
      if (value.id === id) newValue.text = newText;

      return newValue;
    });
    await this.setState({ entries });
    this.saveTodoList();
  };

  getEntries = () => {
    if (!this.state.loaded) return null;
    if (this.state.entries.length === 0) {
      return (
        <div className="d-flex flex-column  align-items-center">
          <FadeIn className="trello-status-container">
            <Lottie
              height="120px"
              width="120px"
              config={{
                animationData: checked,
                loop: false,
                autoplay: true,
              }}
            />
            <h5 className="trello-status-text">It&apos;s empty!</h5>
          </FadeIn>
        </div>
      );
    }

    return this.state.entries.map((entry) => (
      <ToDoEntry
        onDelete={this.handleDelete}
        onDoneToggle={this.handleDoneToggle}
        onEdit={this.handleEdit}
        text={entry.text}
        done={entry.done}
        id={entry.id}
        key={entry.id}
      />
    ));
  };

  render() {
    return (
      <div id="todo-box" className="homepage-card">
        <h4>To Do:</h4>
        <input
          id="todo-new-entry"
          className="text-input"
          type="text"
          placeholder="Add new things to your To Do"
          autoComplete="off"
          onKeyUp={this.handleInputKey}
        />
        <div>{this.getEntries()}</div>
      </div>
    );
  }
}

export default ToDoBox;
