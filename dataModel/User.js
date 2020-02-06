function User(nombre, apellidos, correo, fechaNacimiento, password, telefono) {
  this.nombre = nombre;
  this.apellidos = apellidos;
  this.correo = correo;
  this.fechaNacimiennto = fechaNacimiento;
  this.password = password;
  this.telefono = telefono;
  this.vip = 0;
}
module.exports = {
  User:User
};
