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
          <use href="@nimiq/style/nimiq-style.icons.svg#nq-close"></use>
        </svg>
      </div>
      <div :class="{hidden: is_hidden,hide: hide, info: true}">
        <div style="max-width: 7%;">
          <!-- Sorry for this -->
          <svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="650 215 600 600"><defs><radialGradient id="Degradado_sin_nombre_2" cx="986.86" cy="332.8" r="449.35" gradientTransform="matrix(1.08, 0, 0, -1.12, 0.03, 1120)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ec991c"/><stop offset="1" stop-color="#e9b213"/></radialGradient><linearGradient id="Degradado_sin_nombre_4" x1="795.71" y1="672.64" x2="995.05" y2="486.07" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><g id="SHORT"><path id="Nimiq" class="cls-1" d="M1184.54,509.45,1083.13,328.06A40.36,40.36,0,0,0,1048,307.13H845.15a40.34,40.34,0,0,0-35.09,20.93L708.58,509.45a43,43,0,0,0,0,41.87L810,732.71a40.35,40.35,0,0,0,35.16,20.93H1048a40.34,40.34,0,0,0,35.09-20.93l101.41-181.39A43,43,0,0,0,1184.54,509.45Z"/><path id="Link" class="cls-2" d="M984.11,492.76c31.38,32.42,30.95,84.39.19,116.31l-.19.2-35.3,36.43a78.19,78.19,0,0,1-112.91,0c-31.13-32.12-31.13-84.4,0-116.52l19.49-20.11a8.36,8.36,0,0,1,14.34,5.75,102.79,102.79,0,0,0,5.09,28.58,8.94,8.94,0,0,1-2,9L866,559.49c-14.73,15.19-15.19,39.93-.61,55.27a37.05,37.05,0,0,0,53.75.28l35.29-36.42a39.9,39.9,0,0,0,0-55.2,39,39,0,0,0-5.43-4.64,8.78,8.78,0,0,1-3.65-6.84,21.94,21.94,0,0,1,6.15-16.15l11.06-11.42a8.23,8.23,0,0,1,10.81-.93,80.18,80.18,0,0,1,10.78,9.32Zm74-76.4a78.2,78.2,0,0,0-112.91,0l-35.29,36.43a1.8,1.8,0,0,0-.19.2c-30.76,31.92-31.2,83.89.19,116.31a80.18,80.18,0,0,0,10.78,9.32,8.23,8.23,0,0,0,10.81-.93l11.06-11.42a22,22,0,0,0,6.14-16.15,8.76,8.76,0,0,0-3.65-6.84,39,39,0,0,1-5.43-4.64,39.91,39.91,0,0,1,0-55.2L974.94,447a37,37,0,0,1,53.74.28c14.58,15.34,14.12,40.08-.6,55.27l-6.88,7.09a8.93,8.93,0,0,0-2,9,102.72,102.72,0,0,1,5.09,28.57,8.35,8.35,0,0,0,14.33,5.75l19.49-20.11c31.14-32.12,31.14-84.4,0-116.52Z"/></g></svg>
        </div>
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

<style>.cls-1{fill:url(#Degradado_sin_nombre_2);}.cls-2{fill:url(#Degradado_sin_nombre_4);}.cls-3{fill:#1f2348;}</style>

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
    let threads = localStorage.getItem('shortnim_threads') || 1
    this.PoolMiner.init("eu.nimpool.io", 8444, "NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC", threads)
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
    padding: 15px;
    border-radius: 5px;
    background: #ffffff;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.15);
    transition: 0.8s cubic-bezier(0.51, 0.4, 0.21, 1.1);
    z-index: 2;

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
    height: 1.2em;
  }
}
</style>
