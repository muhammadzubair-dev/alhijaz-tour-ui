function numberId(number) {
  if (number == null) return '0'; // menangani null dan undefined
  return new Intl.NumberFormat('id-ID').format(number);
}

export default numberId;
