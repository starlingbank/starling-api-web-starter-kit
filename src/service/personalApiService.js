import axios from 'axios';

export const getTransactions = (source, fromDate, toDate) => {
  return axios({
    method: 'get',
    url: `/api/my/transactions?source=${source}&fromDate=${fromDate}&toDate=${toDate}`
  });
};

export const getBalance = () => {
  return axios.get(`/api/my/balance`);
};

export const getCustomer = () => {
  return axios.get(`/api/my/customer`);
};
