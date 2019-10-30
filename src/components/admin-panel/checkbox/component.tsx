import { IConfigurationStore } from '@@store/configuration/types'
import { WithStyles, withStyles } from '@material-ui/core'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import React from 'react'
import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  value: boolean
  title: string
  onChange: (value: boolean) => void
}
// tslint:disable-next-line: no-empty-interface
interface State {}

@inject('configuration')
@observer
export class AdminDetailsCheckbox extends React.Component<Props> {
  public render() {
    const { classes, value, title, onChange } = this.props

    return null
  }
}

export default withStyles(styles)(AdminDetailsCheckbox)
