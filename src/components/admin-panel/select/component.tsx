import { WithStyles, withStyles } from '@material-ui/core'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import React from 'react'
import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  value: any
  title: string
  variants: any[]
  onChange: (value: any) => void
}
// tslint:disable-next-line: no-empty-interface
interface State {
  currentStore: string | null
}

@inject('configuration')
@observer
export class AdminDetailsSelect extends React.Component<Props> {
  public render() {
    const { classes, value, title, variants, onChange } = this.props

    return null
  }
}

export default withStyles(styles)(AdminDetailsSelect)
