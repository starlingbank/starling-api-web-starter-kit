import axios from 'axios';

export const getTransactions = (source, fromDate, toDate) => {
  return axios({
    method: 'get',
    url: `/api/oauth/transactions?source=${source}&fromDate=${fromDate}&toDate=${toDate}`
  });
};

export const getBalance = () => {
  return axios.get(`/api/oauth/balance`);
};

export const getCustomer = () => {
  return axios.get(`/api/oauth/customer`);
};
