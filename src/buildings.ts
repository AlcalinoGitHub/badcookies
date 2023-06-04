import type {upgrade} from "./upgrades"
import Decimal from 'decimal.js';

export enum valid_buildings {
    cursor = "cursor",
    grandma = "grandma",
    farm = "farm",
    mine = "mine"
} 

export class Building {
    type: valid_buildings
    amount: Decimal
    base_cps: Decimal
    base_cost: Decimal
    description: string
    image: string
    constructor(type: valid_buildings, base_cps: Decimal, base_cost: Decimal, description: string, image: string, amount: Decimal){
        this.type = type
        this.amount = amount
        this.base_cps = base_cps
        this.base_cost = base_cost
        this.description = description
        this.image = image
    }

    get_total_cps(upgrades: upgrade[]): Decimal{
        let production = this.base_cps
        upgrades = upgrades.filter((x) => x.applies_to == this.type && x.owned)
        upgrades.forEach((up) => {production =  production.times(up.multiplier)})
        return production.times(new Decimal(this.amount))
    }

    get_cost(): Decimal {
        let multiplier = new Decimal(1.15 ** (this.amount.toNumber()))
        return (this.base_cost.times(multiplier)).floor()
    }


    static fromJSON(json: string): Building {
        let data: Building = JSON.parse(json)
        return new Building(
            valid_buildings[data.type],
            new Decimal(data.base_cps), 
            new Decimal(data.base_cost),
            data.description,
            data.image,
            new Decimal(data.amount)
        )
    }
}


export function get_default_buildings(): Building[] {
    let buildings: Building[] = [
        new Building(
            valid_buildings.cursor,
            new Decimal(0.1),
            new Decimal(10),
            "Autoclicks for you",
            "/cursor.png",
            new Decimal(0)
        ),
        new Building(
            valid_buildings.grandma,
            new Decimal(1),
            new Decimal(100),
            "A nice granda to bake more cookies",
            "/grandma.png",
            new Decimal(0)
        ),
        new Building(
            valid_buildings.farm,
            new Decimal(100),
            new Decimal(1000),
            "Grow cookies from cookie seeds",
            "/farm.png",
            new Decimal(0)
        ),
        new Building(
            valid_buildings.mine,
            new Decimal(1000),
            new Decimal(10000),
            "Extract cookies from the ground",
            "/mine.png",
            new Decimal(0)
        )
    ]
    return buildings
}