import { 
    observable, 
    action,
} from 'mobx';
import * as mobx from 'mobx'; 



class Store {

    constructor() {
        mobx.makeObservable(this);
    }
}

export default store = new Store();