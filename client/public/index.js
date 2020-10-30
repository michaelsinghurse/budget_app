var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: after mounting, send get requests for a list of payment source id-name
// pairs and a list of payment category id-name pairs. use these lists to
// populate the select boxes.
var NewTransactionForm = function (_React$Component) {
  _inherits(NewTransactionForm, _React$Component);

  function NewTransactionForm(props) {
    _classCallCheck(this, NewTransactionForm);

    return _possibleConstructorReturn(this, (NewTransactionForm.__proto__ || Object.getPrototypeOf(NewTransactionForm)).call(this, props));
  }

  _createClass(NewTransactionForm, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        { action: "/transactions", method: "post" },
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
              React.createElement("input", { type: "date", name: "date", id: "date", required: true })
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
                { name: "sourceId", id: "sourceId", required: true, defaultValue: "0" },
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
              React.createElement("input", { type: "text", name: "payee", id: "payee", required: true })
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
                { name: "categoryId", id: "categoryId", required: true, defaultValue: "0" },
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
              React.createElement("input", { type: "number", name: "amount", id: "amount", step: "0.01", required: true })
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
              React.createElement("input", { type: "text", name: "notes", id: "notes" })
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


function TransactionTableRow(props) {
  var transaction = props.transaction;
  var formatDate = function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(options);
  };
  return React.createElement(
    "tr",
    null,
    React.createElement(
      "td",
      null,
      formatDate(transactions.date)
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
// TODO: after mounting, send a request to the server for a list of
// transactions. pass those transactions to TransactionsTable


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