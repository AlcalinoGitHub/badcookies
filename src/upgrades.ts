import {valid_buildings} from "./buildings"
import Decimal from 'decimal.js';
import type { GameState } from "./game_state";

export class upgrade {
    name: string
    owned: boolean
    cost: Decimal
    description: string
    image: string
    applies_to: valid_buildings
    multiplier: Decimal

    constructor(name: string, description: string, image: string, applies_to: valid_buildings, multiplier: Decimal, cost: Decimal, owned: boolean) {
        this.cost = cost
        this.name = name;
        this.description = description;
        this.image = image;
        this.applies_to = applies_to;
        this.multiplier = multiplier;
        this.owned = owned
    }

    static get_default_upgrades(): upgrade[] {
        return [
            ...get_cursor_upgrades(),
            ...get_grandma_upgrades(),
            ...get_farm_upgrades(),
            ...get_mine_upgrades()
        ]
    }

    is_viewed(game_state: GameState): boolean {
        if (game_state.total_cookies.equals(0)) {return false}
        return game_state.total_cookies > this.cost.dividedBy(2) && !this.owned
    }



    static fromJSON(json: string ): upgrade {
        let data: upgrade = JSON.parse(json)
        return new upgrade(
            data.name,
            data.description,
            data.image,
            valid_buildings[data.applies_to],
            new Decimal(data.multiplier),
            new Decimal(data.cost),
            data.owned
        )
    }
}


function get_cursor_upgrades(): upgrade[]{
    return [
        new upgrade(
            "Double click",
            "An extra click",
            "/cursor.png",
            valid_buildings.cursor,
            new Decimal(2),
            new Decimal(100),
            false
        )
    ]
}

function get_grandma_upgrades(): upgrade[] {
    return [
        new upgrade(
            "Rollers",
            "Grandmas cake faster",
            "/grandma.png",
            valid_buildings.grandma,
            new Decimal(2),
            new Decimal(1000),
            false
        )
    ]
}

function get_farm_upgrades(): upgrade[] {
    return [
        new upgrade(
            "cookie fertilizer",
            "Increases farm productivity",
            "/farm.png",
            valid_buildings.farm,
            new Decimal(2),
            new Decimal(2000),
            false
        )
    ]
}

function get_mine_upgrades(): upgrade[] {
    return [
        new upgrade(
            "Explosive Drills",
            "Blow them up!",
            "/mine.png",
            valid_buildings.mine,
            new Decimal(2),
            new Decimal(5000),
            false
        )
    ]
}
