import { createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    details: {
      borderLeft: `1px solid ${theme.palette.background.default}`,
      marginLeft: '10px',
      paddingTop: '10px',
    },
    json: {
      fontSize: '10px',
      lineHeight: '20px',
    },
    row: {
      alignItems: 'center',
      display: 'flex',
      padding: '10px',
    },
    rowTitle: {
      paddingRight: '20px',
    },
  })

export default styles
