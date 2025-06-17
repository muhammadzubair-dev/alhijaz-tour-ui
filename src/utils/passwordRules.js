// utils/passwordRules.js
export const passwordRules = {
  required: 'Password wajib diisi',
  minLength: {
    value: 8,
    message: 'Password minimal 8 karakter',
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    message: 'Password harus memiliki huruf besar, huruf kecil, angka, dan simbol',
  },
};
