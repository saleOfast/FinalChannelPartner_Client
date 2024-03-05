export const validEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
export const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
export const validPhone = new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$');
export const validZip = new RegExp('^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$');