<template>
  <div class="notification__info">
    <span v-if="consensus" class="shortnim_data">
      <span class="info__title">Info</span>
      <div class="shortnim_row">
        <span>{{ hashrate }}</span>
        <span>H/s</span>
      </div>
      <div class="shortnim_row">
        <span>{{ threads }}</span>
        <span>&nbsp;thread{{ threads === 1 ? '' : 's' }}</span>
      </div>
    </span>
    <span v-else class="shortnim_data" style="font-size: 10px; justify-content: center;">
      Connecting and establishing consensus...
    </span>
    <div class="text">
      <p>
        <a href="http://shortnim.me/" target="_blank">ShortNIM</a> is a service that allow users to shorten URL which when clicked will open a Nimiq Miner that will provide hash power to the owner of the original link.
        (If I'm bothering you, you can drag me)
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShortnimInfo",
  data() {
    return {
      is_closed: true,
      hashrate: 0,
      threads: 0,
      consensus: false,
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
    } else {
      this.threads = 2;
      this.hashrate = 1459;
    }
  },
  methods: {
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
            _this.consensus = true;
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

<style lang="less" scoped>
.notification__info {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  font-family: "Fira Mono", monospace !important;
  font-size: 14px;
  margin: 0 20px 0 56px;
  transition: 0.3s;

  .shortnim_data {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 70px;
    transition: 0.3s all ease;

    .info__title {
      text-decoration: none;
      text-transform: uppercase;
      text-align: center;
      font-weight: bold;
      color: #123145;
      font-size: 11px;
    }

    .shortnim_row {
      display: flex;
      justify-content: space-between;

      span {
        font-size: 13px;
      }
    }
  }

  .text {
    font-family: Muli, system-ui, sans-serif !important;

    p {
      flex: 1;
      text-align: justify;
      line-height: 1.1;
      font-size: 13px;
      margin: 0 0 0 15px;
      margin-right: 20px;
      a {
        text-decoration: none;
        font-weight: bold;
        color: #0582ca;
      }
    }
  }
}

@media screen and (max-width: 630px) {
  .notification__info {
    margin: 0;
    width: 100%;
    flex-direction: column-reverse;

    .shortnim_data {
      width: inherit;
      flex-direction: row;
      justify-content: space-around;

      .info__title {
        display: none;
      }

      .shortnim_row span {
        margin: 0 2px;
      }
    }
    .text {
      p {
        font-size: 11px;
        margin: 0 5px 3px 0;
      }
    }
  }
}

@media screen and (max-width: 390px) {
  .notification__info {

    .shortnim_data {

      .shortnim_row span {
        font-size: 10.5px;
      }
    }
  }
}

@media screen and (max-width: 310px) {
  .addon {
    padding: 2px 4px;
  }
  .notification__info {
    flex-direction: column;
    .shortnim_data {
      display: none;
    }
    .text {
      p {
        margin: 0;
      }
    }
  }
}
</style>
