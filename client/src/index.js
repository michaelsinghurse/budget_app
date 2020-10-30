// TODO: after mounting, send get requests for a list of payment source id-name
// pairs and a list of payment category id-name pairs. use these lists to
// populate the select boxes.
class NewTransactionForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form action="/transactions" method="post">
        <fieldset>
          <legend>New Transaction</legend>
          <dl>
            <dt><label htmlFor="date">Date</label></dt>
            <dd><input type="date" name="date" id="date" required/></dd>
            <dt><label htmlFor="sourceId">Payment Source</label></dt>
            <dd>
              <select name="sourceId" id="sourceId" required defaultValue="0">
                <option value="0" disabled>Choose one</option>
                <option value="1">Checking</option>
                <option value="2">Savings</option>
              </select>
            </dd>
            <dt><label htmlFor="payee">Payee</label></dt>
            <dd><input type="text" name="payee" id="payee" required/></dd>
            <dt><label htmlFor="categoryId">Category</label></dt>
            <dd>
              <select name="categoryId" id="categoryId" required defaultValue="0" >
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
              <input type="number" name="amount" id="amount" step="0.01" required/>
            </dd>
            <dt><label htmlFor="notes">Notes</label></dt>
            <dd><input type="text" name="notes" id="notes" /></dd>
          </dl>
          <input type="submit" value="Add" />
        </fieldset>
      </form>
    );
  }
}

// TODO: Handle split transactions.
function TransactionTableRow(props) {
  const transaction = props.transaction;
  const formatDate = dateString => {
    return (new Date(dateString)).toLocaleDateString(options);
  };
  return (
    <tr>
      <td>{formatDate(transactions.date)}</td>
      <td>{transaction.source}</td>
      <td>{transaction.payee}</td>
      <td>{transaction.categories[0].category}</td>
      <td>{transaction.categories[0].amount}</td>
      <td>{transaction.notes}</td>
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
// TODO: after mounting, send a request to the server for a list of
// transactions. pass those transactions to TransactionsTable
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
