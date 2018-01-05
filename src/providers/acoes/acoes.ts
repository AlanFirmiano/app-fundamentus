import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform} from "ionic-angular";

/*
  Generated class for the AcoesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AcoesProvider {
  fundamentus = "/fundamentus";
  papel:string;
  constructor(
    public http: Http,
    private platform:Platform
  )
  {
  }

  getDataFundamentus(papel:string){
    this.papel=papel;
    return this.http.get(this.fundamentus+"/detalhes.php?papel="+this.papel);
  }
}
