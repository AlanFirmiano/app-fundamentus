import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AcoesProvider } from "../../providers/acoes/acoes";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [
        AcoesProvider
    ]
})
export class HomePage {
    public data: string;
    public loader;
    public refresher;
    public isRefreshing: boolean = false;

    public items1: Array<any> = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private acoesProvider: AcoesProvider,
        public loadingCtrl: LoadingController
    ) { }

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

    fecharCarregandoHome() {
        this.loader.dismiss();
    }

    initializeItems() {
        this.abrirCarregandoHome();
        this.acoesProvider.getDataFundamentus().subscribe(
            res => {
                const response = (res as any);
                const objeto = (response._body);
                this.data = objeto;

                let tableSplit = this.data.split("<table class=\"w728\">");
                this.workInTable(tableSplit[1]); //1º tebela
                this.workInTable(tableSplit[2]); //2º tebela
                //this.workInTable(tableSplit[4]); //4º tebela

                this.fecharCarregandoHome();
                if (this.isRefreshing) {
                    this.refresher.complete();
                    this.isRefreshing = false;
                }
            },
            err => {
                console.log(err);
                this.fecharCarregandoHome();
                if (this.isRefreshing) {
                    this.refresher.complete();
                    this.isRefreshing = false;
                }
            }
        );
    }
    ionViewDidEnter() {
        this.initializeItems();
    }

    workInTable(table: string) {
        var arrItems = table.split("<span class=\"txt\">");
        arrItems.shift();
        this.getItemRecursive(arrItems);
    }

    getItemRecursive(arrayHtml: Array<string>) {
        if (arrayHtml.length <= 0)
            return;
        let itemKeyHtml = arrayHtml[0];
        let itemValueHtml = arrayHtml[1];

        let key = itemKeyHtml.split("</span>")[0];
        let value = itemValueHtml.split("</span>")[0];
        let item = {
            "key": key,
            "value" : value
        }
        this.items1.push(item);
        console.log(key + ": " + value);

        arrayHtml.shift();
        arrayHtml.shift();
        this.getItemRecursive(arrayHtml);
    }
}
