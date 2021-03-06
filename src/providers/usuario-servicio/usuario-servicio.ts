import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//*********************FIREBASE import*********************//
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
//clase USUARIO
import { Usuario } from '../../classes/usuario';
//Importar map: operador para transformar la información recibida de afDB.list
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class UsuarioServicioProvider {

  usuariosTest:any[] = [];

  //LISTA USUARIOS
  usuariosRef: AngularFireList<any>;
  usuarios: Observable<any[]>;

  constructor(  public afDB: AngularFireDatabase,
                private _http:Http ) {

    console.log('Provider USUARIOS iniciado...');
    this.initialize();
  }

  //INICIALIZAR
  initialize(){
    this.usuariosRef = this.afDB.list('usuarios');
    this.usuarios = this.usuariosRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  /**
   * retorna los usuarios RxJs
   */
  getUsers(){
    return this.usuarios;
  }

  //TRAER USUARIOS DE PRUEBA
  obtener_usuarios_prueba (){

    let promesa = new Promise((resolve, reject)=>{
      this._http.get("assets/data/usuarios.json")
          .subscribe( respuesta =>{
                //console.log("Obtención de usuarios de prueba " + JSON.stringify(respuesta.json()) );
                for(let user of respuesta.json().usuarios){
                  this.usuariosTest.push(user);
                }
                resolve("Todo ok");
          }, error=>{
            console.log("ERROR! al leer usuarios de prueba: " + JSON.stringify(error));
          });
    });
    return promesa;
  }


  //TRAER TODOS LOS USUARIOS
  traer_usuarios(){
    let promesa = new Promise((resolve, reject)=>{

      console.log("METODO: Traer usuarios");
      //TRAER DATOS
      this.usuarios.subscribe( usuarios => {
        resolve(usuarios);
      }, error => reject(error));
    });
    return promesa;
  }

  //TRAER UN USUARIO
  traer_un_usuario(uid:string){
    let promesa = new Promise((resolve, reject)=>{

      //RETORNO
      let usuario:Usuario;
      console.log("METODO: Traer un usuario");
      //TRAER USUARIO
      this.usuarios.forEach((value)=>{
        for(let user of value){
          if(user.id_usuario == uid){
            //console.log("Usuario encontrado: " + user.id_usuario);
            usuario = new Usuario(user);
          }
        }
        resolve(usuario);
      })
    });
    return promesa;
  }

  //TRAER UN USUARIO POR CORREO
  traer_un_usuario_correo(correo:string){
      let promesa = new Promise((resolve, reject)=>{

        //RETORNO
        let usuario:Usuario;
        console.log("METODO: Traer un usuario");
        //TRAER USUARIO
        this.usuarios.forEach((value)=>{
          for(let user of value){
            if(user.correo == correo){
              //console.log("Usuario encontrado: " + user.id_usuario);
              usuario = new Usuario(user);
            }
          }
          resolve(usuario);
        })
      });
      return promesa;
  }

  //ALTA USUARIO REGISTRO
  alta_usuario_registro(userId:string, userEmail:string){
    console.log("Datos recibidos: " + userId + " + " + userEmail);
    let nuevo_user = {
      key: "***",
      id_usuario: userId,
      correo: userEmail,
      nombre: "*****",
      edad: "*****",
      direccion: "*****",
      perfil: "cliente",
      foto: "assets/imgs/default_cliente.png",
      viajando: false,
      activo: false,
      verificado:false
    }

    console.log("Usuario nuevo: " + JSON.stringify(nuevo_user));
      let promesa = new Promise((resolve, reject)=>{
        this.usuariosRef = this.afDB.list('usuarios');
        let newKey = this.usuariosRef.push(nuevo_user).key;
        nuevo_user.key = newKey;
        resolve(nuevo_user);
      });
      return promesa;
  }

  //ALTA
  alta_usuario(user:Usuario){
      let promesa = new Promise((resolve, reject)=>{
        this.usuariosRef = this.afDB.list('usuarios');
        let newKey = this.usuariosRef.push(user).key;
        resolve(newKey);
      });
      return promesa;
  }

  //BAJA
  baja_usuario(userKey:string){
    let promesa = new Promise((resolve, reject)=>{
      this.usuariosRef = this.afDB.list('usuarios');
      this.usuariosRef.remove(userKey);
      resolve();
    });
    return promesa;
  }

  //MODIFICACIÓN
  modificar_usuario(user:any){
    let promesa = new Promise((resolve, reject)=>{
      this.usuariosRef = this.afDB.list('usuarios');
      console.log('user a act : ',user);
      this.usuariosRef.update(user.key, user);
      resolve();
    });
    return promesa;
  }

  //ASIGNAR VEHICULO A USUARIO (Chofer)
  async asignarVehiculo(uid : string , keyVehiculo : string){

    let user:any = await this.traer_un_usuario(uid);
    // console.log(user);
    user.id_vehiculo = keyVehiculo;
    return this.modificar_usuario(user);
  }

  //CARGAR IMAGEN EN STORAGE
  cargar_imagen_storage(uid:string, foto:string){

    let promesa = new Promise((resolve, reject)=>{

      let imgKey:string = new Date().valueOf().toString(); // 1231243245
      let nombreFile = imgKey + "_" + uid;
      let storeRef = firebase.storage().ref();
      let uploadTask: firebase.storage.UploadTask =
        storeRef.child(`usuarios/${ nombreFile }`)
                .putString( foto, 'base64', { contentType:'image/jpeg'});

        //EJECUCION DE TAREA DE CARGA
        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, //Tarda c/subida
            ()=>{},//Saber el % de cuantos Mbs fueron subidos
            ( error )=>{
              //Manejo de error
              console.info("ERROR EN LA CARGA", JSON.stringify(error));
              resolve(false);
            },
            ()=>{
              //Carga exitosa, TODO bien
              console.log("Archivo subido");
              uploadTask.snapshot.ref.getDownloadURL()
              .then((url)=>{
                console.log("URL GENERADA EN SERVICIO: " + url);
                resolve(url);
              });

            }
        )
    });
    return promesa;
  }

   //DEVUELVE UN USUARIO SIN EL FORMATO DE LA CLASE
  traerUsuario(uid:string){
    let promesa = new Promise((resolve, reject)=>{
      let usuario;
      this.usuarios.forEach((value)=>{
        for(let user of value){
          if(user.id_usuario == uid){
            console.log("Usuario encontrado: " + user.id_usuario);
            usuario = user;
          }
        }
        resolve(usuario);
      })
    });
    return promesa;
  }

  //DESUSCRIBIR
  // desuscribir(){
  //   this.destroy$.next();
  //   // Now let's also unsubscribe from the subject itself:
  //   this.destroy$.complete();
  //   console.log("Observables de provider usuarios desuscriptos");
  // }

}
