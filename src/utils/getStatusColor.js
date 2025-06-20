const getStatusColor = (status) => {
  switch (status) {
    case '0':
      return { color: 'orange', label: 'Pending' };
    case '1':
      return { color: 'blue', label: 'In Progress' };
    case '2':
      return { color: 'green', label: 'Done' };
    case '3':
      return { color: 'red', label: 'Rejected' };
    default:
      return { color: 'gray', label: 'Unknown' };
  }
};

export default getStatusColor