import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//FORM
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
//PAGINAS
import { LoginPage } from '../../index-paginas';;
//SERVICIOS
import { UsuarioServicioProvider } from '../../../providers/usuario-servicio/usuario-servicio';
import { AuthServicioProvider } from '../../../providers/auth-servicio/auth-servicio';
//jQUERY
//import * as $ from 'jquery';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
  providers: [UsuarioServicioProvider, AuthServicioProvider]
})
export class RegistroPage {

  mostrarSpinner:boolean = false;
  //FORMS
  registroForm:FormGroup;
  //FORM inputs
  input_nombre:string;
  input_correo:string;
  input_edad:string;
  input_direccion:string;
  input_clave1:string;
  input_clave2:string;
  //FORM Adicional
  formAdicional:boolean = false;
  mostrarErrores:boolean = false;
  //AUDIO
  audio = new Audio();
  //NUEVO USUARIO
  userId:string;
  userEmail:string;


  constructor(public navCtrl: NavController,
              public fbRegistration:FormBuilder,
              public toastCtrl: ToastController,
              public _usuarioServicio:UsuarioServicioProvider,
              public _authServicio:AuthServicioProvider) {

    this.registroForm = this.fbRegistration.group({

      userCorreo: ['', [Validators.required, Validators.email] ],
      userClave1: ['', [Validators.required, Validators.minLength(6)] ],
      userClave2: ['', [Validators.required, Validators.minLength(6)] ]

    });

  }

  ionViewDidLoad() {
    console.log('Página registro cargada!');
  }

  registrarUsuario(){
      let credenciales = {
        email: this.registroForm.value.userCorreo,
        password: this.registroForm.value.userClave2
      };
      this._authServicio.signUpSimple(credenciales)
      .then((data)=>{
        console.log("Datos nuevo usuario: " + JSON.stringify(data.user) );
        console.log("Datos: " + data.user.uid + " + " + data.user.email);
        this.userId = data.user.uid.toString();
        this.userEmail = data.user.email.toString();

      })
      .catch((error)=>{
        console.log("Error al registrar usuario (auth): " + error);
        var errorCode = error.code;
        //var errorMessage = error.message;
        switch(errorCode){
          case "auth/email-already-in-use":
          this.mostrarAlerta("Cuenta ya existente!");
          break;
          case "auth/invalid-email":
          this.mostrarAlerta("Correo invalido!");
          break;
        }
        this.reproducirSonido();

      })
      .then(()=>{
        this._usuarioServicio.crear_usuario(this.userId, this.userEmail);
      })
      .catch((error)=>{
        console.log("Error al generar usuario en firebase!" + error);
      }).then(()=>{ this.volver() })
  }

  reproducirSonido(){
    this.audio.src = "assets/sounds/windows_95_error.mp3";
    this.audio.load();
    this.audio.play();
  }

  mostrarAlerta(msj:string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 2000,
      position: "top"
    });
    toast.present();
  }

  volver(){
    this.navCtrl.setRoot(LoginPage);
  }

}
