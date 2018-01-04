import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {AcoesProvider} from "../../providers/acoes/acoes";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[
    AcoesProvider
  ]
})
export class HomePage {
  public data:string;
  public loader;
  public refresher;
  public isRefreshing:boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private acoesProvider:AcoesProvider,
    public loadingCtrl: LoadingController
  ) {}

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;
    this.initializeItems();
  }
  abrirCarregandoHome() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando Dados..."
    });
    this.loader.present();
  }

  fecharCarregandoHome(){
    this.loader.dismiss();
  }

  initializeItems() {
    this.abrirCarregandoHome();
    this.acoesProvider.getDataFundamentus().subscribe(
      res=>{
        const response = (res as any);
        const objeto = (response._body);
        this.data = objeto;

        console.log(this.data);

        this.fecharCarregandoHome();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing = false;
        }
      },
      err=>{
        console.log(err);
        this.fecharCarregandoHome();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing = false;
        }
      }
    );
  }
  ionViewDidEnter() {
    this.initializeItems();
  }
}
