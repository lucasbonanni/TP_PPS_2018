import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
//FORM
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
//Clase USUARIO
import { Usuario } from '../../../classes/usuario';
//PAGINAS
import { SupervisorListaUsuariosPage, MapaPage } from '../../index-paginas';
//SERVICIOS
import { UsuarioServicioProvider } from '../../../providers/usuario-servicio/usuario-servicio';
import { AuthAdministradorProvider } from '../../../providers/auth-administrador/auth-administrador';

@Component({
  selector: 'page-supervisor-registro-cliente',
  templateUrl: 'supervisor-registro-cliente.html',
})
export class SupervisorRegistroClientePage {

  //CONTROL DE SPINNER
  mostrarSpinner:boolean;

  //FORMS
  registroForm:FormGroup; // para correo / nombre / edad

  //VARIABLES DE CONTROL
  cambios:boolean = false; //Variable de control (activa subir cambios).

  //DATOS DEL USUARIO
  usuario:Usuario; //Usuario a crear
  user_default:any;

  //FOTO
  foto_byDefault:string; //Foto identificatoria por perfil
  foto_preview:string; //Foto tomada con la cámara
  foto_subir:string; //Foto a subir al storage

  //FROM LISTA
  from_lista:boolean;
  //CALLBACK function (para retornar dirección desde MapaPage)
  myCallbackFunction:Function;

  constructor(public navCtrl:   NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public frRegistration:FormBuilder,
              public _auth: AuthAdministradorProvider,
              public _usuarioServicio: UsuarioServicioProvider) {

              //Habilita botón atrás (hacia la lista usuarios)
              if(this.navParams.get("fromLista"))
                this.from_lista = this.navParams.get("fromLista");

              //Datos por defecto
              this.user_default = {
                key: "N/N",
                id_usuario: "N/N",
                correo: "N/N",
                nombre: "N/N",
                edad: null,
                direccion: "N/N",
                perfil: "cliente",
                foto: "https://firebasestorage.googleapis.com/v0/b/kb-remiseria33.appspot.com/o/perfiles%2Fcliente_XDKTOBwO3xNoRiXNDe8fv0lHHi13.png?alt=media&token=7ada1c16-a659-4392-bb1b-47a3a15b36b3",
                viajando: false,
                activo: false,
                verificado: false
              }
              this.usuario = new Usuario(this.user_default);

              this.registroForm = this.frRegistration.group({

                userCorreo: ['',   [ Validators.required, Validators.email ] ],
                userName:   ['',   [ Validators.minLength(5), Validators.maxLength(30) ] ],
                userAge:    [null, [ Validators.min(14), Validators.max(100) ] ]

              });
  }

  ionViewDidLoad() {
    this.myCallbackFunction = (dato)=> {
      console.log("callback asignado");
       return new Promise((resolve, reject) => {
               this.usuario.direccion = dato.direccion;
               resolve();
           });
    }
  }

  //GUARDAR
  guardar(){

    let credenciales = {
      email: this.registroForm.value.userCorreo,
      password: "asdasd"
    }

    this.usuario.correo = this.registroForm.value.userCorreo;
    this.usuario.nombre = this.registroForm.value.userName;
    this.usuario.edad = this.registroForm.value.userAge;

    this.mostrarSpinner = true;
   // 1 - REGISTRO EN AUTH
      this._auth.signUpExterno(credenciales)
      .then((data:any)=>{
          this.usuario.id_usuario = data.user.uid.toString();
          console.log("Nuevo uid: " + this.usuario.id_usuario);
   // 2 - ACTUALIZAR PROFILE AUTH
          this._auth.update_externalUserAccount(data.user, this.usuario.perfil, this.usuario.foto)
          .then(()=>{
          //ENVIAR MAIL DE VERIFICACIÓN (si el usuario se creo inactivo)
            // this._auth.send_ExternalEmailVerification();
   // 3 - DESLOGUEARSE DE AUTH
            this._auth.signOutExternal()
              .then(()=>{
   // 4 - REGISTRO EN DB
             this._usuarioServicio.alta_usuario(this.usuario)
               .then((newKey:any)=>{
                 this.usuario.key = newKey;
   // 5 - ACTUALIZACION KEY EN DB
                 this._usuarioServicio.modificar_usuario(this.usuario)
                   .then(()=>{
                       this.mostrarSpinner = false;
                       this.mostrarAlerta("Usuario creado");
                   })
                   .catch((error)=>{ console.log("Error al actualizar key usuario en DB: " + error); })
                 })
                 .catch((error)=>{ console.log("Error al crear usuario en DB: " + error); })
              })
              .catch((error)=>{ console.log("Error al desloguearse: " + error); })
          })
          .catch((error)=>{ console.log("Error al actualizar profile auth: " + error); });
      })
      .catch((error)=>{ console.log("Error al crear usuario en AUTH: " + error);
        var errorCode = error.code;
        this.mostrarSpinner = false;
        switch(errorCode){
          case "auth/email-already-in-use":
          this.mostrarAlerta("Cuenta no disponible");
          break;
          case "auth/invalid-email":
          this.mostrarAlerta("Correo invalido");
          break;
        }
      })

  }

  //ALERTA
  mostrarAlerta(msj:string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  //MOSTRAR MAPA
  verMapa(){
    this.navCtrl.push(MapaPage, {'direccion' : this.usuario.direccion, 'callback':this.myCallbackFunction});
  }

  //VOLVER ATRAS
  volver(){
    this.navCtrl.push(SupervisorListaUsuariosPage);
  }

}
