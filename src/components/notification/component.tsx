import { withStyles } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import React from 'react'

const styles: any = (theme: any) => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
})

interface Props {
  id: string
  remove: (id: string) => void
  timeout: number | null
  message: string
  enabled?: boolean
}

// tslint:disable-next-line: no-empty-interface
interface State {}

export class Notification extends React.Component<Props, State> {
  public handleClose = () => {
    this.props.remove(this.props.id)
  }

  public render() {
    const { timeout, message, enabled } = this.props
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
          open={!!enabled}
          autoHideDuration={timeout ? timeout : undefined}
          message={<span id="message-id">{message}</span>}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          onClose={this.handleClose}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleClose}>
              <Icon>close</Icon>
            </IconButton>,
          ]}
        />
      </div>
    )
  }
}

export default Notification
