import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

let toDoItems;
// [
//   {
//     key: uuidv4(),
//     label: "Have fun",
//   },
//   {
//     key: uuidv4(),
//     label: "Spread Empathy",
//   },
//   {
//     key: uuidv4(),
//     label: "Generate Value",
//   },
// ];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  toDoItems =
    localStorage.getItem("toDoItems") === null
      ? []
      : JSON.parse(localStorage.getItem("toDoItems"));

  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() => toDoItems);

  const [filterType, setFilterType] = useState("");

  const [searchVal, setSearchVal] = useState("");

  const handleSearchFilter = (event) => {
    setSearchVal(event.target.value);
    console.log(event.target.value);

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (
          !event.target.value ||
          item.label.toLowerCase().includes(event.target.value.toLowerCase())
        ) {
          return { ...item, hide: false };
        } else return { ...item, hide: true };
      })
    );
  };

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    setItems((prevItems) => {
      let after = [{ label: itemToAdd, key: uuidv4() }, ...prevItems];
      // console.log(after);
      localStorage.setItem("toDoItems", JSON.stringify(after));
      return after;
    });
    setItemToAdd("");
  };

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) => {
      let after = prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      });
      // console.log(after);
      localStorage.setItem("toDoItems", JSON.stringify(after));
      return after;
    });
  };

  const handleItemDelete = ({ key }) => {
    setItems((prevItems) => {
      let after = prevItems.filter((item) => item.key !== key);
      // console.log(after);
      localStorage.setItem("toDoItems", JSON.stringify(after));
      return after;
    });
  };

  const handleItemImportant = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, important: !oldItem.important };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, important: item.important ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) => {
      let after = prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      });
      // console.log(after);
      localStorage.setItem("toDoItems", JSON.stringify(after));
      return after;
    });
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchVal}
          onChange={handleSearchFilter}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li
              key={item.key}
              className="list-group-item"
              style={{ display: item.hide ? "none" : "block" }}
            >
              <span
                className={`todo-list-item${item.done ? " done" : ""} ${
                  item.important ? " important" : ""
                }`}
              >
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => handleItemImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
