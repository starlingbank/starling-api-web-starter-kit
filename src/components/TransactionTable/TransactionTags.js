import _ from 'lodash';
import React from "react";
import Select from 'react-select';
import { connect } from 'react-redux';
import {addTransactionTag, deleteTransactionTag} from '../../routes/PersonalAccess/modules/personalAccess';

// import {lookup, iconClasses, amountDisplay, sourceDisplay} from "../../commons/utils";
// import {Container, Table, Icon} from "semantic-ui-react";
// import TransactionTags from './TransactionTags';

// TODO
// connect actions, no state
// dispatch transaction adding / delteing actions directly / manually
// ...

const handleOnChange = (transaction, existingTags, dispatch) => (updatedTags) => {
  console.log('HANDLE ON CHANGE', transaction.id, transaction.created, updatedTags);

  let a = new Set(_.map(existingTags, 'value'));
  let b = new Set(_.map(updatedTags, 'value'));
  const toRemove = new Set([...a].filter(x => !b.has(x))); // in a, not in b
  const toAdd = new Set([...b].filter(x => !a.has(x))); // in b, not in a

  toRemove.forEach((r) => {
    console.debug('Removing tag', r);
    dispatch(deleteTransactionTag({transactionUid: transaction.id}, r));
  });
  toAdd.forEach((r) => {
    console.debug('Adding tag', r);
    dispatch(addTransactionTag({transactionUid: transaction.id, created: transaction.created}, r));
  });
};

export const TransactionTags = ({dispatch, transaction, transactionTags, tags, tagSuggestions}) => {
  const existingTags = transactionTags[transaction.id];
  const options = tags.map((tag) => ({label: tag, value: tag}));
  const onChange = handleOnChange(transaction, existingTags, dispatch);
  return <Select.Creatable
           options={options}
           onChange={onChange}
           value={existingTags} multi />
};

export default connect()(TransactionTags);

// export const TransactionTable = ({transactions, transactionTags, tags, tagSuggestions}) =>{
//   return <Container>
//       <Table selectable>
//         <thead>
//         <tr>
//           <th/>
//           <th width="300px">Description</th>
//           <th>Source</th>
//           <th>Tags</th>
//           <th width="105px">Amount</th>
//           <th width="105px">Balance</th>
//           <th>Date</th>
//         </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction, index) => <TransactionItem
//                                                       key={index}
//                                                       transaction={transaction}
//                                                       transactionTags={transactionTags}
//                                                       tags={tags}
//                                                       tagSuggestions={tagSuggestions} />)}
//         </tbody>
//       </Table>
//     </Container>;
// };

// const TransactionItem = ({transaction, transactionTags, tags, tagSuggestions}) => {
//   const itemClass = lookup(transaction.source).in(iconClasses).orDefault('pound');
//   const displayBalance = transaction.balance ? amountDisplay(transaction.balance, transaction.currency) : null;
//   const displayAmount = amountDisplay(transaction.amount, transaction.currency);
//   const displaySource = lookup(transaction.source).in(sourceDisplay).orDefault('Other');

//   return <tr>
//     <td style={{textAlign: 'center'}}>
//       <Icon size="large" name={itemClass} style={{textAlign: 'center'}}/>
//     </td>
//     <td>{transaction.narrative}</td>
//     <td>{displaySource}</td>
//     <td><TransactionTags
//           transaction={transaction}
//           transactionTags={transactionTags}
//           tags={tags}
//           tagSuggestions={tagSuggestions} /></td>
//     <td className="right-aligned">{displayAmount}</td>
//     <td>{displayBalance}</td>
//     <td>
//       <div className="ui label">
//         {new Date(transaction.created).toLocaleDateString('en-GB', {
//           day: 'numeric',
//           month: 'numeric',
//           year: 'numeric'
//         }).split(' ').join('/')}
//       </div>
//     </td>
//   </tr>;
// };
