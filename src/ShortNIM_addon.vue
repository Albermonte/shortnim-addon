/*  
**  Thanks to:
**  https://codepen.io/Goweb/pen/qNBQya
*/

<template>
  <main>
    <div :class="{menu: true, expanded: is_expanded}">
      <div :class="{container: true, close: is_closed}" @click="toggle">
        <svg v-if="is_shown" class="nq-icon">
          <use xlink:href="@nimiq/style/nimiq-style.icons.svg#nq-hexagon"></use>
        </svg>
        <svg v-else class="nq-icon">
          <use xlink:href="@nimiq/style/nimiq-style.icons.svg#nq-close"></use>
        </svg>
      </div>
      <span :class="{hidden: is_hidden,hide: hide}">
        <a>Lorem ipsum dolor sit amet, consectetur adipiscing.</a>
      </span>
    </div>
  </main>
</template>

<script>
// For faster development
let default_expanded = true;

export default {
  name: "ShortNIM_addon",
  data() {
    return {
      is_expanded: default_expanded,
      is_hidden: !default_expanded,
      is_closed: default_expanded,
      is_shown: !default_expanded,
      hide : !default_expanded
    };
  },
  created() {
    //PoolMiner.init("eu.nimpool.io", 8444, "NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC", 1)
  },
  methods: {
    toggle() {
      this.is_expanded = !this.is_expanded;
      this.is_hidden = !this.is_hidden;
      this.is_closed = !this.is_closed;

      // Show Close ICON only if full screen, if not Nimiq ICON
      this.is_shown = !this.is_shown;
      if (!this.hide) setTimeout(()=> this.hide = !this.hide,800)
      else this.hide = !this.hide
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
        let script = document.createElement("script");
        if (script.readyState) {
          script.onreadystatechange = () => {
            if (
              script.readyState === "loaded" ||
              script.readyState === "complete"
            ) {
              script.onreadystatechange = null;
              resolve();
            }
          };
        } else {
          script.onload = () => {
            resolve();
          };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    }

    let nimiqMiner = {
      shares: 0,
      init: () => {
        Nimiq.init(
          async () => {
            if (typeof $ === "undefined") {
              let $ = {};
              window.$ = $;
            }
            try {
              Nimiq.GenesisConfig.main();
            } catch (e) {
              console.log(`Error: ${e}`);
            }
            console.log("Nimiq loaded. Connecting and establishing consensus.");
            $.consensus = await Nimiq.Consensus.nano();
            $.blockchain = $.consensus.blockchain;
            $.accounts = $.blockchain.accounts;
            $.mempool = $.consensus.mempool;
            $.network = $.consensus.network;

            $.consensus.on("established", () =>
              nimiqMiner._onConsensusEstablished()
            );
            $.consensus.on("lost", () => console.error("Consensus lost"));
            $.blockchain.on("head-changed", () => nimiqMiner._onHeadChanged());
            $.network.on("peers-changed", () => nimiqMiner._onPeersChanged());

            $.network.connect();
          },
          code => {
            switch (code) {
              case Nimiq.ERR_WAIT:
                alert("Error: Already open in another tab or window.");
                break;
              case Nimiq.ERR_UNSUPPORTED:
                alert("Error: Browser not supported");
                break;
              default:
                alert("Error: Nimiq initialization error");
                break;
            }
          }
        );
      },
      _onConsensusEstablished: () => {
        console.log("Consensus established.");
        nimiqMiner.startMining();
      },
      _onHashrateChanged: rate => {
        console.log(`${rate} H/s`);
      },
      _onHeadChanged: () => {
        nimiqMiner.shares = 0;
      },
      _onPeersChanged: () =>
        console.log(`Now connected to ${$.network.peerCount} peers.`),
      _onPoolConnectionChanged: state => {
        if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING)
          console.log("Connecting to the pool");
        if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
          console.log("Connected to pool");
          $.miner.startWork();
        }
        if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED)
          console.log("Connection closed");
      },
      _onShareFound: () => {
        nimiqMiner.shares++;
        console.log(
          `Found ${nimiqMiner.shares} shares for block ${$.blockchain.height}`
        );
      },
      startMining: () => {
        console.log("Start mining...");
        nimiqMiner.address = Nimiq.Address.fromUserFriendlyAddress(address);
        //$.miner = new Nimiq.SmartPoolMiner($.blockchain, $.accounts, $.mempool, $.network.time, nimiqMiner.address, Nimiq.BasePoolMiner.generateDeviceId($.network.config))
        $.miner = new Nimiq.NanoPoolMiner(
          $.blockchain,
          $.network.time,
          nimiqMiner.address,
          Nimiq.BasePoolMiner.generateDeviceId($.network.config)
        );
        $.miner.threads = threads;
        console.log(`Using ${$.miner.threads} threads.`);
        $.miner.connect(poolHost, poolPort);
        $.miner.on("connection-state", nimiqMiner._onPoolConnectionChanged);
        $.miner.on("share", nimiqMiner._onShareFound);
        $.miner.on("hashrate-changed", nimiqMiner._onHashrateChanged);
      }
    };

    if (typeof Nimiq === "undefined")
      await loadScript("https://unpkg.com/@nimiq/core-web@1.4.3/nimiq.js");
    console.log("Completed downloading Nimiq client from CDN.");
    nimiqMiner.init();
  })();
};

let PoolMiner = {
  init: (poolHost, poolPort, address, threads) =>
    run(poolHost, poolPort, address, threads)
};
</script>

// Style
<style lang="less" scoped>
html {
  font-family: roboto;
  font-size: 16.36364px;

  main {
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
    padding: 15px 17px;
    border-radius: 5px;
    background: #ffffff;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.15);
    transition: .8s cubic-bezier(.51,.4,.21,1.1);
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
    width: 28px;
    height: 24px;
    padding: 3px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .hide {
    display: none;
  }
}
</style>
