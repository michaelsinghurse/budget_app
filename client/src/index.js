// TODO: re-write html of the form so that category and amount are horizontally
// next to each other. add a button to split transaction.
// TODO: handle split button click. add another category-amount pair. add a
// button to add another split or to remove the current split.
class NewTransactionForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      date: "",
      sourceId: "0",
      payee: "",
      categories: [{
        categoryId: "0",
        amount: "",
      }],
      notes: "",
      errors: {
        date: "",
        sourceId: "",
        payee: "",
        categories: [{
          categoryId: "",
          amount: "",
        }],
        notes: "",
      },
    };

    this.handleAddSplitClick = this.handleAddSplitClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDeleteSplitClick = this.handleDeleteSplitClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAddSplitClick(event) {
    const categories = this.state.categories;
    const errors = this.state.errors;

    categories.push({
      categoryId: "0",
      amount: "",
    });

    errors.categories.push({
      categoryId: "",
      amount: "",
    });

    this.setState({ 
      categories,
      errors, 
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const errors = this.state.errors;

    if (name.includes("categoryId") || name.includes("amount")) {
      const categories = this.state.categories;
      const baseName = name.slice(0, name.indexOf("_"));
      const index = Number(name.slice(name.indexOf("_") + 1));

      categories[index][baseName] = value;
      
      errors.categories[index][baseName] = this.validateElementValue(baseName, value);

      this.setState({
        categories,   
        errors,
      });
    } else {
      errors[name] = this.validateElementValue(name, value);

      this.setState({
        [name]: value,
        errors,
      });
    }
  }
  
  handleDeleteSplitClick(event) {
    const id = event.target.id;
    const categoryIndex = Number(id.slice(id.indexOf("_") + 1));

    const categories = this.state.categories;
    const errors = this.state.errors;

    categories.splice(categoryIndex, 1);
    errors.categories.splice(categoryIndex, 1);

    this.setState({
      categories,
      errors,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const errors = this.state.errors;
    const elements = event.target.elements;

    for (let index = 0; index < elements.length; index += 1) {
      const { name, value } = elements[index];
      
      if (name.includes("categoryId") || name.includes("amount")) {
        const baseName = name.slice(0, name.indexOf("_"));
        const index = Number(name.slice(name.indexOf("_") + 1));

        errors.categories[index][baseName] = this.validateElementValue(baseName, value);

      } else if (this.state.hasOwnProperty(name)) {
        errors[name] = this.validateElementValue(name, value);
      }
    }
    
    if (this.hasErrorMessage(errors)) { 
      this.setState({ errors });
      return;
    }

    this.props.onSubmit({
      date: this.state.date,
      sourceId: this.state.sourceId,
      payee: this.state.payee,
      categories: this.state.categories,
      notes: this.state.notes,
    });

    this.setState({
      date: "",
      sourceId: "0",
      payee: "",
      categories: [{
        categoryId: "0",
        amount: "",
      }],
      notes: "",
    });
  }

  hasErrorMessage(errorsObject) {
    for (let key in errorsObject) {
      if (key === "categories") {
        for (let index = 0; index < errorsObject.categories.length; index += 1) {
          const category = errorsObject.categories[index];
          for (let key2 in category) {
            if (category[key2] !== "") {
              return true;
            }
          }
        }
      } else {
        if (errorsObject[key] !== "") {
          return true;
        }
      }
    }

    return false;
  }
  
  makeErrorsListItems(errorsObject) {
    const listItems = [];

    for (let key in errorsObject) {
      if (key === "categories") {
        errorsObject[key].forEach((category, index) => {
          for (let key2 in category) {
            const value = category[key2];
            if (value) {
              listItems.push(<li key={key2 + "_" + index}>
                {`\u26a0 ${value} (category-amount ${index})`}
              </li>);
            }
          }
        });
      } else {
        const value = errorsObject[key];

        if (value) {
          listItems.push(<li key={key}>{"\u26a0" + value}</li>);
        }
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
    
    const categoriesAndAmounts = this.state.categories.map((category, index) => {
      return (
        <fieldset key={index}>
          <label>
            Category
            <SettingsSelect name={"categoryId_" + index} id={"categoryId_" + index}
              value={category.categoryId} onChange={this.handleChange} />
          </label>
          <label>
            Amount
            <input type="number" name={"amount_" + index} id={"amount_" + index} 
              step="0.01" value={category.amount} onChange={this.handleChange} />
          </label>
          {index === 0 &&
            <button type="button" onClick={this.handleAddSplitClick}>Split</button>
          }
          {index > 0 &&
            <button type="button" id={"deleteSplit_" + index} 
              onClick={this.handleDeleteSplitClick}>Delete</button>
          }
        </fieldset>
      );
    });

    return (
      <div>
        <form noValidate onSubmit={this.handleSubmit}>
          <h2>New Transaction</h2>
          <div>
            <label>
              Date
              <input type="date" name="date" id="date" 
                value={this.state.date} onChange={this.handleChange} />
            </label>
          </div>
          <div>
            <label>
              Payment Source
              <SettingsSelect name="sourceId" id="sourceId" value={this.state.sourceId}
                onChange={this.handleChange} />
            </label>
          </div>
          <div>
            <label>
              Payee
              <input type="text" name="payee" id="payee" 
                value={this.state.payee} onChange={this.handleChange} />
            </label>
          </div>

          {categoriesAndAmounts}

          <div>
            <label>
              Notes
              <input type="text" name="notes" id="notes" value={this.state.notes}
                onChange={this.handleChange} />
            </label>
          </div>
          <div>
            <input type="submit" value="Add" />
          </div>
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
    
    let name = this.props.name;

    if (name.includes("_")) {
      name = name.slice(0, name.indexOf("_"));
    }

    const url = URLS[name];

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

// TODO: Add button to show split transaction categories and amounts.
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
    
    const category = transaction.categories.length > 1
      ? "SPLIT"
      : transaction.categories[0].category;

    const amount = transaction.categories.length > 1
      ? transaction.categories.reduce((sum, category) => {
          sum += Number(category.amount);
          return sum;
        }, 0)
      : transaction.categories[0].amount;

    return (
      <tr data-transaction-id={transaction.id}>
        <td>{formatDate(transaction.date)}</td>
        <td>{transaction.source}</td>
        <td>{transaction.payee}</td>
        <td>{category}</td>
        <td>{amount}</td>
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

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
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
          isLoaded: true,
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
        {this.state.isLoaded &&
          <TransactionsTable onSubmit={this.handleEditTransactionSubmit}
            transactions={this.state.transactions} />
        }
        {!this.state.isLoaded &&
          <div>Loading...</div>
        }
      </div>
    );
  }
}

ReactDOM.render(
  <Transactions />,
  document.getElementById("react-root")
);
