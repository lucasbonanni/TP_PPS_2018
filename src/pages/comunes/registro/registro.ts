import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//FORM
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
//PAGINAS
import { LoginPage } from '../../index-paginas';;
//SERVICIOS
import { UsuarioServicioProvider } from '../../../providers/usuario-servicio/usuario-servicio';
import { AuthAdministradorProvider } from '../../../providers/auth-administrador/auth-administrador';
import { UtilidadesProvider } from '../../../providers/utilidades/utilidades';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  mostrarSpinner:boolean = false;
  //FORMS
  registroForm:FormGroup;
  //NUEVO USUARIO
  userId:string;
  userEmail:string;
  userProfile:string = "cliente";
  userFoto:string = "assets/imgs/default_cliente.png";

  constructor(public navCtrl: NavController,
              public fbRegistration:FormBuilder,
              public toastCtrl: ToastController,
              public _usuarioServicio:UsuarioServicioProvider,
              public _authServicio:AuthAdministradorProvider,
              public _utilitiesServ: UtilidadesProvider) {

    this.registroForm = this.fbRegistration.group({

      userCorreo: ['', [Validators.required, Validators.email] ],
      userClave1: ['', [Validators.required, Validators.minLength(6)] ],
      userClave2: ['', [Validators.required, Validators.minLength(6)] ]

    });

  }

  //PAGINA CARGADA
  ionViewDidLoad() {
    console.log('Página registro cargada!');
  }

  registrarUsuario(){
    this.mostrarSpinner = true;
      let credenciales = {
        email: this.registroForm.value.userCorreo,
        password: this.registroForm.value.userClave2
      };

    // 1 - REGISTRAR EN AUTHENTICATION
      this._authServicio.signUpExterno(credenciales)
      .then((data)=>{
        this.userId = data.user.uid.toString();
        this.userEmail = data.user.email.toString();
    // 2 - ACTUALIZAR PROFILE AUTH
        this._authServicio.update_externalUserAccount(data.user, this.userProfile, this.userFoto)
        .then(()=>{
    // 3 - ENVIAR MAIL DE VERIFICACION
          this._authServicio.send_ExternalEmailVerification()
          .then(()=>{
    // 4 - DESLOGUEARSE DE AUTH
            this._authServicio.signOutExternal()
            .then(()=>{
    // 5 - REGISTRAR USER EN DATABASE
              this._usuarioServicio.alta_usuario_registro(this.userId, this.userEmail)
              .then((newUser)=>{
    // 6 - ACTUALIZAR USER EN DATABASE
                this._usuarioServicio.modificar_usuario(newUser)
                .then(()=>{
                  this.mostrarSpinner = false;
                  this._utilitiesServ.showToast("Cuenta creada");
                  this.volver();
                })
                .catch((error)=>{ console.log("Error al actualizar usuario en firebase: " + error); });
              })
              .catch((error)=>{ console.log("Error al generar usuario en firebase: " + error); });
            })
            .catch((error)=>{ console.log("Error al desloguearse: " + error); });
          })
          .catch((error)=>{ console.log("Error al enviar mail: " + error); })
        })
        .catch((error)=>{ console.log("Error al actualizar auth info: " + error); });
      })
      .catch((error)=>{ console.log("Error al registrar usuario (auth): " + error);
        let errorCode = error.code;
        //var errorMessage = error.message;
        switch(errorCode){
          case "auth/email-already-in-use":
          this._utilitiesServ.showWarningToast("Cuenta no disponible");
          this.registroForm.reset();
          break;
          case "auth/invalid-email":
          this._utilitiesServ.showErrorToast("Correo invalido");
          break;
        }
        this.mostrarSpinner = false;
      })
  }

  volver(){
    this.navCtrl.setRoot(LoginPage);
  }

}
