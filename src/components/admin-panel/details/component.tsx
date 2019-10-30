import { IConfigurationStore } from '@@store/configuration/types'
import { FieldTypes, ICommonStore, IDataView, IEditableStore } from '@@store/types'
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  WithStyles,
  withStyles,
} from '@material-ui/core'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import React from 'react'
import JSONPretty from 'react-json-pretty'
import uuid from 'uuid'
import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  storeName: string
  configuration?: IConfigurationStore
}
// tslint:disable-next-line: no-empty-interface
interface State {}

@inject('configuration')
@observer
export class AdminDetails extends React.Component<Props> {
  public render() {
    const { classes, storeName } = this.props
    const configuration = this.props.configuration!
    const store =
      storeName === configuration.storeName
        ? configuration
        : (configuration.stores[storeName] as IEditableStore & ICommonStore)

    return store && (store as any).editable ? (
      <div className={classnames(classes.details)}>
        {store.rows.map(row => {
          return (
            <div key={row.fieldName} className={classnames(classes.row)}>
              <div className={classnames(classes.rowTitle)}>{row.title}</div>
              {this.renderRowField(row, store[row.fieldName], (__, value: any) =>
                this.onChangeField(storeName, row.fieldName, value)
              )}
            </div>
          )
        })}
      </div>
    ) : null
  }

  private onChangeField = (storeName: string, fieldName: string, value: any) => {
    const configuration = this.props.configuration!
    const store =
      storeName === configuration.storeName
        ? configuration
        : (configuration.stores[storeName] as IEditableStore & ICommonStore)
    store[fieldName] = value
  }

  private renderRowField = (row: IDataView, value: any, onChange: (...rest: any) => void) => {
    switch (row.fieldType) {
      case FieldTypes.CHECKBOX:
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={onChange}
                value={row.fieldName}
                disabled={!row.editable}
              />
            }
            label={row.fieldName}
          />
        )
      case FieldTypes.INPUT:
        return (
          <TextField
            label={row.fieldName}
            value={value}
            onChange={onChange}
            placeholder={row.fieldName}
            disabled={!row.editable}
          />
        )
      case FieldTypes.JSON:
        return <JSONPretty className={this.props.classes.json} id={uuid.v4()} data={value} />
      case FieldTypes.SELECT:
        return (
          <Select
            value={value}
            onChange={onChange}
            disabled={!row.editable}
            placeholder={row.fieldName}
          >
            {(row.variants || []).map(variant => {
              return (
                <MenuItem key={variant.value} value={variant.value}>
                  {variant.label}
                </MenuItem>
              )
            })}
          </Select>
        )
      case FieldTypes.TOGGLE:
        return (
          <FormControlLabel
            control={<Switch checked={!!value} disabled={!row.editable} onChange={onChange} />}
            label={row.fieldName}
          />
        )
    }
  }
}

export default withStyles(styles)(AdminDetails)
