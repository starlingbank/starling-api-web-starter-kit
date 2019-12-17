import axios from 'axios';
import querystring from 'querystring';

export const getTransactions = (from, to) => {
  return axios({
    method: 'get',
    url: `/api/sandbox/transactions?${querystring.stringify({ from, to })}`
  });
};

export const getBalance = () => {
  return axios.get(`/api/sandbox/balance`);
};

export const getCustomer = () => {
  return axios.get(`/api/sandbox/customer`);
};
