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
    public items3: Array<any> = []; // Items da tabela 3

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
                this.workIn3Table(tableSplit[3]); //3º tebela
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

    workIn3Table(table: string){
        var arrItems = table.split("<span class=\"txt\">");
        //arrItems.shift();
        this.getItemRecursive3(arrItems);
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
        //console.log(key + ": " + value);

        arrayHtml.shift();
        arrayHtml.shift();
        this.getItemRecursive(arrayHtml);
    }

    getItemRecursive3(arrayHtml: Array<string>) {
        if (arrayHtml.length <= 0)
            return;
        let begin = arrayHtml[0];
        if(begin.indexOf("class=\"nivel1\"") !== -1){
            arrayHtml.shift();
            this.getItemRecursive3(arrayHtml);
            return;
        }
        arrayHtml.shift();

        let itemKeyHtml = arrayHtml[0];
        if(!itemKeyHtml){ // Se for um TD em branco
            this.getItemRecursive3(arrayHtml);
            return;
        }
        let key = itemKeyHtml.split("</span>")[0];
        if(key == ""){ // Se a key for vazia
            this.getItemRecursive3(arrayHtml);
            return;
        }
        let value;

        if(itemKeyHtml.indexOf("<span class=\"oscil\">") !== -1){
            let spanSplit = itemKeyHtml.split("<span class=\"oscil\">")[1];
            let fontSplit = spanSplit.split(">")[1];
            value = fontSplit.split("</font")[0];
        } else {
            let itemValueHtml = arrayHtml[1];
            value = itemValueHtml.split("</span>")[0];
            arrayHtml.shift();
        }
        
        let item = {
            "key": key,
            "value" : value
        }
        this.items3.push(item);

        this.getItemRecursive3(arrayHtml);
    }
}
