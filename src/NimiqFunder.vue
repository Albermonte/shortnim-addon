<template>
  <div class="nimiq-funder">
    <div class="nf-backdrop" v-if="expanded" @click="expanded = false"></div>
    <div class="nf-main">
      <div class="nf-container" :class="{'nf-expanded': expanded, 'help': !expanded}">
        <div v-if="expanded">
          <p>
            This Website is funded through visitors hashing power on the Nimiq Blockchain. Find out more about Nimiq at
            <a
              href="https://nimiq.com"
              target="_blank"
            >nimiq.com</a>
          </p>
          <ul>
            <li>Test text</li>
          </ul>
          <button class="nf-button" @click="alert('Click 1')">Button 1</button>
        </div>
        <div>
          <div class="nf-logo">
            <div style="cursor: pointer" v-if="expanded" @click="openShortNIM()">ShortNIM</div>
          </div>
          <small @click="expand()" :class="{'hide': expanded, 'logo-not-hidden': !expanded}">
            <div v-if="expanded">Hide</div>
            <div v-else>ShortNIM Help</div>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NimiqFunder",
  data() {
    return {
      expanded: false,
      firstExpand: false
    };
  },
  created() {
    const vm = this;
    setTimeout(() => {
      if (!vm.firstExpand) {
        vm.expanded = true;
      }
    }, 5000);
  },
  methods: {
    expand() {
      this.expanded = !this.expanded;
      this.firstExpand = true;
    },
    openShortNIM() {
      window.open("https://shortnim.me/", "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.nimiq-funder {
  .nf-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 99998;
    transition: all 0.5s ease-in-out;
  }

  .nf-main {
    color: rgba(255, 255, 255, 0.9);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: fixed;
    z-index: 99999;
    top: 0;
    right: 15px;
    margin-left: auto;
    margin-right: auto;
    background-image: linear-gradient(30deg, #3023ae, #9c58cb);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 10px;

    .nf-container {
      width: 100px;
      height: 20px;
      transition: all 0.5s ease;
      &.nf-expanded {
        height: auto;
        width: 200px;
        transition: all 0.5s ease;
      }
    }

    .nf-logo {
      height: 24px;
      box-sizing: border-box;
      background-size: 24px 21px;
      background-repeat: no-repeat;
      padding-left: 28px;
      cursor: auto;
    }

    .nf-expand {
      float: right;
    }

    small {
      position: absolute;
      font-size: 75%;
    }

    p,
    ul {
      font-size: 10px;
      padding-right: 10px;
      line-height: 1.2;
      width: 100%;
    }

    a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: underline;
    }

    ul {
      list-style-type: none;
      padding-left: 0px;
    }

    .nf-info {
      position: absolute;
      bottom: 2px;
      left: 10px;
    }

    .nf-button {
      color: white;
      background: #e2a62f;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      display: inline-block;
      font-size: 14px;
      text-shadow: none;
      vertical-align: middle;
      line-height: 28px;
      margin: 8px;
      letter-spacing: 0;
      font-weight: 600;
      transition: background 0.2s ease;
    }

    .nf-button:hover {
      background: #e69e1d;
    }

    .nf-secondary-button {
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.7);
      color: white;
      transition: color 0.3s, border 0.3s;
    }

    .nf-button,
    .nf-secondary-button {
      border-radius: 3px;
      margin: 6px;
      padding: 4px 12px !important;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 1pt;
    }

    .nf-secondary-button {
      background-color: transparent;
    }

    .help {
      cursor: help;
    }

    .logo-not-hidden{
      top: 12px;
    }

    .hide {
      cursor: not-allowed;
      bottom: 8px;
      right: 10px;
    }
  }
}
</style>
