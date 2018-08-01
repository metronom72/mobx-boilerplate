export const setCredentials = context => (field, value) => event => {
  if (context.setState) {
    if (!context.state) {
      throw new Error('state doesn\'t exist');
    }
    if (!context.state.credentials) {
      throw new Error('state\'s credentials doesn\'t exist');
    }
    context.setState({
      ...context.state,
      credentials: {
        ...context.state.credentials,
        [field]: value || event.target.value,
      },
    });
  } else throw new Error('setState is undefined');
};
