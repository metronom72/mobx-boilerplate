import { createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    adminLayout: {
      ['@media (max-width:780px)']: {
        display: 'none',
      },
      overflowY: 'scroll',
      position: 'relative',
      zIndex: 0,
    },
    adminMenu: {
      height: '100%',
      maxWidth: '150px',
    },
    adminPaper: {
      display: 'flex',
      width: 'calc(100vw - 480px)',
    },
    header: {
      fontSize: '1.5em',
      padding: '20px',
    },
  })

export default styles
