var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This component is responsible for rendering the form and validating all form
// input. If the form is submitted, it needs to validate the input and then pass
// the submitted data back up to its parent.
// TODO: after mounting, send get requests for a list of payment source id-name
// pairs and a list of payment category id-name pairs. use these lists to
// populate the select boxes.
// TODO: handle split transactions
var NewTransactionForm = function (_React$Component) {
  _inherits(NewTransactionForm, _React$Component);

  function NewTransactionForm(props) {
    _classCallCheck(this, NewTransactionForm);

    var _this = _possibleConstructorReturn(this, (NewTransactionForm.__proto__ || Object.getPrototypeOf(NewTransactionForm)).call(this, props));

    _this.state = {
      date: "",
      sourceId: "0",
      payee: "",
      categoryId: "0",
      amount: "",
      notes: ""
    };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(NewTransactionForm, [{
    key: "handleChange",
    value: function handleChange(event) {
      // TODO: validate input
      this.setState(_defineProperty({}, event.target.name, event.target.value));
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      // TODO: send form data back up to the parent
      event.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        { onSubmit: this.handleSubmit },
        React.createElement(
          "fieldset",
          null,
          React.createElement(
            "legend",
            null,
            "New Transaction"
          ),
          React.createElement(
            "dl",
            null,
            React.createElement(
              "dt",
              null,
              React.createElement(
                "label",
                { htmlFor: "date" },
                "Date"
              )
            ),
            React.createElement(
              "dd",
              null,
              React.createElement("input", { type: "date", name: "date", id: "date",
                value: this.state.date, onChange: this.handleChange, required: true })
            ),
            React.createElement(
              "dt",
              null,
              React.createElement(
                "label",
                { htmlFor: "sourceId" },
                "Payment Source"
              )
            ),
            React.createElement(
              "dd",
              null,
              React.createElement(
                "select",
                { name: "sourceId", id: "sourceId", value: this.state.sourceId,
                  onChange: this.handleChange, required: true },
                React.createElement(
                  "option",
                  { value: "0", disabled: true },
                  "Choose one"
                ),
                React.createElement(
                  "option",
                  { value: "1" },
                  "Checking"
                ),
                React.createElement(
                  "option",
                  { value: "2" },
                  "Savings"
                )
              )
            ),
            React.createElement(
              "dt",
              null,
              React.createElement(
                "label",
                { htmlFor: "payee" },
                "Payee"
              )
            ),
            React.createElement(
              "dd",
              null,
              React.createElement("input", { type: "text", name: "payee", id: "payee",
                value: this.state.payee, onChange: this.handleChange, required: true })
            ),
            React.createElement(
              "dt",
              null,
              React.createElement(
                "label",
                { htmlFor: "categoryId" },
                "Category"
              )
            ),
            React.createElement(
              "dd",
              null,
              React.createElement(
                "select",
                { name: "categoryId", id: "categoryId", value: this.state.categoryId,
                  onChange: this.handleChange, required: true },
                React.createElement(
                  "option",
                  { value: "0", disabled: true },
                  "Choose one"
                ),
                React.createElement(
                  "option",
                  { value: "1" },
                  "Groceries"
                ),
                React.createElement(
                  "option",
                  { value: "2" },
                  "Rent"
                ),
                React.createElement(
                  "option",
                  { value: "3" },
                  "Electricity"
                ),
                React.createElement(
                  "option",
                  { value: "4" },
                  "M/U Incentive"
                ),
                React.createElement(
                  "option",
                  { value: "5" },
                  "Michael Vitamins"
                ),
                React.createElement(
                  "option",
                  { value: "6" },
                  "Home Supplies"
                ),
                React.createElement(
                  "option",
                  { value: "7" },
                  "Girls needs"
                )
              )
            ),
            React.createElement(
              "dt",
              null,
              React.createElement(
                "label",
                { htmlFor: "amount" },
                "Amount"
              )
            ),
            React.createElement(
              "dd",
              null,
              React.createElement("input", { type: "number", name: "amount", id: "amount", step: "0.01",
                value: this.state.amount, onChange: this.handleChange, required: true })
            ),
            React.createElement(
              "dt",
              null,
              React.createElement(
                "label",
                { htmlFor: "notes" },
                "Notes"
              )
            ),
            React.createElement(
              "dd",
              null,
              React.createElement("input", { type: "text", name: "notes", id: "notes", value: this.state.notes,
                onChange: this.handleChange })
            )
          ),
          React.createElement("input", { type: "submit", value: "Add" })
        )
      );
    }
  }]);

  return NewTransactionForm;
}(React.Component);

// TODO: Handle split transactions.
// TODO: Handle "edit" button clicks. Brings up a form to edit the transaction 


function TransactionTableRow(props) {
  var transaction = props.transaction;

  var formatDate = function formatDate(dateString) {
    var options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  return React.createElement(
    "tr",
    null,
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
      transaction.categories[0].category
    ),
    React.createElement(
      "td",
      null,
      transaction.categories[0].amount
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
        { type: "button" },
        "Edit"
      )
    )
  );
}

var TransactionsTable = function (_React$Component2) {
  _inherits(TransactionsTable, _React$Component2);

  function TransactionsTable(props) {
    _classCallCheck(this, TransactionsTable);

    return _possibleConstructorReturn(this, (TransactionsTable.__proto__ || Object.getPrototypeOf(TransactionsTable)).call(this, props));
  }

  _createClass(TransactionsTable, [{
    key: "render",
    value: function render() {
      var transactions = this.props.transactions || [];
      var tableRows = transactions.map(function (transaction) {
        return React.createElement(TransactionTableRow, {
          key: transaction.id,
          transaction: transaction });
      });

      return React.createElement(
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
      );
    }
  }]);

  return TransactionsTable;
}(React.Component);

// TODO: pass an on submit handler to the NewTransactionForm. the handler should
// submit the new transaction to the server and handle the response. on success,
// either add the new transaction to the list of transactions maintained in
// state or send a request for entirely new set of transactions. pass those
// returned transactions to TransactionsTable


var Transactions = function (_React$Component3) {
  _inherits(Transactions, _React$Component3);

  function Transactions(props) {
    _classCallCheck(this, Transactions);

    var _this3 = _possibleConstructorReturn(this, (Transactions.__proto__ || Object.getPrototypeOf(Transactions)).call(this, props));

    _this3.state = {
      transactions: null
    };
    return _this3;
  }

  _createClass(Transactions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      fetch("/transactions").then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }).then(function (data) {
        _this4.setState({
          transactions: data.transactions
        });
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
        React.createElement(NewTransactionForm, null),
        React.createElement(TransactionsTable, { transactions: this.state.transactions })
      );
    }
  }]);

  return Transactions;
}(React.Component);

ReactDOM.render(React.createElement(Transactions, null), document.getElementById("react-root"));