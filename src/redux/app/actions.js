/** App actions set variables that are used globally */

const actions = {
  // Constants definition
  LOADING: 'LOADING',
  GET_SERVER_INFO: 'GET_SERVER_INFO',
  GET_SERVER_INFO_RESULT: 'GET_SERVER_INFO_RESULT',
  SET_ERROR: 'SET_ERROR',

  // Functions definition
  loading: (isLoading) => ({
    type: actions.LOADING,
    value: isLoading,
  }),
  getServerInfo: () => {
    console.log('getServerInfo is called.');
    return {
      type: actions.GET_SERVER_INFO,
    };
  },
};

export default actions;
