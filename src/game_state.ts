import { Building, valid_buildings, get_default_buildings} from "./buildings"
import {upgrade} from "./upgrades"
import Decimal from 'decimal.js';
import Cookies from "js-cookie";


export class GameState {
    username: string
    buildings: Building[]
    upgrades: upgrade[]
    cookies: Decimal
    total_cookies: Decimal

    constructor(username: string, buildings: Building[], upgrades: upgrade[], cookies: Decimal, total_cookies: Decimal) {
        this.username = username;
        this.buildings = buildings;
        this.upgrades = upgrades;
        this.cookies = cookies;
        this.total_cookies = total_cookies
    }

    buy_bulding(building: Building): GameState {
        if (this.cookies.minus(building.get_cost()) < new Decimal(0)) {return this}
        this.cookies = this.cookies.minus(building.get_cost())
        this.buildings = this.buildings.map((x) => {
            if (x.type == building.type) {x.amount = x.amount.plus(1)}
            return x
        })
        return this
    }

    buy_upgrade(up: upgrade): GameState {
        if (this.cookies.minus(up.cost) < new Decimal(0) || up.owned) {return this}
        this.cookies = this.cookies.minus(up.cost)
        this.upgrades = this.upgrades.map((x) => {
            if (x.name == up.name) {x.owned = true}
            return x
        })
        return this
    }

    bake_cookies(): GameState {
        let production = new Decimal(0);
        this.buildings.forEach((x) => production =  production.plus(x.get_total_cps(this.upgrades)))
        this.cookies = this.cookies.plus(production)
        this.total_cookies = this.total_cookies.plus(production)
        return this
    }

    get_cps(): Decimal {
        let production = new Decimal(0);
        this.buildings.forEach((x) => production = production.plus(x.get_total_cps(this.upgrades)))
        return production
    }

    click_big_cookie(): GameState {
        let add = new Decimal(1)
        this.upgrades.forEach((x) => {
            if (x.applies_to == valid_buildings.cursor && x.owned) {add =  add.times(x.multiplier)}
        })
        this.cookies  = this.cookies.add(add)
        this.total_cookies = this.total_cookies.add(add)
        return this
    }

    toJSON(): string {
        return JSON.stringify(this)
    }

    static get_game_state(): GameState {
        //Cookies.remove("saved_data")
        let saved_data: string | undefined = Cookies.get("saved_data")
        let game_state: GameState;
        if (saved_data) {
            let data = JSON.parse(saved_data)
            let buildings = data.buildings.map((x: string) => Building.fromJSON(x))
            let upgrades = data.upgrades.map((x: string) => upgrade.fromJSON(x))
            game_state =  new GameState(data.username, buildings, upgrades, new Decimal(data.cookies), new Decimal(data.total_cookies))
            //return new GameState("orteil", get_default_buildings(), upgrade.get_default_upgrades(), new Decimal(0))
            return game_state
        }
        return game_state = new GameState("orteil", get_default_buildings(), upgrade.get_default_upgrades(), new Decimal(0), new Decimal(0))
        
    }
    
    save_game_state(): void {
        let buildings = this.buildings.map((x) => JSON.stringify(x))
        let upgrades = this.upgrades.map((x) => JSON.stringify(x))
        let saved_data = {
            username: this.username,
            cookies: this.cookies,
            total_cookies: this.total_cookies,
            buildings: buildings,
            upgrades: upgrades
        }
        Cookies.set("saved_data", JSON.stringify(saved_data))

    }
}


