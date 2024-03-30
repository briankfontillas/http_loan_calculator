const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }

      fieldset {
        text-align: left;
      }

      label {
        display: inline-block;
      }

      input {
        box-sizing: border-box;
        display: inline-block;
        margin: 5px 0;
        width: 80%;
      }

      a {
        text-decoration: none;
      }
  </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `
        </tbody>
      </table>
    </article>
  </body>
</html>`;

function getParams(path) {
  const myURL = new URL(path, `http://localhost${PORT}`);
  return myURL.searchParams;
}

function calculation(amount, duration, apr) {
  let annualInterestRate = apr / 100;
  let monthlyInterestRate = annualInterestRate / 12;
  let months = Number(duration) * 12;
  let payment = amount *
    (monthlyInterestRate /
    (1 - Math.pow((1 + monthlyInterestRate), (-months))));

  return payment.toFixed(2);
}

function loanMessage(params) {
  const APR = 5;
  let amount = Number(params.get('amount'));
  let duration = Number(params.get('duration'));
  let monthlyPayment = calculation(amount, duration, APR);
  let form = `<form action="" method="get">
                <fieldset>
                  <dl>
                    <dt><label for="amount">Amount</label></dt>
                    <dd><input type="text" name="amount" required></dd>
                  </dl>
                  <dl>
                    <dt><label for="duration">Duration</label></dt>
                    <dd><input type="text" name="duration" required></dd>
                    <dd><input type="submit"></dd>
                  </dl>
                </fieldset>
              </form></dd>`
  let content = `<tr><th>Amount:</th><td>
                  <a href="/?amount=${amount - 100}&duration=${duration}">-100$</a>
                  $${amount}
                  <a href="/?amount=${amount + 100}&duration=${duration}">+100$</a>
                  </td></tr>
                 <tr><th>Duration:</th><td>
                  <a href="/?amount=${amount}&duration=${duration - 1}">-1 year</a>
                  ${duration} years
                  <a href="/?amount=${amount}&duration=${duration + 1}">+1 year</a>
                  </td></tr>
                 <tr><th>APR:</th><td>${APR}%</td></tr>
                 <tr><th>Monthly payment:</th><td>$${monthlyPayment}</td></tr>`;

  return `${HTML_START}${form}${content}${HTML_END}`;

}
const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;

  if (path !== '/favicon.ico') {
    let content = loanMessage(getParams(path))
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(`${content}\n`);
    res.end();
  } else {
    res.statusCode = 400;
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});