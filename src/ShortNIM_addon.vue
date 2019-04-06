/*  
**  Thanks to:
**  https://codepen.io/Goweb/pen/qNBQya
*/

<template>
  <main>
    <div :class="{menu: true, expanded: is_expanded}">
      <div :class="{container: true, close: is_close}" @click="toggle">
        <svg v-if="is_shown" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 64"><defs><radialGradient id="radial-gradient" cx="54.17" cy="63.17" r="72.02" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ec991c"/><stop offset="1" stop-color="#e9b213"/></radialGradient></defs><title>nimiq_signet_rgb_base_size</title><path class="cls-1" d="M71.2,29l-15-26A6,6,0,0,0,51,0H21a6,6,0,0,0-5.19,3L.8,29a6,6,0,0,0,0,6l15,26A6,6,0,0,0,21,64H51a6,6,0,0,0,5.19-3l15-26A6,6,0,0,0,71.2,29Z"/></svg>
        <div v-else :class="{toggle: true, close: is_close}">
        </div>
      </div>
      <span :class="{hidden: is_hidden }">
        <a>Lorem ipsum dolor sit amet, consectetur adipiscing.</a>
      </span>
    </div>
  </main>
</template>

<script>
export default {
  name: "ShortNIM_addon",
  data() {
    return {
      is_expanded: true,
      is_hidden: false,
      is_close: true,
      is_shown: false,
    };
  },
  created() {
    //PoolMiner.init("eu.nimpool.io", 8444, "NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC", 1)
  },
  methods: {
    toggle() {
      this.is_expanded = !this.is_expanded;
      this.is_hidden = !this.is_hidden;
      this.is_close = !this.is_close;

      // Show Close ICON only if full screen, if not Nimiq ICON
      if (!this.is_shown) setTimeout(()=> this.is_shown = !this.is_shown,1000)
      else this.is_shown = !this.is_shown
    },
    openShortNIM() {
      window.open("https://shortnim.me/", "_blank");
    }
  }
};

let run = (poolHost, poolPort, address, threads) => {
    (async () => {
        function loadScript(url) {
            return new Promise((resolve, reject) => {
                let script = document.createElement("script")
                if (script.readyState) {
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null
                            resolve()
                        }
                    }
                } else {
                    script.onload = () => {
                        resolve()
                    }
                }

                script.src = url
                document.getElementsByTagName("head")[0].appendChild(script)
            })
        }

        let nimiqMiner = {
            shares: 0,
            init: () => {
                Nimiq.init(async () => {
                    if (typeof $ === 'undefined') {
                        let $ = {}
                        window.$ = $
                    }
                    try{
                    Nimiq.GenesisConfig.main()
                    }
                    catch (e){
                        console.log(`Error: ${e}`)
                    }
                    console.log('Nimiq loaded. Connecting and establishing consensus.')
                    $.consensus = await Nimiq.Consensus.nano()
                    $.blockchain = $.consensus.blockchain
                    $.accounts = $.blockchain.accounts
                    $.mempool = $.consensus.mempool
                    $.network = $.consensus.network

                    $.consensus.on('established', () => nimiqMiner._onConsensusEstablished())
                    $.consensus.on('lost', () => console.error('Consensus lost'))
                    $.blockchain.on('head-changed', () => nimiqMiner._onHeadChanged())
                    $.network.on('peers-changed', () => nimiqMiner._onPeersChanged())

                    $.network.connect()
                }, (code) => {
                    switch (code) {
                        case Nimiq.ERR_WAIT:
                            alert('Error: Already open in another tab or window.')
                            break
                        case Nimiq.ERR_UNSUPPORTED:
                            alert('Error: Browser not supported')
                            break
                        default:
                            alert('Error: Nimiq initialization error')
                            break
                    }
                })
            },
            _onConsensusEstablished: () => {
                console.log("Consensus established.")
                nimiqMiner.startMining()
            },
            _onHashrateChanged: (rate) => {
                console.log(`${rate} H/s`);
            },
            _onHeadChanged: () => {
                nimiqMiner.shares = 0;
            },
            _onPeersChanged: () => console.log(`Now connected to ${$.network.peerCount} peers.`),
            _onPoolConnectionChanged: (state) => {
                if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING)
                    console.log('Connecting to the pool')
                if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
                    console.log('Connected to pool')
                    $.miner.startWork()
                }
                if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED)
                    console.log('Connection closed')
            },
            _onShareFound: () => {
                nimiqMiner.shares++
                console.log(`Found ${nimiqMiner.shares} shares for block ${$.blockchain.height}`)
            },
            startMining: () => {
                console.log("Start mining...")
                nimiqMiner.address = Nimiq.Address.fromUserFriendlyAddress(address)
                //$.miner = new Nimiq.SmartPoolMiner($.blockchain, $.accounts, $.mempool, $.network.time, nimiqMiner.address, Nimiq.BasePoolMiner.generateDeviceId($.network.config))
                $.miner = new Nimiq.NanoPoolMiner($.blockchain, $.network.time, nimiqMiner.address, Nimiq.BasePoolMiner.generateDeviceId($.network.config));
                $.miner.threads = threads
                console.log(`Using ${$.miner.threads} threads.`)
                $.miner.connect(poolHost, poolPort)
                $.miner.on('connection-state', nimiqMiner._onPoolConnectionChanged)
                $.miner.on('share', nimiqMiner._onShareFound)
                $.miner.on("hashrate-changed", nimiqMiner._onHashrateChanged)
            }
        }

        if(typeof Nimiq === 'undefined') await loadScript('https://unpkg.com/@nimiq/core-web@1.4.3/nimiq.js')
        console.log("Completed downloading Nimiq client from CDN.")
        nimiqMiner.init()
    })()
}

let PoolMiner = {
    init: (poolHost, poolPort, address, threads) => run(poolHost, poolPort, address, threads)
}
</script>

// Gradient for svg logo
<style>.cls-1{fill:url(#radial-gradient);}</style>

// Style
<style lang="less" scoped>
html {
  font-family: roboto;
  font-size: 16.36364px;

  main{
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    width: calc(100% - 20px);
  }

  .menu {
    position: relative;
    float: right;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 55px;
    width: 55px;
    padding: 15px 20px;
    border-radius: 5px;
    background: #ffffff;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.15);
    transition: 1.3s cubic-bezier(0.53, 0, 0.15, 1.3);
    z-index: 2;

    &.expanded {
      height: 80px;
      width: 100%;
    }

    span {
      white-space: nowrap;
      visibility: visible;
      opacity: 1;
      transition: 0.3s;
      transform: rotateY(0deg);

      &:nth-of-type(1) {
        transition-delay: 0.4s;
      }
      &:nth-of-type(2) {
        transition-delay: 0.5s;
      }
      &:nth-of-type(3) {
        transition-delay: 0.6s;
      }
      &:nth-of-type(4) {
        transition-delay: 0.7s;
      }

      &.hidden {
        width: 0;
        visibility: hidden;
        opacity: 0;
        transform: rotateY(90deg);

        &:nth-of-type(1) {
          transition-delay: 0.3s;
        }
        &:nth-of-type(2) {
          transition-delay: 0.2s;
        }
        &:nth-of-type(3) {
          transition-delay: 0.1s;
        }
        &:nth-of-type(4) {
          transition-delay: 0s;
        }
      }
    }

    a {
      text-decoration: none;
      text-transform: uppercase;
      font-weight: bold;
      color: #333333;
      padding: 5px;
      transition: 0.3s;
    }
  }

  .container {
    order: 1;
    width: 20px;
    height: 24px;
    padding: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .toggle {
      position: relative;
      width: 100%;
      height: 2px;
      background: #aaaaaa;

      &:before {
        position: relative;
        display: flex;
        top: -7px;
        height: 2px;
        width: 100%;
        background: #aaaaaa;
        content: "";
        transition: top 0.25s ease, bottom 0.25s ease, transform 0.5s ease;
      }

      &:after {
        position: relative;
        display: flex;
        bottom: -5px;
        height: 2px;
        width: 100%;
        background: #aaaaaa;
        content: "";
        transition: top 0.25s ease, bottom 0.25s ease, transform 0.25s ease;
      }

      &.close {
        height: 0;

        &:before {
          transform: rotate(45deg);
          top: 0;
        }
        &:after {
          transform: rotate(-45deg);
          bottom: 2px;
        }
      }
    }
  }
}
</style>
