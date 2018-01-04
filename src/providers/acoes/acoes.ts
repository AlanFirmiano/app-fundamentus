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
  constructor(
    public http: Http,
    private platform:Platform
  )
  {
  }

  getDataFundamentus(){
    return this.http.get(this.fundamentus+"/detalhes.php?papel=QUAL3&x=25&y=11");
  }
}
