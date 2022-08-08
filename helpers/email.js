import nodemailer from "nodemailer";


// ------------------------- Registro -------------------------
export const emailRegistro = async (datos) => {

    const {email, nombre, token} = datos

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    //   informacion del email
    const info = await transport.sendMail({
      from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject: "Uptask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre}. Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprueba cuenta aquí</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>`,
    })
}


// ------------------------- Olvide mi contraseña -------------------------
export const emailOlvidePassword = async (datos) => {

  const {email, nombre, token} = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //   informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject: "Uptask - Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>
        <p>sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablece tu Password</a>
        </p>
        <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>`,
  })
}