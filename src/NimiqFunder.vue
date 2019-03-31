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
  name: "NimiqFunder",
  data() {
    return {
      is_expanded: true,
      is_hidden: false,
      is_close: true,
      is_shown: false,
    };
  },
  created() {},
  methods: {
    toggle() {
      this.is_expanded = !this.is_expanded;
      this.is_hidden = !this.is_hidden;
      this.is_close = !this.is_close;
      if (!this.is_shown) setTimeout(()=> this.is_shown = !this.is_shown,1000)
      else this.is_shown = !this.is_shown
    },
    openShortNIM() {
      window.open("https://shortnim.me/", "_blank");
    }
  }
};
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


