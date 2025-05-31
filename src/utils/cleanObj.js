function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );
}

export default cleanObject
