import React, { PropTypes } from 'react';
import _ from 'lodash';
import {joinClasses, lookup, iconClasses, amountDisplay, sourceDisplay} from "../commons/utils";
import {Container, Table, Icon} from "semantic-ui-react";

export const getUniqueRowId = (row, projection) => {
  const keyParts = _.filter(_.entries(projection), ([propertyName, {primaryKey}]) => {
    return primaryKey;
  });
  const keyValues = _.map(keyParts, ([propertyName, __]) => {
    return _.get(row, propertyName);
  });
  const id = keyValues.join('_');
  return id;
};

export const Item = ({rowId, projection, selection, item, selected, rowClickHandler, dispatch, index, context}) => {
  return <tr key={`row_${rowId}`} className={selected ? 'selected' : (rowClickHandler ? 'actionable' : null)} onClick={() => rowClickHandler ? rowClickHandler(item) : null}>
    {_.map(selection, (k, i) => {
      const cellDef = projection[k];
      const cellVal = _.get(item, k);
      return cellDef
        ? <td style={cellDef.cellStyle ? cellDef.cellStyle : null}
              title={cellDef.cellTitle ? cellDef.cellTitle(item, cellVal, index, context) : null}
              className={joinClasses(cellDef.cellClass, cellDef.cellAction ? 'actionable' : null)}
              onClick={cellDef.cellAction ? () => cellDef.cellAction(item, cellVal, dispatch, index, context) : null}
              key={`cell_${rowId}_${i}`}>
            {cellDef.formatter ? cellDef.formatter(item, cellVal, dispatch, index, context) : cellVal}
          </td>
        : null;
    })}
  </tr>;
};

Item.propTypes = {
  rowId: PropTypes.string.isRequired,
  projection: PropTypes.object.isRequired,
  selection: PropTypes.arrayOf(PropTypes.string),
  item: PropTypes.object.isRequired,
  dispatch: PropTypes.func // Provide this to item formatters so a cell can format a button or link to invoke a row level action
};

/**
 * Consumers must provide a projection definition like:
 *
 * {
 *   uid: { primaryKey: true, label: 'ID' },
 *   createdAt: { label: 'Created', formatter: (row, createdAt) => formatDateTime(createdAt) },
 *   ...
 * }
 */
const QuickTable = ({projection, selection, items, selectedItem, rowClickHandler, dispatch, isSummaryStyle, style, context}) => {
  if (items && items.length) {
    return <Table style={style} className={isSummaryStyle ? 'table--summary' : null}>
      <thead><tr>{_.map(selection, (k, i) => {
        const def = projection[k];
        return def ? <th key={`${k}_${i}`}>{def.label}</th> : null;
      })}</tr></thead>
      <tbody>{
        _.map(items, (row, i) => {
          const id = getUniqueRowId(row, projection);
          const isSelected = selectedItem && getUniqueRowId(selectedItem, projection) === id;
          return <Item key={`row_${id}_${i}`} index={i} rowId={id} projection={projection} selection={selection} item={row} rowClickHandler={rowClickHandler} selected={isSelected} dispatch={dispatch} context={context}/>;
        })}
      </tbody>
    </Table>;
  }
  return null;
};

QuickTable.propTypes = {

  // Defines how to render each property of each item
  projection: PropTypes.shape({
    primaryKey: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    formatter: PropTypes.func,
    cellStyle: PropTypes.string,
    cellTitle: PropTypes.string,
    cellClass: PropTypes.string,
    cellAction: PropTypes.func
  }).isRequired,

  // Which of the properties in projection to render as columns
  selection: PropTypes.arrayOf(PropTypes.string).isRequired,

  // The items to render
  items: PropTypes.array.isRequired,

  // The selected row item
  selectedItem: PropTypes.object,

  // Invoke on row click receiving the row item
  rowClickHandler: PropTypes.func,

  // Provide this to item formatters so a cell can format a button or link to invoke a row level action
  dispatch: PropTypes.func,

  // Makes the font and padding smaller
  isSummaryStyle: PropTypes.bool
};

export default QuickTable;
