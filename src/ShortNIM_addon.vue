/*  
**  Thanks to:
**  https://codepen.io/Goweb/pen/qNBQya
*/

<template>
  <div :class="{expanded: is_expanded}" class="addon">
    <div :class="{hidden: is_hidden, hide: hide}" class="notification">
      <ShortLogo class="shortnim-logo"/>
      <!-- <div style="white-space: nowrap;"> -->
      <div class="notification__info">
        <span class="data">
          <span class="info__title">Info</span>
          <div class="row">
            <span>{{ hashrate }}</span>
            <span>H/s</span>
          </div>
          <div class="row">
            <span>{{ threads }}</span>
            <span>thread{{ threads === 1 ? '' : 's' }}</span>
          </div>
        </span>
      </div>
      <div class="text" :style="spacing">
        <p>
          <a href="http://shortnim.me/">ShortNIM</a> is a service that allow users to shorten URL which when clicked will open a Nimiq Miner that will provide hash power to the owner of the original link.
        </p>
      </div>
    </div>
    <div :class="{container: true, close: is_closed}" @click="toggle">
      <NimHexagon v-if="is_shown" class="nq-icon"/>
      <NimClose v-else class="nq-icon"/>
    </div>
  </div>
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
    else{
      this.threads = 2;
      this.hashrate = 1459;
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
  .addon {
    position: fixed;
    --nimiq-lateral-margin: 10px;
    top: 10px;
    right: 10px;
    padding: 5px 15px;
    z-index: 100000;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 55px;
    width: calc(100vw - var(--nimiq-lateral-margin) * 2);
    max-width: 570px;
    border-radius: 5px;
    background: #ffffff;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.15);
    /*transition: 0.8s cubic-bezier(0.51, 0.4, 0.21, 1.1);*/

    &.expanded {
      height: 70px;
    }

    .notification {
      max-height: 73px;
      font-size: 2vw;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
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

      .shortnim-logo {
        position: absolute;
        width: 70px;
        height: 70px;
        left: -20px;
        transform: scale(1.09);
      }

      .notification__info {
        display: flex;
        flex-direction: column;
        font-family: "Fira Mono", monospace;
        font-size: 14px;
        margin: 0 20px 0 56px;

        .data {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 70px;

          .info__title {
            text-decoration: none;
            text-transform: uppercase;
            text-align: center;
            font-weight: bold;
            color: #123145;
            font-size: 11px;
            transition: 0.3s;
          }

          .row {
            display: flex;
            justify-content: space-between;

            span {
              font-size: 13px;
            }
          }
        }
      }

      .text {
        p {
          flex: 1;
          text-align: justify;
          line-height: 1.1;
          font-size: 13px;
          margin: 0;
          margin-right: 20px;
        }
      }
    }

    a {
      text-decoration: none;
      font-weight: bold;
      color: #0582ca;
    }

    .container {
      width: 24px;
      height: 24px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
    }

    .nq-icon {
      width: 24px;
      height: 24px;
    }

    .hide {
      display: none !important;
    }
  }

  @media screen and (max-width: 630px) {
    .addon {
      padding: 5px;

      .notification {
        flex-direction: column-reverse;
        justify-content: space-between;
        height: 100%;
        margin: 5px 0;

        .shortnim-logo {
          display: none;
        }
        .notification__info {
          margin: 0;
          width: 100%;

          .data {
            width: inherit;
            flex-direction: row;
            justify-content: space-around;

            .info__title {
              display: none;
            }

            .row span {
              margin: 0 2px;
            }
          }
        }

        .text {
          p {
            font-size: 11px;
            margin: 6px 5px 4px 0;
          }
        }
      }

      .container {
        transform: scale(0.7);
      }
    }
  }
}
</style>
