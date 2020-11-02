// This component is responsible for rendering the form and validating all form
// input. If the form is submitted, it needs to validate the input and then pass
// the submitted data back up to its parent.
// TODO: after mounting, send get requests for a list of payment source id-name
// pairs and a list of payment category id-name pairs. use these lists to
// populate the select boxes.
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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    // TODO: validate input
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    // TODO: send form data back up to the parent
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>New Transaction</legend>
          <dl>
            <dt><label htmlFor="date">Date</label></dt>
            <dd>
              <input type="date" name="date" id="date" 
                value={this.state.date} onChange={this.handleChange} required/>
            </dd>
            <dt><label htmlFor="sourceId">Payment Source</label></dt>
            <dd>
              <select name="sourceId" id="sourceId" value={this.state.sourceId} 
                onChange={this.handleChange} required>
                <option value="0" disabled>Choose one</option>
                <option value="1">Checking</option>
                <option value="2">Savings</option>
              </select>
            </dd>
            <dt><label htmlFor="payee">Payee</label></dt>
            <dd>
              <input type="text" name="payee" id="payee" 
                value={this.state.payee} onChange={this.handleChange} required/>
            </dd>
            <dt><label htmlFor="categoryId">Category</label></dt>
            <dd>
              <select name="categoryId" id="categoryId" value={this.state.categoryId}
                onChange={this.handleChange} required>
                <option value="0" disabled >Choose one</option>
                <option value="1">Groceries</option>
                <option value="2">Rent</option>
                <option value="3">Electricity</option>
                <option value="4">M/U Incentive</option>
                <option value="5">Michael Vitamins</option>
                <option value="6">Home Supplies</option>
                <option value="7">Girls needs</option>
              </select>
            </dd>
            <dt><label htmlFor="amount">Amount</label></dt>
            <dd>
              <input type="number" name="amount" id="amount" step="0.01" 
                value={this.state.amount} onChange={this.handleChange} required/>
            </dd>
            <dt><label htmlFor="notes">Notes</label></dt>
            <dd>
              <input type="text" name="notes" id="notes" value={this.state.notes}
                onChange={this.handleChange} />
            </dd>
          </dl>
          <input type="submit" value="Add" />
        </fieldset>
      </form>
    );
  }
}

// TODO: Handle split transactions.
// TODO: Handle "edit" button clicks. Brings up a form to edit the transaction 
function TransactionTableRow(props) {
  const transaction = props.transaction;

  const formatDate = dateString => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return (new Date(dateString)).toLocaleString("en-US", options);
  };

  return (
    <tr>
      <td>{formatDate(transaction.date)}</td>
      <td>{transaction.source}</td>
      <td>{transaction.payee}</td>
      <td>{transaction.categories[0].category}</td>
      <td>{transaction.categories[0].amount}</td>
      <td>{transaction.notes}</td>
      <td><button type="button">Edit</button></td>
    </tr>
  );
}

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const transactions = this.props.transactions || [];
    const tableRows = transactions.map(transaction => {
      return <TransactionTableRow 
                key={transaction.id} 
                transaction={transaction} />;
    });

    return (
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
  }
  
  componentDidMount() {
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

  render() {
    return (
      <div>
        <NewTransactionForm />
        <TransactionsTable transactions={this.state.transactions} />
      </div>
    );
  }
}

ReactDOM.render(
  <Transactions />,
  document.getElementById("react-root")
);
