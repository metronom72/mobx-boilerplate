import Details from '@@components/admin-panel/details'
import { IConfigurationStore } from '@@store/configuration/types'
import { AppBar, MenuItem, MenuList, Paper, WithStyles, withStyles } from '@material-ui/core'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import React from 'react'
import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  configuration?: IConfigurationStore
}
// tslint:disable-next-line: no-empty-interface
interface State {
  currentStore: string | null
}

@inject('configuration')
@observer
export class AdminLayout extends React.Component<Props, State> {
  public state = {
    currentStore: null,
  }

  public render() {
    const { classes } = this.props
    const configuration = this.props.configuration!

    return configuration.configured ? (
      <div className={classnames(classes.adminLayout)}>
        <AppBar position="relative" color="primary" className={classes.header}>
          {this.state.currentStore || configuration.storeName}
        </AppBar>
        <Paper className={classnames(classes.adminPaper)}>
          <MenuList className={classnames(classes.adminMenu)}>
            <MenuItem
              key={configuration.storeName}
              onClick={this.selectStoreName(configuration.storeName)}
            >
              {configuration.storeName}
            </MenuItem>
            {Object.values(configuration.stores).map(item => {
              return (
                <MenuItem key={item.storeName} onClick={this.selectStoreName(item.storeName)}>
                  {item.storeName}
                </MenuItem>
              )
            })}
          </MenuList>
          <Details storeName={this.state.currentStore || configuration.storeName} />
        </Paper>
      </div>
    ) : null
  }

  private selectStoreName = storeName => () => this.setState({ currentStore: storeName })
}

export default withStyles(styles)(AdminLayout)
