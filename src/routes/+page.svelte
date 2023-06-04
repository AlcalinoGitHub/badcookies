<script lang='ts'>
    import "./styles.css"
    import {GameState} from "../game_state"

    let game_state: GameState = GameState.get_game_state();

    function bake(): void {
        game_state = game_state.bake_cookies()
    }

    function save_game(): void { 
        game_state.save_game_state()
    }
    
    save_game()

    setInterval(save_game, 100)
    setInterval(bake, 1000)

</script>

<head>
    <title>Bad Cookie! {game_state.cookies.floor()}</title>
</head>

<div class = "main-pannel">
    
    <div class = "inner-pannel">
        <div class = "cookie-count" style = "margin-bottom: 0vh; width:50%">{game_state.username}</div>

        <div class  = "cookie-count" style = "margin-top: 1vh">
            <div>{game_state.cookies.floor()} cookies</div>
            <div>{game_state.get_cps()} cps</div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img src = '/cookie.png' alt = "COOKIE" class = "image-cookie" on:click={() => {game_state = game_state.click_big_cookie()}}>
    </div>

    <div class = "inner-pannel" style = "width: 50%; max-width: 50%"></div>

    <div class = "inner-pannel">
        <div class = 'upgrade-store'>
            {#each game_state.upgrades as upgrade}
                {#if upgrade.is_viewed(game_state)}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class = "upgrade-box" on:click={() => {game_state = game_state.buy_upgrade(upgrade)}}>
                        <img style = "height: 4vh; aspect-ratio: 1/1;" src = {upgrade.image} alt = "">
                    </div>
                {/if}
            {/each}
        </div>

        {#each game_state.buildings as building}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class = "building-card" on:click={() => {game_state = game_state.buy_bulding(building)}}>
                <img class = 'building-image' src = {building.image} style = "width: 20%; aspect-ratio: 1/1; margin-right: 1vw" alt = "building">
                <div style = "color: white; font-size:xx-large" >
                    {building.type} <br>
                    <div style = "font-size: small; color: green; margin-left: 0.5vw">🍪 {building.get_cost()}</div>
                    <div style = "font-size: small; color: black; margin-left: 0.6vw">Producing {building.get_total_cps(game_state.upgrades)} cps</div>
                </div> 
                <div style = "margin-left: auto; margin-right: 1vw; font-size: xxx-large">{building.amount} </div>
            </div>
        {/each}
        
    </div>

</div>