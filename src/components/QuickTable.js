import React from 'react';
import _ from 'lodash';
import { joinClasses } from '../commons/utils';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const getUniqueRowId = (row, projection) => {
  const keyParts = _.filter(_.entries(projection), ([ { primaryKey } ]) => {
    return primaryKey;
  });
  const keyValues = _.map(keyParts, ([ propertyName ]) => {
    return _.get(row, propertyName);
  });
  return keyValues.join('_');
};

export const Item = ({ rowId, projection, selection, item, selected, rowClickHandler, dispatch, index, context }) => {
  return <tr key={`row_${rowId}`} className={selected ? 'selected' : rowClickHandler ? 'actionable' : null}
             onClick={() => rowClickHandler ? rowClickHandler(item) : null}>
    {_.map(selection, (k, i) => {
      const cellDef = projection[ k ];
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
  dispatch: PropTypes.func,
  selected: PropTypes.any,
  rowClickHandler: PropTypes.func,
  index: PropTypes.any,
  context: PropTypes.any
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
const QuickTable = ({
                      projection, selection, items, selectedItem,
                      rowClickHandler, dispatch, isSummaryStyle, style, context
                    }) => {
  if (items && items.length) {
    return <Table style={style} className={isSummaryStyle ? 'table--summary' : null}>
      <thead>
      <tr>{_.map(selection, (k, i) => {
        const def = projection[ k ];
        return def ? <th key={`${k}_${i}`}>{def.label}</th> : null;
      })}</tr>
      </thead>
      <tbody>{
        _.map(items, (row, i) => {
          const id = getUniqueRowId(row, projection);
          const isSelected = selectedItem && getUniqueRowId(selectedItem, projection) === id;
          return <Item key={`row_${id}_${i}`} index={i} rowId={id} projection={projection} selection={selection}
                       item={row} rowClickHandler={rowClickHandler} selected={isSelected} dispatch={dispatch}
                       context={context}/>;
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
    label: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    formatter: PropTypes.func,
    cellStyle: PropTypes.string,
    cellTitle: PropTypes.string,
    cellClass: PropTypes.string,
    cellAction: PropTypes.func
  }).isRequired,

  selection: PropTypes.arrayOf(PropTypes.string).isRequired,
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.object,
  rowClickHandler: PropTypes.func,
  dispatch: PropTypes.func,
  isSummaryStyle: PropTypes.bool,
  style: PropTypes.any,
  context: PropTypes.any
};

export default QuickTable;
