import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//PAGES
import { MyApp } from './app.component';
import { InicioPage, RegistroPage, LoginPage,
         ClienteInicioPage, ClientePerfilPage, ClienteViajePage, ClienteReservaPage, ClienteHistorialPage, ClienteEstadisticaPage, ClienteEncuestaPage, //--CLIENTE
         ChoferInicioPage, ChoferPerfilPage, ChoferViajePage, ChoferHistorialPage, ChoferEstadisticaPage, ChoferEncuestaPage,//-----------------------------CHOFER
         SupervisorInicioPage, SupervisorPerfilPage, SupervisorSeguimientoPage, SupervisorEstadisticaPage, SupervisorEncuestaPage,//------------------------SUPERVISOR
         SupervisorUsuarioPage, SupervisorVehiculoPage, SupervisorListaUsuariosPage, SupervisorListaVehiculosPage, SupervisorRegistroUsuarioPage, SupervisorRegistroVehiculoPage,SupervisorRegistroChoferPage} from '../pages/index-paginas';

//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//CONFIGURACION FIREBASE
import { environment } from '../environments/environment';
//CONFIGUARCION DATETIME
import { dateTime } from '../environments/dateTime';
//HTTP
import { HttpModule } from '@angular/http';

//SERVICIOS
import { UsuarioServicioProvider } from '../providers/usuario-servicio/usuario-servicio';
import { AuthServicioProvider } from '../providers/auth-servicio/auth-servicio';
import { Geolocation } from '@ionic-native/geolocation';

// //ONE SIGNAL (Push notification)
// import { OneSignal } from '@ionic-native/onesignal';
// import { PushOneSignalProvider } from '../providers/push-one-signal/push-one-signal';

//


@NgModule({
  declarations: [
    MyApp,
    InicioPage,
    RegistroPage,
    LoginPage,
    //CLIENTE
    ClienteInicioPage,
    ClientePerfilPage,
    ClienteViajePage,
    ClienteReservaPage,
    ClienteHistorialPage,
    ClienteEstadisticaPage,
    ClienteEncuestaPage,
    //CHOFER
    ChoferInicioPage,
    ChoferPerfilPage,
    ChoferViajePage,
    ChoferHistorialPage,
    ChoferEstadisticaPage,
    ChoferEncuestaPage,
    //SUPERVISOR
    SupervisorInicioPage,
    SupervisorPerfilPage,
    SupervisorSeguimientoPage,
    SupervisorEstadisticaPage,
    SupervisorEncuestaPage,
    SupervisorUsuarioPage,
    SupervisorVehiculoPage,
    SupervisorListaUsuariosPage,
    SupervisorListaVehiculosPage,
    SupervisorRegistroUsuarioPage,
    SupervisorRegistroVehiculoPage,
    SupervisorRegistroChoferPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,dateTime),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InicioPage,
    RegistroPage,
    LoginPage,
    //CLIENTE
    ClienteInicioPage,
    ClientePerfilPage,
    ClienteViajePage,
    ClienteReservaPage,
    ClienteHistorialPage,
    ClienteEstadisticaPage,
    ClienteEncuestaPage,
    //CHOFER
    ChoferInicioPage,
    ChoferPerfilPage,
    ChoferViajePage,
    ChoferHistorialPage,
    ChoferEstadisticaPage,
    ChoferEncuestaPage,
    //SUPERVISOR
    SupervisorInicioPage,
    SupervisorPerfilPage,
    SupervisorSeguimientoPage,
    SupervisorEstadisticaPage,
    SupervisorEncuestaPage,
    SupervisorUsuarioPage,
    SupervisorVehiculoPage,
    SupervisorListaUsuariosPage,
    SupervisorListaVehiculosPage,
    SupervisorRegistroUsuarioPage,
    SupervisorRegistroVehiculoPage,
    SupervisorRegistroChoferPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuarioServicioProvider,
    AuthServicioProvider,
    Geolocation
  ]
})
export class AppModule {}
