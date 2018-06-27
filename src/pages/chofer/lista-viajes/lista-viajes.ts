import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ViajeServicio } from '../../../providers/viaje-servicio/viaje-servicio';
import { UsuarioServicioProvider } from '../../../providers/usuario-servicio/usuario-servicio';
import * as firebase from 'firebase/app';
import { ChoferViajePage } from '../../index-paginas';

import { Subscription } from "rxjs/Subscription"; 
import { Observable } from "rxjs/Observable"; 
import 'rxjs/add/observable/fromPromise';

@IonicPage()
@Component({
  selector: 'page-lista-viajes',
  templateUrl: 'lista-viajes.html',
})
export class ListaViajesPage {

  viajes : any;
  chofer : any;
  usuarioSesion:any;
  vehiculo : any;
  v : any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viajesProv : ViajeServicio,
              public userProv: UsuarioServicioProvider,
              public menu: MenuController) {
    this.menu.enable(true);
    this.vehiculo = this.navParams.get('vehiculo');
  }
  //VERFICAR QUE TENGA UN AUTO ASIGNADO 
  ionViewDidLoad(){
    
    this.traerViajes(); //CAMBIAR A RESERVAS Y CUANDO SE LA TOMA PASA A SER UN VIAJE EN ESTADO TOMADO
    this.usuarioSesion = firebase.auth().currentUser;
    this.traerUsuario();
    console.log(this.chofer);

  }
  //cancelado / pendiente / tomado / en curso / cumplido
  async traerUsuario(){
  	try{
        this.chofer = await this.userProv.traerUsuario(this.usuarioSesion.uid);
        console.log(this.chofer);
  	}catch(e){
        console.log(e.message);
  	}
  	
  }

  traerViajes(){
  	try{
        this.v = Observable.fromPromise(this.viajesProv.traer_viajes('pendiente','estado'))
                                      .subscribe(viajes => this.viajes = viajes);
        console.log("Viajes ",this.viajes);
  	}catch(e){
        console.log(e.message);
  	}

  }

  async viajeSeleccionado(viaje:any){
    
    viaje.id_chofer = this.usuarioSesion.uid;
    viaje.id_vehiculo = this.chofer.id_vehiculo;
    viaje.estado = 'tomado';
    await this.viajesProv.modificar_viaje(viaje);
    this.navCtrl.push(ChoferViajePage, {viaje: viaje, chofer: this.chofer});
  }

  ionViewWillLeave(){
    console.log("se ejecuto ionViewWillLeave");
    this.v.unsubscribe();
    //this.viajes = null;
  }

  

}
