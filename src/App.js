import './App.css';
import {useEffect, useState} from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(transactions => {
      setTransactions(transactions);
    });
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(' ')[0];

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ price, name: name.substring(price.length + 1), description, datetime })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDateTime('');
        setDescription('');

        getTransactions().then(setTransactions);
      });
    });
  }

  let balance = 0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  const dollars = balance.split('.')[0];

  const filteredIncomeTransactions = transactions.filter(t => t.price > 0);
  const incomeData = {
    labels: filteredIncomeTransactions.map(t => t.datetime.split('T')[0]),
    datasets: [{
      label: 'Total Income',
      data: filteredIncomeTransactions.map(t => t.price),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
      tension: 0.3
    }]
  };

  return (
    <main>
      <h1>${dollars}<span>{"." + fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type="text" 
                 value={name}
                 onChange={ev => setName(ev.target.value)}
                 placeholder={'+200 new samsung tv'} />
          <input type="datetime-local"
                 value={datetime}
                 onChange={ev => setDateTime(ev.target.value)} />
        </div>
        <div className='description'>
          <input type="text" placeholder={'Description'}
                 value={description}
                 onChange={ev => setDescription(ev.target.value)} />
        </div>
        <button type="submit">Add new transactions</button>
      </form>

      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className='transaction' key={transaction.id}>
            <div className='left'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
              <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
              <div className='datetime'>{transaction.datetime}</div>
            </div>
          </div>
        ))}


        <div className="graph-container">
          <h2>Total Income Over Time</h2>
          <Line data={incomeData} />
        </div>
      </div>
    </main>
  );
}

export default App;
