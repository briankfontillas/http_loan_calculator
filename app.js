const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
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
  let content = `<tr><th>Amount:</th><td>$${amount}</td></tr>
                 <tr><th>Duration:</th><td>${duration} years</td></tr>
                 <tr><th>APR:</th><td>${APR}%</td></tr>
                 <tr><th>Monthly payment:</th><td>$${monthlyPayment}</td></tr>`;

  return `${HTML_START}${content}${HTML_END}`;

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