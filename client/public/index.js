var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: re-write html of the form so that category and amount are horizontally
// next to each other. add a button to split transaction.
// TODO: handle split button click. add another category-amount pair. add a
// button to add another split or to remove the current split.
var NewTransactionForm = function (_React$Component) {
  _inherits(NewTransactionForm, _React$Component);

  function NewTransactionForm(props) {
    _classCallCheck(this, NewTransactionForm);

    var _this = _possibleConstructorReturn(this, (NewTransactionForm.__proto__ || Object.getPrototypeOf(NewTransactionForm)).call(this, props));

    _this.state = {
      date: "",
      sourceId: "0",
      payee: "",
      categories: [{
        categoryId: "0",
        amount: ""
      }],
      notes: "",
      errors: {
        date: "",
        sourceId: "",
        payee: "",
        categoryId: "",
        amount: "",
        notes: ""
      }
    };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(NewTransactionForm, [{
    key: "handleChange",
    value: function handleChange(event) {
      var _event$target = event.target,
          name = _event$target.name,
          value = _event$target.value;

      var errors = this.state.errors;

      errors[name] = this.validateElementValue(name, value);

      if (name === "categoryId" || name === "amount") {
        var categories = this.state.categories;
        categories[0][name] = value;

        this.setState({
          categories: categories,
          errors: errors
        });
      } else {
        var _setState;

        this.setState((_setState = {}, _defineProperty(_setState, name, value), _defineProperty(_setState, "errors", errors), _setState));
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      event.preventDefault();

      var errors = this.state.errors;
      var elements = event.target.elements;

      for (var index = 0; index < elements.length; index += 1) {
        var element = elements[index];

        if (!this.state.hasOwnProperty(element.name) && !this.state.categories.hasOwnProperty(element.name)) {
          continue;
        }

        errors[element.name] = this.validateElementValue(element.name, element.value);
      }

      if (Object.values(errors).some(function (errorMessage) {
        return errorMessage.length > 0;
      })) {
        this.setState({ errors: errors });
        return;
      }

      this.props.onSubmit({
        date: this.state.date,
        sourceId: this.state.sourceId,
        payee: this.state.payee,
        categories: [{
          categoryId: this.state.categories[0].categoryId,
          amount: this.state.categories[0].amount
        }],
        notes: this.state.notes
      });

      this.setState({
        date: "",
        sourceId: "0",
        payee: "",
        categories: [{
          categoryId: "0",
          amount: ""
        }],
        notes: ""
      });
    }
  }, {
    key: "makeErrorsListItems",
    value: function makeErrorsListItems(errorsObject) {
      var listItems = [];

      for (var key in errorsObject) {
        var value = errorsObject[key];

        if (value) {
          listItems.push(React.createElement(
            "li",
            { key: key },
            "\u26A0" + value
          ));
        }
      }
      return listItems;
    }
  }, {
    key: "validateElementValue",
    value: function validateElementValue(name, value) {
      var errorMessage = "";

      switch (name) {
        case "date":
          errorMessage = value.length > 0 ? "" : "Date is required.";
          break;
        case "sourceId":
          errorMessage = Number(value) > 0 ? "" : "Payment source is required.";
          break;
        case "payee":
          if (value.length === 0) {
            errorMessage = "Payee is required.";
          } else if (value.length > 50) {
            errorMessage = "Payee must be 50 characters or less.";
          }
          break;
        case "categoryId":
          errorMessage = Number(value) > 0 ? "" : "Category is required.";
          break;
        case "amount":
          if (value.length === 0) {
            errorMessage = "Amount is required.";
          } else if (Number.isNaN(Number(value))) {
            errorMessage = "Amount must be a number.";
          } else {
            errorMessage = Number(value) * 100 % 1 === 0 ? "" : "Amount must be rounded to the cent (hundredths place).";
          }

          break;
        case "notes":
          errorMessage = value.length < 201 ? "" : "Notes must be 200 characters or less";
          break;
        default:
          break;
      }

      return errorMessage;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var errorsList = this.makeErrorsListItems(this.state.errors);

      var categoriesAndAmounts = this.state.categories.map(function (category, index) {
        return React.createElement(
          "fieldset",
          { key: index },
          React.createElement(
            "label",
            null,
            "Category",
            React.createElement(SettingsSelect, { name: "categoryId_" + index, id: "categoryId_" + index,
              value: category.categoryId, onChange: _this2.handleChange })
          ),
          React.createElement(
            "label",
            null,
            "Amount",
            React.createElement("input", { type: "number", name: "amount_" + index, id: "amount_" + index,
              step: "0.01", value: category.amount, onChange: _this2.handleChange })
          ),
          React.createElement(
            "button",
            { type: "button" },
            "Split"
          )
        );
      });

      return React.createElement(
        "div",
        null,
        React.createElement(
          "form",
          { noValidate: true, onSubmit: this.handleSubmit },
          React.createElement(
            "h2",
            null,
            "New Transaction"
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              null,
              "Date",
              React.createElement("input", { type: "date", name: "date", id: "date",
                value: this.state.date, onChange: this.handleChange })
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              null,
              "Payment Source",
              React.createElement(SettingsSelect, { name: "sourceId", id: "sourceId", value: this.state.sourceId,
                onChange: this.handleChange })
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              null,
              "Payee",
              React.createElement("input", { type: "text", name: "payee", id: "payee",
                value: this.state.payee, onChange: this.handleChange })
            )
          ),
          categoriesAndAmounts,
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              null,
              "Notes",
              React.createElement("input", { type: "text", name: "notes", id: "notes", value: this.state.notes,
                onChange: this.handleChange })
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement("input", { type: "submit", value: "Add" })
          )
        ),
        React.createElement(
          "ul",
          null,
          errorsList
        )
      );
    }
  }]);

  return NewTransactionForm;
}(React.Component);

var SettingsSelect = function (_React$Component2) {
  _inherits(SettingsSelect, _React$Component2);

  function SettingsSelect(props) {
    _classCallCheck(this, SettingsSelect);

    var _this3 = _possibleConstructorReturn(this, (SettingsSelect.__proto__ || Object.getPrototypeOf(SettingsSelect)).call(this, props));

    _this3.handleChange = _this3.handleChange.bind(_this3);
    return _this3;
  }

  _createClass(SettingsSelect, [{
    key: "handleChange",
    value: function handleChange(event) {
      this.props.onChange(event);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      var URLS = {
        sourceId: "/settings/paymentSources",
        categoryId: "/settings/budgetCategories"
      };

      var name = this.props.name;

      if (name.includes("_")) {
        name = name.slice(0, name.indexOf("_"));
      }

      var url = URLS[name];

      fetch(url).then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }).then(function (data) {
        _this4.populateSelectOptions(data);
      }).catch(function (error) {
        console.error("Problem with fetch operations:", error);
      });
    }
  }, {
    key: "populateSelectOptions",
    value: function populateSelectOptions(data) {
      var select = document.getElementById(this.props.id);

      data.forEach(function (object) {
        var option = document.createElement("option");
        option.value = object.id;
        option.appendChild(document.createTextNode(object.name));
        select.appendChild(option);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "select",
        { name: this.props.name, id: this.props.id, value: this.props.value,
          onChange: this.handleChange },
        React.createElement(
          "option",
          { value: "0", disabled: true },
          "Choose one"
        )
      );
    }
  }]);

  return SettingsSelect;
}(React.Component);

// TODO: Add button to show split transaction categories and amounts.
// TODO: Handle "edit" button clicks. Brings up a form to edit the transaction 


var TransactionTableRow = function (_React$Component3) {
  _inherits(TransactionTableRow, _React$Component3);

  function TransactionTableRow(props) {
    _classCallCheck(this, TransactionTableRow);

    var _this5 = _possibleConstructorReturn(this, (TransactionTableRow.__proto__ || Object.getPrototypeOf(TransactionTableRow)).call(this, props));

    _this5.handleEditClick = _this5.handleEditClick.bind(_this5);
    return _this5;
  }

  _createClass(TransactionTableRow, [{
    key: "handleEditClick",
    value: function handleEditClick(event) {
      var transactionId = event.target.parentElement.parentElement.dataset.transactionId;
      console.log(transactionId);

      // TODO: insert an `input` element into each `td` element in the row that was
      // clicked on. give the `input` a value of the current text in the `td`.
      // give it the proper `name` attribute.
      // but how to control the component with React state and how to render
      // errors? where will the state live?
      // the alterative is for a modal dialog box to pop up.
    }
  }, {
    key: "render",
    value: function render() {
      var transaction = this.props.transaction;

      var formatDate = function formatDate(dateString) {
        var options = { day: "2-digit", month: "2-digit", year: "2-digit" };
        return new Date(dateString).toLocaleString("en-US", options);
      };

      var category = transaction.categories.length > 1 ? "SPLIT" : transaction.categories[0].category;

      var amount = transaction.categories.length > 1 ? transaction.categories.reduce(function (sum, category) {
        sum += Number(category.amount);
        return sum;
      }, 0) : transaction.categories[0].amount;

      return React.createElement(
        "tr",
        { "data-transaction-id": transaction.id },
        React.createElement(
          "td",
          null,
          formatDate(transaction.date)
        ),
        React.createElement(
          "td",
          null,
          transaction.source
        ),
        React.createElement(
          "td",
          null,
          transaction.payee
        ),
        React.createElement(
          "td",
          null,
          category
        ),
        React.createElement(
          "td",
          null,
          amount
        ),
        React.createElement(
          "td",
          null,
          transaction.notes
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "button",
            { type: "button", onClick: this.handleEditClick },
            "Edit"
          )
        )
      );
    }
  }]);

  return TransactionTableRow;
}(React.Component);

var TransactionsTable = function (_React$Component4) {
  _inherits(TransactionsTable, _React$Component4);

  function TransactionsTable(props) {
    _classCallCheck(this, TransactionsTable);

    var _this6 = _possibleConstructorReturn(this, (TransactionsTable.__proto__ || Object.getPrototypeOf(TransactionsTable)).call(this, props));

    _this6.handleSubmit = _this6.handleSubmit.bind(_this6);
    return _this6;
  }

  _createClass(TransactionsTable, [{
    key: "handleSubmit",
    value: function handleSubmit(event) {
      event.preventDefault();
      this.props.onSubmit(event);
    }
  }, {
    key: "render",
    value: function render() {
      var transactions = this.props.transactions || [];
      var tableRows = transactions.map(function (transaction) {
        return React.createElement(TransactionTableRow, {
          key: transaction.id,
          transaction: transaction });
      });

      return React.createElement(
        "div",
        null,
        React.createElement("form", { id: "edit-transaction", onSubmit: this.handleSubmit }),
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Date"
              ),
              React.createElement(
                "th",
                null,
                "Source"
              ),
              React.createElement(
                "th",
                null,
                "Payee"
              ),
              React.createElement(
                "th",
                null,
                "Category"
              ),
              React.createElement(
                "th",
                null,
                "Amount"
              ),
              React.createElement(
                "th",
                null,
                "Notes"
              ),
              React.createElement(
                "th",
                null,
                "Action"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            tableRows
          )
        )
      );
    }
  }]);

  return TransactionsTable;
}(React.Component);

var Transactions = function (_React$Component5) {
  _inherits(Transactions, _React$Component5);

  function Transactions(props) {
    _classCallCheck(this, Transactions);

    var _this7 = _possibleConstructorReturn(this, (Transactions.__proto__ || Object.getPrototypeOf(Transactions)).call(this, props));

    _this7.state = {
      isLoaded: false,
      transactions: null
    };

    _this7.handleEditTransactionSubmit = _this7.handleEditTransactionSubmit.bind(_this7);
    _this7.handleNewTransactionSubmit = _this7.handleNewTransactionSubmit.bind(_this7);
    return _this7;
  }

  _createClass(Transactions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchAllTransactions();
    }
  }, {
    key: "fetchAllTransactions",
    value: function fetchAllTransactions() {
      var _this8 = this;

      fetch("/transactions").then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }).then(function (data) {
        _this8.setState({
          isLoaded: true,
          transactions: data.transactions
        });
      }).catch(function (error) {
        console.error("Problem with fetch operations:", error);
      });
    }
  }, {
    key: "handleEditTransactionSubmit",
    value: function handleEditTransactionSubmit(inputs) {
      console.log("hello from Transactions component");
      console.log("inside `handleEditTransactionsSubmit` method");
      console.log("inputs:", inputs);
    }
  }, {
    key: "handleNewTransactionSubmit",
    value: function handleNewTransactionSubmit(inputs) {
      var _this9 = this;

      var init = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
      };

      fetch("/transactions", init).then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }).then(function (_data) {
        return _this9.fetchAllTransactions();
      }).catch(function (error) {
        console.error("Problem with fetch operations:", error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(NewTransactionForm, { onSubmit: this.handleNewTransactionSubmit }),
        this.state.isLoaded && React.createElement(TransactionsTable, { onSubmit: this.handleEditTransactionSubmit,
          transactions: this.state.transactions }),
        !this.state.isLoaded && React.createElement(
          "div",
          null,
          "Loading..."
        )
      );
    }
  }]);

  return Transactions;
}(React.Component);

ReactDOM.render(React.createElement(Transactions, null), document.getElementById("react-root"));