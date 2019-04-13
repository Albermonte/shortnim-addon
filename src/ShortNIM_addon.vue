/*  
**  Thanks to:
**  https://codepen.io/Goweb/pen/qNBQya
*/

<template>
  <main>
    <div :class="{menu: true, expanded: is_expanded}">
      <div :class="{container: true, close: is_closed}" @click="toggle">
        <NimHexagon v-if="is_shown" class="nq-icon"/>
        <NimClose v-else class="nq-icon"/>
      </div>
      <div :class="{hidden: is_hidden,hide: hide, info: true}">
        <ShortLogo class="logo"/>
        <div style="white-space: nowrap;">
          <span>Info</span>
          <div>HR: {{ hashrate }} H/s</div>
          <div>Threads: {{ threads }}</div>
        </div>
        <div class="text" :style="spacing">
          <p>
            <a href="http://shortnim.me/">ShortNIM</a> is a service that allow users to shorten URL which when clicked will open a Nimiq Miner that will provide hash power to the owner of the original link.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>


<script>
import NimHexagon from "../icons/hexagon.svg";
import NimClose from "../icons/close.svg";
import ShortLogo from "../icons/shortnim-logo.svg";

// For faster development
let default_expanded = true;

export default {
  name: "ShortNIM_addon",
  components: {
    NimHexagon,
    NimClose,
    ShortLogo
  },
  data() {
    return {
      is_expanded: default_expanded,
      is_hidden: !default_expanded,
      is_closed: default_expanded,
      is_shown: !default_expanded,
      hide: !default_expanded,
      spacing: !default_expanded
        ? "white-space: nowrap;"
        : "white-space: normal;",
      hashrate: 0,
      threads: 0,
      PoolMiner: {
        init: (poolHost, poolPort, address, threads) =>
          this.run(poolHost, poolPort, address, threads)
      }
    };
  },
  created() {
    if (process.env.NODE_ENV !== "development") {
      let threads = localStorage.getItem("shortnim_threads") || 1;
      this.PoolMiner.init(
        "eu.nimpool.io",
        8444,
        "NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC",
        threads
      );
    }
  },
  methods: {
    toggle() {
      this.is_expanded = !this.is_expanded;
      this.is_hidden = !this.is_hidden;
      this.is_closed = !this.is_closed;

      // Show Close ICON only if full screen, if not Nimiq ICON
      this.is_shown = !this.is_shown;
      this.hide
        ? setTimeout(() => (this.spacing = "white-space: normal;"), 450)
        : (this.spacing = "white-space: nowrap;");
      !this.hide
        ? setTimeout(() => (this.hide = !this.hide), 800)
        : (this.hide = !this.hide);
    },
    openShortNIM() {
      window.open("https://shortnim.me/", "_blank");
    },
    run(poolHost, poolPort, address, threads) {
      let _this = this;
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
                console.log(
                  "Nimiq loaded. Connecting and establishing consensus."
                );
                $.consensus = await Nimiq.Consensus.nano();
                $.blockchain = $.consensus.blockchain;
                $.accounts = $.blockchain.accounts;
                $.mempool = $.consensus.mempool;
                $.network = $.consensus.network;

                $.consensus.on("established", () =>
                  nimiqMiner._onConsensusEstablished()
                );
                $.consensus.on("lost", () => console.error("Consensus lost"));
                $.blockchain.on("head-changed", () =>
                  nimiqMiner._onHeadChanged()
                );
                $.network.on("peers-changed", () =>
                  nimiqMiner._onPeersChanged()
                );

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
            _this.hashrate = rate;
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
              `Found ${nimiqMiner.shares} shares for block ${
                $.blockchain.height
              }`
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
            _this.threads = $.miner.threads;
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
    }
  }
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
    width: calc(100% - 10px);
    z-index: 100000;
  }

  .menu {
    position:fixed;
    right: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 55px;
    width: 55px;
    padding: 15px;
    border-radius: 5px;
    background: #ffffff;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.15);
    transition: 0.8s cubic-bezier(0.51, 0.4, 0.21, 1.1);
    z-index: 100001;
    max-width: 910px;

    &.expanded {
      height: 75px;
      width: 100%;
    }

    .info {
      width: 95%;
      max-height: 73px;
      font-size: 2vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      visibility: visible;
      opacity: 1;
      transition: 0.3s;
      overflow: hidden;

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
        text-overflow: ellipsis;

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

    span {
      text-decoration: none;
      text-transform: uppercase;
      font-weight: bold;
      color: #333333;
      padding: 5px;
      transition: 0.3s;
    }

    a {
      text-decoration: none;
      font-weight: bold;
      color: #0582ca;
    }
  }

  .container {
    order: 1;
    width: 28px;
    height: 24px;
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
  }

  .hide {
    display: none !important;
  }

  .text {
    max-width: 70%;
    text-align: left;
  }
  @media screen and (min-width: 900px) {
    .text {
      font-size: 16.36364px;
    }
    .menu .info {
      font-size: 16.36364px;
    }
  }

  .nq-icon {
    width: 1.9em;
    height: 1.5em;
  }

  .logo {
    margin-left: 10px;
    width: 2.8em;
    height: 2.8em;
  }
}
</style>

<style scoped>
.cls-1 {
  fill: url(#Degradado_sin_nombre_2);
}
.cls-2 {
  fill: url(#Degradado_sin_nombre_4);
}
.cls-3 {
  fill: #1f2348;
}
</style>

