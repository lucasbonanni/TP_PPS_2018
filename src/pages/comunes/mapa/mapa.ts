import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, FabContainer } from 'ionic-angular';
//SERVICIOS GEOCODING + GEOLOCATE
import { GeocodingProvider } from '../../../providers/geocoding/geocoding';
import { GeolocationProvider } from '../../../providers/geolocation/geolocation';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  lat:number;
  lng:number;
  direccion:string;
  callback:Function;
  mostrarSpinner:boolean = false;

  constructor(public navCtrl:   NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private _geoCoding:GeocodingProvider,
              private _geoLocate:GeolocationProvider) {

      if(this.navParams.get('direccion')){
        this.direccion = this.navParams.get('direccion');
        console.log("Direccion recibida: " + this.direccion);
      }
      //Se setea el callback siempre ya que el if anterior
      //no siempre sirve como verificacion
      if (this.navParams.get("callback") !== null) {
        this.callback = this.navParams.get("callback");
      }
  }

  ionViewDidLoad() {
    if(this.direccion && this.direccion != "*****" && this.direccion != "N/N")
      this.marcarDireccion();
    else{
      this.lat = -34.662305;
      this.lng = -58.36472349999997;
    }
  }

  accionMenu(event, fab:FabContainer, opcion:string){
    fab.close();
    switch(opcion){
      case "close":
      this.volver();
      break;
      case "update":
      this.actualizarDireccion();
      break;
    }
  }

  marcarUbicacion(event){
    //Muestra las coordenadas
    this.mostrarSpinner = true;
    this._geoCoding.obtenerDireccion(event.coords.lat, event.coords.lng)
      .then((data:any)=>{
        this.direccion = data.toString();
        this.lat = event.coords.lat;
        this.lng = event.coords.lng;
        this.mostrarSpinner = false;
      })
      .catch((error)=>{
        console.log("ERROR: al convertir coordenadas -> dirección: " + error);
      })

  }

  marcarDireccion(){
    this.mostrarSpinner = true;
    this._geoCoding.obtenerCoordenadas(this.direccion)
      .then((coordenadas:any)=>{
        console.log("Dato recibido de obtener coordenadas: " + coordenadas);
        this.lat = coordenadas[0];
        this.lng = coordenadas[1];
        this.mostrarSpinner = false;
      })
      .catch((error)=>{
        console.log("ERROR: al convertir direccion -> coordenadas: " + error);
      })
  }

  localizarDispositivo(){
    //OBTENER Y MARCAR UBICACION
    this.mostrarSpinner = true;
    this._geoLocate.obtenerPosicion()
      .then((data)=>{
        console.log("Geolocalización: " + JSON.stringify(data));
        this.lat = data.coords.latitude;
        this.lng = data.coords.longitude;
      })
      .catch((error)=>{
        console.log("Error al ubicar posición del usuario: " + error);
      })
    //TRADUCIR EN DIRECCION
      .then(()=>{
        this._geoCoding.obtenerDireccion(this.lat, this.lng)
          .then((data:any)=>{
            this.direccion = data.toString();
            this.mostrarSpinner = false;
            console.log("Dirección: " + this.direccion);
          })
          .catch((error)=>{
            console.log("ERROR: al convertir coordenadas -> dirección: " + error);
          })
      })
  }

  actualizarDireccion(){
    let datos = {
      direccion: this.direccion,
      lat: this.lat,
      lng: this.lng
    }
    this.callback(datos).then(()=>{
      this.navCtrl.pop();
   });
  }

  volver(){
    this.navCtrl.pop();
  }

}
