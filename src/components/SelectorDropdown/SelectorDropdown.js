import React from 'react';
import { Button, Dropdown, Form, Grid } from 'semantic-ui-react';
import { Field, formValueSelector, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { isEmpty, keys } from 'lodash';
import { doOAuthTransactionFilter } from '../../routes/OAuth/modules/oauth';
import { doPersonalTransactionFilter } from '../../routes/PersonalAccess/modules/personalAccess';
import { doSandboxTransactionFilter } from '../../routes/Sandbox/modules/sandbox';

const onClick = (values, dispatch) => {
  return new Promise((resolve) => {
    const errors = {};
    if (isEmpty(values.source)) {
      errors.source = 'Choose a transaction type to filter by.'
    }
    if (keys(errors).length) {
      throw new SubmissionError(errors);
    } else {
      if (values.mode === 'Production') {
        dispatch(doOAuthTransactionFilter(values.source));
      } else if (values.mode === 'Personal Access') {
        dispatch(doPersonalTransactionFilter(values.source));
      } else {
        dispatch(doSandboxTransactionFilter(values.source));
      }
      resolve();
    }
  });
};

const options = [
  { text: 'Card Payments', value: 'MASTER_CARD' },
  { text: 'Direct Debits', value: 'DIRECT_DEBIT' },
  { text: 'Inbound Payments', value: 'FASTER_PAYMENTS_IN' },
  { text: 'Outbound Payments', value: 'FASTER_PAYMENTS_OUT' }
];

class SelectorDropdown extends React.Component {

  render () {
    const { handleSubmit, submitting, mode } = this.props;
    return (
      <Grid >
        <Form style={{ margin: '0 80px 0 auto' }} inverted loading={submitting}
              onSubmit={handleSubmit((data, dispatch) => {
                const formParams = {
                  source: data.source,
                  mode
                };
                return onClick(formParams, dispatch)
              })}>
          <Form.Group widths='equal'>
            <Field label="Filter Transactions" type="select" name="source" component={selectComponent}/>
            <Button primary disabled={submitting} type="submit">Select</Button>
          </Form.Group>
        </Form>
      </Grid>
    )
  }
}

const selectComponent = (props) => {
  return (
    <Form.Field>
      <Dropdown options={options} selection={true} {...props.input}
                value={props.input.value}
                onChange={(param, data) => props.input.onChange(data.value)}
                placeholder={props.label}
      />
    </Form.Field>
  )
};

SelectorDropdown = reduxForm({
  form: 'sourceForm'
})(SelectorDropdown);

const selector = formValueSelector('sourceForm');

SelectorDropdown = connect(
  state => ({
    firstValue: selector(state, 'source')
  })
)(SelectorDropdown);

export default SelectorDropdown
