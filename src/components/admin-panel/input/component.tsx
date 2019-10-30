import { WithStyles, withStyles } from '@material-ui/core'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import React from 'react'
import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  title: string
  value: string
  onChange: (value: string) => void
}
// tslint:disable-next-line: no-empty-interface
interface State {}

@inject('configuration')
@observer
export class AdminDetailsInput extends React.Component<Props> {
  public render() {
    const { classes, title, value, onChange } = this.props

    return null
  }
}

export default withStyles(styles)(AdminDetailsInput)
