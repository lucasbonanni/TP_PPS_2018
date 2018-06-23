import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DateTimeProvider } from '../../../providers/date-time/date-time';
import { MapaPage } from '../../index-paginas';
import { AuthServicioProvider } from '../../../providers/auth-servicio/auth-servicio';
import { UsuarioServicioProvider } from '../../../providers/usuario-servicio/usuario-servicio';
import { GeocodingProvider } from '../../../providers/geocoding/geocoding';
import { Usuario } from '../../../classes/usuario';
import { Reserva } from '../../../classes/viaje.model';
import { ReservasProvider } from '../../../providers/reservas/reservas';

@IonicPage()
@Component({
  selector: 'page-cliente-reserva',
  templateUrl: 'cliente-reserva.html',
})
export class ClienteReservaPage {
  //Nombres de meses y días para el date picker
  monthNames: string[];
  monthShortNames: string[];
  daysNames: string[];
  daysShortNames: string[];
  myOriginCallbackFunction: Function;
  myDestCallbackFunction: Function;
  usuario: Usuario;
  viajeReserva: Reserva;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    dateTimeSrv: DateTimeProvider,
    private auth: AuthServicioProvider,
    private usuarioServicio: UsuarioServicioProvider,
    private geo: GeocodingProvider,
    private reservasSrv : ReservasProvider) {
    this.monthNames = dateTimeSrv.getMonthNames();
    this.daysNames = dateTimeSrv.getWeekDays();
    this.daysShortNames = dateTimeSrv.getWeekDaysShort();
    this.monthShortNames = dateTimeSrv.getMonthNamesShort();
    this.inicializarReserva();
  }

  /**
   * Inicializa la reserva
   */
  private inicializarReserva() {
    this.viajeReserva = new Reserva();
    this.viajeReserva.origen_coord = [];
    this.viajeReserva.destino_coord = [];
  }

  /**
   * ion View Did Load
   */
  ionViewDidLoad() {
    this.myOriginCallbackFunction = (_params) => {
      console.log("callback asignado");
      return new Promise((resolve, reject) => {
        this.viajeReserva.origen = _params;
        //cambiar el tipo de coordinadas en el merge
        this.geo.obtenerCoordenadas(_params).then(coord => {
          this.setTripOriginCoord(coord, this.viajeReserva);
        });
        resolve();
      });
    }
    this.myDestCallbackFunction = (_params) => {
      console.log("callback asignado");
      return new Promise((resolve, reject) => {
        this.viajeReserva.destino = _params;
        this.geo.obtenerCoordenadas(_params).then(coord => {
          this.setTripDestCoord(coord, this.viajeReserva);
        });
        resolve();
      });
    }
  }
  /**
   * ion view can enter
   */
  ionViewCanEnter() {
    this.loadUser();
  }

  /**
   * Metodo que carga el usuario
   */
  loadUser() {
    this.usuarioServicio.traer_un_usuario(this.auth.get_userUID())
      .then((user: any) => {
        //console.log("USUARIO: " + JSON.stringify(user));
        this.usuario = user;
        console.log(user);
      })
      .catch((error) => {
        // this.mostrarSpinner = false;
        console.log("Ocurrió un error al traer un usuario!: " + JSON.stringify(error));
      })
  }

  /**
   * Actualizar las coordenadas del viaje
   * @param coords coordenadas obtenidas
   * @param coordToUpdate coordenadas que se van a actualizar
   */
  setTripCoord(coords: number[], coordToUpdate: number[]) {
    coordToUpdate = coords;
    console.log(this.viajeReserva, coordToUpdate);
  }

  /**
   * Establecer coordenadas origen
   * @param coordenadas coordenadas a establecer
   * @param reserva instancia de la reserva
   */
  setTripOriginCoord(coordenadas: number[], reserva: Reserva) {
    reserva.origen_coord = coordenadas;
    this.viajeReserva = reserva;
    console.log(coordenadas, this.viajeReserva, reserva);
  }


  /**
   * Establecer coordenadas destino
   * @param coordenadas coordenadas a establecer
   * @param reserva instancia de la reserva
   */
  setTripDestCoord(coordenadas: number[], reserva: Reserva) {
    reserva.destino_coord = coordenadas;
    this.viajeReserva = reserva;
    console.log(coordenadas, this.viajeReserva, reserva);
  }

  /**
   * Metodo para establecer la dirección 
   * sin tener problemas con el scope.
   * @param dir dirección
   */
  public setDir(dir) {
    this.viajeReserva.origen = dir;
  }

  /**
   * Setea la dirección de origen
   */
  setOriginDir() {
    this.navCtrl.push(MapaPage, { 'direccion': this.viajeReserva.origen, 'callback': this.myOriginCallbackFunction });
  }

  /**
   * Setea la dirección de destino
   */
  setDestDir() {
    this.navCtrl.push(MapaPage, { 'direccion': this.viajeReserva.destino, 'callback': this.myDestCallbackFunction });
  }
  /**
   * guardar reserva
   */
  guardarReserva(){
    console.log(this.viajeReserva);
    //se convierte la fecha del imput en tipo fecha
    const fecha = new Date(this.viajeReserva.fecha);
    const hora = new Date(this.viajeReserva.hora);
    //se unen fecha y hora
    const fechaTipoDate = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDay(),
      hora.getHours(),
      hora.getMinutes(),
      hora.getSeconds());
    //se setean los datos para guardar
    this.viajeReserva.fecha = fechaTipoDate.toLocaleString();
    this.viajeReserva.cod_fecha = fechaTipoDate.valueOf().toString();
    this.viajeReserva.id_cliente = this.usuario.id_usuario;
    console.log(this.viajeReserva);
  }
}
