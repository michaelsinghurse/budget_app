// This component is responsible for rendering the form and validating all form
// input. If the form is submitted, it needs to validate the input and then pass
// the submitted data back up to its parent.
// TODO: handle split transactions
class NewTransactionForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      date: "",
      sourceId: "0",
      payee: "",
      categoryId: "0",
      amount: "",
      notes: "",
      errors: {
        date: "",
        sourceId: "",
        payee: "",
        categoryId: "",
        amount: "",
        notes: "",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    const { name, value } = event.target;
    const errors = this.state.errors;

    errors[name] = this.validateElementValue(name, value);

    this.setState({
      [name]: value,
      errors,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const errors = this.state.errors;
    const elements = event.target.elements;

    for (let index = 0; index < elements.length; index += 1) {
      const element = elements[index];

      if (!this.state.hasOwnProperty(element.name)) continue;

      errors[element.name] = this.validateElementValue(element.name, element.value);
    }
    
    if (Object.values(errors).some(errorMessage => errorMessage.length > 0)) {
      this.setState({ errors });
      return;
    }

    this.props.onSubmit({
      date: this.state.date,
      sourceId: this.state.sourceId,
      payee: this.state.payee,
      categoryId: this.state.categoryId,
      amount: this.state.amount,
      notes: this.state.notes,
    });

    this.setState({
      date: "",
      sourceId: "0",
      payee: "",
      categoryId: "0",
      amount: "",
      notes: "",
    });
  }
  
  makeErrorsListItems(errorsObject) {
    const listItems = [];

    for (let key in errorsObject) {
      const value = errorsObject[key];

      if (value) {
        listItems.push(<li key={key}>{"\u26a0" + value}</li>);
      }
    }
    return listItems;
  }

  validateElementValue(name, value) {
    let errorMessage = "";
    
    switch (name) {
      case "date":
        errorMessage = value.length > 0 
          ? ""
          : "Date is required.";
        break;
      case "sourceId":
        errorMessage = Number(value) > 0
          ? ""
          : "Payment source is required.";
        break;
      case "payee":
        if (value.length === 0) {
          errorMessage = "Payee is required.";
        } else if (value.length > 50) {
          errorMessage = "Payee must be 50 characters or less.";
        }
        break;
      case "categoryId":
        errorMessage = Number(value) > 0
          ? ""
          : "Category is required."
        break;
      case "amount":
        if (value.length === 0) {
          errorMessage = "Amount is required.";
        } else if (Number.isNaN(Number(value))) {
          errorMessage = "Amount must be a number.";
        } else {
          errorMessage = (Number(value) * 100) % 1 === 0
            ? ""
            : "Amount must be rounded to the cent (hundredths place).";
        }

        break;
      case "notes":
        errorMessage = value.length < 201 
          ? ""
          : "Notes must be 200 characters or less";
        break;
      default:
        break;
    }

    return errorMessage;
  }

  render() {
    const errorsList = this.makeErrorsListItems(this.state.errors);

    return (
      <div>
        <form noValidate onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>New Transaction</legend>
            <dl>
              <dt><label htmlFor="date">Date</label></dt>
              <dd>
                <input type="date" name="date" id="date" 
                  value={this.state.date} onChange={this.handleChange} />
              </dd>
              <dt><label htmlFor="sourceId">Payment Source</label></dt>
              <dd>
                <SettingsSelect name="sourceId" id="sourceId" value={this.state.sourceId}
                  onChange={this.handleChange} />
              </dd>
              <dt><label htmlFor="payee">Payee</label></dt>
              <dd>
                <input type="text" name="payee" id="payee" 
                  value={this.state.payee} onChange={this.handleChange} />
              </dd>
              <dt><label htmlFor="categoryId">Category</label></dt>
              <dd>
                <SettingsSelect name="categoryId" id="categoryId" value={this.state.categoryId}
                  onChange={this.handleChange} />
              </dd>
              <dt><label htmlFor="amount">Amount</label></dt>
              <dd>
                <input type="number" name="amount" id="amount" step="0.01" 
                  value={this.state.amount} onChange={this.handleChange} />
              </dd>
              <dt><label htmlFor="notes">Notes</label></dt>
              <dd>
                <input type="text" name="notes" id="notes" value={this.state.notes}
                  onChange={this.handleChange} />
              </dd>
            </dl>
          </fieldset>
          <input type="submit" value="Add" />
        </form>
        <ul>
          {errorsList}
        </ul>
      </div>
    );
  }
}

class SettingsSelect extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onChange(event);
  }

  componentDidMount() {
    const URLS = {
      sourceId: "/settings/paymentSources",
      categoryId: "/settings/budgetCategories",
    };

    const url = URLS[this.props.name];

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        this.populateSelectOptions(data);
      })
      .catch(error => {
        console.error("Problem with fetch operations:", error);
      });
  }

  populateSelectOptions(data) {
    const select = document.getElementById(this.props.id);

    data.forEach(object => {
      const option = document.createElement("option");
      option.value = object.id;
      option.appendChild(document.createTextNode(object.name));
      select.appendChild(option);
    });
  }

  render() {
    return (
      <select name={this.props.name} id={this.props.id} value={this.props.value} 
        onChange={this.handleChange} >
        <option value="0" disabled>Choose one</option>
      </select>
    );
  }
}

// TODO: Handle split transactions.
// TODO: Handle "edit" button clicks. Brings up a form to edit the transaction 
class TransactionTableRow extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleEditClick(event) {
    const transactionId = event.target.parentElement.parentElement.dataset.transactionId;
    console.log(transactionId);

    // TODO: insert an `input` element into each `td` element in the row that was
    // clicked on. give the `input` a value of the current text in the `td`.
    // give it the proper `name` attribute.
    // but how to control the component with React state and how to render
    // errors? where will the state live?
    // the alterative is for a modal dialog box to pop up.
  }

  render() {
    const transaction = this.props.transaction;

    const formatDate = dateString => {
      const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
      return (new Date(dateString)).toLocaleString("en-US", options);
    };

    return (
      <tr data-transaction-id={transaction.id}>
        <td>{formatDate(transaction.date)}</td>
        <td>{transaction.source}</td>
        <td>{transaction.payee}</td>
        <td>{transaction.categories[0].category}</td>
        <td>{transaction.categories[0].amount}</td>
        <td>{transaction.notes}</td>
        <td>
          <button type="button" onClick={this.handleEditClick}>Edit</button>
        </td>
      </tr>
    );
  }
}

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(event);
  }

  render() {
    const transactions = this.props.transactions || [];
    const tableRows = transactions.map(transaction => {
      return <TransactionTableRow 
                key={transaction.id} 
                transaction={transaction} />;
    });

    return (
      <div>
        <form id="edit-transaction" onSubmit={this.handleSubmit}></form>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Payee</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}

// TODO: pass an on submit handler to the NewTransactionForm. the handler should
// submit the new transaction to the server and handle the response. on success,
// either add the new transaction to the list of transactions maintained in
// state or send a request for entirely new set of transactions. pass those
// returned transactions to TransactionsTable
class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: null,
    };
    
    this.handleEditTransactionSubmit = this.handleEditTransactionSubmit.bind(this);
    this.handleNewTransactionSubmit = this.handleNewTransactionSubmit.bind(this);
  }
  
  componentDidMount() {
    this.fetchAllTransactions();
  }
  
  fetchAllTransactions() {
    fetch("/transactions")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          transactions: data.transactions,
        });
      })
      .catch(error => {
        console.error("Problem with fetch operations:", error);
      });
  }

  handleEditTransactionSubmit(inputs) {
    console.log("hello from Transactions component");
    console.log("inside `handleEditTransactionsSubmit` method");
    console.log("inputs:", inputs);
  }

  handleNewTransactionSubmit(inputs) {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    };

    fetch("/transactions", init)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(_data => this.fetchAllTransactions())
      .catch(error => {
        console.error("Problem with fetch operations:", error);
      });
  }

  render() {
    return (
      <div>
        <NewTransactionForm onSubmit={this.handleNewTransactionSubmit} />
        <TransactionsTable onSubmit={this.handleEditTransactionSubmit}
          transactions={this.state.transactions} />
      </div>
    );
  }
}

ReactDOM.render(
  <Transactions />,
  document.getElementById("react-root")
);
