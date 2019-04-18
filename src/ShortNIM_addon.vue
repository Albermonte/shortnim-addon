/*  
**  Thanks to:
**  https://codepen.io/Goweb/pen/qNBQya
*/

<template>
  <div :class="{expanded: is_expanded}" class="addon">
    <div :class="{hidden: is_hidden, hide: hide}" class="notification">
      <ShortLogo class="shortnim-logo"/>
      <ShortnimInfo/>
      <ShortnimText :style="spacing"/>
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

import ShortnimInfo from "@/components/ShortnimInfo";
import ShortnimText from "@/components/ShortnimText";

// For faster development
let default_expanded = true;

export default {
  name: "ShortNIM_addon",
  components: {
    NimHexagon,
    NimClose,
    ShortLogo,
    ShortnimInfo,
    ShortnimText
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
        : "white-space: normal;"
    };
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
    line-height: 1;

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
      }

      .container {
        transform: scale(0.7);
      }
    }
  }
}
</style>
