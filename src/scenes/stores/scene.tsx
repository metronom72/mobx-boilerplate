import AdminLayout from '@@components/admin-panel/layout'
import { WithStyles, withStyles } from '@material-ui/core'
import React from 'react'
import styles from './styles'

export interface Props extends WithStyles<typeof styles> {}
// tslint:disable-next-line: no-empty-interface
export interface State {}

export class StoresAdmin extends React.Component<Props, State> {
  public render() {
    return <AdminLayout />
  }
}

export default withStyles(styles)(StoresAdmin)
